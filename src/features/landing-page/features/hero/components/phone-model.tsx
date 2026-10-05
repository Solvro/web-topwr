"use client";

import { Stage, useGLTF, useVideoTexture } from "@react-three/drei";
import { Canvas, useFrame } from "@react-three/fiber";
import { Suspense, useRef, useState } from "react";
import * as THREE from "three";

import { cn } from "@/lib/utils";

const PHONE_MODEL_FILENAME = "/phone.glb";
const PREVIEW_VIDEO_FILENAME = "/topwr-preview.mp4";
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
} as const;

/**
 * Phone hover animation.
 * Interpolates transform properties towards target values based on hover state
 *
 * @param group - The Three.js Group containing the phone and screen meshes
 * @param hovered - Whether the user is currently hovering over the 3D phone model
 * @param elapsedTime - Total elapsed clock time in seconds
 * @param delta - Delta time in seconds since the previous frame
 */
function updatePhoneTransformOnFrame(
  group: THREE.Group,
  hovered: boolean,
  elapsedTime: number,
  delta: number,
): void {
  /* float up and down */
  const targetY = hovered
    ? 0
    : Math.sin(elapsedTime * ANIMATION_CONFIG.floatFrequency) *
      ANIMATION_CONFIG.floatAmplitude;

  const target = hovered ? ANIMATION_CONFIG.hover : ANIMATION_CONFIG.rest;
  const alpha = delta * ANIMATION_CONFIG.speed;

  group.position.y = THREE.MathUtils.lerp(group.position.y, targetY, alpha);
  group.rotation.x = THREE.MathUtils.lerp(
    group.rotation.x,
    target.rotationX,
    alpha,
  );
  group.rotation.y = THREE.MathUtils.lerp(
    group.rotation.y,
    target.rotationY,
    alpha,
  );
  group.scale.setScalar(
    THREE.MathUtils.lerp(group.scale.x, target.scale, alpha),
  );
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
  const groupRef = useRef<THREE.Group>(null);

  useFrame((state, delta) => {
    if (groupRef.current !== null) {
      updatePhoneTransformOnFrame(
        groupRef.current,
        hovered,
        state.clock.elapsedTime,
        delta,
      );
    }
  });

  return (
    <group
      ref={groupRef}
      onPointerEnter={() => {
        setHovered(true);
      }}
      onPointerLeave={() => {
        setHovered(false);
      }}
    >
      <mesh geometry={nodes.phone.geometry}>
        <meshStandardMaterial color="#1c1c1e" roughness={0.3} metalness={0.7} />
      </mesh>
      <mesh geometry={nodes.screen.geometry}>
        <meshBasicMaterial map={videoTexture} toneMapped={false} />
      </mesh>
    </group>
  );
}

useGLTF.preload(PHONE_MODEL_FILENAME);

export function PhoneModel({ className }: { className?: string }) {
  const [hovered, setHovered] = useState(false);

  return (
    <Canvas
      camera={{ position: [0, 0, 5], fov: 45 }}
      className={cn(
        "size-full max-h-full max-w-full overflow-hidden",
        hovered ? "cursor-pointer" : "cursor-default",
        className,
      )}
    >
      <Suspense fallback={null}>
        <Stage
          environment="city"
          intensity={0.5}
          shadows={false}
          adjustCamera={1.2}
        >
          <Model hovered={hovered} setHovered={setHovered} />
        </Stage>
      </Suspense>
    </Canvas>
  );
}
