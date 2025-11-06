import Image from "next/image";

import SolvroLogo from "@/assets/logo-solvro.png";
import LogoToPWR from "@/assets/logo-topwr-white.png";
import { Link } from "@/components/link";
import { SOLVRO_WEBPAGE_URL } from "@/config/constants";

import { LoginForm } from "./form";

export default function LoginPage() {
  return (
    <div className="from-gradient-1 to-gradient-2 flex h-full w-full items-center justify-center bg-linear-to-r">
      <div className="-mt-20 flex w-96 flex-col items-center space-y-4 p-4">
        <Image src={LogoToPWR} alt="Logo ToPWR" className="p-10" />
        <LoginForm />
      </div>
      <Link
        href={SOLVRO_WEBPAGE_URL}
        className="absolute bottom-4 h-6 md:bottom-8"
        target="_blank"
        rel="noreferrer"
      >
        <Image src={SolvroLogo} alt="Logo Solvro" className="h-full w-full" />
      </Link>
    </div>
  );
}
