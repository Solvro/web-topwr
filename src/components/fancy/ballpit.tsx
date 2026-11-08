//source: https://reactbits.dev/backgrounds/ballpit
"use client";
import { useEffect, useRef } from "react";
import type { CSSProperties, RefObject } from "react";

import { cn } from "@/lib/utils";

const FOV_DEGREES = 50;
const CAMERA_Z = 20;
const MAX_ASPECT = 1.5;
const MAX_SPEED = 16;
const INSTANCE_STRIDE = 16;
const INSTANCE_ATTRIBUTES = 4;
const CONTACT_STRIDE = 8;
const CONTACTS_PER_BALL = 12;
const CURSOR_CONTACT = -1;
const WALL_CONTACT = -2;
const PENETRATION_SLOP = 0.01;
const BOUNCE_THRESHOLD = 1.5;
const MAX_BALL_COUNT = 4000;
const MIN_BALL_SIZE = 0.05;
const MAX_PIXEL_RATIO = 2;
const IDLE_TIMEOUT_SECONDS = 0.8;
const DECAL_SLOT_SIZE = 256;
const DECAL_SLOT_PADDING = 24;
const DECAL_MAX_TILT = 0.45;
const DECAL_MAX_ROTATION = 0.6;

type BallpitMaterial = "satin" | "matte" | "gloss" | "frosted" | "metal";

interface MaterialParameters {
  roughness: number;
  metalness: number;
  coat: number;
  coatRoughness: number;
  scatter: number;
  frost: number;
}

const MATERIALS: Record<BallpitMaterial, MaterialParameters> = {
  satin: {
    roughness: 0.42,
    metalness: 0,
    coat: 0.35,
    coatRoughness: 0.22,
    scatter: 1,
    frost: 0,
  },
  matte: {
    roughness: 0.92,
    metalness: 0,
    coat: 0,
    coatRoughness: 0.5,
    scatter: 0.5,
    frost: 0,
  },
  gloss: {
    roughness: 0.2,
    metalness: 0,
    coat: 1,
    coatRoughness: 0.08,
    scatter: 1,
    frost: 0,
  },
  frosted: {
    roughness: 0.55,
    metalness: 0,
    coat: 0.6,
    coatRoughness: 0.18,
    scatter: 1.5,
    frost: 1,
  },
  metal: {
    roughness: 0.3,
    metalness: 1,
    coat: 0,
    coatRoughness: 0.2,
    scatter: 0,
    frost: 0,
  },
};

const VERTEX_SHADER = `#version 300 es
precision highp float;
layout(location = 0) in vec2 aCorner;
layout(location = 1) in vec4 aSphere;
layout(location = 2) in vec4 aColor;
layout(location = 3) in vec4 aShade;
layout(location = 4) in vec4 aDecal;
uniform mat4 uProj;
uniform float uCameraZ;
uniform float uPixel;
out vec3 vPoint;
flat out vec3 vCenter;
flat out float vRadius;
flat out vec4 vColor;
flat out vec4 vShade;
flat out vec4 vDecal;
void main() {
  vec3 c = vec3(aSphere.xy, aSphere.z - uCameraZ);
  float r = aSphere.w;
  float d = length(c);
  vec3 toCamera = -c / d;
  vec3 right = normalize(cross(vec3(0.0, 1.0, 0.0), toCamera));
  vec3 up = cross(toCamera, right);
  float reach = r * d / sqrt(max(d * d - r * r, 1e-4)) + uPixel * d * 2.0;
  vec3 p = c + (right * aCorner.x + up * aCorner.y) * reach;
  vPoint = p;
  vCenter = c;
  vRadius = r;
  vColor = aColor;
  vShade = aShade;
  vDecal = aDecal;
  gl_Position = uProj * vec4(p, 1.0);
}`;

const FRAGMENT_SHADER = `#version 300 es
precision highp float;
in vec3 vPoint;
flat in vec3 vCenter;
flat in float vRadius;
flat in vec4 vColor;
flat in vec4 vShade;
flat in vec4 vDecal;
uniform mat4 uProj;
uniform vec3 uLightPos;
uniform vec3 uLight;
uniform float uExposure;
uniform float uShadow;
uniform vec4 uSurface;
uniform vec2 uExtra;
uniform sampler2D uDecal;
uniform float uDecalSlots;
uniform float uDecalSize;
out vec4 outColor;
const float PI = 3.14159265;

float lobe(vec3 d, vec3 axis, float sharp) {
  return pow(max(dot(d, axis), 0.0), sharp) * (sharp + 1.0) * 0.16;
}

vec3 studio(vec3 d, float rough) {
  float r = clamp(rough, 0.0, 1.0);
  float sharp = mix(60.0, 1.2, sqrt(r));
  vec3 col = mix(vec3(0.085, 0.085, 0.09), vec3(0.38, 0.38, 0.39), smoothstep(-0.7, 0.9, d.y));
  col += vec3(1.0, 0.99, 0.97) * 2.6 * lobe(d, normalize(vec3(-0.42, 0.78, 0.47)), sharp);
  col += vec3(0.97, 0.98, 1.0) * 1.1 * lobe(d, normalize(vec3(0.78, 0.22, 0.58)), sharp * 0.7);
  col += vec3(1.0) * 1.3 * lobe(d, normalize(vec3(0.15, 0.55, -0.82)), sharp * 0.8);
  return col;
}

vec2 envBRDF(float NoV, float rough) {
  vec4 c0 = vec4(-1.0, -0.0275, -0.572, 0.022);
  vec4 c1 = vec4(1.0, 0.0425, 1.04, -0.04);
  vec4 r = rough * c0 + c1;
  float a = min(r.x * r.x, exp2(-9.28 * NoV)) * r.x + r.y;
  return vec2(-1.04, 1.04) * a + r.zw;
}

float ggx(float NoH, float a) {
  float a2 = a * a;
  float d = NoH * NoH * (a2 - 1.0) + 1.0;
  return a2 / (PI * d * d);
}

float smith(float NoV, float NoL, float a) {
  float k = a * 0.5;
  return 0.25 / max((NoV * (1.0 - k) + k) * (NoL * (1.0 - k) + k), 1e-4);
}

vec3 aces(vec3 x) {
  return clamp((x * (2.51 * x + 0.03)) / (x * (2.43 * x + 0.59) + 0.14), 0.0, 1.0);
}

vec3 applyDecal(vec3 albedo, vec3 n) {
  vec3 facing = normalize(vec3(vDecal.xy, 1.0));
  vec3 baseTangent = normalize(cross(vec3(0.0, 1.0, 0.0), facing));
  vec3 baseBitangent = cross(facing, baseTangent);
  float c = cos(vDecal.z);
  float s = sin(vDecal.z);
  vec3 tangent = baseTangent * c + baseBitangent * s;
  vec3 bitangent = baseBitangent * c - baseTangent * s;
  vec2 uv = vec2(dot(n, tangent), dot(n, bitangent)) / uDecalSize * 0.5 + 0.5;
  vec2 inside = step(vec2(0.0), uv) * step(uv, vec2(1.0));
  float mask = inside.x * inside.y * step(0.0, dot(n, facing));
  float slot = floor(vDecal.w);
  bool hasOwnColors = vDecal.w - slot > 0.25;
  vec2 atlasUv = vec2((slot + clamp(uv.x, 0.0, 1.0)) / uDecalSlots, 1.0 - clamp(uv.y, 0.0, 1.0));
  vec4 texel = texture(uDecal, atlasUv);
  vec3 inkColor = hasOwnColors ? pow(texel.rgb / max(texel.a, 1e-4), vec3(2.2)) : vec3(1.0);
  return mix(albedo, inkColor, texel.a * mask);
}

void main() {
  vec3 rd = normalize(vPoint);
  float b = dot(vCenter, rd);
  float h = length(vCenter - rd * b);
  float r = vRadius;
  float aa = max(fwidth(h), 1e-5);
  float cover = clamp((r - h) / aa + 0.5, 0.0, 1.0);
  if (cover <= 0.002) discard;
  float hc = min(h, r * 0.9995);
  float t = b - sqrt(r * r - hc * hc);
  vec3 pos = rd * t;
  vec3 n = normalize(pos - vCenter);
  vec4 clip = uProj * vec4(pos, 1.0);
  gl_FragDepth = clamp(clip.z / clip.w * 0.5 + 0.5, 0.0, 1.0);

  vec3 v = -rd;
  vec3 albedo = vDecal.w >= 0.0 && uDecalSlots > 0.0 ? applyDecal(vColor.rgb, n) : vColor.rgb;
  vec3 dn = fwidth(n);
  float rough = sqrt(min(uSurface.x * uSurface.x + dot(dn, dn) * 0.6, 1.0));
  float metal = uSurface.y;
  float coat = uSurface.z;
  float coatRough = sqrt(min(uSurface.w * uSurface.w + dot(dn, dn) * 0.6, 1.0));
  float NoV = clamp(dot(n, v), 1e-4, 1.0);
  float fresnelNoV = max(NoV, 0.22);
  vec3 R = reflect(-v, n);

  float occlusion = vShade.w * smoothstep(-0.15, 0.9, dot(n, vShade.xyz));
  float ao = 1.0 - uShadow * occlusion;
  float specAo = 1.0 - uShadow * occlusion * 0.7;

  vec3 L = uLightPos - pos;
  float dist2 = dot(L, L);
  L *= inversesqrt(dist2);
  vec3 radiance = uLight / (dist2 + 1.0);
  float NoL = clamp(dot(n, L), 0.0, 1.0);
  vec3 H = normalize(L + v);
  float NoH = clamp(dot(n, H), 0.0, 1.0);
  float VoH = clamp(dot(v, H), 0.0, 1.0);

  vec3 F0 = mix(vec3(0.04), albedo, metal);
  vec2 ab = envBRDF(NoV, rough);
  vec3 Fr = max(vec3(1.0 - rough), F0) - F0;
  vec3 kS = F0 + Fr * pow(1.0 - fresnelNoV, 5.0);
  vec3 diffuseColor = albedo * (1.0 - metal);
  vec3 irradiance = studio(n, 1.0) * 1.15;
  vec3 envSpec = studio(R, rough) * (F0 * ab.x + ab.y);
  vec3 col = diffuseColor * irradiance * (1.0 - kS) * ao + envSpec * specAo;
  vec3 F = F0 + (1.0 - F0) * pow(1.0 - VoH, 5.0);
  float a = max(rough * rough, 0.06);
  vec3 spec = ggx(NoH, a) * smith(NoV, NoL, a) * F;
  float wrap = clamp((dot(n, L) + 0.3) / 1.3, 0.0, 1.0);
  col += (diffuseColor * (1.0 - F) / PI * wrap + spec * NoL) * radiance;
  vec3 sh = normalize(L + n * 0.1);
  float scatter = pow(clamp(dot(v, -sh), 0.0, 1.0), 2.0) * 10.0 + 0.04;
  col += scatter * albedo * radiance * 0.03 * uExtra.x;
  float alpha = 1.0;
  if (uExtra.y > 0.5) {
    float rim = pow(1.0 - NoV, 2.5);
    col += albedo * (studio(-R, 1.0) * 0.35 + 0.06) * (1.0 - rim);
    col += radiance * albedo * pow(max(dot(-v, L), 0.0), 3.0) * 0.08;
    alpha = mix(0.5, 0.96, rim);
  }
  if (coat > 0.0) {
    float Fc = 0.04 + 0.96 * pow(1.0 - fresnelNoV, 5.0);
    float ca = max(coatRough * coatRough, 0.03);
    vec3 coatEnv = studio(R, coatRough) * Fc;
    float coatSpec = ggx(NoH, ca) * smith(NoV, NoL, ca) * (0.04 + 0.96 * pow(1.0 - VoH, 5.0)) * NoL;
    col = col * (1.0 - Fc * coat) + (coatEnv * specAo + radiance * coatSpec) * coat;
    alpha = mix(alpha, 1.0, Fc * coat);
  }
  col = aces(col * uExposure);
  col = pow(col, vec3(1.0 / 2.2));
  col += (fract(sin(dot(gl_FragCoord.xy, vec2(12.9898, 78.233))) * 43758.5453) - 0.5) / 255.0;
  float a2 = alpha * cover;
  outColor = vec4(col * a2, a2);
}`;

export interface BallpitDecal {
  src: string;
  /** Which balls the decal is printed on, by their color's luminance */
  target?: "light" | "dark" | "any";
  /** Keeps the image's colors instead of printing it white */
  hasOwnColors?: boolean;
}

const LIGHT_LUMINANCE_THRESHOLD = 0.5;

const getDecalsKey = (decals: BallpitDecal[]) =>
  decals
    .map(
      ({ src, target = "any", hasOwnColors = false }) =>
        `${src}:${target}:${String(hasOwnColors)}`,
    )
    .join("|");

function getDecalSlotsForColor(
  decals: BallpitDecal[],
  [red, green, blue]: [number, number, number],
) {
  const isLight =
    0.2126 * red + 0.7152 * green + 0.0722 * blue > LIGHT_LUMINANCE_THRESHOLD;
  return decals.flatMap(({ target = "any", hasOwnColors = false }, slot) =>
    target === "any" || (target === "light") === isLight
      ? [slot + (hasOwnColors ? 0.5 : 0)]
      : [],
  );
}

interface BallpitSettings {
  count: number;
  /** Hex/CSS colors, `var(--token)` references or packed RGB numbers */
  colors: (string | number)[];
  material: BallpitMaterial;
  /** Logos printed on the balls */
  decals: BallpitDecal[];
  /** Decal size relative to the ball radius */
  decalSize: number;
  minSize: number;
  maxSize: number;
  gravity: number;
  friction: number;
  wallBounce: number;
  bounce: number;
  depth: number;
  drift: number;
  /** Spawns a ball under the mouse cursor while it hovers the pit */
  followCursor: boolean;
  cursorSize: number;
  lightColor: string;
  lightIntensity: number;
  exposure: number;
  shadows: number;
  intro: boolean;
  dpr?: number;
}

const clamp = (value: number, min: number, max: number) =>
  Math.min(max, Math.max(min, value));

const randomSigned = () => Math.random() * 2 - 1;

function getBallpitSettings(
  settings: Partial<BallpitSettings>,
): BallpitSettings {
  const {
    count = 200,
    colors = ["#ffffff"],
    material = "satin",
    decals = [],
    decalSize = 0.3,
    minSize = 0.5,
    maxSize = 1,
    gravity = 0.5,
    friction = 0.9975,
    wallBounce = 0.95,
    bounce = 0.85,
    depth = 2,
    drift = 0,
    followCursor = true,
    cursorSize = 1,
    lightColor = "#ffffff",
    lightIntensity = 1,
    exposure = 0.7,
    shadows = 0.6,
    intro = true,
    dpr,
  } = settings;

  return {
    count: Math.round(clamp(count, 1, MAX_BALL_COUNT)),
    colors: colors.length > 0 ? colors : ["#ffffff"],
    material,
    decals,
    decalSize: clamp(decalSize, 0.05, 1),
    minSize: Math.max(MIN_BALL_SIZE, Math.min(minSize, maxSize)),
    maxSize: Math.max(MIN_BALL_SIZE, Math.max(minSize, maxSize)),
    gravity,
    friction: clamp(friction, 0.5, 1),
    wallBounce: clamp(wallBounce, 0, 1),
    bounce: clamp(bounce, 0, 1),
    depth: Math.max(0, depth),
    drift: Math.max(0, drift),
    followCursor,
    cursorSize: Math.max(0, cursorSize),
    lightColor,
    lightIntensity:
      lightIntensity > 20 ? lightIntensity / 200 : Math.max(0, lightIntensity),
    exposure: Math.max(0, exposure),
    shadows: clamp(shadows, 0, 1),
    intro,
    dpr,
  };
}

function compileShader(
  gl: WebGL2RenderingContext,
  type: number,
  source: string,
) {
  const shader = gl.createShader(type);
  if (shader == null) {
    return null;
  }
  gl.shaderSource(shader, source);
  gl.compileShader(shader);
  if (gl.getShaderParameter(shader, gl.COMPILE_STATUS) === true) {
    return shader;
  }
  gl.deleteShader(shader);
  return null;
}

function linkBallProgram(gl: WebGL2RenderingContext) {
  const vertexShader = compileShader(gl, gl.VERTEX_SHADER, VERTEX_SHADER);
  const fragmentShader = compileShader(gl, gl.FRAGMENT_SHADER, FRAGMENT_SHADER);
  const program = gl.createProgram();
  if (vertexShader == null || fragmentShader == null) {
    gl.deleteProgram(program);
    return null;
  }
  gl.attachShader(program, vertexShader);
  gl.attachShader(program, fragmentShader);
  gl.linkProgram(program);
  gl.deleteShader(vertexShader);
  gl.deleteShader(fragmentShader);
  if (gl.getProgramParameter(program, gl.LINK_STATUS) !== true) {
    gl.deleteProgram(program);
    return null;
  }
  const getUniform = (name: string) => gl.getUniformLocation(program, name);
  const uniforms = {
    projection: getUniform("uProj"),
    cameraZ: getUniform("uCameraZ"),
    pixelSize: getUniform("uPixel"),
    decal: getUniform("uDecal"),
    decalSlots: getUniform("uDecalSlots"),
    decalSize: getUniform("uDecalSize"),
    lightPosition: getUniform("uLightPos"),
    light: getUniform("uLight"),
    exposure: getUniform("uExposure"),
    shadow: getUniform("uShadow"),
    surface: getUniform("uSurface"),
    extra: getUniform("uExtra"),
  };
  return { program, uniforms };
}

function getRgbChannels(packed: number): [number, number, number] {
  return [
    ((packed >> 16) & 255) / 255,
    ((packed >> 8) & 255) / 255,
    (packed & 255) / 255,
  ];
}

function getLinearRgb(packed: number): [number, number, number] {
  const [red, green, blue] = getRgbChannels(packed);
  return [red ** 2.2, green ** 2.2, blue ** 2.2];
}

/** Resolves any CSS color (including `var(--token)` references) to packed RGB */
function createCssColorResolver(element: HTMLElement) {
  const probe = document
    .createElement("canvas")
    .getContext("2d", { willReadFrequently: true });
  return (color: string | number) => {
    if (typeof color === "number") {
      return color;
    }
    const variableName = /^var\((--[\w-]+)\)$/.exec(color.trim())?.[1];
    const cssColor =
      variableName == null
        ? color
        : getComputedStyle(element).getPropertyValue(variableName).trim();
    if (probe == null || cssColor === "") {
      return 0xff_ff_ff;
    }
    probe.clearRect(0, 0, 1, 1);
    probe.fillStyle = "#ffffff";
    probe.fillStyle = cssColor;
    probe.fillRect(0, 0, 1, 1);
    const [red, green, blue] = probe.getImageData(0, 0, 1, 1).data;
    return (red << 16) | (green << 8) | blue;
  };
}

const getPlaneIntersection = (
  ray: [number, number, number],
  planeZ: number,
) => {
  const distance = (planeZ - CAMERA_Z) / ray[2];
  return [ray[0] * distance, ray[1] * distance] as const;
};

async function loadImage(url: string) {
  const image = new Image();
  image.src = url;
  await image.decode();
  return image;
}

function createGrowableFloatArray(previous: Float32Array, length: number) {
  const next = new Float32Array(length);
  next.set(previous.subarray(0, Math.min(previous.length, length)));
  return next;
}

function startBallpitSimulation({
  container,
  canvas,
  gl,
  settingsRef,
}: {
  container: HTMLDivElement;
  canvas: HTMLCanvasElement;
  gl: WebGL2RenderingContext;
  settingsRef: RefObject<BallpitSettings>;
}) {
  const ballProgram = linkBallProgram(gl);
  if (ballProgram == null) {
    return null;
  }
  const { program, uniforms } = ballProgram;

  const prefersReducedMotion = window.matchMedia(
    "(prefers-reduced-motion: reduce)",
  ).matches;
  const baseTanHalfFov = Math.tan((FOV_DEGREES * Math.PI) / 360);
  const view = {
    width: 1,
    height: 1,
    pixelRatio: 1,
    halfWidth: 9,
    halfHeight: 9,
    fit: 1,
    tanHalfFov: baseTanHalfFov,
  };
  const projection = new Float32Array(16);

  const vertexArray = gl.createVertexArray();
  gl.bindVertexArray(vertexArray);
  const quadBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, quadBuffer);
  gl.bufferData(
    gl.ARRAY_BUFFER,
    new Float32Array([-1, -1, 1, -1, -1, 1, 1, 1]),
    gl.STATIC_DRAW,
  );
  gl.enableVertexAttribArray(0);
  gl.vertexAttribPointer(0, 2, gl.FLOAT, false, 0, 0);
  const instanceBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, instanceBuffer);
  for (let attribute = 0; attribute < INSTANCE_ATTRIBUTES; attribute++) {
    gl.enableVertexAttribArray(1 + attribute);
    gl.vertexAttribPointer(
      1 + attribute,
      4,
      gl.FLOAT,
      false,
      INSTANCE_STRIDE * 4,
      attribute * 16,
    );
    gl.vertexAttribDivisor(1 + attribute, 1);
  }
  gl.bindVertexArray(null);

  let capacity = 0;
  let ballCount = 0;
  let positionX = new Float32Array(0);
  let positionY = new Float32Array(0);
  let positionZ = new Float32Array(0);
  let velocityX = new Float32Array(0);
  let velocityY = new Float32Array(0);
  let velocityZ = new Float32Array(0);
  let radius = new Float32Array(0);
  let inverseMass = new Float32Array(0);
  let sizeFactor = new Float32Array(0);
  let driftPhase = new Float32Array(0);
  let decalPose = new Float32Array(0);
  let occlusion = new Float32Array(0);
  let previousPosition = new Float32Array(0);
  let colorIndex = new Uint16Array(0);
  let hasEntered = new Uint8Array(0);
  let cellOfBall = new Int32Array(0);
  let ballsByCell = new Int32Array(0);
  let drawOrder = new Int32Array(1);
  let instanceData = new Float32Array(INSTANCE_STRIDE);
  let cellOffsets = new Int32Array(2);
  let cellCursors = new Int32Array(2);
  let contacts = new Float32Array(0);
  let contactCount = 0;
  const getPackedColor = createCssColorResolver(container);
  let palette: [number, number, number][] = [];
  let paletteKey = "";
  let lightRgb = getLinearRgb(getPackedColor(settingsRef.current.lightColor));
  let lightColorKey = settingsRef.current.lightColor;
  let decalSlots = 0;
  let decalSlotsByColor: number[][] = [];
  let decalsKey = "";
  let isDisposed = false;
  const decalTexture = gl.createTexture();
  gl.bindTexture(gl.TEXTURE_2D, decalTexture);
  gl.texImage2D(
    gl.TEXTURE_2D,
    0,
    gl.RGBA,
    1,
    1,
    0,
    gl.RGBA,
    gl.UNSIGNED_BYTE,
    new Uint8Array(4),
  );

  const setDecalPose = (index: number) => {
    decalPose[index * 4] = randomSigned() * DECAL_MAX_TILT;
    decalPose[index * 4 + 1] = randomSigned() * DECAL_MAX_TILT;
    decalPose[index * 4 + 2] = randomSigned() * DECAL_MAX_ROTATION;
    decalPose[index * 4 + 3] = Math.random();
  };

  const getDecalSlot = (index: number) => {
    const slots = decalSlotsByColor.at(colorIndex[index] % palette.length);
    if (slots == null || slots.length === 0) {
      return -1;
    }
    return slots[Math.floor(decalPose[index * 4 + 3] * slots.length)];
  };

  const uploadDecalAtlas = (images: HTMLImageElement[]) => {
    const slotCount = 2 ** Math.ceil(Math.log2(images.length));
    const atlas = document.createElement("canvas");
    atlas.width = DECAL_SLOT_SIZE * slotCount;
    atlas.height = DECAL_SLOT_SIZE;
    const context = atlas.getContext("2d");
    if (context == null) {
      return;
    }
    const innerSize = DECAL_SLOT_SIZE - DECAL_SLOT_PADDING * 2;
    for (const [slot, image] of images.entries()) {
      const scale = Math.min(
        innerSize / image.naturalWidth,
        innerSize / image.naturalHeight,
      );
      const width = image.naturalWidth * scale;
      const height = image.naturalHeight * scale;
      context.drawImage(
        image,
        slot * DECAL_SLOT_SIZE + (DECAL_SLOT_SIZE - width) / 2,
        (DECAL_SLOT_SIZE - height) / 2,
        width,
        height,
      );
    }
    gl.bindTexture(gl.TEXTURE_2D, decalTexture);
    gl.pixelStorei(gl.UNPACK_PREMULTIPLY_ALPHA_WEBGL, true);
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, atlas);
    gl.pixelStorei(gl.UNPACK_PREMULTIPLY_ALPHA_WEBGL, false);
    gl.generateMipmap(gl.TEXTURE_2D);
    gl.texParameteri(
      gl.TEXTURE_2D,
      gl.TEXTURE_MIN_FILTER,
      gl.LINEAR_MIPMAP_LINEAR,
    );
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
    decalSlots = slotCount;
  };

  const loadDecals = (decals: BallpitDecal[]) => {
    const requestKey = getDecalsKey(decals);
    decalsKey = requestKey;
    decalSlots = 0;
    if (decals.length === 0) {
      return;
    }
    Promise.all(decals.map(async ({ src }) => loadImage(src)))
      .then((images) => {
        if (isDisposed || requestKey !== decalsKey) {
          return;
        }
        uploadDecalAtlas(images);
        wake();
      })
      .catch(() => {
        decalSlots = 0;
      });
  };
  let sizesKey = "";

  let isPointerInside = false;
  const cursor = {
    x: 0,
    y: 0,
    radius: 0,
    targetX: 0,
    targetY: 0,
    velocityX: 0,
    velocityY: 0,
  };
  const grid = {
    scale: 1,
    originX: 0,
    originY: 0,
    originZ: 0,
    cellsX: 1,
    cellsY: 1,
    cellsZ: 1,
  };
  let elapsedSeconds = 0;
  let glideSeconds = 0;
  let animationFrame = 0;
  let lastFrameTime = 0;
  let isVisible = true;
  let quietSeconds = 0;
  let sizedPixelRatio = settingsRef.current.dpr;

  const allocate = (total: number) => {
    positionX = createGrowableFloatArray(positionX, total);
    positionY = createGrowableFloatArray(positionY, total);
    positionZ = createGrowableFloatArray(positionZ, total);
    velocityX = createGrowableFloatArray(velocityX, total);
    velocityY = createGrowableFloatArray(velocityY, total);
    velocityZ = createGrowableFloatArray(velocityZ, total);
    radius = createGrowableFloatArray(radius, total);
    inverseMass = createGrowableFloatArray(inverseMass, total);
    sizeFactor = createGrowableFloatArray(sizeFactor, total);
    driftPhase = createGrowableFloatArray(driftPhase, total);
    decalPose = createGrowableFloatArray(decalPose, total * 4);
    occlusion = createGrowableFloatArray(occlusion, total * 4);
    previousPosition = createGrowableFloatArray(previousPosition, total * 3);
    const nextColorIndex = new Uint16Array(total);
    nextColorIndex.set(
      colorIndex.subarray(0, Math.min(colorIndex.length, total)),
    );
    colorIndex = nextColorIndex;
    const nextHasEntered = new Uint8Array(total);
    nextHasEntered.set(
      hasEntered.subarray(0, Math.min(hasEntered.length, total)),
    );
    hasEntered = nextHasEntered;
    cellOfBall = new Int32Array(total);
    ballsByCell = new Int32Array(total);
    drawOrder = new Int32Array(total);
    instanceData = new Float32Array((total + 1) * INSTANCE_STRIDE);
    capacity = total;
    gl.bindBuffer(gl.ARRAY_BUFFER, instanceBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, instanceData.byteLength, gl.DYNAMIC_DRAW);
  };

  const getBallRadius = (index: number, settings: BallpitSettings) =>
    (settings.minSize +
      sizeFactor[index] * (settings.maxSize - settings.minSize)) *
    view.fit;

  const setBallRadius = (index: number, settings: BallpitSettings) => {
    radius[index] = getBallRadius(index, settings);
    inverseMass[index] = 1 / radius[index] ** 3;
  };

  const spawnBall = (
    index: number,
    settings: BallpitSettings,
    shouldIntro: boolean,
  ) => {
    const ballRadius = radius[index];
    const depthRange = Math.max(settings.depth - ballRadius, 0);
    const spreadX = Math.max(view.halfWidth - ballRadius, 0.01);
    const spreadY = Math.max(view.halfHeight - ballRadius, 0.01);
    hasEntered[index] = 1;
    if (shouldIntro && settings.gravity > 0.05) {
      positionX[index] = randomSigned() * spreadX;
      positionY[index] =
        view.halfHeight + ballRadius + Math.random() * view.halfHeight * 2.2;
      positionZ[index] = randomSigned() * depthRange;
      velocityX[index] = (Math.random() - 0.5) * 2;
      velocityY[index] = -(4 + Math.random() * 5);
      velocityZ[index] = 0;
      hasEntered[index] = 0;
    } else if (shouldIntro) {
      const targetX = randomSigned() * spreadX;
      const targetY = randomSigned() * spreadY;
      const targetZ = randomSigned() * depthRange;
      positionX[index] = randomSigned() * 0.6;
      positionY[index] = randomSigned() * 0.6;
      positionZ[index] = randomSigned() * Math.min(depthRange, 0.3);
      velocityX[index] = (targetX - positionX[index]) * 2.2;
      velocityY[index] = (targetY - positionY[index]) * 2.2;
      velocityZ[index] = (targetZ - positionZ[index]) * 2.2;
      glideSeconds = 1;
    } else {
      positionX[index] = randomSigned() * spreadX;
      positionY[index] = randomSigned() * spreadY;
      positionZ[index] = randomSigned() * depthRange;
      velocityX[index] = 0;
      velocityY[index] = 0;
      velocityZ[index] = 0;
    }
  };

  const syncSettings = (settings: BallpitSettings, isFirstSync: boolean) => {
    if (settings.count !== ballCount) {
      if (settings.count > capacity) {
        allocate(Math.max(settings.count, Math.ceil(capacity * 1.5)));
      }
      const previousCount = ballCount;
      ballCount = settings.count;
      const shouldSpawnFromTop =
        (isFirstSync ? settings.intro : true) && !prefersReducedMotion;
      for (let ballIndex = previousCount; ballIndex < ballCount; ballIndex++) {
        sizeFactor[ballIndex] = Math.random();
        colorIndex[ballIndex] = ballIndex;
        driftPhase[ballIndex] = Math.random() * Math.PI * 2;
        setDecalPose(ballIndex);
        setBallRadius(ballIndex, settings);
        spawnBall(ballIndex, settings, shouldSpawnFromTop);
      }
      for (let ballIndex = 0; ballIndex < ballCount; ballIndex++) {
        drawOrder[ballIndex] = ballIndex;
      }
    }
    const nextSizesKey = `${String(settings.minSize)}:${String(settings.maxSize)}:${String(view.fit)}`;
    if (nextSizesKey !== sizesKey) {
      sizesKey = nextSizesKey;
      for (let ballIndex = 0; ballIndex < ballCount; ballIndex++) {
        setBallRadius(ballIndex, settings);
      }
    }
    const nextPaletteKey = settings.colors.join("|");
    const nextDecalsKey = getDecalsKey(settings.decals);
    if (nextPaletteKey !== paletteKey || nextDecalsKey !== decalsKey) {
      palette = settings.colors.map((color) =>
        getLinearRgb(getPackedColor(color)),
      );
      paletteKey = nextPaletteKey;
      decalSlotsByColor = palette.map((color) =>
        getDecalSlotsForColor(settings.decals, color),
      );
    }
    if (settings.lightColor !== lightColorKey) {
      lightRgb = getLinearRgb(getPackedColor(settings.lightColor));
      lightColorKey = settings.lightColor;
    }
    if (nextDecalsKey !== decalsKey) {
      loadDecals(settings.decals);
    }
  };

  const getCellIndex = (index: number) => {
    const cellX = clamp(
      Math.floor((positionX[index] - grid.originX) * grid.scale),
      0,
      grid.cellsX - 1,
    );
    const cellY = clamp(
      Math.floor((positionY[index] - grid.originY) * grid.scale),
      0,
      grid.cellsY - 1,
    );
    const cellZ = clamp(
      Math.floor((positionZ[index] - grid.originZ) * grid.scale),
      0,
      grid.cellsZ - 1,
    );
    return (cellZ * grid.cellsY + cellY) * grid.cellsX + cellX;
  };

  const buildGrid = (cellSize: number, settings: BallpitSettings) => {
    const halfDepth = Math.max(settings.depth, settings.maxSize);
    grid.scale = 1 / cellSize;
    grid.originX = -view.halfWidth - cellSize;
    grid.originY = -view.halfHeight - cellSize;
    grid.originZ = -halfDepth - cellSize;
    const getCellsAlong = (extent: number) =>
      Math.max(1, Math.ceil((extent * 2 + cellSize * 2) * grid.scale) + 1);
    grid.cellsX = getCellsAlong(view.halfWidth);
    grid.cellsY = getCellsAlong(view.halfHeight);
    grid.cellsZ = getCellsAlong(halfDepth);
    const totalCells = grid.cellsX * grid.cellsY * grid.cellsZ;
    if (cellOffsets.length < totalCells + 1) {
      cellOffsets = new Int32Array(totalCells + 1);
      cellCursors = new Int32Array(totalCells + 1);
    }
    cellOffsets.fill(0, 0, totalCells + 1);
    for (let ballIndex = 0; ballIndex < ballCount; ballIndex++) {
      const cell = getCellIndex(ballIndex);
      cellOfBall[ballIndex] = cell;
      cellOffsets[cell + 1]++;
    }
    for (let cell = 1; cell <= totalCells; cell++) {
      cellOffsets[cell] += cellOffsets[cell - 1];
    }
    cellCursors.set(cellOffsets.subarray(0, totalCells + 1));
    for (let ballIndex = 0; ballIndex < ballCount; ballIndex++) {
      ballsByCell[cellCursors[cellOfBall[ballIndex]]++] = ballIndex;
    }
  };

  const hasContactRoom = () => contactCount * CONTACT_STRIDE < contacts.length;

  const addContact = ({
    ball,
    other,
    normalX,
    normalY,
    normalZ,
    gap,
    approach,
    restitution,
  }: {
    ball: number;
    other: number;
    normalX: number;
    normalY: number;
    normalZ: number;
    gap: number;
    approach: number;
    restitution: number;
  }) => {
    const offset = contactCount * CONTACT_STRIDE;
    contacts[offset] = ball;
    contacts[offset + 1] = other;
    contacts[offset + 2] = normalX;
    contacts[offset + 3] = normalY;
    contacts[offset + 4] = normalZ;
    contacts[offset + 5] = gap;
    contacts[offset + 6] =
      approach < -BOUNCE_THRESHOLD ? -restitution * approach : 0;
    contacts[offset + 7] = 0;
    contactCount++;
  };

  const addWallContact = (
    ball: number,
    gap: number,
    [normalX, normalY, normalZ]: [number, number, number],
    restitution: number,
    margin: number,
  ) => {
    if (gap >= margin || !hasContactRoom()) {
      return;
    }
    addContact({
      ball,
      other: WALL_CONTACT,
      normalX,
      normalY,
      normalZ,
      gap,
      approach:
        velocityX[ball] * normalX +
        velocityY[ball] * normalY +
        velocityZ[ball] * normalZ,
      restitution,
    });
  };

  const addOcclusion = (
    ball: number,
    normal: [number, number, number],
    weight: number,
  ) => {
    occlusion[ball * 4] += normal[0] * weight;
    occlusion[ball * 4 + 1] += normal[1] * weight;
    occlusion[ball * 4 + 2] += normal[2] * weight;
    occlusion[ball * 4 + 3] += weight;
  };

  const findBallPairContacts = (
    ballIndex: number,
    otherIndex: number,
    settings: BallpitSettings,
    shouldShade: boolean,
    margin: number,
  ) => {
    const deltaX = positionX[otherIndex] - positionX[ballIndex];
    const deltaY = positionY[otherIndex] - positionY[ballIndex];
    const deltaZ = positionZ[otherIndex] - positionZ[ballIndex];
    const distanceSquared = deltaX * deltaX + deltaY * deltaY + deltaZ * deltaZ;
    const radiusSum = radius[ballIndex] + radius[otherIndex];
    const reach = Math.max(
      radiusSum + margin,
      shouldShade ? radiusSum * 1.4 : 0,
    );
    if (distanceSquared >= reach * reach || distanceSquared < 1e-12) {
      return;
    }
    const distance = Math.sqrt(distanceSquared);
    const normalX = deltaX / distance;
    const normalY = deltaY / distance;
    const normalZ = deltaZ / distance;
    if (shouldShade) {
      const weight = clamp(
        1 - (distance - radiusSum) / (radiusSum * 0.4),
        0,
        1,
      );
      addOcclusion(ballIndex, [normalX, normalY, normalZ], weight);
      addOcclusion(otherIndex, [-normalX, -normalY, -normalZ], weight);
    }
    if (distance >= radiusSum + margin || !hasContactRoom()) {
      return;
    }
    addContact({
      ball: ballIndex,
      other: otherIndex,
      normalX,
      normalY,
      normalZ,
      gap: distance - radiusSum,
      approach:
        (velocityX[otherIndex] - velocityX[ballIndex]) * normalX +
        (velocityY[otherIndex] - velocityY[ballIndex]) * normalY +
        (velocityZ[otherIndex] - velocityZ[ballIndex]) * normalZ,
      restitution: settings.bounce,
    });
  };

  const findNeighborContacts = (
    ballIndex: number,
    settings: BallpitSettings,
    shouldShade: boolean,
    margin: number,
  ) => {
    const { cellsX, cellsY, cellsZ } = grid;
    const cell = cellOfBall[ballIndex];
    const cellX = cell % cellsX;
    const cellY = Math.floor(cell / cellsX) % cellsY;
    const cellZ = Math.floor(cell / (cellsX * cellsY));
    for (
      let offsetZ = cellZ > 0 ? -1 : 0;
      offsetZ <= (cellZ < cellsZ - 1 ? 1 : 0);
      offsetZ++
    ) {
      for (
        let offsetY = cellY > 0 ? -1 : 0;
        offsetY <= (cellY < cellsY - 1 ? 1 : 0);
        offsetY++
      ) {
        const rowStart =
          ((cellZ + offsetZ) * cellsY + cellY + offsetY) * cellsX;
        for (
          let offsetX = cellX > 0 ? -1 : 0;
          offsetX <= (cellX < cellsX - 1 ? 1 : 0);
          offsetX++
        ) {
          const neighborCell = rowStart + cellX + offsetX;
          for (
            let k = cellOffsets[neighborCell];
            k < cellOffsets[neighborCell + 1];
            k++
          ) {
            const otherIndex = ballsByCell[k];
            if (otherIndex > ballIndex) {
              findBallPairContacts(
                ballIndex,
                otherIndex,
                settings,
                shouldShade,
                margin,
              );
            }
          }
        }
      }
    }
  };

  const findWallContacts = (
    ballIndex: number,
    settings: BallpitSettings,
    margin: number,
  ) => {
    const ballRadius = radius[ballIndex];
    const depthRange = Math.max(settings.depth - ballRadius, 0);
    const restitution = settings.wallBounce;
    addWallContact(
      ballIndex,
      positionX[ballIndex] + view.halfWidth - ballRadius,
      [1, 0, 0],
      restitution,
      margin,
    );
    addWallContact(
      ballIndex,
      view.halfWidth - ballRadius - positionX[ballIndex],
      [-1, 0, 0],
      restitution,
      margin,
    );
    addWallContact(
      ballIndex,
      positionY[ballIndex] + view.halfHeight - ballRadius,
      [0, 1, 0],
      restitution,
      margin,
    );
    if (hasEntered[ballIndex] === 1) {
      addWallContact(
        ballIndex,
        view.halfHeight - ballRadius - positionY[ballIndex],
        [0, -1, 0],
        restitution,
        margin,
      );
    }
    addWallContact(
      ballIndex,
      positionZ[ballIndex] + depthRange,
      [0, 0, 1],
      restitution,
      margin,
    );
    addWallContact(
      ballIndex,
      depthRange - positionZ[ballIndex],
      [0, 0, -1],
      restitution,
      margin,
    );
  };

  const findCursorContact = (
    ballIndex: number,
    settings: BallpitSettings,
    margin: number,
  ) => {
    const deltaX = positionX[ballIndex] - cursor.x;
    const deltaY = positionY[ballIndex] - cursor.y;
    const deltaZ = positionZ[ballIndex];
    const radiusSum = radius[ballIndex] + cursor.radius;
    const distanceSquared = deltaX * deltaX + deltaY * deltaY + deltaZ * deltaZ;
    if (
      distanceSquared >= (radiusSum + margin) ** 2 ||
      distanceSquared <= 1e-12
    ) {
      return;
    }
    const distance = Math.sqrt(distanceSquared);
    const normalX = deltaX / distance;
    const normalY = deltaY / distance;
    const normalZ = deltaZ / distance;
    addContact({
      ball: ballIndex,
      other: CURSOR_CONTACT,
      normalX,
      normalY,
      normalZ,
      gap: distance - radiusSum,
      approach:
        (velocityX[ballIndex] - cursor.velocityX) * normalX +
        (velocityY[ballIndex] - cursor.velocityY) * normalY +
        velocityZ[ballIndex] * normalZ,
      restitution: settings.bounce,
    });
  };

  const findContacts = (
    settings: BallpitSettings,
    shouldShade: boolean,
    margin: number,
  ) => {
    contactCount = 0;
    for (let ballIndex = 0; ballIndex < ballCount; ballIndex++) {
      findNeighborContacts(ballIndex, settings, shouldShade, margin);
      findWallContacts(ballIndex, settings, margin);
      if (cursor.radius > 0.01 && hasContactRoom()) {
        findCursorContact(ballIndex, settings, margin);
      }
    }
  };

  const solveVelocities = (deltaSeconds: number) => {
    const iterations = ballCount > 800 ? 5 : 8;
    for (let iteration = 0; iteration < iterations; iteration++) {
      for (let contact = 0; contact < contactCount; contact++) {
        const offset = contact * CONTACT_STRIDE;
        const ballIndex = contacts[offset];
        const otherIndex = contacts[offset + 1];
        const normalX = contacts[offset + 2];
        const normalY = contacts[offset + 3];
        const normalZ = contacts[offset + 4];
        const gap = contacts[offset + 5];
        const targetVelocity =
          gap > 0 ? -gap / deltaSeconds : contacts[offset + 6];
        const accumulatedImpulse = contacts[offset + 7];
        if (otherIndex < 0) {
          const isCursor = otherIndex === CURSOR_CONTACT;
          const normalVelocity =
            (velocityX[ballIndex] - (isCursor ? cursor.velocityX : 0)) *
              normalX +
            (velocityY[ballIndex] - (isCursor ? cursor.velocityY : 0)) *
              normalY +
            velocityZ[ballIndex] * normalZ;
          const nextImpulse = Math.max(
            accumulatedImpulse + targetVelocity - normalVelocity,
            0,
          );
          const impulseChange = nextImpulse - accumulatedImpulse;
          contacts[offset + 7] = nextImpulse;
          velocityX[ballIndex] += impulseChange * normalX;
          velocityY[ballIndex] += impulseChange * normalY;
          velocityZ[ballIndex] += impulseChange * normalZ;
          continue;
        }
        const inverseMassBall = inverseMass[ballIndex];
        const inverseMassOther = inverseMass[otherIndex];
        const totalInverseMass = inverseMassBall + inverseMassOther;
        if (totalInverseMass <= 0) {
          continue;
        }
        const normalVelocity =
          (velocityX[otherIndex] - velocityX[ballIndex]) * normalX +
          (velocityY[otherIndex] - velocityY[ballIndex]) * normalY +
          (velocityZ[otherIndex] - velocityZ[ballIndex]) * normalZ;
        const nextImpulse = Math.max(
          accumulatedImpulse +
            (targetVelocity - normalVelocity) / totalInverseMass,
          0,
        );
        const impulseChange = nextImpulse - accumulatedImpulse;
        contacts[offset + 7] = nextImpulse;
        velocityX[ballIndex] -= impulseChange * inverseMassBall * normalX;
        velocityY[ballIndex] -= impulseChange * inverseMassBall * normalY;
        velocityZ[ballIndex] -= impulseChange * inverseMassBall * normalZ;
        velocityX[otherIndex] += impulseChange * inverseMassOther * normalX;
        velocityY[otherIndex] += impulseChange * inverseMassOther * normalY;
        velocityZ[otherIndex] += impulseChange * inverseMassOther * normalZ;
      }
    }
  };

  const correctCursorOverlap = (ballIndex: number) => {
    const deltaX = positionX[ballIndex] - cursor.x;
    const deltaY = positionY[ballIndex] - cursor.y;
    const deltaZ = positionZ[ballIndex];
    const distance = Math.hypot(deltaX, deltaY, deltaZ);
    const overlap =
      radius[ballIndex] + cursor.radius - distance - PENETRATION_SLOP;
    if (overlap <= 0 || distance < 1e-6) {
      return;
    }
    const correction = (overlap * 0.5) / distance;
    positionX[ballIndex] += deltaX * correction;
    positionY[ballIndex] += deltaY * correction;
    positionZ[ballIndex] += deltaZ * correction;
  };

  const correctBallOverlap = (ballIndex: number, otherIndex: number) => {
    const deltaX = positionX[otherIndex] - positionX[ballIndex];
    const deltaY = positionY[otherIndex] - positionY[ballIndex];
    const deltaZ = positionZ[otherIndex] - positionZ[ballIndex];
    const distance = Math.hypot(deltaX, deltaY, deltaZ);
    const overlap =
      radius[ballIndex] + radius[otherIndex] - distance - PENETRATION_SLOP;
    if (overlap <= 0 || distance < 1e-6) {
      return;
    }
    const inverseMassBall = inverseMass[ballIndex];
    const inverseMassOther = inverseMass[otherIndex];
    const totalInverseMass = inverseMassBall + inverseMassOther;
    if (totalInverseMass <= 0) {
      return;
    }
    const correction = (overlap * 0.3) / (distance * totalInverseMass);
    positionX[ballIndex] -= deltaX * correction * inverseMassBall;
    positionY[ballIndex] -= deltaY * correction * inverseMassBall;
    positionZ[ballIndex] -= deltaZ * correction * inverseMassBall;
    positionX[otherIndex] += deltaX * correction * inverseMassOther;
    positionY[otherIndex] += deltaY * correction * inverseMassOther;
    positionZ[otherIndex] += deltaZ * correction * inverseMassOther;
  };

  const correctPositions = () => {
    for (let pass = 0; pass < 2; pass++) {
      for (let contact = 0; contact < contactCount; contact++) {
        const offset = contact * CONTACT_STRIDE;
        const ballIndex = contacts[offset];
        const otherIndex = contacts[offset + 1];
        if (otherIndex === CURSOR_CONTACT) {
          correctCursorOverlap(ballIndex);
        } else if (otherIndex >= 0) {
          correctBallOverlap(ballIndex, otherIndex);
        }
      }
    }
  };

  const getBouncedVelocity = (velocity: number, restitution: number) =>
    Math.abs(velocity) > BOUNCE_THRESHOLD ? -velocity * restitution : 0;

  const constrainToWalls = (settings: BallpitSettings) => {
    const restitution = settings.wallBounce;
    for (let ballIndex = 0; ballIndex < ballCount; ballIndex++) {
      const ballRadius = radius[ballIndex];
      if (positionX[ballIndex] < -view.halfWidth + ballRadius) {
        positionX[ballIndex] = -view.halfWidth + ballRadius;
        if (velocityX[ballIndex] < 0) {
          velocityX[ballIndex] = getBouncedVelocity(
            velocityX[ballIndex],
            restitution,
          );
        }
      } else if (positionX[ballIndex] > view.halfWidth - ballRadius) {
        positionX[ballIndex] = view.halfWidth - ballRadius;
        if (velocityX[ballIndex] > 0) {
          velocityX[ballIndex] = getBouncedVelocity(
            velocityX[ballIndex],
            restitution,
          );
        }
      }
      if (positionY[ballIndex] < -view.halfHeight + ballRadius) {
        positionY[ballIndex] = -view.halfHeight + ballRadius;
        if (velocityY[ballIndex] < 0) {
          velocityY[ballIndex] = getBouncedVelocity(
            velocityY[ballIndex],
            restitution,
          );
        }
        velocityX[ballIndex] *= 0.995;
        velocityZ[ballIndex] *= 0.995;
      } else if (
        hasEntered[ballIndex] === 1 &&
        positionY[ballIndex] > view.halfHeight - ballRadius
      ) {
        positionY[ballIndex] = view.halfHeight - ballRadius;
        if (velocityY[ballIndex] > 0) {
          velocityY[ballIndex] = getBouncedVelocity(
            velocityY[ballIndex],
            restitution,
          );
        }
      }
      if (
        hasEntered[ballIndex] === 0 &&
        positionY[ballIndex] < view.halfHeight - ballRadius
      ) {
        hasEntered[ballIndex] = 1;
      }
      const depthRange = Math.max(settings.depth - ballRadius, 0);
      if (positionZ[ballIndex] < -depthRange) {
        positionZ[ballIndex] = -depthRange;
        if (velocityZ[ballIndex] < 0) {
          velocityZ[ballIndex] = getBouncedVelocity(
            velocityZ[ballIndex],
            restitution,
          );
        }
      } else if (positionZ[ballIndex] > depthRange) {
        positionZ[ballIndex] = depthRange;
        if (velocityZ[ballIndex] > 0) {
          velocityZ[ballIndex] = getBouncedVelocity(
            velocityZ[ballIndex],
            restitution,
          );
        }
      }
    }
  };

  const applyForces = (settings: BallpitSettings, deltaSeconds: number) => {
    const gravityAcceleration = settings.gravity * 45;
    const damping =
      settings.friction ** (deltaSeconds * 60) *
      (glideSeconds > 0 ? Math.exp(-2.2 * deltaSeconds) : 1);
    const wanderStrength = prefersReducedMotion ? 0 : settings.drift * 2.2;
    for (let ballIndex = 0; ballIndex < ballCount; ballIndex++) {
      velocityY[ballIndex] -= gravityAcceleration * deltaSeconds;
      if (wanderStrength > 0) {
        const phase = driftPhase[ballIndex];
        const wander = wanderStrength * deltaSeconds;
        velocityX[ballIndex] +=
          Math.sin(elapsedSeconds * 0.63 + phase) * wander;
        velocityY[ballIndex] +=
          Math.cos(elapsedSeconds * 0.47 + phase * 1.7) * wander;
        velocityZ[ballIndex] +=
          Math.sin(elapsedSeconds * 0.41 + phase * 2.3) * wander * 0.5;
      }
      velocityX[ballIndex] *= damping;
      velocityY[ballIndex] *= damping;
      velocityZ[ballIndex] *= damping;
      const speed = Math.hypot(
        velocityX[ballIndex],
        velocityY[ballIndex],
        velocityZ[ballIndex],
      );
      if (speed > MAX_SPEED) {
        const limit = MAX_SPEED / speed;
        velocityX[ballIndex] *= limit;
        velocityY[ballIndex] *= limit;
        velocityZ[ballIndex] *= limit;
      }
    }
  };

  const addFloorOcclusion = () => {
    for (let ballIndex = 0; ballIndex < ballCount; ballIndex++) {
      const gap = positionY[ballIndex] - radius[ballIndex] + view.halfHeight;
      const reach = radius[ballIndex] * 0.5;
      if (gap < reach) {
        addOcclusion(ballIndex, [0, -1, 0], 1 - Math.max(gap, 0) / reach);
      }
    }
  };

  const step = (
    settings: BallpitSettings,
    deltaSeconds: number,
    shouldShade: boolean,
  ) => {
    const biggestRadius = settings.maxSize * view.fit;
    const margin = biggestRadius * 0.3;
    if (contacts.length < ballCount * CONTACTS_PER_BALL * CONTACT_STRIDE) {
      contacts = new Float32Array(
        ballCount * CONTACTS_PER_BALL * CONTACT_STRIDE,
      );
    }
    applyForces(settings, deltaSeconds);
    buildGrid(biggestRadius * (shouldShade ? 2.8 : 2.3), settings);
    if (shouldShade) {
      occlusion.fill(0, 0, ballCount * 4);
    }
    findContacts(settings, shouldShade, margin);
    solveVelocities(deltaSeconds);
    for (let ballIndex = 0; ballIndex < ballCount; ballIndex++) {
      positionX[ballIndex] += velocityX[ballIndex] * deltaSeconds;
      positionY[ballIndex] += velocityY[ballIndex] * deltaSeconds;
      positionZ[ballIndex] += velocityZ[ballIndex] * deltaSeconds;
    }
    correctPositions();
    constrainToWalls(settings);
    if (shouldShade) {
      addFloorOcclusion();
    }
  };

  const getRay = (
    clientX: number,
    clientY: number,
  ): [number, number, number] => {
    const rect = container.getBoundingClientRect();
    const normalizedX =
      ((clientX - rect.left) / Math.max(rect.width, 1)) * 2 - 1;
    const normalizedY =
      1 - ((clientY - rect.top) / Math.max(rect.height, 1)) * 2;
    return [
      normalizedX * view.tanHalfFov * (view.width / view.height),
      normalizedY * view.tanHalfFov,
      -1,
    ];
  };

  const sortDrawOrder = () => {
    for (let sortedCount = 1; sortedCount < ballCount; sortedCount++) {
      const item = drawOrder[sortedCount];
      const depth = positionZ[item];
      let slot = sortedCount - 1;
      while (slot >= 0 && positionZ[drawOrder[slot]] > depth) {
        drawOrder[slot + 1] = drawOrder[slot];
        slot--;
      }
      drawOrder[slot + 1] = item;
    }
  };

  const writeCursorInstance = (offset: number) => {
    const [red, green, blue] = palette.at(0) ?? [1, 1, 1];
    instanceData.set(
      [
        cursor.x,
        cursor.y,
        0,
        cursor.radius,
        red,
        green,
        blue,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        -1,
      ],
      offset,
    );
  };

  const writeBallInstance = (index: number, offset: number) => {
    const [red, green, blue] = palette[colorIndex[index] % palette.length];
    const occlusionX = occlusion[index * 4];
    const occlusionY = occlusion[index * 4 + 1];
    const occlusionZ = occlusion[index * 4 + 2];
    const occlusionLength = Math.hypot(occlusionX, occlusionY, occlusionZ) || 1;
    instanceData.set(
      [
        positionX[index],
        positionY[index],
        positionZ[index],
        radius[index],
        red,
        green,
        blue,
        0,
        occlusionX / occlusionLength,
        occlusionY / occlusionLength,
        occlusionZ / occlusionLength,
        Math.min(occlusion[index * 4 + 3] * 0.55, 1),
        decalPose[index * 4],
        decalPose[index * 4 + 1],
        decalPose[index * 4 + 2],
        getDecalSlot(index),
      ],
      offset,
    );
  };

  const draw = () => {
    const settings = settingsRef.current;
    const material = MATERIALS[settings.material];
    sortDrawOrder();
    const hasCursorBall = settings.followCursor && cursor.radius > 0.01;
    let instanceIndex = 0;
    let isCursorWritten = !hasCursorBall;
    for (let k = 0; k < ballCount; k++) {
      const index = drawOrder[k];
      if (!isCursorWritten && positionZ[index] > 0) {
        writeCursorInstance(instanceIndex++ * INSTANCE_STRIDE);
        isCursorWritten = true;
      }
      writeBallInstance(index, instanceIndex++ * INSTANCE_STRIDE);
    }
    if (!isCursorWritten) {
      writeCursorInstance(instanceIndex * INSTANCE_STRIDE);
    }
    const instanceCount = ballCount + (hasCursorBall ? 1 : 0);
    gl.viewport(0, 0, canvas.width, canvas.height);
    gl.clearColor(0, 0, 0, 0);
    gl.clearDepth(1);
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
    if (instanceCount === 0) {
      return;
    }
    gl.enable(gl.DEPTH_TEST);
    gl.depthFunc(gl.LEQUAL);
    gl.enable(gl.BLEND);
    gl.blendFunc(gl.ONE, gl.ONE_MINUS_SRC_ALPHA);
    gl.useProgram(program);
    gl.uniformMatrix4fv(uniforms.projection, false, projection);
    gl.uniform1f(uniforms.cameraZ, CAMERA_Z);
    gl.uniform1f(uniforms.pixelSize, (2 * view.tanHalfFov) / canvas.height);
    gl.activeTexture(gl.TEXTURE0);
    gl.bindTexture(gl.TEXTURE_2D, decalTexture);
    gl.uniform1i(uniforms.decal, 0);
    gl.uniform1f(uniforms.decalSlots, decalSlots);
    gl.uniform1f(uniforms.decalSize, settings.decalSize);
    const [lightRed, lightGreen, lightBlue] = lightRgb;
    const lightPower = settings.lightIntensity * 60;
    gl.uniform3f(
      uniforms.light,
      lightRed * lightPower,
      lightGreen * lightPower,
      lightBlue * lightPower,
    );
    gl.uniform3f(
      uniforms.lightPosition,
      0,
      view.halfHeight * 0.75,
      settings.depth + 4 - CAMERA_Z,
    );
    gl.uniform1f(uniforms.exposure, settings.exposure);
    gl.uniform1f(uniforms.shadow, settings.shadows);
    gl.uniform4f(
      uniforms.surface,
      material.roughness,
      material.metalness,
      material.coat,
      material.coatRoughness,
    );
    gl.uniform2f(uniforms.extra, material.scatter, material.frost);
    gl.bindBuffer(gl.ARRAY_BUFFER, instanceBuffer);
    gl.bufferSubData(
      gl.ARRAY_BUFFER,
      0,
      instanceData,
      0,
      instanceCount * INSTANCE_STRIDE,
    );
    gl.bindVertexArray(vertexArray);
    gl.drawArraysInstanced(gl.TRIANGLE_STRIP, 0, 4, instanceCount);
    gl.bindVertexArray(null);
  };

  const updateProjection = (aspect: number) => {
    const focalLength = 1 / view.tanHalfFov;
    const near = 1;
    const far = 80;
    projection.fill(0);
    projection[0] = focalLength / aspect;
    projection[5] = focalLength;
    projection[10] = (far + near) / (near - far);
    projection[11] = -1;
    projection[14] = (2 * far * near) / (near - far);
  };

  const updateCursor = (settings: BallpitSettings, deltaSeconds: number) => {
    const targetRadius =
      settings.followCursor && isPointerInside
        ? settings.cursorSize * view.fit
        : 0;
    cursor.radius +=
      (targetRadius - cursor.radius) * (1 - Math.exp(-deltaSeconds / 0.12));
    const follow = 1 - Math.exp(-deltaSeconds / 0.06);
    const previousX = cursor.x;
    const previousY = cursor.y;
    cursor.x += (cursor.targetX - cursor.x) * follow;
    cursor.y += (cursor.targetY - cursor.y) * follow;
    const safeDelta = Math.max(deltaSeconds, 1e-3);
    cursor.velocityX = clamp(
      (cursor.x - previousX) / safeDelta,
      -MAX_SPEED,
      MAX_SPEED,
    );
    cursor.velocityY = clamp(
      (cursor.y - previousY) / safeDelta,
      -MAX_SPEED,
      MAX_SPEED,
    );
  };

  const getMaxDisplacement = () => {
    let maxDisplacement = 0;
    for (let ballIndex = 0; ballIndex < ballCount; ballIndex++) {
      const offset = ballIndex * 3;
      const displacement =
        Math.abs(positionX[ballIndex] - previousPosition[offset]) +
        Math.abs(positionY[ballIndex] - previousPosition[offset + 1]) +
        Math.abs(positionZ[ballIndex] - previousPosition[offset + 2]);
      maxDisplacement = Math.max(maxDisplacement, displacement);
      previousPosition[offset] = positionX[ballIndex];
      previousPosition[offset + 1] = positionY[ballIndex];
      previousPosition[offset + 2] = positionZ[ballIndex];
    }
    return maxDisplacement;
  };

  const isBusy = (settings: BallpitSettings, motion: number) =>
    motion > 0.6 ||
    isPointerInside ||
    cursor.radius > 0.01 ||
    glideSeconds > 0 ||
    (settings.drift > 0 && !prefersReducedMotion);

  const resize = () => {
    const settings = settingsRef.current;
    sizedPixelRatio = settings.dpr;
    view.width = Math.max(1, container.clientWidth);
    view.height = Math.max(1, container.clientHeight);
    view.pixelRatio = Math.min(
      settings.dpr ?? window.devicePixelRatio,
      MAX_PIXEL_RATIO,
    );
    canvas.width = Math.max(1, Math.round(view.width * view.pixelRatio));
    canvas.height = Math.max(1, Math.round(view.height * view.pixelRatio));
    const aspect = view.width / view.height;
    view.tanHalfFov =
      aspect > MAX_ASPECT
        ? (baseTanHalfFov * MAX_ASPECT) / aspect
        : baseTanHalfFov;
    view.halfHeight = view.tanHalfFov * CAMERA_Z;
    view.halfWidth = view.halfHeight * aspect;
    view.fit = clamp(
      Math.sqrt(
        (view.halfWidth * view.halfHeight) /
          (baseTanHalfFov ** 2 * CAMERA_Z ** 2 * MAX_ASPECT),
      ),
      0.4,
      1,
    );
    updateProjection(aspect);
    if (ballCount === 0) {
      syncSettings(settings, true);
    }
    draw();
    wake();
  };

  const renderFrame = (now: number) => {
    animationFrame = 0;
    if (!isVisible || document.hidden) {
      return;
    }
    const settings = settingsRef.current;
    if (settings.dpr !== sizedPixelRatio) {
      resize();
    }
    const deltaSeconds =
      lastFrameTime === 0
        ? 1 / 60
        : clamp((now - lastFrameTime) / 1000, 0, 1 / 20);
    lastFrameTime = now;
    elapsedSeconds += deltaSeconds;
    glideSeconds = Math.max(0, glideSeconds - deltaSeconds);
    syncSettings(settings, false);
    updateCursor(settings, deltaSeconds);
    if (deltaSeconds > 1e-4) {
      const substeps = Math.min(6, Math.max(1, Math.ceil(deltaSeconds * 180)));
      const substepSeconds = deltaSeconds / substeps;
      for (let substep = 0; substep < substeps; substep++) {
        step(settings, substepSeconds, substep === substeps - 1);
      }
    }
    draw();
    const motion = getMaxDisplacement() / Math.max(deltaSeconds, 1e-3);
    quietSeconds = isBusy(settings, motion) ? 0 : quietSeconds + deltaSeconds;
    if (quietSeconds < IDLE_TIMEOUT_SECONDS) {
      animationFrame = requestAnimationFrame(renderFrame);
    }
  };

  function wake() {
    quietSeconds = 0;
    if (animationFrame === 0 && isVisible && !document.hidden) {
      lastFrameTime = 0;
      animationFrame = requestAnimationFrame(renderFrame);
    }
  }

  const isInsideContainer = (event: PointerEvent) => {
    const rect = container.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;
    return x >= 0 && y >= 0 && x <= rect.width && y <= rect.height;
  };

  const handlePointerMove = (event: PointerEvent) => {
    const wasInside = isPointerInside;
    isPointerInside = event.pointerType !== "touch" && isInsideContainer(event);
    if (isPointerInside) {
      [cursor.targetX, cursor.targetY] = getPlaneIntersection(
        getRay(event.clientX, event.clientY),
        0,
      );
      if (!wasInside) {
        cursor.x = cursor.targetX;
        cursor.y = cursor.targetY;
      }
    }
    if (isPointerInside || wasInside) {
      wake();
    }
  };

  const handlePointerLeave = () => {
    isPointerInside = false;
    wake();
  };

  const resizeObserver = new ResizeObserver(resize);
  resizeObserver.observe(container);
  const intersectionObserver = new IntersectionObserver((entries) => {
    isVisible = entries.some((entry) => entry.isIntersecting);
    if (isVisible) {
      wake();
    }
  });
  intersectionObserver.observe(container);
  window.addEventListener("pointermove", handlePointerMove, { passive: true });
  document.documentElement.addEventListener("pointerleave", handlePointerLeave);
  document.addEventListener("visibilitychange", wake);
  resize();

  const dispose = () => {
    isDisposed = true;
    gl.deleteTexture(decalTexture);
    cancelAnimationFrame(animationFrame);
    resizeObserver.disconnect();
    intersectionObserver.disconnect();
    window.removeEventListener("pointermove", handlePointerMove);
    document.documentElement.removeEventListener(
      "pointerleave",
      handlePointerLeave,
    );
    document.removeEventListener("visibilitychange", wake);
    gl.deleteBuffer(quadBuffer);
    gl.deleteBuffer(instanceBuffer);
    gl.deleteVertexArray(vertexArray);
    gl.deleteProgram(program);
    gl.getExtension("WEBGL_lose_context")?.loseContext();
  };

  return { wake, dispose };
}

/**
 * Creates a fresh canvas on every mount, because a canvas whose context was
 * lost on unmount (e.g. by Strict Mode's double effect) cannot be reused.
 */
function createCanvas(container: HTMLDivElement) {
  const canvas = document.createElement("canvas");
  canvas.className = "block size-full";
  canvas.setAttribute("aria-hidden", "true");
  container.append(canvas);
  return canvas;
}

/**
 * Soft-lit pit of physics balls rendered with WebGL2. While the mouse hovers
 * the pit, a ball spawns under the cursor and shoves the others around.
 * Balls can carry small logo decals.
 */
export function Ballpit({
  className,
  style,
  ...settingsProps
}: Partial<BallpitSettings> & {
  className?: string;
  style?: CSSProperties;
}) {
  const containerRef = useRef<HTMLDivElement>(null);
  const wakeRef = useRef<(() => void) | null>(null);
  const settings = getBallpitSettings(settingsProps);
  const settingsRef = useRef(settings);

  useEffect(() => {
    const container = containerRef.current;
    if (container == null) {
      return;
    }
    const canvas = createCanvas(container);
    const gl = canvas.getContext("webgl2", {
      alpha: true,
      premultipliedAlpha: true,
      antialias: false,
      depth: true,
      stencil: false,
      powerPreference: "high-performance",
    });
    const simulation =
      gl == null
        ? null
        : startBallpitSimulation({ container, canvas, gl, settingsRef });
    wakeRef.current = simulation?.wake ?? null;
    return () => {
      wakeRef.current = null;
      simulation?.dispose();
      canvas.remove();
    };
  }, []);

  useEffect(() => {
    settingsRef.current = settings;
    wakeRef.current?.();
  });

  return (
    <div
      ref={containerRef}
      className={cn("relative size-full overflow-hidden", className)}
      style={style}
    />
  );
}
