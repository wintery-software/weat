import { LoginForm } from "@/app/login/login-form";
import { COMPANY_NAME } from "@/lib/constants";
import { GalleryVerticalEnd } from "lucide-react";
import Link from "next/link";

const Page = () => {
  return (
    <div className="grid min-h-svh lg:grid-cols-2">
      <div className="flex flex-col gap-4 p-6 md:p-10">
        <div className="flex justify-center gap-2 md:justify-start">
          <Link
            href="https://github.com/wintery-software"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 font-medium"
          >
            <div className="bg-primary text-primary-foreground flex size-6 items-center justify-center rounded-md">
              <GalleryVerticalEnd className="size-4" />
            </div>
            {COMPANY_NAME}
          </Link>
        </div>
        <div className="flex flex-1 items-center justify-center">
          <div className="w-full max-w-xs">
            <LoginForm />
          </div>
        </div>
      </div>
      <div className="bg-muted relative hidden lg:block">
        <div
          className="absolute inset-0 h-full w-full bg-cover bg-center dark:brightness-[0.2] dark:grayscale"
          style={{ backgroundImage: "url('/placeholder.svg')" }}
          aria-hidden="true"
        />
      </div>
    </div>
  );
};

export default Page;
