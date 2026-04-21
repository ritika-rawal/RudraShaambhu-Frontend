import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import CheckoutClient from "@/components/checkout/CheckoutClient";
import { authOptions } from "@/lib/auth";

export default async function CheckoutPage() {
  const session = await getServerSession(authOptions);

  if (!session?.user?.id) {
    redirect("/login?callbackUrl=/checkout");
  }

  return <CheckoutClient userId={session.user.id} />;
}
