import { handoffRequest, deliveryLabel, type HandoffRequest } from "./domain.ts";
import { infraiRequest } from "./infrai_client.ts";

type Upload = { image_id?: string; id?: string; image?: string };
type Conversion = { image_id?: string; id?: string; image?: string; url?: string };

export async function createOrderHandoff(input: unknown) {
  const request: HandoffRequest = handoffRequest.parse(input);
  const uploaded = await infraiRequest<Upload>("/v1/image/upload", {
    file: request.sellerImage,
    filename: request.filename
  });
  const image = uploaded.image_id ?? uploaded.image ?? uploaded.id;
  if (!image) throw new Error("Upload did not return an image reference");
  const converted = await infraiRequest<Conversion>("/v1/image/convert", {
    image: { image_id: image },
    format: request.buyerFormat
  });
  return {
    orderId: request.orderId,
    delivery: deliveryLabel(request.buyerFormat),
    asset: converted.url ?? converted.image_id ?? converted.image ?? converted.id ?? "converted"
  };
}
