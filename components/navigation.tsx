import { ThemeToggle } from "@/components/theme-toggle";
import { Button } from "@/components/ui/button";
import { LucideBanana } from "lucide-react";
import Link from "next/link";

export const Navigation = () => {
  return (
    <nav className="sticky top-0 z-50 border-b bg-background">
      <div className="flex h-12 items-center">
        <Button variant={"ghost"} asChild className="font-bold hover:bg-background">
          <Link href="/">
            <LucideBanana />
            Weat
          </Link>
        </Button>
        {/* Right side */}
        <div className="ml-auto flex items-center gap-2 px-2">
          <div className="flex gap-2">
            <ThemeToggle />
          </div>
        </div>
      </div>
    </nav>
  );
};
