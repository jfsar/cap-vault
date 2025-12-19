import { UserCircle, UserCircle2 } from "lucide-react";
import { Badge } from "../ui/badge"; 

export default function UserBadge({ role }: { role: string }) {
  const getUserDetails = (role: string) => {
    switch (role) {
      case "admin":
        return {
          label: "Admin",
          variant: "default" as const,
          icon: <UserCircle className="w-4 h-4" />,
        };
      case "user":
        return {
          label: "User",
          variant: "secondary" as const,
          icon: <UserCircle2 className="w-4 h-4" />,
        };
      default:
        return {
          label: role,
          variant: "secondary" as const,
          icon: <UserCircle2 className="w-4 h-4" />,
        };
    }
  };

  const userDetails = getUserDetails(role);
  return (
    <Badge variant={userDetails.variant} className="flex items-center gap-1">
      {userDetails.icon}
      {userDetails.label}
    </Badge>
  );
}