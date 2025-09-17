// @ts-nocheck
import { InfoCircledIcon, TrashIcon } from "@radix-ui/react-icons";
import { NodeViewWrapper } from "@tiptap/react";
import type { NodeViewProps } from "@tiptap/react";
import Image from "next/image";
import * as React from "react";
import { Controlled as ControlledZoom } from "react-medium-image-zoom";

import { cn } from "@/lib/utils";

import { Spinner } from "../../../components/spinner";
import { blobUrlToBase64, randomId } from "../../../utils";
import type { ElementDimensions } from "../hooks/use-drag-resize";
import { useDragResize } from "../hooks/use-drag-resize";
import { useImageActions } from "../hooks/use-image-actions";
import type { UploadReturnType } from "../image";
import { ActionButton, ActionWrapper, ImageActions } from "./image-actions";
import { ImageOverlay } from "./image-overlay";
import { ResizeHandle } from "./resize-handle";

const MAX_HEIGHT = 600;
const MIN_HEIGHT = 120;
const MIN_WIDTH = 120;

interface ImageState {
  src: string;
  isServerUploading: boolean;
  imageLoaded: boolean;
  isZoomed: boolean;
  error: boolean;
  naturalSize: ElementDimensions;
}

const normalizeUploadResponse = (res: UploadReturnType) => ({
  src: typeof res === "string" ? res : res.src,
  id: typeof res === "string" ? randomId() : res.id,
});

export function ImageViewBlock({
  editor,
  node,
  selected,
  updateAttributes,
}: NodeViewProps) {
  const {
    src: initialSource,
    width: initialWidth,
    height: initialHeight,
    fileName,
  } = node.attrs;
  const uploadAttemptedRef = React.useRef(false);

  const initSource = React.useMemo(() => {
    if (typeof initialSource === "string") {
      return initialSource;
    }
    return initialSource.src;
  }, [initialSource]);

  const [imageState, setImageState] = React.useState<ImageState>({
    src: initSource,
    isServerUploading: false,
    imageLoaded: false,
    isZoomed: false,
    error: false,
    naturalSize: { width: initialWidth, height: initialHeight },
  });

  const containerRef = React.useRef<HTMLDivElement>(null);
  const [activeResizeHandle, setActiveResizeHandle] = React.useState<
    "left" | "right" | null
  >(null);

  const onDimensionsChange = React.useCallback(
    ({ width, height }: ElementDimensions) => {
      updateAttributes({ width, height });
    },
    [updateAttributes],
  );

  const aspectRatio =
    imageState.naturalSize.width / imageState.naturalSize.height;
  const maxWidth = MAX_HEIGHT * aspectRatio;
  const containerMaxWidth = containerRef.current
    ? Number.parseFloat(
        getComputedStyle(containerRef.current).getPropertyValue(
          "--editor-width",
        ),
      )
    : Infinity;

  const { isLink, onView, onDownload, onCopy, onCopyLink, onRemoveImg } =
    useImageActions({
      editor,
      node,
      src: imageState.src,
      onViewClick: (isZoomed) => {
        setImageState((previous) => ({ ...previous, isZoomed }));
      },
    });

  const {
    currentWidth,
    currentHeight,
    updateDimensions,
    initiateResize,
    isResizing,
  } = useDragResize({
    initialWidth: initialWidth ?? imageState.naturalSize.width,
    initialHeight: initialHeight ?? imageState.naturalSize.height,
    contentWidth: imageState.naturalSize.width,
    contentHeight: imageState.naturalSize.height,
    gridInterval: 0.1,
    onDimensionsChange,
    minWidth: MIN_WIDTH,
    minHeight: MIN_HEIGHT,
    maxWidth: containerMaxWidth > 0 ? containerMaxWidth : maxWidth,
  });

  const shouldMerge = React.useMemo(() => currentWidth <= 180, [currentWidth]);

  const handleImageLoad = React.useCallback(
    (event_: React.SyntheticEvent<HTMLImageElement>) => {
      const img = event_.target as HTMLImageElement;
      const newNaturalSize = {
        width: img.naturalWidth,
        height: img.naturalHeight,
      };
      setImageState((previous) => ({
        ...previous,
        naturalSize: newNaturalSize,
        imageLoaded: true,
      }));
      updateAttributes({
        width: img.width || newNaturalSize.width,
        height: img.height || newNaturalSize.height,
        alt: img.alt,
        title: img.title,
      });

      if (!initialWidth) {
        updateDimensions((state) => ({
          ...state,
          width: newNaturalSize.width,
        }));
      }
    },
    [initialWidth, updateAttributes, updateDimensions],
  );

  const handleImageError = React.useCallback(() => {
    setImageState((previous) => ({
      ...previous,
      error: true,
      imageLoaded: true,
    }));
  }, []);

  const handleResizeStart = React.useCallback(
    (direction: "left" | "right") =>
      (event: React.PointerEvent<HTMLDivElement>) => {
        setActiveResizeHandle(direction);
        initiateResize(direction)(event);
      },
    [initiateResize],
  );

  const handleResizeEnd = React.useCallback(() => {
    setActiveResizeHandle(null);
  }, []);

  React.useEffect(() => {
    if (!isResizing) {
      handleResizeEnd();
    }
  }, [isResizing, handleResizeEnd]);

  React.useEffect(() => {
    const handleImage = async () => {
      if (!initSource.startsWith("blob:") || uploadAttemptedRef.current) {
        return;
      }

      uploadAttemptedRef.current = true;
      const imageExtension = editor.options.extensions.find(
        (extension) => extension.name === "image",
      );
      const { uploadFn } = imageExtension?.options ?? {};

      if (!uploadFn) {
        try {
          const base64 = await blobUrlToBase64(initSource);
          setImageState((previous) => ({ ...previous, src: base64 }));
          updateAttributes({ src: base64 });
        } catch {
          setImageState((previous) => ({ ...previous, error: true }));
        }
        return;
      }

      try {
        setImageState((previous) => ({ ...previous, isServerUploading: true }));
        const response = await fetch(initSource);
        const blob = await response.blob();
        const file = new File([blob], fileName, { type: blob.type });

        const url = await uploadFn(file, editor);
        const normalizedData = normalizeUploadResponse(url);

        setImageState((previous) => ({
          ...previous,
          ...normalizedData,
          isServerUploading: false,
        }));

        updateAttributes(normalizedData);
      } catch {
        setImageState((previous) => ({
          ...previous,
          error: true,
          isServerUploading: false,
        }));
      }
    };

    handleImage();
  }, [editor, fileName, initSource, updateAttributes]);

  return (
    <NodeViewWrapper
      ref={containerRef}
      data-drag-handle
      className="relative text-center leading-none"
    >
      <div
        className="group/node-image relative mx-auto rounded-md object-contain"
        style={{
          maxWidth: `min(${maxWidth}px, 100%)`,
          width: currentWidth,
          maxHeight: MAX_HEIGHT,
          aspectRatio: `${imageState.naturalSize.width} / ${imageState.naturalSize.height}`,
        }}
      >
        <div
          className={cn(
            "relative flex h-full cursor-default flex-col items-center gap-2 rounded",
            {
              "outline-primary outline-2 outline-offset-1":
                selected || isResizing,
            },
          )}
        >
          <div className="h-full contain-paint">
            <div className="relative h-full">
              {imageState.isServerUploading && !imageState.error ? (
                <div className="absolute inset-0 flex items-center justify-center">
                  <Spinner className="size-7" />
                </div>
              ) : null}

              {imageState.error ? (
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <InfoCircledIcon className="text-destructive size-8" />
                  <p className="text-muted-foreground mt-2 text-sm">
                    Failed to load image
                  </p>
                </div>
              ) : null}

              <ControlledZoom
                isZoomed={imageState.isZoomed}
                onZoomChange={() => {
                  setImageState((previous) => ({
                    ...previous,
                    isZoomed: false,
                  }));
                }}
              >
                <Image
                  className={cn(
                    "h-auto rounded object-contain transition-shadow",
                    {
                      "opacity-0": !imageState.imageLoaded || imageState.error,
                    },
                  )}
                  style={{
                    maxWidth: `min(100%, ${maxWidth}px)`,
                    minWidth: `${MIN_WIDTH}px`,
                    maxHeight: MAX_HEIGHT,
                  }}
                  width={currentWidth}
                  height={currentHeight}
                  src={imageState.src}
                  onError={handleImageError}
                  onLoad={handleImageLoad}
                  alt={node.attrs.alt || ""}
                  title={Boolean(node.attrs.title) || ""}
                  id={node.attrs.id}
                />
              </ControlledZoom>
            </div>

            {imageState.isServerUploading ? <ImageOverlay /> : null}

            {editor.isEditable &&
            imageState.imageLoaded &&
            !imageState.error &&
            !imageState.isServerUploading ? (
              <>
                <ResizeHandle
                  onPointerDown={handleResizeStart("left")}
                  className={cn("left-1", {
                    hidden: isResizing && activeResizeHandle === "right",
                  })}
                  isResizing={
                    isResizing ? activeResizeHandle === "left" : undefined
                  }
                />
                <ResizeHandle
                  onPointerDown={handleResizeStart("right")}
                  className={cn("right-1", {
                    hidden: isResizing && activeResizeHandle === "left",
                  })}
                  isResizing={
                    isResizing ? activeResizeHandle === "right" : undefined
                  }
                />
              </>
            ) : null}
          </div>

          {imageState.error ? (
            <ActionWrapper>
              <ActionButton
                icon={<TrashIcon />}
                tooltip="Remove image"
                onClick={onRemoveImg}
              />
            </ActionWrapper>
          ) : null}

          {!isResizing &&
            !imageState.error &&
            !imageState.isServerUploading && (
              <ImageActions
                shouldMerge={shouldMerge}
                isLink={isLink}
                onView={onView}
                onDownload={onDownload}
                onCopy={onCopy}
                onCopyLink={onCopyLink}
              />
            )}
        </div>
      </div>
    </NodeViewWrapper>
  );
}
