import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import Link from "next/link";

const NotFound = () => {
  return (
    <div className="flex min-h-screen items-center justify-center p-4">
      <Card className="w-full max-w-md space-y-6 p-8 text-center">
        <h1 className="text-4xl font-bold">404</h1>
        <p className="text-muted-foreground">Page not found.</p>
        <CardContent className="flex flex-col gap-4">
          <Button asChild>
            <Link href="/">Go Home</Link>
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default NotFound;
