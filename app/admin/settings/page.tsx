import { Button } from "@/components/ui/button";
import { auth, signOut } from "@/lib/next-auth";
import { getCurrentUrl } from "@/lib/utils-server";
import hljs from "highlight.js/lib/core";
import json from "highlight.js/lib/languages/json";
import "highlight.js/styles/github.css";

hljs.registerLanguage("json", json);

const Page = async () => {
  const session = await auth();

  const { href } = await getCurrentUrl();
  const redirectTo = `${process.env.AUTH_COGNITO_DOMAIN}/logout?client_id=${process.env.AUTH_COGNITO_ID}&logout_uri=${encodeURIComponent(href)}`;

  const raw = JSON.stringify(session, null, 2);
  const __html = hljs.highlight(raw, { language: "json" }).value;

  return (
    <div className="flex flex-col gap-8">
      <h1>Settings</h1>
      <div className="flex flex-col gap-4">
        <h2>Session</h2>
        <pre
          className="overflow-auto rounded-lg border bg-transparent p-4 text-xs"
          dangerouslySetInnerHTML={{ __html }}
        />
        <div className="flex flex-col gap-2">
          <h3>Actions</h3>
          <div className="flex gap-2">
            <Button variant={"outline"}>
              <a href={`/login?redirect_to=${href}`}>Refresh</a>
            </Button>
            <Button
              variant={"destructive"}
              onClick={async () => {
                "use server";

                await signOut({
                  redirect: true,
                  redirectTo,
                });

                console.log("Signed out. Redirecting to", redirectTo);
              }}
            >
              Log out
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Page;
