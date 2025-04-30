import { dynamicIconImports } from "lucide-react/dynamic";
import dynamic from "next/dynamic";
import { memo } from "react";

/**
 * Use Lucide icons by name. Can be slow.
 */
const LucideIcon = memo(({ name, ...props }: LucideIconProps) => {
  const Icon = dynamic(dynamicIconImports[name], {
    ssr: false,
  });

  if (!Icon) {
    return null;
  }

  return <Icon {...props} />;
});

LucideIcon.displayName = "LucideIcon";
export default LucideIcon;
