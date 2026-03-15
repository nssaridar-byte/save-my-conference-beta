"use server";
import { Subscription } from "@prisma/client";
import { isPast } from "date-fns";
import { prisma } from "./prisma";

export async function subscriptionValid(subscription: Subscription) {
  let newSubscription: Subscription = subscription;

  // If the current period end is in the past and the status is active, update the status to inactive
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

  // If the new subscription status is inactive or the new subscription current period end is in the past, return false
  if (
    newSubscription.status?.toLowerCase() == "inactive" ||
    isPast(newSubscription.currentPeriodEnd as Date)
  ) {
    return false;
  }

  return true;
}
