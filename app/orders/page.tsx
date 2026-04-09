import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import OrdersClient from "@/components/orders/OrdersClient";
import { authOptions } from "@/lib/auth";

export default async function OrdersPage() {
  const session = await getServerSession(authOptions);

  if (!session?.user?.id) {
    redirect("/login?callbackUrl=/orders");
  }

  return <OrdersClient userId={session.user.id} />;
}
