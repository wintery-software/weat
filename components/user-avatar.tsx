import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { type Profile } from "@/types/types";
import { UserIcon } from "lucide-react";

interface UserAvatarProps {
  profile: Profile | null;
  className?: string;
}

export const UserAvatar = ({ profile, className }: UserAvatarProps) => {
  const nameParts = profile?.name?.split(" ").filter(Boolean) || [];
  const name = nameParts[0]?.charAt(0).toUpperCase();

  return (
    <Avatar className={className}>
      <AvatarImage src={profile?.avatar || "#"} />
      <AvatarFallback>{name ?? <UserIcon className="size-4" />}</AvatarFallback>
    </Avatar>
  );
};
