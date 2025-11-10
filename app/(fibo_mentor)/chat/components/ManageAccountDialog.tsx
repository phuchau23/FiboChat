import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";
import * as React from "react";
import { useUserProfile } from "@/hooks/useUser";
import { useRouter } from "next/navigation";
import DeviceCurrentCard from "@/components/DeviceCurrentCard";

export default function ManageAccountDialog({
  open,
  onOpenChange,
}: {
  open: boolean;
  onOpenChange: (v: boolean) => void;
}) {
  const { data } = useUserProfile();
  const router = useRouter();
  const user = data?.data;
  const [section, setSection] = React.useState<"profile" | "security">(
    "profile"
  );
  const initials =
    (user?.firstname?.trim()?.[0] ?? "H") +
    (user?.lastname?.trim()?.[0] ?? "L");

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        className={cn(
          "gap-0 p-0 max-w-5xl w-[980px] rounded-2xl overflow-hidden",
          "border border-border shadow-2xl"
        )}
      >
        <div className="flex h-[72vh]">
          {/* Sidebar */}
          <aside className="w-64 bg-muted/30 border-r border-border p-6">
            <h2 className="text-xl font-semibold mb-4">Account</h2>
            <p className="text-sm text-muted-foreground mb-6">
              Manage your account info.
            </p>

            <nav className="space-y-1">
              <button
                className={cn(
                  "w-full text-left px-3 py-2 rounded-lg text-sm",
                  section === "profile"
                    ? "bg-background shadow-sm"
                    : "hover:bg-muted"
                )}
                onClick={() => setSection("profile")}
              >
                Profile
              </button>
              <button
                className={cn(
                  "w-full text-left px-3 py-2 rounded-lg text-sm",
                  section === "security"
                    ? "bg-background shadow-sm"
                    : "hover:bg-muted"
                )}
                onClick={() => setSection("security")}
              >
                Security
              </button>
            </nav>
          </aside>

          {/* Main content */}
          <section className="flex-1 overflow-auto">
            <div className="p-6 border-b border-border">
              <DialogHeader>
                <DialogTitle>Profile details</DialogTitle>
              </DialogHeader>
            </div>

            {section === "profile" ? (
              <div className="p-8 space-y-8">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <Avatar className="h-14 w-14">
                      <AvatarFallback className="bg-slate-600 text-white">
                        {initials}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <div className="font-medium">
                        {user?.firstname} {user?.lastname}
                      </div>
                      <div className="text-sm text-muted-foreground">
                        Profile
                      </div>
                    </div>
                  </div>
                  <Button
                    onClick={() => router.push("/profile")}
                    variant="outline"
                  >
                    Update profile
                  </Button>
                </div>

                <div className="space-y-3">
                  <div className="text-sm font-medium">Email addresses</div>
                  <div className="flex items-center gap-3">
                    <span className="text-sm">{user?.email ?? "—"}</span>
                    <span className="text-xs rounded-md border px-2 py-0.5 text-muted-foreground">
                      Primary
                    </span>
                  </div>
                  <Button variant="ghost" className="px-0 h-auto">
                    + Add email address
                  </Button>
                </div>
              </div>
            ) : (
              <div className="p-8 space-y-6">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-lg font-semibold">Security</div>
                    <p className="text-sm text-muted-foreground">
                      Devices currently used to access your account.
                    </p>
                  </div>
                  <div className="text-xs text-muted-foreground">
                    Only local info shown
                  </div>
                </div>

                <div className="space-y-3">
                  <DeviceCurrentCard />
                </div>
              </div>
            )}
          </section>
        </div>
      </DialogContent>
    </Dialog>
  );
}
