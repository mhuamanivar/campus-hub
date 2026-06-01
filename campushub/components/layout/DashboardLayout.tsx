import ProtectedRoute from "@/components/auth/ProtectedRoute";
import Sidebar from "./Sidebar";
import Topbar from "./Topbar";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <ProtectedRoute>
      <div className="flex min-h-screen bg-[#F5F7FB]">
        <Sidebar />
        <div className="flex-1 flex flex-col">
          <Topbar />
          <main className="p-8">{children}</main>
        </div>
      </div>
    </ProtectedRoute>
  );
}