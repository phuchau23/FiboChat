import { Toaster } from "@/components/ui/toaster";

export default function ChatLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <main>
        {children}
        <Toaster />
      </main>
    </>
  );
}
