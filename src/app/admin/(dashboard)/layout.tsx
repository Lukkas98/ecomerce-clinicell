import DashboardNav from "./DashboardNav";

export default function DashboardLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <div className="dashboard-shell">
      <main>{children}</main>
      <DashboardNav />
    </div>
  );
}