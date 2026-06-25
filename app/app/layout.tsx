import { Poppins } from "next/font/google";
import DashboardShell from "./_components/dashboard-shell";
import { LogProvider } from "./_lib/log-store";
import { ToastProvider } from "./_components/toast";

// The Lovable reference (/app) uses Poppins. Loaded here so it only applies
// to the dashboard subtree, leaving the marketing site on Plus Jakarta Sans.
const poppins = Poppins({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800"],
  variable: "--font-poppins",
});




export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <DashboardShell fontClassName={poppins.className}>
      <LogProvider>
        <ToastProvider>{children}</ToastProvider>
      </LogProvider>
    </DashboardShell>
  );
}
