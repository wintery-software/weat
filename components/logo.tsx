import { LucideProps } from "lucide-react";
import Image from "next/image";

// export const WeatLogo = (props: LucideProps) => <SaladIcon {...props} />;
export const WeatLogo = (props: LucideProps) => (
  <Image
    src="/weat.jpg"
    alt="Weat Logo"
    width={512}
    height={512}
    className={props.className}
  />
);
