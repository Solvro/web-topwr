import {
  CaretDownIcon,
  DotsHorizontalIcon,
  FontBoldIcon,
  FontItalicIcon,
  LetterCaseCapitalizeIcon,
  Link2Icon,
  ListBulletIcon,
  PlusIcon,
  UnderlineIcon,
} from "@radix-ui/react-icons";

import { TextColorIcon } from "@/components/presentation/text-color-icon";
import { Separator } from "@/components/ui/separator";
import { Toggle } from "@/components/ui/toggle";

import { ToolbarWrapper } from "./toolbar-wrapper";

export function MockToolbar() {
  return (
    <ToolbarWrapper>
      {/* Text styles dropdown */}
      <Toggle disabled className="gap-0">
        <LetterCaseCapitalizeIcon className="size-5" />
        <CaretDownIcon className="size-5" />
      </Toggle>

      <Separator orientation="vertical" className="mx-2" />

      {/* Bold, Italic, Underline buttons */}
      <Toggle disabled>
        <FontBoldIcon className="size-5" />
      </Toggle>
      <Toggle disabled>
        <FontItalicIcon className="size-5" />
      </Toggle>
      <Toggle disabled>
        <UnderlineIcon className="size-5" />
      </Toggle>
      {/* More formatting dropdown */}
      <Toggle disabled className="w-8 gap-0">
        <DotsHorizontalIcon className="size-5" />
      </Toggle>

      <Separator orientation="vertical" className="mx-2" />

      {/* Color picker */}
      <Toggle disabled className="gap-0">
        <TextColorIcon className="size-5" />
        <CaretDownIcon className="size-5" />
      </Toggle>

      <Separator orientation="vertical" className="mx-2" />

      {/* Lists dropdown */}
      <Toggle disabled className="w-12 gap-0">
        <ListBulletIcon className="size-5" />
        <CaretDownIcon className="size-5" />
      </Toggle>

      <Separator orientation="vertical" className="mx-2" />

      {/* Link + Insert elements */}
      <Toggle disabled>
        <Link2Icon className="size-5" />
      </Toggle>
      <Toggle disabled className="w-12 gap-0">
        <PlusIcon className="size-5" />
        <CaretDownIcon className="size-5" />
      </Toggle>
    </ToolbarWrapper>
  );
}
