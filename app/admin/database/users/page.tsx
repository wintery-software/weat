// Force dynamic rendering to prevent build-time API calls
export const dynamic = "force-dynamic";

const Page = () => {
  return (
    <div className="flex flex-col gap-4">
      <h1 className="text-2xl font-bold">Users</h1>
      <p className="text-muted-foreground">User management coming soon...</p>
    </div>
  );
};

export default Page;
