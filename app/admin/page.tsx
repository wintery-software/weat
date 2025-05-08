import { auth } from "@/lib/next-auth";

const Page = async () => {
  const session = await auth();
  const user = session?.user;

  return (
    <div className="flex flex-col gap-8">
      <h1>Admin Dashboard</h1>
      <p>Welcome, {user?.name || user?.email}</p>
    </div>
  );
};

export default Page;
