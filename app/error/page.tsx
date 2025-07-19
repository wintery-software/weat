"use client";

import { useSearchParams } from "next/navigation";

const Page = () => {
  const searchParams = useSearchParams();
  const error = searchParams.get("error");

  return (
    <div className="flex min-h-screen items-center justify-center">
      <div className="max-w-md text-center">
        <h1 className="text-2xl font-bold text-red-600">Error</h1>
        <p className="mt-4">Sorry, something went wrong</p>
        {error && process.env.NODE_ENV === "development" && (
          <div className="mt-4 rounded-md bg-red-50 p-4">
            <p className="text-sm text-red-800">Debug info: {error}</p>
          </div>
        )}
        <a
          href="/login"
          className="mt-6 inline-block rounded bg-blue-600 px-4 py-2 text-white hover:bg-blue-700"
        >
          Back to Login
        </a>
      </div>
    </div>
  );
};

export default Page;
