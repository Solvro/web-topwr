import {
  DiscordLogoIcon,
  GitHubLogoIcon,
  InstagramLogoIcon,
  LinkedInLogoIcon,
  TwitterLogoIcon,
} from "@radix-ui/react-icons";
import { Link as LinkIcon } from "lucide-react";

import { LinkType } from "@/features/resources/enums";

const ICON_MAP: Record<string, React.ElementType> = {
  [LinkType.GitHub]: GitHubLogoIcon,
  [LinkType.LinkedIn]: LinkedInLogoIcon,
  [LinkType.Instagram]: InstagramLogoIcon,
  [LinkType.Discord]: DiscordLogoIcon,
  [LinkType.X]: TwitterLogoIcon,
};

export function SocialIcon({
  type,
  className,
}: {
  type: LinkType | string;
  className?: string;
}) {
  const Icon = ICON_MAP[type] ?? LinkIcon;
  return <Icon className={className} />;
}
