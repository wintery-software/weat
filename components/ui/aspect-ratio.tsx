"use client";

import * as AspectRatioPrimitive from "@radix-ui/react-aspect-ratio";

const AspectRatio = ({
  ...props
}: React.ComponentProps<typeof AspectRatioPrimitive.Root>) => {
  return <AspectRatioPrimitive.Root data-slot="aspect-ratio" {...props} />;
};

export { AspectRatio };
