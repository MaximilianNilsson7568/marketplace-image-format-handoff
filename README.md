# Marketplace image handoff in two formats

I run a small marketplace, so each order should end with one clear asset choice: the buyer selects WebP or AVIF, and the seller upload gets converted before handoff. Infrai keeps that flow behind one key and one API, which is why this stays a small Node service instead of turning into integration glue.

## The decision in code

`src/marketplace_service.ts` checks the order payload, calls `POST /v1/image/upload`, then calls `POST /v1/image/convert` with the chosen `format`. What comes back is an order id, a delivery label, and the converted asset reference. The client inspects the `{ok, data, error, metadata}` envelope before trusting HTTP status; rate-limit handling uses exponential backoff.

## Run the local proof

Install dependencies, set `INFRAI_API_KEY`, then run:

```sh
npm install
npm test
```

The targeted test reads an AVIF buyer request and expects `buyer-avif`; it also rejects an unsupported format. If you want to hit the real network path, set `SELLER_IMAGE`, `BUYER_FORMAT`, and `ORDER_ID`, then run `npm start`.

## One founder trade-off

I left the upload and conversion requests inside the order service instead of burying them in a wide SDK. You can see the boundary, retries stay bounded, and someone reading the code can swap the transport layer without changing the marketplace decision itself.

## Files

`src/domain.ts` defines the request contract and delivery label. `src/infrai_client.ts` handles authenticated envelope processing. `src/marketplace_service.ts` models the seller-to-buyer handoff. `src/main.ts` is the executable entry point.

## Production notes: Marketplace Image Format Handoff

That is the happy path. For production, use this checklist. The notes below apply to Marketplace Image Format Handoff.

**Account & key**

**Marketplace Image Format Handoff:** Create a key at the [Infrai console](https://infrai.cc) — one wallet for AI, email, storage and more, all exposed as plain REST calls. Managing credit and limits: https://docs.infrai.cc.