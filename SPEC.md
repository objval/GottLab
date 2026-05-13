# GottLab - App Specification & Audit

> Forked from [DonSebita/GottLab](https://github.com/DonSebita/GottLab)
> Live: https://gott-lab.vercel.app
> 17 commits, ~1 week of development (started May 5, 2026)

---

## 1. Executive Summary

**What it is:** An e-commerce storefront for selling in-vitro plants (cultivo in vitro), built with Next.js App Router. Targets the Chilean market (CLP, Correos de Chile shipping, Rut field). Directly sells plants and takes pre-orders (preventas). Admin panel for product/order/user management.

**Current status:** Early-stage prototype. Auth works (login/register/logout) with custom JWT. Product catalog fetches from Supabase. Cart uses a 15-minute reservation system via Supabase. Admin panel shell exists. **No checkout, no payment integration, no shipping calculation.**

---

## 2. Tech Stack

| Layer | Technology |
|-------|-----------|
| Framework | Next.js 16.2.4 (App Router) |
| Language | TypeScript (94%), JavaScript (6%) |
| Styling | Tailwind CSS v4 + PostCSS |
| Database ORM | Prisma 7.8 (schema defined, but NOT used at runtime) |
| Runtime DB | Supabase (direct client calls, no Prisma client usage) |
| Auth | Custom JWT (jose) + bcryptjs, httpOnly cookie |
| Icons | Lucide React |
| Font | Geist (Vercel) |
| Hosting | Vercel (gott-lab.vercel.app) |

**Dual DB stack paradox:** Prisma schema defines all models (281 lines, full relational model) but the app code exclusively uses Supabase client. The Prisma client is generated to `app/generated/prisma` but never imported. This is a planned-but-not-yet-executed migration to PostgreSQL, or a leftover from scaffolding.

---

## 3. Architecture

### 3.1 Project Structure

```
GottLab/
├── app/
│   ├── layout.tsx              # Root layout (AuthProvider > ThemeProvider > CarritoProvider > AdminShell)
│   ├── page.tsx                # Home (hero carousel, features, nuevos, catalog carousel, CTA)
│   ├── globals.css             # Tailwind imports + dark mode + animations
│   ├── login/page.tsx          # Login form (client component)
│   ├── register/page.tsx       # Register form (client component)
│   ├── productos/
│   │   ├── page.tsx            # Product catalog (server component fetching data)
│   │   └── [id]/
│   │       ├── page.tsx        # Product detail
│   │       └── consulta/page.tsx # Consultation form (stub)
│   ├── carrito/page.tsx        # Cart page with validation
│   ├── preventas/page.tsx      # Pre-orders page (stub)
│   ├── nosotros/page.tsx       # About page (stub)
│   ├── contacto/page.tsx       # Contact page (stub)
│   ├── mi-cuenta/
│   │   ├── layout.tsx          # Account sidebar layout
│   │   ├── page.tsx            # Personal data edit
│   │   ├── pedidos/page.tsx    # Order history (stub)
│   │   ├── direcciones/page.tsx # Addresses CRUD (stub)
│   │   └── cambiar-password/page.tsx # Password change (stub)
│   ├── admin/
│   │   ├── layout.tsx          # Admin sidebar layout (auth-gated)
│   │   ├── page.tsx            # Dashboard (fetches product stats from Supabase)
│   │   ├── productos/page.tsx  # Product management (stub)
│   │   ├── pedidos/page.tsx    # Order management (stub)
│   │   ├── usuarios/page.tsx   # Employee management (stub)
│   │   ├── categorias/page.tsx # Category management (stub)
│   │   └── configuracion/page.tsx # Settings (stub)
│   └── api/
│       ├── auth/
│       │   ├── login/route.ts     # POST - validate credentials, set cookie
│       │   ├── register/route.ts  # POST - create user + client record
│       │   ├── logout/route.ts    # POST - clear cookie
│       │   └── session/route.ts   # GET  - return current user from cookie
│       └── cliente/
│           ├── perfil/route.ts        # GET/PUT client profile
│           ├── pedidos/route.ts       # GET client orders
│           ├── direcciones/route.ts   # GET/POST/PUT/DELETE addresses
│           └── cambiar-password/route.ts # POST password change
├── components/
│   ├── Navbar.tsx              # Fixed navbar with auth-aware links, dark mode toggle, cart icon
│   ├── AdminShell.tsx          # Conditional wrapper: shows Navbar+AnnouncementBar or nothing (admin)
│   ├── AnnouncementBar.tsx     # "Envios a todo Chile" banner on home only
│   ├── ThemeProvider.tsx       # Light/dark toggle with localStorage persistence
│   ├── ProductCard.tsx         # Product card with tags (nuevo, destacado, stock, categoria)
│   ├── Productos.tsx           # Full product catalog client component with filters
│   ├── ProductCarousel.tsx     # Single-item carousel with thumbnails
│   ├── HeroCarousel.tsx        # Full-screen hero carousel (4 slides)
│   ├── CarritoDropdown.tsx     # Cart dropdown (desktop) or link (mobile)
│   ├── AgregarAlCarritoBtn.tsx # Add-to-cart button with state feedback
│   └── PageTransition.tsx      # Fade-in page transition wrapper
├── contexts/
│   ├── AuthContext.tsx          # Auth state management (login, logout, session fetch)
│   └── CarritoContext.tsx       # Cart state management (reserva-based, auto-refresh)
├── lib/
│   ├── jwt.ts                  # JWT sign/verify with jose (HS256, 30-day expiry)
│   ├── supabaseClient.ts       # Browser Supabase client (anon key)
│   ├── supabaseServer.js       # Server Supabase client (service_role key)
│   └── actions/
│       ├── productos.js        # Server actions: getProductos, getDestacados, getNuevos, etc.
│       └── carrito.js          # Server actions: cart CRUD via reservas table
├── prisma/
│   └── schema.prisma           # Full Prisma schema (NOT used at runtime)
├── prisma.config.ts            # Prisma config pointing to DATABASE_URL
├── middleware.ts               # Route protection based on JWT cookie + role
├── types/
│   └── lucide-react.d.ts       # Lucide type overrides
├── public/                     # Static assets (placeholder.avif, SVG icons)
└── .vscode/settings.json
```

### 3.2 Data Flow

```
Browser                    Server (Next.js)              Supabase
  │                            │                            │
  │  GET /productos            │                            │
  │  ─────────────────────────>│  getProductos()            │
  │                            │  ─────────────────────────>│
  │                            │  <──────── product rows ───│
  │  <──── SSR HTML ───────────│                            │
  │                            │                            │
  │  POST /api/auth/login      │                            │
  │  ─────────────────────────>│  bcrypt.compare()          │
  │                            │  ───── select user ───────>│
  │                            │  <──── user row ──────────│
  │  <─── Set-Cookie: token ───│  signToken() → JWT         │
  │                            │                            │
  │  add-to-cart (client)      │                            │
  │  ─────────────────────────>│  agregarAlCarrito()        │
  │                            │  ── insert reserva ──────>│
  │                            │  <── success ────────────│
  │  <──── { success: true } ──│                            │
```

### 3.3 Auth Flow

1. Register creates a row in `usuarios` table (email, password_hash, rol='cliente', activo=true)
2. Then creates a row in `clientes` table (nombre, apellido, linked by id_usuario)
3. Login: validates against `usuarios` table with bcrypt, then fetches profile from `clientes` or `empleados`
4. JWT (HS256, 30d) stored in httpOnly cookie `auth_token`
5. Middleware checks cookie for protected routes (/admin, /mi-cuenta, /panel-empleado)
6. Session endpoint validates token against DB on each load

### 3.4 Cart System (Reserva Pattern)

**Clever approach:** Instead of a traditional cart, the app uses a 15-minute reservation system:

1. User adds product → `reservas` row created with `fecha_expiracion = now() + 15min`
2. Stock is NOT decremented in `productos.stock_total` — it's calculated dynamically
3. On every cart operation, expired reservations are cleaned up
4. Cart count = sum of active reservation quantities
5. Checkout validation recalculates available stock considering other active reservations
6. After 15 minutes of inactivity, reservations auto-expire (cleaned on next cart access)

---

## 4. Database Schema (Supabase - Actual Runtime)

The Supabase database has TWO parallel user systems:

**Legacy tables (Prisma-defined, may or may not exist in Supabase):**
- `Clientes` - original client model (id_cliente, rut, nombre, apellido, email, password_hash, etc.)
- `Empleados` - original employee model
- `Productos`, `Categorias`, etc.

**New architecture tables (used by auth API routes):**
- `usuarios` - centralized user table (id_usuario, email, password, rol, activo)
- `clientes` - client profile linked via id_usuario FK (not id_cliente)
- `empleados` - employee profile linked via id_usuario FK

**Shared tables:**
- `reservas` - cart reservations (id_reserva, id_producto, id_cliente, cantidad, fecha_expiracion, estado)
- `productos` - products with fields: id_producto, nombre, nombre_cientifico, descripcion, id_categoria, tipo_venta, stock_total, stock_reservado, precio_venta, precio_costo, estado, destacado, nuevo, prioridad
- `categorias` - product categories (id_categoria, nombre)
- `imagenes_productos` - product images (id_imagen, id_producto, url, es_principal, orden)
- `pedidos` - orders
- `detalle_pedido` - order line items
- `pagos` - payments
- `envios` - shipping info
- `direcciones` - addresses
- `historial_pedido` - order history log

---

## 5. Page-by-Page Breakdown

### 5.1 Public Pages

| Route | Type | Status | Description |
|-------|------|--------|-------------|
| `/` | Server | Working | Homepage: hero carousel, features, "Lo Nuevo" grid, catalog carousel, CTA |
| `/productos` | Server | Working | Catalog with search, category, price, and availability filters. 3 view modes (grid/list/single). Pagination via URL params |
| `/productos/[id]` | Server | Working | Product detail: gallery, info, add-to-cart, related products |
| `/productos/[id]/consulta` | Client | Stub | Contact form about a specific plant |
| `/login` | Client | Working | Login form with email/password, redirect support |
| `/register` | Client | Working | Register with nombre/apellido/email/password, password rules, terms checkbox |
| `/carrito` | Client | Working | Full cart page: items with qty controls, validation, summary (no actual payment yet) |
| `/preventas` | Server | Stub | Pre-orders page |
| `/nosotros` | Server | Stub | About page |
| `/contacto` | Server | Stub | Contact page |

### 5.2 Customer Pages (auth-gated)

| Route | Type | Status | Description |
|-------|------|--------|-------------|
| `/mi-cuenta` | Client | Working | Profile edit (nombre, apellido, telefono, rut) |
| `/mi-cuenta/pedidos` | Client | Stub | Order history |
| `/mi-cuenta/direcciones` | Client | Stub | Address management |
| `/mi-cuenta/cambiar-password` | Client | Stub | Password change |

### 5.3 Admin Pages (auth-gated, role=admin)

| Route | Type | Status | Description |
|-------|------|--------|-------------|
| `/admin` | Client | Partial | Dashboard with product stats from Supabase. Other stats show "--" |
| `/admin/productos` | Client | Stub | Product CRUD |
| `/admin/pedidos` | Client | Stub | Order management |
| `/admin/usuarios` | Client | Stub | Employee management (admin only) |
| `/admin/categorias` | Client | Stub | Category management |
| `/admin/configuracion` | Client | Stub | Settings (admin only) |

---

## 6. API Routes Summary

| Route | Methods | Auth | Description |
|-------|---------|------|-------------|
| `/api/auth/login` | POST | None | Email + password → JWT cookie |
| `/api/auth/register` | POST | None | Create user + client profile |
| `/api/auth/logout` | POST | None | Clear auth cookie |
| `/api/auth/session` | GET | Cookie | Return current user from JWT |
| `/api/cliente/perfil` | GET, PUT | Cliente | Get/update own profile |
| `/api/cliente/pedidos` | GET | Cliente | List own orders |
| `/api/cliente/direcciones` | GET, POST, PUT, DELETE | Cliente | Full CRUD for addresses |
| `/api/cliente/cambiar-password` | POST | Cliente | Change password (requires current) |

---

## 7. Audit & Critique

### 7.1 Critical Issues

**A. Prisma/Supabase schizophrenia (HIGH)**
The Prisma schema is a full relational model that's never used. Every API route uses raw Supabase queries. This means:
- No type safety from Prisma generated types
- No migrations management
- Two competing DB schemas that may diverge
- `prisma.config.ts` references `DATABASE_URL` env var, but the app connects to Supabase

**Fix:** Choose ONE. Either migrate everything to Prisma+PostgreSQL (ditch Supabase), or delete the Prisma schema and use Supabase types generation. The dual setup will cause data corruption.

**B. Auth schema mismatch (HIGH)**
The code references both `clientes` (Prisma schema, with `email`, `password_hash` directly on the table) AND `clientes` (Supabase, with `id_usuario` FK to `usuarios`). The login route queries `usuarios` then `clientes` by `id_usuario`. The Prisma `Cliente` model has `email` and `password_hash` directly. These are incompatible schemas.

**C. Hardcoded client ID for cart (CRITICAL)**
`CarritoContext.tsx` line 59: `const ID_CLIENTE_TEMPORAL = 1`
And `carrito/page.tsx` line 20: `const ID_CLIENTE_TEMPORAL = 1`

Every cart operation uses client ID 1 regardless of who is logged in. All users share the same cart. This needs to be wired to the auth context's `perfilId`.

**D. No checkout/payment integration**
The cart has a "Proceder al pago" button that logs to console and shows an alert. No actual checkout flow exists. No payment provider integration (Stripe, MercadoPago, WebPay, etc.).

**E. No shipping calculation**
The cart shows "Envio: A calcular" hardcoded. No weight/dimension fields on products. No shipping rate logic. No Correos de Chile API integration despite the announcement bar advertising it.

**F. Images always show placeholder**
Despite having a full `imagenes_productos` table with Wasabi S3 URLs (next.config.ts allows s3.us-central-1.wasabisys.com), every image component renders `src="/placeholder.avif"`. The image URLs from the DB are fetched but never passed to `<Image>` components. Example: `ProductCard.tsx` line 55, `HeroCarousel.tsx` line 199, Product detail line 62 — all hardcoded to placeholder.

### 7.2 High-Severity Issues

**G. No input sanitization on search**
`getProductos()` uses `ilike` with raw user input: `.or(\`nombre.ilike.%${busqueda}%...\`)`. This is SQL-injection-resistant in Supabase's PostgREST, but the raw string interpolation pattern is dangerous if they switch to raw SQL queries.

**H. Missing rate limiting on auth endpoints**
No rate limiting on login/register. Brute-forceable.

**I. JWT secret fallback to hardcoded value**
`lib/jwt.ts` line 4: `process.env.JWT_SECRET || 'fallback-dev-secret-change-in-production'`
If `JWT_SECRET` is missing in production, all tokens are signed with a known string. The app deployed at gott-lab.vercel.app may be running this way.

**J. No email verification on registration**
Users can register with any email. No verification flow. The `notas` file mentions "correo de confirmacion para personas recien creadas" as a TODO.

**K. Admin layout allows empleado access but dashboard queries for admin only**
`AdminShell.tsx` strips Navbar on all `/admin` routes. `AdminLayout` requires `isAdmin`. But the nav items include empleado-accessible routes. The middleware allows both admin and empleado to `/panel-empleado` but there's no such route — instead empleados are sent to `/admin` via the Navbar.

### 7.3 Medium Issues

**L. Mixed JS/TS**
`lib/actions/productos.js` and `lib/actions/carrito.js` are plain JavaScript files despite the project being TypeScript. No type safety on server actions.

**M. No error boundaries**
No `error.tsx` or `global-error.tsx` files. Any unhandled error crashes to a blank page.

**N. No loading states (beyond spinners)**
No `loading.tsx` files for route-level Suspense boundaries. Catalog page fetches all data before rendering.

**O. Suboptimal Supabase queries**
`getHeroProductos()` fetches `limit * 2` then slices to `limit` in JS. The `uniqueById` dedup pattern runs in JS memory instead of using Supabase's distinct.

**P. No SEO metadata on product pages**
`layout.tsx` has global metadata but individual product pages don't override with product-specific titles/descriptions/OG tags.

### 7.4 Low / Cosmetic Issues

**Q. Lucide icon imports use deep paths**
Icons are imported from `lucide-react/dist/esm/icons/...` instead of the standard `lucide-react` barrel export. Tree-shaking should handle this, but it's non-standard.

**R. No sitemap or robots.txt**

**S. Bundle includes both @supabase/ssr and @supabase/supabase-js**
Only `@supabase/supabase-js` is actually used. `@supabase/ssr` is an unused dependency.

**T. `CLAUDE.md` just contains `@AGENTS.md`**
Placeholder file with no actual content.

---

## 8. What's Missing (Gap Analysis)

| Feature | Priority | Notes |
|---------|----------|-------|
| Checkout flow | CRITICAL | Address selection → shipping calc → payment → order creation |
| Payment integration | CRITICAL | MercadoPago or WebPay for Chile |
| Shipping calculator | CRITICAL | Correos de Chile API, weight/dimensions on products |
| Wire cart to auth | CRITICAL | Replace ID_CLIENTE_TEMPORAL with actual user ID |
| Fix image rendering | HIGH | Pass actual image URLs from DB to Image components |
| Email verification | HIGH | Registration flow with email confirmation |
| Password reset | MEDIUM | Forgot password flow |
| Admin CRUD | HIGH | All admin pages are stubs — product/order/user management |
| Product image upload | HIGH | No way to upload product images |
| Stock management | MEDIUM | Stock decrement on order, not just reservation |
| Order notifications | MEDIUM | Email to customer + admin on new order |
| SEO optimization | MEDIUM | Per-page metadata, sitemap, OG tags |
| Error handling | MEDIUM | Error boundaries, proper error pages |
| Analytics | LOW | Page views, conversion tracking |
| Terms/Privacy pages | LOW | Linked from register form but don't exist |

---

## 9. Proposed Architecture for Nico's Fork

### 9.1 Immediate decisions needed

**Option A: Ditch Prisma, go full Supabase**
- Delete prisma/ directory
- Use Supabase CLI for type generation
- Keep existing Supabase queries
- Faster to ship, less control over DB

**Option B: Ditch Supabase, go full Prisma + PostgreSQL**
- Migrate existing data to PostgreSQL
- Replace all Supabase calls with Prisma client
- Better type safety, proper migrations
- More work upfront

**Option C: Keep both, use Prisma for admin, Supabase for public**
- Admin CRUD uses Prisma (typed)
- Public catalog queries use Supabase (fast, realtime potential)
- Complex, risk of schema drift

**Recommendation: Option A** for speed. The app already uses Supabase everywhere. Import `supabase gen types` and get full type coverage without migrating.

### 9.2 Priority changes for your fork

1. **Fix the cart** — wire `useAuth().usuario.perfil.id` to replace `ID_CLIENTE_TEMPORAL = 1`
2. **Fix product images** — pass `imagen.url` to `<Image src={...}>` instead of `/placeholder.avif` everywhere
3. **Add peso_gramos** field to `productos` table for shipping calculation
4. **Implement shipping calculation** — Correos de Chile API or flat rate by weight tiers
5. **Add payment integration** — WebPay Plus (Transbank) is standard for Chile
6. **Build checkout flow** — address selection → shipping → payment → order confirmation
7. **Add email verification** — send email with confirmation link on registration
8. **Complete admin panel** — product CRUD, order management, inventory

### 9.3 Shipping Considerations (per your request)

You mentioned wanting to calculate shipping based on package weight. Current schema has NO weight/dimension fields. Add to `productos`:
```sql
ALTER TABLE productos ADD COLUMN peso_gramos INTEGER DEFAULT 500;
ALTER TABLE productos ADD COLUMN requiere_refrigeracion BOOLEAN DEFAULT false;
```

For Correos de Chile, you'll need:
- Product weight aggregation per order
- Packaging weight overlay
- Correos API integration (or a pre-calculated rate table by comuna + weight tier)
- Option for "retiro en tienda" (you mentioned POS/tienda pickup)

For the "solo un envío por semana" model: add a `dia_envio` field to config, batch orders placed Mon-Sun into a single Monday shipment. This needs:
- An order cutoff time (e.g., Sunday 23:59)
- Batch shipping label generation
- Customer notification of shipment day

---

## 10. Environment Variables Needed

```
# Supabase
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=
SUPABASE_SERVICE_ROLE_KEY=

# JWT
JWT_SECRET=

# Database (for Prisma, if used)
DATABASE_URL=

# Payment (future)
MERCADOPAGO_ACCESS_TOKEN=
# or
WEBPAY_COMMERCE_CODE=
WEBPAY_API_KEY=
WEBPAY_ENVIRONMENT=

# Email (future)
SMTP_HOST=
SMTP_PORT=
SMTP_USER=
SMTP_PASS=

# Shipping (future)
CORREOSCHILE_API_KEY=
```

---

## 11. Running Locally

```bash
cd GottLab
cp .env.example .env  # fill in Supabase keys
npm install
npx prisma generate   # generates client (optional, not used)
npm run dev            # starts on localhost:3000
```

---

*Generated by Basaltor (Hermes) on 2026-05-13 for Nico's review.*
