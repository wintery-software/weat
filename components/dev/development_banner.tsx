import DevelopmentView from "@/components/dev/development_view";
import {
  Banner,
  BannerClose,
  BannerIcon,
  BannerTitle,
} from "@/components/ui/kibo-ui/banner";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { CurlyBraces } from "lucide-react";
import { type ReactNode } from "react";

const DevelopmentBanner = ({ children }: { children?: ReactNode }) => {
  return (
    <DevelopmentView>
      <Banner className="dark:bg-background dark:text-primary">
        <BannerIcon icon={CurlyBraces} />
        <BannerTitle>
          <Popover>
            <PopoverTrigger className="font-semibold underline decoration-dashed">
              Developer&#39;s Message
            </PopoverTrigger>
            <PopoverContent
              align="start"
              className="w-fit border-none bg-primary p-2 text-xs text-background"
            >
              This message is only visible in development mode.
            </PopoverContent>
          </Popover>
          <span className="block">{children}</span>
        </BannerTitle>
        <BannerClose />
      </Banner>
    </DevelopmentView>
  );
};

export default DevelopmentBanner;
