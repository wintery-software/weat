import { Button } from "@/components/ui/button";
import { auth, signOut } from "@/lib/next-auth";
import hljs from "highlight.js/lib/core";
import json from "highlight.js/lib/languages/json";
import "highlight.js/styles/github.css";

hljs.registerLanguage("json", json);

const Page = async () => {
  const redirectTo = `${process.env.AUTH_COGNITO_DOMAIN}/logout?client_id=${process.env.AUTH_COGNITO_ID}`;

  const session = await auth();
  const raw = JSON.stringify(session, null, 2);
  const __html = hljs.highlight(raw, { language: "json" }).value;

  return (
    <div className="flex flex-col gap-4">
      <h1>Admin Page</h1>
      <div className="flex flex-col gap-2">
        <h2>Session</h2>
        <pre
          className="overflow-auto rounded-lg border bg-transparent p-4 text-xs"
          dangerouslySetInnerHTML={{ __html }}
        />
        <h3>Session Actions</h3>
        <div className="flex gap-2">
          <Button
            onClick={async () => {
              "use server";

              await signOut({
                redirect: true,
                redirectTo,
              });
            }}
          >
            Log out
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Page;
