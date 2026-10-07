import { useEffect, useMemo } from "react";
import * as THREE from "three";

import type { BlobShape } from "../types";

export interface BlobMask {
  texture: THREE.CanvasTexture;
  aspectRatio: number;
}

const MASK_MAX_DIMENSION = 2048;

function createBlobMask(
  { path, viewBox }: BlobShape,
  padding: number,
): BlobMask {
  const scale = MASK_MAX_DIMENSION / Math.max(viewBox.width, viewBox.height);
  const canvas = document.createElement("canvas");
  canvas.width = Math.round(viewBox.width * scale);
  canvas.height = Math.round(viewBox.height * scale);

  const context = canvas.getContext("2d");
  if (context !== null) {
    const shapeScale = scale * (1 - 2 * padding);
    context.translate(canvas.width * padding, canvas.height * padding);
    context.scale(shapeScale, shapeScale);
    context.translate(-viewBox.x, -viewBox.y);
    context.rect(viewBox.x, viewBox.y, viewBox.width, viewBox.height);
    context.clip();
    context.fill(new Path2D(path), "evenodd");
  }

  const texture = new THREE.CanvasTexture(canvas);
  texture.generateMipmaps = false;
  texture.minFilter = THREE.LinearFilter;

  return { texture, aspectRatio: canvas.width / canvas.height };
}

/**
 * Rasterizes an SVG path into a texture whose alpha channel is used as the blob silhouette.
 *
 * @param shape - The SVG path and its viewBox
 * @param padding - Transparent margin around the shape, as a fraction of the texture size
 */
export function useBlobMaskTexture(
  shape: BlobShape,
  padding: number,
): BlobMask {
  const mask = useMemo(() => createBlobMask(shape, padding), [shape, padding]);

  useEffect(() => {
    return () => {
      mask.texture.dispose();
    };
  }, [mask]);

  return mask;
}
