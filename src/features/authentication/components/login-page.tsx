import Image from "next/image";

import SolvroLogo from "@/assets/logo-solvro.png";
import { Link } from "@/components/link";
import { Logo } from "@/components/logo";
import { SOLVRO_WEBPAGE_URL } from "@/config/constants";

import { LoginForm } from "./login-form";

export function LoginPage() {
  return (
    <div className="from-gradient-1 to-gradient-2 flex size-full flex-col items-center justify-center bg-linear-to-r">
      <div className="flex flex-1 flex-col items-stretch justify-center space-y-4 p-4 sm:w-96">
        <figure className="p-10">
          <Logo variant="white" className="w-full" />
        </figure>
        <LoginForm />
      </div>
      <footer className="mt-auto mb-4 h-6 md:mb-8">
        <Link href={SOLVRO_WEBPAGE_URL} target="_blank" rel="noreferrer">
          <Image src={SolvroLogo} alt="Logo Solvro" className="size-full" />
        </Link>
      </footer>
    </div>
  );
}
