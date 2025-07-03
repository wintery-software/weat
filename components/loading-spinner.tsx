import { Loader2 } from "lucide-react";

interface LoadingSpinnerProps {
  message?: string;
  size?: "sm" | "md" | "lg";
}

export const LoadingSpinner = ({
  message = "加载中...",
  size = "md",
}: LoadingSpinnerProps) => {
  const sizeConfig = {
    sm: { spinner: "size-4", font: "text-xs" },
    md: { spinner: "size-6", font: "text-sm" },
    lg: { spinner: "size-8", font: "text-base" },
  };

  return (
    <div className="flex items-center justify-center py-8">
      <div className="flex flex-col items-center gap-2">
        <Loader2 className={`animate-spin ${sizeConfig[size].spinner}`} />
        <div className={`text-muted-foreground ${sizeConfig[size].font}`}>
          {message}
        </div>
      </div>
    </div>
  );
};
