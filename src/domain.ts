import { z } from "zod";

export const handoffRequest = z.object({
  sellerImage: z.string().min(1),
  filename: z.string().min(1),
  buyerFormat: z.enum(["webp", "avif"]),
  orderId: z.string().min(1)
});

export type HandoffRequest = z.infer<typeof handoffRequest>;

export function deliveryLabel(format: HandoffRequest["buyerFormat"]): string {
  return format === "avif" ? "buyer-avif" : "buyer-webp";
}
