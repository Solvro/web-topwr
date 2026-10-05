"use client";

import { Environment, useGLTF, useVideoTexture } from "@react-three/drei";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { Suspense, useRef, useState } from "react";
import * as THREE from "three";

import { cn } from "@/lib/utils";

import type { CursorOffset } from "../hooks/use-cursor-offset";
import { useCursorOffset } from "../hooks/use-cursor-offset";

const PHONE_MODEL_FILENAME = "/phone.glb";
const PREVIEW_VIDEO_FILENAME = "/topwr-preview.mp4";
const AMBIENT_LIGHT_INTENSITY = 1;
const FIT_MARGIN = 1.415;
const DEVICE_PIXEL_RATIO = 2;
const ANIMATION_CONFIG = {
  speed: 6,
  floatFrequency: 1,
  floatAmplitude: 0.05,
  rest: {
    rotationX: -0.02,
    rotationY: -0.4,
    scale: 1,
  },
  hover: {
    rotationX: -0.01,
    rotationY: -0.15,
    scale: 1.2,
  },
  cursorTilt: {
    rotationX: 0.18,
    rotationY: 0.4,
  },
} as const;

/**
 * Phone hover and cursor-follow animation.
 * Damps transform properties towards target values based on hover state and cursor position.
 *
 * @param group - The Three.js Group containing the phone and screen meshes
 * @param hovered - Whether the user is currently hovering over the 3D phone model
 * @param cursorOffset - Where the cursor is relative to the screen center; the phone tilts towards it
 * @param elapsedTime - Total elapsed clock time in seconds
 * @param delta - Delta time in seconds since the previous frame
 */
function updatePhoneTransformOnFrame(
  group: THREE.Group,
  hovered: boolean,
  cursorOffset: CursorOffset,
  elapsedTime: number,
  delta: number,
): void {
  /* float up and down */
  const targetY = hovered
    ? 0
    : Math.sin(elapsedTime * ANIMATION_CONFIG.floatFrequency) *
      ANIMATION_CONFIG.floatAmplitude;

  const target = hovered ? ANIMATION_CONFIG.hover : ANIMATION_CONFIG.rest;
  const { speed, cursorTilt } = ANIMATION_CONFIG;

  group.position.y = THREE.MathUtils.damp(
    group.position.y,
    targetY,
    speed,
    delta,
  );
  group.rotation.x = THREE.MathUtils.damp(
    group.rotation.x,
    target.rotationX + cursorOffset.y * cursorTilt.rotationX,
    speed,
    delta,
  );
  group.rotation.y = THREE.MathUtils.damp(
    group.rotation.y,
    target.rotationY + cursorOffset.x * cursorTilt.rotationY,
    speed,
    delta,
  );
  group.scale.setScalar(
    THREE.MathUtils.damp(group.scale.x, target.scale, speed, delta),
  );
}

function getGeometryBounds(geometry: THREE.BufferGeometry) {
  geometry.computeBoundingBox();
  const boundingBox = geometry.boundingBox ?? new THREE.Box3();
  return {
    center: boundingBox.getCenter(new THREE.Vector3()),
    size: boundingBox.getSize(new THREE.Vector3()),
  };
}

/* eslint-disable react/no-unknown-property */
function Model({
  hovered,
  setHovered,
}: {
  hovered: boolean;
  setHovered: (hovered: boolean) => void;
}) {
  const { nodes } = useGLTF(PHONE_MODEL_FILENAME) as unknown as {
    nodes: {
      phone: THREE.Mesh;
      screen: THREE.Mesh;
    };
  };
  const videoTexture = useVideoTexture(PREVIEW_VIDEO_FILENAME, {
    loop: true,
    muted: true,
    start: true,
  });
  const viewport = useThree((state) => state.viewport);
  const groupRef = useRef<THREE.Group>(null);
  const cursorOffsetRef = useCursorOffset();

  const { center, size } = getGeometryBounds(nodes.phone.geometry);
  const fitScale =
    Math.min(viewport.width / size.x, viewport.height / size.y) / FIT_MARGIN;

  useFrame((state, delta) => {
    if (groupRef.current !== null) {
      updatePhoneTransformOnFrame(
        groupRef.current,
        hovered,
        cursorOffsetRef.current,
        state.clock.elapsedTime,
        delta,
      );
    }
  });

  return (
    <group scale={fitScale}>
      <group
        ref={groupRef}
        rotation={[
          ANIMATION_CONFIG.rest.rotationX,
          ANIMATION_CONFIG.rest.rotationY,
          0,
        ]}
        onPointerEnter={() => {
          setHovered(true);
        }}
        onPointerLeave={() => {
          setHovered(false);
        }}
      >
        <group position={[-center.x, -center.y, -center.z]}>
          <mesh geometry={nodes.phone.geometry}>
            <meshStandardMaterial
              color="#1c1c1e"
              roughness={0.3}
              metalness={0.7}
            />
          </mesh>
          <mesh geometry={nodes.screen.geometry}>
            <meshBasicMaterial map={videoTexture} toneMapped={false} />
          </mesh>
        </group>
      </group>
    </group>
  );
}

useGLTF.preload(PHONE_MODEL_FILENAME);

export function PhoneModel({ className }: { className?: string }) {
  const [hovered, setHovered] = useState(false);

  return (
    <div className="absolute inset-x-0 -inset-y-[8%]">
      <Canvas
        camera={{ position: [0, 0, 5], fov: 45 }}
        dpr={DEVICE_PIXEL_RATIO}
        className={cn(
          "size-full max-h-full max-w-full overflow-hidden",
          hovered ? "cursor-pointer" : "cursor-default",
          className,
        )}
      >
        <Suspense fallback={null}>
          <ambientLight intensity={AMBIENT_LIGHT_INTENSITY} />
          <Environment preset="city" />
          <Model hovered={hovered} setHovered={setHovered} />
        </Suspense>
      </Canvas>
    </div>
  );
}
