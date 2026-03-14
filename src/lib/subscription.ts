"use server";
import { Subscription } from "@prisma/client";
import { isPast } from "date-fns";
import { prisma } from "./prisma";

export async function subscriptionValid(subscription: Subscription) {
  let newSubscription: Subscription = subscription;
  console.log(subscription.currentPeriodEnd);
  console.log(newSubscription.currentPeriodEnd);

  if (
    isPast(subscription.currentPeriodEnd as Date) &&
    subscription.status?.toLowerCase() == "active"
  ) {
    newSubscription = await prisma.subscription.update({
      where: { id: subscription.id },
      data: {
        status: "Inactive",
      },
    });
  }

  if (newSubscription.status?.toLowerCase() == "active") {
    return true;
  }

  return false;
}
