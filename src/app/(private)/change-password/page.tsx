import { ChangePasswordForm } from "@/features/password-change";

export default function ChangePasswordPage() {
  return (
    <div className="container mx-auto flex h-full flex-col items-center justify-center p-4 sm:p-8">
      <h1 className="mb-4 text-2xl font-semibold">Tutaj zmienisz hasło</h1>
      <ChangePasswordForm />
    </div>
  );
}
