import { HERO_BACKGROUND_BLOB } from "../constants";
import { BlobShader } from "./blob-shader";

export function HeroBackground() {
  return (
    <BlobShader
      {...HERO_BACKGROUND_BLOB}
      className="pointer-events-none absolute -top-17 right-0 -z-10 aspect-2221/4571 h-[175%] drop-shadow-[-0.2rem_-0.7rem_0.05rem_rgb(175_67_43)] max-lg:-right-48"
    />
  );
}
