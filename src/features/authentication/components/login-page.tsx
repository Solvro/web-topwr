import { Logo } from "@/components/presentation/logo";
import { Footer } from "@/features/footer";

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
      <Footer invertColors className="absolute inset-0 top-[unset] mb-10" />
    </div>
  );
}
