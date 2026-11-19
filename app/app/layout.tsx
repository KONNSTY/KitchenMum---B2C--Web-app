import { AppShell } from "@/components/app-shell";
import { ToastHost } from "@/components/ui";

export default function WorkspaceLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <AppShell>
      {children}
      <ToastHost />
    </AppShell>
  );
}
