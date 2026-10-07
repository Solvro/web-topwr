"use client";

import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { useRef } from "react";
import * as THREE from "three";

import { BLOB_ANIMATION } from "../constants";
import { useBlobMaskTexture } from "../hooks/use-blob-mask-texture";
import type { BlobConfig, BlobShape, Point } from "../types";

const vertexShader = /* glsl */ `
  in vec3 position;
  out vec2 v_canvasUV;
  void main() {
    v_canvasUV = position.xy * 0.5 + 0.5;
    gl_Position = vec4(position, 1.0);
  }
`;

const fragmentShader = /* glsl */ `
  precision highp float;

  uniform float u_time;
  uniform vec2 u_canvasSize;
  uniform sampler2D u_mask;
  uniform float u_maskAspect;
  uniform float u_maskPadding;
  uniform vec3 u_color;
  uniform vec3 u_gradientColor;
  uniform vec2 u_gradientStart;
  uniform vec2 u_gradientEnd;
  uniform float u_waveSize;
  uniform float u_waveStrength;

  in vec2 v_canvasUV;
  out vec4 fragColor;

  float random(vec2 p) {
      vec3 p3  = fract(vec3(p.xyx) * 0.1031);
      p3 += dot(p3, p3.yzx + 33.33);
      return fract((p3.x + p3.y) * p3.z);
  }

  float noise2D(vec2 coordinate) {
      vec2 gridCell = floor(coordinate);
      vec2 fraction = fract(coordinate);

      float bottomLeft  = random(gridCell);
      float bottomRight = random(gridCell + vec2(1.0, 0.0));
      float topLeft     = random(gridCell + vec2(0.0, 1.0));
      float topRight    = random(gridCell + vec2(1.0, 1.0));

      vec2 smoothFraction = fraction * fraction * (3.0 - 2.0 * fraction);

      return mix(mix(bottomLeft, bottomRight, smoothFraction.x), mix(topLeft, topRight, smoothFraction.x), smoothFraction.y);
  }

  // Fits the mask inside the canvas the same way object-fit: contain does
  vec2 getContainScale() {
      float canvasAspect = u_canvasSize.x / u_canvasSize.y;
      return canvasAspect > u_maskAspect
          ? vec2(canvasAspect / u_maskAspect, 1.0)
          : vec2(1.0, u_maskAspect / canvasAspect);
  }

  // Same as an SVG linearGradient: points are fractions of the shape size, with y pointing down
  vec3 gradientColor(vec2 maskUV) {
      vec2 shapeUV = (maskUV - u_maskPadding) / (1.0 - 2.0 * u_maskPadding);
      vec2 aspect = vec2(u_maskAspect, 1.0);
      vec2 point = vec2(shapeUV.x, 1.0 - shapeUV.y) * aspect;
      vec2 start = u_gradientStart * aspect;
      vec2 direction = u_gradientEnd * aspect - start;
      float progress = clamp(dot(point - start, direction) / dot(direction, direction), 0.0, 1.0);
      return mix(u_color, u_gradientColor, progress);
  }

  void main() {
      vec2 containScale = getContainScale();
      vec2 maskUV = (v_canvasUV - 0.5) * containScale + 0.5;

      // Domain warp: warp the coordinate space using noise to make the outline morph organically
      vec2 noiseCoordinate = v_canvasUV * u_canvasSize / u_waveSize;
      vec2 warp = vec2(
          noise2D(noiseCoordinate + vec2(u_time * 0.1, u_time * 0.05)),
          noise2D(noiseCoordinate + vec2(-u_time * 0.08, u_time * 0.12) + 31.7)
      ) - 0.5;
      warp *= u_waveStrength * containScale / u_canvasSize;

      float coverage = texture(u_mask, maskUV + warp).a;
      float edgeWidth = max(fwidth(coverage) * 0.75, 0.0001);
      float alpha = smoothstep(0.5 - edgeWidth, 0.5 + edgeWidth, coverage);

      fragColor = vec4(gradientColor(maskUV) * alpha, alpha);
  }
`;

/** Shader colors are written straight to the canvas, so they have to stay in sRGB to match CSS colors */
function getCssColor(color: string): THREE.Color {
  return new THREE.Color(color).convertLinearToSRGB();
}

/* eslint-disable react/no-unknown-property */
function ShaderPlane({
  shape,
  maskPadding,
  color,
  gradientColor,
  gradientStart,
  gradientEnd,
}: {
  shape: BlobShape;
  maskPadding: number;
  color: string;
  gradientColor: string;
  gradientStart: Point;
  gradientEnd: Point;
}) {
  const materialRef = useRef<THREE.RawShaderMaterial>(null);
  const mask = useBlobMaskTexture(shape, maskPadding);
  const canvasSize = useThree((state) => state.size);

  useFrame((state) => {
    if (materialRef.current !== null) {
      materialRef.current.uniforms.u_time.value =
        state.clock.elapsedTime * BLOB_ANIMATION.speed;
    }
  });

  return (
    <mesh>
      <planeGeometry args={[2, 2]} />
      <rawShaderMaterial
        glslVersion={THREE.GLSL3}
        vertexShader={vertexShader}
        fragmentShader={fragmentShader}
        ref={materialRef}
        uniforms={{
          u_time: { value: 0 },
          u_canvasSize: {
            value: new THREE.Vector2(canvasSize.width, canvasSize.height),
          },
          u_mask: { value: mask.texture },
          u_maskAspect: { value: mask.aspectRatio },
          u_maskPadding: { value: maskPadding },
          u_color: { value: getCssColor(color) },
          u_gradientColor: { value: getCssColor(gradientColor) },
          u_gradientStart: { value: new THREE.Vector2(...gradientStart) },
          u_gradientEnd: { value: new THREE.Vector2(...gradientEnd) },
          u_waveSize: { value: BLOB_ANIMATION.waveSize },
          u_waveStrength: { value: BLOB_ANIMATION.waveStrength },
        }}
      />
    </mesh>
  );
}
/* eslint-enable react/no-unknown-property */

/** Renders an SVG path as a blob with a slowly morphing outline. */
export function BlobShader({
  className,
  shape,
  color,
  gradientColor = color,
  gradientStart = [0, 0],
  gradientEnd = [1, 0],
  bleed = 0,
}: BlobConfig & { className?: string }) {
  const maskPadding = bleed / (1 + 2 * bleed);

  return (
    <div className={className}>
      <div className="absolute" style={{ inset: `${String(-bleed * 100)}%` }}>
        <Canvas>
          <ShaderPlane
            shape={shape}
            maskPadding={maskPadding}
            color={color}
            gradientColor={gradientColor}
            gradientStart={gradientStart}
            gradientEnd={gradientEnd}
          />
        </Canvas>
      </div>
    </div>
  );
}
