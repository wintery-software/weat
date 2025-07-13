import { COMPANY_NAME } from "@/lib/constants";
import Link from "next/link";

export const Footer = () => (
  <footer className="container flex h-16 flex-col items-center justify-center text-xs md:flex-row md:justify-between md:text-sm">
    <p className="text-muted-foreground text-center md:text-left">
      &copy;&nbsp;{new Date().getFullYear()}&nbsp;
      <Link
        href="https://github.com/wintery-software"
        target="_blank"
        className="hover:text-primary underline underline-offset-2 transition-colors duration-300"
        rel="noopener noreferrer"
      >
        {COMPANY_NAME}
      </Link>
      .&nbsp;All rights reserved.
    </p>
  </footer>
);
