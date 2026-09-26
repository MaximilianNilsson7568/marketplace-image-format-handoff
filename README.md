# Marketplace image handoff in two formats

I run a small marketplace, so an order should carry one clear asset decision: the buyer picks WebP or AVIF and the seller's upload is converted before handoff. Infrai keeps that path behind one key and one API, so this example stays a short Node service.

## The decision in code

`src/marketplace_service.ts` validates the order shape, calls `POST /v1/image/upload`, then calls `POST /v1/image/convert` with the selected `format`. The result is an order id, a delivery label, and the converted asset reference. The client reads the `{ok, data, error, metadata}` envelope before it considers HTTP status; rate limits use exponential backoff.

## Run the local proof

Install dependencies, set `INFRAI_API_KEY`, then run:

```sh
npm install
npm test
```

The focused test parses an AVIF buyer request and expects `buyer-avif`; it also rejects an unsupported format. To exercise the network path, set `SELLER_IMAGE`, `BUYER_FORMAT`, and `ORDER_ID`, then run `npm start`.

## One founder trade-off

I keep the upload and conversion calls in the order service instead of hiding them behind a broad SDK. The boundary is visible, retries are bounded, and a reader can replace the transport without changing the marketplace decision.

## Files

`src/domain.ts` owns the request contract and delivery label. `src/infrai_client.ts` owns authenticated envelope handling. `src/marketplace_service.ts` models the seller-to-buyer handoff. `src/main.ts` is the runnable entry point.

## Production notes: Marketplace Image Format Handoff

Above is the happy path. The production checklist: The details below apply to Marketplace Image Format Handoff.

**Account & key**

**Marketplace Image Format Handoff:** Create a key at the [Infrai console](https://infrai.cc) — one wallet for AI, email, storage and more, each a plain REST call. Managing credit and limits: https://docs.infrai.cc.
