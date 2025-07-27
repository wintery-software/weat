"use client";

import { Button } from "@/components/ui/button";
import Image from "next/image";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense } from "react";

const ErrorContent = () => {
  const searchParams = useSearchParams();
  const router = useRouter();
  const error = searchParams.get("error");

  return (
    <div className="flex min-h-screen items-center justify-center">
      <div className="max-w-md text-center">
        <div className="mb-6 flex justify-center">
          <Image
            src="/error-two-dogs.png"
            alt="Error illustration"
            width={200}
            height={200}
            className="rounded-lg"
          />
        </div>
        <p>Something went wrong</p>
        {error && process.env.NODE_ENV === "development" && (
          <div className="mt-4 rounded-md bg-red-50 p-4">
            <p className="text-sm text-red-800">Debug info: {error}</p>
          </div>
        )}
        <Button onClick={() => router.push("/login")}>Back to Login</Button>
      </div>
    </div>
  );
};

const Page = () => {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-screen items-center justify-center">
          <div className="max-w-md text-center">
            <div className="mb-6 flex justify-center">
              <Image
                src="/error-two-dogs.png"
                alt="Error illustration"
                width={200}
                height={200}
                className="rounded-lg"
              />
            </div>
            <h1 className="text-2xl font-bold text-red-600">Error</h1>
            <p className="mt-4">Loading...</p>
          </div>
        </div>
      }
    >
      <ErrorContent />
    </Suspense>
  );
};

export default Page;
