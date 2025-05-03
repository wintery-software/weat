import { auth } from "@/lib/auth";

const Page = async () => {
  const session = await auth();

  return (
    <div>
      <h1>Admin Page</h1>
      <pre className="text-wrap">{JSON.stringify(session, null, 2)}</pre>
    </div>
  );
};

export default Page;
