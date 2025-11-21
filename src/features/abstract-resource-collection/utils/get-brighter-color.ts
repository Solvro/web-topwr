export function getBrighterColor(
  inputHex: string,
  lightLuminanceCap = 180,
  darkLuminanceCap = 255,
): {
  light: string;
  dark: string;
} {
  const cleanHex = inputHex.replace("#", "").trim().toUpperCase();

  // "ABC" -> "AABBCC"
  const hex =
    cleanHex.length === 3
      ? // eslint-disable-next-line @typescript-eslint/no-misused-spread
        [...cleanHex].map((char) => char + char).join("")
      : cleanHex;

  if (!/^[0-9A-F]{6}$/.test(hex)) {
    return { light: inputHex, dark: inputHex };
  }

  const r = Number.parseInt(hex.slice(0, 2), 16);
  const g = Number.parseInt(hex.slice(2, 4), 16);
  const b = Number.parseInt(hex.slice(4, 6), 16);

  const maxChannel = Math.max(r, g, b);

  const toHex = (n: number) =>
    Math.round(n).toString(16).padStart(2, "0").toUpperCase();

  function generateVariant(luminanceCap: number) {
    let scale;
    scale = maxChannel > 0 ? 255 / maxChannel : 255;

    const currentLuminance =
      0.2126 * r * scale + 0.7152 * g * scale + 0.0722 * b * scale;

    if (currentLuminance > luminanceCap) {
      scale *= luminanceCap / currentLuminance;
    }

    return `#${toHex(r * scale)}${toHex(g * scale)}${toHex(b * scale)}`;
  }

  return {
    light: generateVariant(lightLuminanceCap),
    dark: generateVariant(darkLuminanceCap),
  };
}
