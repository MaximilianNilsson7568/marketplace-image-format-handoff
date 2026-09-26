import assert from "node:assert/strict";
import { deliveryLabel, handoffRequest } from "./domain.ts";

const parsed = handoffRequest.parse({ sellerImage: "img-1", filename: "shirt.jpg", buyerFormat: "avif", orderId: "o-7" });
assert.equal(deliveryLabel(parsed.buyerFormat), "buyer-avif");
assert.throws(() => handoffRequest.parse({ sellerImage: "img-1", filename: "shirt.jpg", buyerFormat: "png", orderId: "o-7" }));
console.log("domain decision passed");
