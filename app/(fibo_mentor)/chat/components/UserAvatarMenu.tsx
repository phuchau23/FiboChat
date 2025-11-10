import { useEffect, useRef, useState } from "react";
import { LogOut, Settings } from "lucide-react";
import { useUserProfile } from "@/hooks/useUser";
import ManageAccountDialog from "./ManageAccountDialog";
import { deleteCookie } from "cookies-next";
import { useAuthContext } from "@/lib/providers/authProvider";
import { useRouter } from "next/navigation";
// (nếu bạn để chỗ khác thì chỉnh lại import)

export default function UserDropdown() {
  const { data } = useUserProfile();
  const { logout } = useAuthContext();
  const user = data?.data;
  const [open, setOpen] = useState(false);
  const [accountOpen, setAccountOpen] = useState(false); // ⬅️ modal state
  const rootRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  const initials =
    (user?.firstname?.trim()?.[0] ?? "H") +
    (user?.lastname?.trim()?.[0] ?? "L");

  // Đóng dropdown khi click ra ngoài
  useEffect(() => {
    function onDocClick(e: MouseEvent) {
      if (!rootRef.current) return;
      if (!rootRef.current.contains(e.target as Node)) setOpen(false);
    }
    function onEsc(e: KeyboardEvent) {
      if (e.key === "Escape") setOpen(false);
    }
    document.addEventListener("mousedown", onDocClick);
    document.addEventListener("keydown", onEsc);
    return () => {
      document.removeEventListener("mousedown", onDocClick);
      document.removeEventListener("keydown", onEsc);
    };
  }, []);

  function handleLogout() {
    logout();
    deleteCookie("auth-token");
    deleteCookie("user-id");
    setOpen(false);
    router.push("/login");
  }

  return (
    <div className="relative" ref={rootRef}>
      {/* Avatar Button */}
      <button
        onClick={() => setOpen((v) => !v)}
        className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center text-sm font-semibold text-gray-700"
        aria-haspopup="menu"
        aria-expanded={open}
      >
        {initials}
      </button>

      {/* Dropdown */}
      {open && (
        <div className="absolute right-0 mt-2 w-80 bg-white border border-gray-200 rounded-xl shadow-lg overflow-hidden z-50">
          <div className="p-4 flex items-center gap-3 border-b border-gray-100">
            <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center text-sm font-semibold text-gray-700">
              {initials}
            </div>
            <div>
              <p className="text-sm font-medium text-gray-900">
                {user?.firstname} {user?.lastname}
              </p>
              <p className="text-xs text-gray-500">{user?.email}</p>
            </div>
          </div>

          <button
            className="w-full flex items-center gap-2 px-4 py-3 text-sm text-gray-700 hover:bg-gray-50"
            onClick={() => {
              setOpen(false); // đóng dropdown
              setAccountOpen(true); // mở modal Manage account
            }}
          >
            <Settings size={16} />
            Manage account
          </button>

          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-2 px-4 py-3 text-sm text-red-600 hover:bg-gray-50"
          >
            <LogOut size={16} />
            Sign out
          </button>
        </div>
      )}

      {/* Modal Manage Account */}
      <ManageAccountDialog open={accountOpen} onOpenChange={setAccountOpen} />
    </div>
  );
}
