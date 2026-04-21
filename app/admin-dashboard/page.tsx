import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import Header from "@/components/common/Header";
import Footer from "@/components/common/Footer";
import AdminDashboardClient from "@/components/admin/AdminDashboardClient";
import { authOptions } from "@/lib/auth";

const ADMIN_EMAIL = "admin@gmail.com";

export default async function AdminDashboardPage() {
  const session = await getServerSession(authOptions);

  if (!session?.user?.email) {
    redirect("/admin?callbackUrl=/admin-dashboard");
  }

  if (session.user.email.toLowerCase() !== ADMIN_EMAIL) {
    redirect("/login");
  }

  return (
    <div className="min-h-screen bg-[#140D0A]">
      <Header showBack title="Admin Dashboard" backHref="/landing" />

      <AdminDashboardClient
        adminName={session.user.name || "Admin"}
        adminEmail={session.user.email}
      />

      <Footer variant="simple" />
    </div>
  );
}
