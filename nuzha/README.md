# Nuzha · نزهة — storefront + admin (frontend only)

Next.js 16 · React 19 · Tailwind v4 · zustand. No backend: cart, orders, stock, theme and settings live in your browser's localStorage, so you can place orders like a customer and then handle them in the admin.

## Run

```bash
npm install
npm run dev
```

Open http://localhost:3000 — it redirects to `/en`. Arabic (RTL) is at `/ar`; the EN | عربي pill in the header switches.

## Try the full loop

1. Pick a product, choose colour/size, **Add to cart**, open the drawer, **Checkout**.
2. Step 1 contact → Step 2 address + shipping method → Step 3 payment (Mada, card, Apple Pay, cash on delivery). Discount code `NUZHA10` gives 10%.
3. **Pay** → confirmation page `/en/orders/<id>`. Your orders also appear at `/en/account`.
4. Open `/en/admin` (link in the footer): the order is in **Orders**; open it to **Fulfil**, **Mark as shipped**, or **Refund** (partial or full, optional restock).
5. **Products** → edit price, stock, title (EN/AR) or set to Draft; the storefront reflects it immediately.
6. **Themes** switches the storefront preset (Arcade light/dark, Harbour, Stroll). **Settings** toggles payment methods, the Arabic locale and the free-shipping threshold.
7. **Settings → Reset demo data** restores the seeded orders and stock.

## Structure

- `src/lib/catalog.ts` — categories and 24 products (EN/AR copy, Unsplash photos)
- `src/lib/i18n.ts` — EN/AR dictionaries
- `src/lib/store.ts` — cart, orders, refunds, overrides, theme, settings (persisted)
- `src/app/[locale]/(store)` — storefront pages · `src/app/[locale]/admin` — admin pages
- `src/app/globals.css` — design tokens (mirrors the Figma variables), theme presets, RTL font switch
