import { Toaster } from "@/components/ui/toaster";
import { Toast } from "@radix-ui/react-toast";

export default function ChatLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <main>
        {children}
        <Toaster />
      </main>
    </>
  );
}
