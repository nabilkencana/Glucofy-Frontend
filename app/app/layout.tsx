import DashboardShell from "./_components/dashboard-shell";
import { LogProvider } from "./_lib/log-store";
import { ToastProvider } from "./_components/toast";

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <DashboardShell>
      <LogProvider>
        <ToastProvider>{children}</ToastProvider>
      </LogProvider>
    </DashboardShell>
  );
}

