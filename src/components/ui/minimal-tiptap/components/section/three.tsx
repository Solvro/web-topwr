// @ts-nocheck
import { CaretDownIcon, CheckIcon } from "@radix-ui/react-icons";
import type { Editor } from "@tiptap/react";
import type { VariantProps } from "class-variance-authority";
import * as React from "react";

import { TextColorIcon } from "@/components/presentation/text-color-icon";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import type { toggleVariants } from "@/components/ui/toggle";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";

import { useTheme } from "../../hooks/use-theme";
import { ToolbarButton } from "../toolbar-button";

interface ColorItem {
  cssVar: string;
  label: string;
  darkLabel?: string;
}

interface ColorPalette {
  label: string;
  colors: ColorItem[];
  inverse: string;
}

const COLORS: ColorPalette[] = [
  {
    label: "Palette 1",
    inverse: "hsl(var(--background))",
    colors: [
      { cssVar: "hsl(var(--foreground))", label: "Domyślny" },
      { cssVar: "var(--mt-accent-bold-blue)", label: "Mocny niebieski" },
      { cssVar: "var(--mt-accent-bold-teal)", label: "Mocny turkusowy" },
      { cssVar: "var(--mt-accent-bold-green)", label: "Mocny zielony" },
      { cssVar: "var(--mt-accent-bold-orange)", label: "Mocny pomarańczowy" },
      { cssVar: "var(--mt-accent-bold-red)", label: "Mocny czerwony" },
      { cssVar: "var(--mt-accent-bold-purple)", label: "Mocny fioletowy" },
    ],
  },
  {
    label: "Palette 2",
    inverse: "hsl(var(--background))",
    colors: [
      { cssVar: "var(--mt-accent-gray)", label: "Szary" },
      { cssVar: "var(--mt-accent-blue)", label: "Niebieski" },
      { cssVar: "var(--mt-accent-teal)", label: "Turkusowy" },
      { cssVar: "var(--mt-accent-green)", label: "Zielony" },
      { cssVar: "var(--mt-accent-orange)", label: "Pomarańczowy" },
      { cssVar: "var(--mt-accent-red)", label: "Czerwony" },
      { cssVar: "var(--mt-accent-purple)", label: "Fioletowy" },
    ],
  },
  {
    label: "Palette 3",
    inverse: "hsl(var(--foreground))",
    colors: [
      { cssVar: "hsl(var(--background))", label: "Biały", darkLabel: "Czarny" },
      { cssVar: "var(--mt-accent-blue-subtler)", label: "Subtelny niebieski" },
      { cssVar: "var(--mt-accent-teal-subtler)", label: "Subtelny turkusowy" },
      { cssVar: "var(--mt-accent-green-subtler)", label: "Subtelny zielony" },
      { cssVar: "var(--mt-accent-yellow-subtler)", label: "Subtelny żółty" },
      { cssVar: "var(--mt-accent-red-subtler)", label: "Subtelny czerwony" },
      {
        cssVar: "var(--mt-accent-purple-subtler)",
        label: "Subtelny fioletowy",
      },
    ],
  },
];

const MemoizedColorButton = React.memo<{
  color: ColorItem;
  isSelected: boolean;
  inverse: string;
  onClick: (value: string) => void;
}>(({ color, isSelected, inverse, onClick }) => {
  const isDarkMode = useTheme();
  const label = isDarkMode && color.darkLabel ? color.darkLabel : color.label;

  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <ToggleGroupItem
          tabIndex={0}
          className="relative size-7 rounded-md p-0"
          value={color.cssVar}
          aria-label={label}
          style={{ backgroundColor: color.cssVar }}
          onClick={(e: React.MouseEvent<HTMLButtonElement>) => {
            e.preventDefault();
            onClick(color.cssVar);
          }}
        >
          {isSelected ? (
            <CheckIcon
              className="absolute inset-0 m-auto size-6"
              style={{ color: inverse }}
            />
          ) : null}
        </ToggleGroupItem>
      </TooltipTrigger>
      <TooltipContent side="bottom">
        <p>{label}</p>
      </TooltipContent>
    </Tooltip>
  );
});

MemoizedColorButton.displayName = "MemoizedColorButton";

const MemoizedColorPicker = React.memo<{
  palette: ColorPalette;
  selectedColor: string;
  inverse: string;
  onColorChange: (value: string) => void;
}>(({ palette, selectedColor, inverse, onColorChange }) => (
  <ToggleGroup
    type="single"
    value={selectedColor}
    onValueChange={(value: string) => {
      if (value) {
        onColorChange(value);
      }
    }}
    className="gap-1.5"
  >
    {palette.colors.map((color, index) => (
      <MemoizedColorButton
        key={index}
        inverse={inverse}
        color={color}
        isSelected={selectedColor === color.cssVar}
        onClick={onColorChange}
      />
    ))}
  </ToggleGroup>
));

MemoizedColorPicker.displayName = "MemoizedColorPicker";

interface SectionThreeProps extends VariantProps<typeof toggleVariants> {
  editor: Editor;
}

export const SectionThree: React.FC<SectionThreeProps> = ({
  editor,
  size,
  variant,
}) => {
  const color =
    editor.getAttributes("textStyle")?.color || "hsl(var(--foreground))";
  const [selectedColor, setSelectedColor] = React.useState(color);

  const handleColorChange = React.useCallback(
    (value: string) => {
      setSelectedColor(value);
      if (editor.state.storedMarks) {
        const textStyleMarkType = editor.schema.marks.textStyle;
        if (textStyleMarkType) {
          editor.view.dispatch(
            editor.state.tr.removeStoredMark(textStyleMarkType),
          );
        }
      }

      setTimeout(() => {
        editor.chain().setColor(value).run();
      }, 0);
    },
    [editor],
  );

  React.useEffect(() => {
    setSelectedColor(color);
  }, [color]);

  return (
    <Popover>
      <PopoverTrigger asChild>
        <ToolbarButton
          tooltip="Kolor tekstu"
          aria-label="Text color"
          className="gap-0"
          size={size}
          variant={variant}
        >
          <TextColorIcon className="size-5" style={{ color: selectedColor }} />
          <CaretDownIcon className="size-5" />
        </ToolbarButton>
      </PopoverTrigger>
      <PopoverContent align="start" className="w-full">
        <div className="space-y-1.5">
          {COLORS.map((palette, index) => (
            <MemoizedColorPicker
              key={index}
              palette={palette}
              inverse={palette.inverse}
              selectedColor={selectedColor}
              onColorChange={handleColorChange}
            />
          ))}
        </div>
      </PopoverContent>
    </Popover>
  );
};

SectionThree.displayName = "SectionThree";

export default SectionThree;
