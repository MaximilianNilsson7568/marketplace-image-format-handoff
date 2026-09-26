import { createOrderHandoff } from "./marketplace_service.ts";

const input = {
  sellerImage: process.env.SELLER_IMAGE ?? "iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAwMCAO+/lXcAAAAASUVORK5CYII=",
  filename: "linen-shirt.png",
  buyerFormat: (process.env.BUYER_FORMAT ?? "webp") as "webp" | "avif",
  orderId: process.env.ORDER_ID ?? "order-demo-001"
};

try {
  console.log(await createOrderHandoff(input));
} catch (error) {
  console.error(error instanceof Error ? error.message : error);
  process.exitCode = 1;
}
