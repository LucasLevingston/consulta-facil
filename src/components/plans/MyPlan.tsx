import React from "react";
import axios from "axios";
import { toast } from "@/hooks/use-toast";
import { useSession } from "next-auth/react";
import { Button } from "../ui/button";

export default function MyPlan() {
  const { data: session } = useSession();

  const handleCustomer = async () => {
    try {
      const { data } = await axios.post(`/api/stripe/billing-portal`, {
        userId: session?.user?.id,
        email: session?.user?.email,
      });

      if (data) {
        console.log(data);
      } else {
        console.error("Failed to create checkout session");
        toast({ title: "Failed to create checkout session" });
        return;
      }
    } catch (error) {
      console.error("Error during checkout:", error);
      toast({ title: "Error during checkout" });
      return;
    }
  };
  return <Button onClick={() => handleCustomer()}>Ver minhas assinaturas</Button>;
}
