// @ts-nocheck
import {
  CopyIcon,
  ExternalLinkIcon,
  LinkBreak2Icon,
} from "@radix-ui/react-icons";
import * as React from "react";

import { Separator } from "@/components/ui/separator";

import { ToolbarButton } from "../toolbar-button";

interface LinkPopoverBlockProps {
  url: string;
  onClear: () => void;
  onEdit: (e: React.MouseEvent<HTMLButtonElement>) => void;
}

export const LinkPopoverBlock: React.FC<LinkPopoverBlockProps> = ({
  url,
  onClear,
  onEdit,
}) => {
  const [copyTitle, setCopyTitle] = React.useState<string>("Kopiuj");

  const handleCopy = React.useCallback(
    (e: React.MouseEvent<HTMLButtonElement>) => {
      e.preventDefault();
      navigator.clipboard
        .writeText(url)
        .then(() => {
          setCopyTitle("Skopiowano!");
          setTimeout(() => {
            setCopyTitle("Kopiuj");
          }, 1000);
        })
        .catch(console.error);
    },
    [url],
  );

  const handleOpenLink = React.useCallback(() => {
    window.open(url, "_blank", "noopener,noreferrer");
  }, [url]);

  return (
    <div className="bg-background flex overflow-hidden rounded p-2 shadow-lg">
      <div className="inline-flex items-center gap-1">
        <ToolbarButton tooltip="Edytuj link" onClick={onEdit}>
          Edit link
        </ToolbarButton>
        <Separator orientation="vertical" />
        <ToolbarButton
          tooltip="Otwórz link w nowej karcie"
          onClick={handleOpenLink}
        >
          <ExternalLinkIcon />
        </ToolbarButton>
        <Separator orientation="vertical" />
        <ToolbarButton tooltip="Usuń link" onClick={onClear}>
          <LinkBreak2Icon />
        </ToolbarButton>
        <Separator orientation="vertical" />
        <ToolbarButton
          tooltip={copyTitle}
          onClick={handleCopy}
          tooltipOptions={{
            onPointerDownOutside: (e) => {
              if (e.target === e.currentTarget) {
                e.preventDefault();
              }
            },
          }}
        >
          <CopyIcon />
        </ToolbarButton>
      </div>
    </div>
  );
};
