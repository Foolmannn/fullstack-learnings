 In the **Next.js App Router**, there are several **special files** that have predefined meanings. Once you understand these, the `app/` directory becomes much easier to reason about.

# Next.js App Router special files

A typical route might look like:

```text
app/
└── dashboard/
    ├── page.tsx
    ├── layout.tsx
    ├── loading.tsx
    ├── error.tsx
    ├── not-found.tsx
    ├── template.tsx
    └── default.tsx
```

Each file has a specific purpose.

---

# 1. `page.tsx` — UI for a route

This is the most fundamental special file.

```text
app/
├── page.tsx
├── about/
│   └── page.tsx
└── dashboard/
    └── page.tsx
```

Produces:

```text
/               → app/page.tsx
/about          → app/about/page.tsx
/dashboard      → app/dashboard/page.tsx
```

Example:

```tsx
export default function DashboardPage() {
  return <h1>Dashboard</h1>;
}
```

### Important

A folder by itself does **not** automatically become a public page.

```text
app/dashboard/
```

doesn't create a route until you have:

```text
app/dashboard/page.tsx
```

---

# 2. `layout.tsx` — shared UI

`layout.tsx` is used for UI that should remain shared across multiple pages.

Example:

```text
app/
├── layout.tsx
├── page.tsx
└── dashboard/
    ├── layout.tsx
    ├── page.tsx
    └── settings/
        └── page.tsx
```

The root layout:

```tsx
export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <header>My App</header>

        {children}

        <footer>Footer</footer>
      </body>
    </html>
  );
}
```

The dashboard layout:

```tsx
export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <section>
      <aside>Dashboard Sidebar</aside>

      <main>{children}</main>
    </section>
  );
}
```

The structure becomes:

```text
Root Layout
│
├── Header
│
├── Dashboard Layout
│   ├── Sidebar
│   └── Page
│
└── Footer
```

### Layouts are persistent

When navigating between pages inside the same layout hierarchy, Next.js can preserve the layout rather than recreating it.

That's useful for:

* navigation bars
* sidebars
* authentication shells
* dashboards
* shared providers
* common page structure

---

# 3. `template.tsx` — like a layout, but recreated

`template.tsx` looks similar to `layout.tsx`:

```tsx
export default function Template({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div>
      {children}
    </div>
  );
}
```

But there is an important difference.

### Layout

```text
Layout
   ↓
persists between navigation
```

### Template

```text
Template
   ↓
new instance on navigation
```

Think:

```text
layout.tsx
    → persistent shell

template.tsx
    → fresh wrapper
```

Templates can be useful when you specifically want things such as:

* animations to restart
* state inside the template to reset
* effects to run again when navigating

Example:

```text
dashboard/
├── layout.tsx
└── template.tsx
```

The hierarchy is roughly:

```text
Layout
  ↓
Template
  ↓
Page
```

---

# 4. `loading.tsx` — loading UI

`loading.tsx` provides a loading state for a route segment.

```text
app/
└── dashboard/
    ├── page.tsx
    └── loading.tsx
```

Example:

```tsx
export default function Loading() {
  return <p>Loading dashboard...</p>;
}
```

When the dashboard is waiting for its content:

```text
User navigates
      ↓
loading.tsx
      ↓
page.tsx
```

This works particularly well with React Server Components and streaming.

### Example

```tsx
export default async function Dashboard() {
  const data = await getDashboardData();

  return <DashboardUI data={data} />;
}
```

While that server-side work is pending, the route can show:

```text
Loading dashboard...
```

instead of leaving the user staring at a blank screen.

---

# 5. `error.tsx` — error boundary

We've discussed this already, but it's one of the most important special files.

```text
app/
└── dashboard/
    ├── page.tsx
    └── error.tsx
```

Example:

```tsx
"use client";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div>
      <h2>Something went wrong.</h2>

      <button onClick={reset}>
        Try again
      </button>
    </div>
  );
}
```

It handles unexpected errors within the relevant route segment.

Remember:

```text
error.tsx
    ↓
unexpected runtime errors
```

---

# 6. `global-error.tsx` — root-level error UI

```text
app/
├── layout.tsx
└── global-error.tsx
```

This is for errors that occur at the root level, including problems involving the root layout.

Example:

```tsx
"use client";

export default function GlobalError() {
  return (
    <html>
      <body>
        <h1>Something went wrong</h1>
      </body>
    </html>
  );
}
```

Because it can replace the root layout, it must define the HTML document structure itself.

Think:

```text
error.tsx
    ↓
route-level error

global-error.tsx
    ↓
root-level error
```

---

# 7. `not-found.tsx` — 404 UI

`not-found.tsx` handles resources that don't exist.

```text
app/
└── products/
    └── [id]/
        ├── page.tsx
        └── not-found.tsx
```

Example:

```tsx
export default function NotFound() {
  return (
    <div>
      <h1>Product not found</h1>
      <p>This product doesn't exist.</p>
    </div>
  );
}
```

Then:

```tsx
import { notFound } from "next/navigation";

export default async function ProductPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const product = await getProduct(id);

  if (!product) {
    notFound();
  }

  return <h1>{product.name}</h1>;
}
```

The flow:

```text
/products/123
      ↓
Find product
      ↓
Product doesn't exist
      ↓
notFound()
      ↓
not-found.tsx
```

---

# 8. `global-not-found.tsx`

In current Next.js versions, there is also a **global 404 mechanism** called `global-not-found.tsx`, which is distinct from route-level `not-found.tsx`.

It is particularly useful for applications with complex routing structures, such as multiple root layouts.

Conceptually:

```text
global-not-found.tsx
        ↓
application-wide unmatched route
```

It can serve as a global 404 page without going through the normal layout rendering hierarchy.

Because this feature has had version-specific behavior and configuration requirements, check the documentation for the Next.js version you're using before implementing it.

---

# 9. `route.ts` — API / Route Handler

This is another major special file.

```text
app/
└── api/
    └── users/
        └── route.ts
```

creates:

```text
/api/users
```

Example:

```tsx
import { NextResponse } from "next/server";

export async function GET() {
  return NextResponse.json({
    users: ["Alice", "Bob"],
  });
}
```

You can define HTTP methods:

```tsx
export async function GET() {}

export async function POST() {}

export async function PUT() {}

export async function PATCH() {}

export async function DELETE() {}
```

For example:

```tsx
export async function POST(request: Request) {
  const body = await request.json();

  return Response.json({
    success: true,
    data: body,
  });
}
```

### `page.tsx` vs `route.ts`

This distinction is important:

```text
page.tsx
    ↓
UI

route.ts
    ↓
HTTP endpoint
```

You generally cannot have both a `page.tsx` and `route.ts` serving the exact same route segment.

---

# 10. `default.tsx` — parallel route fallback

`default.tsx` is primarily associated with **Parallel Routes**.

Suppose:

```text
app/
└── dashboard/
    ├── layout.tsx
    ├── page.tsx
    ├── @analytics/
    │   └── page.tsx
    └── @team/
        ├── page.tsx
        └── default.tsx
```

Parallel routes use named slots:

```text
@analytics
@team
```

Your layout might receive them:

```tsx
export default function DashboardLayout({
  children,
  analytics,
  team,
}: {
  children: React.ReactNode;
  analytics: React.ReactNode;
  team: React.ReactNode;
}) {
  return (
    <div>
      {children}

      <section>
        {analytics}
      </section>

      <section>
        {team}
      </section>
    </div>
  );
}
```

`default.tsx` provides fallback UI when Next.js doesn't have a matching page for a parallel route during certain navigation/initial-load situations.

This is an **advanced routing feature**.

---

# 11. `middleware.ts` / `proxy.ts`

This one needs special attention because the naming has changed across recent Next.js versions.

Historically:

```text
middleware.ts
```

was used for request interception.

In newer Next.js versions, the convention is moving toward:

```text
proxy.ts
```

The purpose is broadly to intercept/process requests before they reach the final route.

Typical use cases:

```text
Authentication
Authorization
Redirects
Rewrites
Locale detection
Request-based routing
```

Conceptually:

```text
Browser
   ↓
proxy.ts
   ↓
Check request
   ↓
Redirect / rewrite / continue
   ↓
Route
```

For example, an authenticated dashboard might conceptually work as:

```text
/dashboard
     ↓
proxy
     ↓
Is user authenticated?
   /       \
  yes       no
   ↓         ↓
dashboard   /login
```

Because the exact file name and APIs depend on the Next.js version, use the convention supported by your installed version.

---

# 12. Route Groups: `(group)`

This isn't a file, but it's an important special routing convention.

```text
app/
├── (marketing)/
│   ├── page.tsx
│   └── pricing/
│       └── page.tsx
│
└── (dashboard)/
    └── settings/
        └── page.tsx
```

The parentheses mean:

> Don't include this folder in the URL.

Therefore:

```text
app/(marketing)/pricing/page.tsx
```

becomes:

```text
/pricing
```

not:

```text
/(marketing)/pricing
```

This is excellent for organizing large projects.

---

# 13. Dynamic route folders: `[id]`

Again, not a file, but another important convention.

```text
app/
└── products/
    └── [id]/
        └── page.tsx
```

matches:

```text
/products/1
/products/2
/products/100
```

You receive:

```tsx
const { id } = await params;
```

---

# 14. Catch-all: `[...slug]`

```text
app/
└── docs/
    └── [...slug]/
        └── page.tsx
```

matches:

```text
/docs/javascript
/docs/javascript/react
/docs/javascript/react/hooks
```

The parameter becomes an array:

```tsx
{
  slug: ["javascript", "react", "hooks"]
}
```

---

# 15. Optional catch-all: `[[...slug]]`

```text
app/
└── docs/
    └── [[...slug]]/
        └── page.tsx
```

Can match:

```text
/docs
/docs/javascript
/docs/javascript/react
```

Difference:

```text
[...slug]
```

requires at least one segment.

```text
[[...slug]]
```

allows zero or more segments.

---

# 16. Parallel route folders: `@folder`

Parallel routes use:

```text
@analytics
@team
@notifications
```

Example:

```text
app/
└── dashboard/
    ├── layout.tsx
    ├── @analytics/
    │   └── page.tsx
    └── @team/
        └── page.tsx
```

This lets one layout render multiple independent UI slots.

Think:

```text
Dashboard
├───────────────┐
│               │
Analytics      Team
│               │
└───────────────┘
```

---

# 17. Intercepting route conventions

Next.js has special folder conventions for intercepting routes:

```text
(.)
(..)
(..)(..)
(...)
```

These allow a route to be rendered in the context of another route.

A common example is a photo gallery.

Normal navigation:

```text
/gallery/photo/123
```

might display a full page.

But clicking the photo from `/gallery` could display:

```text
/gallery
     +
 photo modal
```

while the URL still becomes:

```text
/gallery/photo/123
```

This gives you the combination of:

```text
URL navigation
+
modal UI
```

It's an advanced App Router feature.

---

# 18. Metadata files

Next.js also has **special metadata files**.

For example:

```text
app/
├── favicon.ico
├── robots.txt
├── sitemap.xml
└── opengraph-image.png
```

These can be used for SEO and social sharing.

There are also programmatic metadata APIs using:

```tsx
export const metadata = {
  title: "My Website",
  description: "My website description",
};
```

and:

```tsx
export async function generateMetadata() {
  return {
    title: "Dynamic Page",
  };
}
```

These aren't route UI files, but they're an important part of Next.js's file conventions.

---

# 19. `favicon.ico`

You can put:

```text
app/favicon.ico
```

in your App Router project.

Next.js can use it as the site's favicon.

You can also use other supported icon conventions such as:

```text
icon.png
icon.svg
```

depending on your setup and requirements.

---

# 20. `robots.txt`

You can create:

```text
app/robots.txt
```

or generate it programmatically with:

```text
app/robots.ts
```

Example:

```tsx
import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
    },
    sitemap: "https://example.com/sitemap.xml",
  };
}
```

This controls instructions intended for search-engine crawlers.

---

# 21. `sitemap.xml`

You can use:

```text
app/sitemap.ts
```

Example:

```tsx
import type { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    {
      url: "https://example.com",
      lastModified: new Date(),
    },
    {
      url: "https://example.com/about",
      lastModified: new Date(),
    },
  ];
}
```

Next.js can generate the sitemap from this.

For a large application, you can generate entries dynamically from your database/CMS.

---

# 22. `opengraph-image`

You can create special Open Graph images such as:

```text
app/
├── opengraph-image.png
```

or generate them dynamically using the supported metadata image APIs.

These are used when your URL is shared on platforms that consume Open Graph metadata.

Conceptually:

```text
User shares:
https://example.com/products/123

        ↓

Social platform reads metadata

        ↓

Title
Description
Preview image
```

You can also have route-specific images:

```text
app/
└── products/
    └── [id]/
        └── opengraph-image.tsx
```

This can be particularly useful for dynamic product/article previews.

---

# 23. `manifest.ts`

For web-app/PWA-style metadata, you can use:

```text
app/manifest.ts
```

Example:

```tsx
import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "My App",
    short_name: "MyApp",
    description: "My awesome application",
    start_url: "/",
    display: "standalone",
  };
}
```

This generates a web app manifest.

---

# 24. Special files summary

Here's the cheat sheet I'd memorize:

| File / convention      | Purpose                                        |
| ---------------------- | ---------------------------------------------- |
| `page.tsx`             | UI for a route                                 |
| `layout.tsx`           | Persistent shared UI                           |
| `template.tsx`         | Shared UI recreated during navigation          |
| `loading.tsx`          | Loading UI                                     |
| `error.tsx`            | Route-segment error boundary                   |
| `global-error.tsx`     | Root-level error UI                            |
| `not-found.tsx`        | 404 UI for a segment                           |
| `global-not-found.tsx` | Application-wide 404 handling                  |
| `route.ts`             | HTTP Route Handler/API                         |
| `default.tsx`          | Fallback for Parallel Routes                   |
| `proxy.ts`             | Request interception in newer Next.js versions |
| `middleware.ts`        | Older request-interception convention          |
| `(group)`              | Route group; doesn't affect URL                |
| `[id]`                 | Dynamic segment                                |
| `[...slug]`            | Catch-all segment                              |
| `[[...slug]]`          | Optional catch-all                             |
| `@slot`                | Parallel Route slot                            |
| `(.)`, `(..)`, etc.    | Intercepting Routes                            |
| `favicon.ico`          | Favicon                                        |
| `robots.ts`            | Robots metadata                                |
| `sitemap.ts`           | Sitemap generation                             |
| `manifest.ts`          | Web app manifest                               |
| `opengraph-image.*`    | Social preview image                           |

---

# 25. How they fit together

Imagine this application:

```text
app/
│
├── layout.tsx
├── page.tsx
├── loading.tsx
├── error.tsx
├── not-found.tsx
│
├── products/
│   ├── page.tsx
│   ├── loading.tsx
│   ├── error.tsx
│   │
│   └── [id]/
│       ├── page.tsx
│       ├── loading.tsx
│       ├── error.tsx
│       ├── not-found.tsx
│       └── opengraph-image.tsx
│
├── dashboard/
│   ├── layout.tsx
│   ├── page.tsx
│   ├── template.tsx
│   ├── loading.tsx
│   └── error.tsx
│
├── api/
│   └── users/
│       └── route.ts
│
├── robots.ts
├── sitemap.ts
└── manifest.ts
```

You can think about the request lifecycle like this:

```text
                     Request
                        │
                        ▼
                  proxy / middleware
                        │
                        ▼
                   Route matching
                        │
             ┌──────────┴──────────┐
             │                     │
          page.tsx              route.ts
             │                     │
             ▼                     ▼
           UI/API              HTTP response
             │
       ┌─────┼─────────┐
       │     │         │
       ▼     ▼         ▼
   loading  error   not-found
```

And around the page:

```text
layout.tsx
     │
     ▼
template.tsx
     │
     ▼
page.tsx
```

This is the **core architecture of Next.js App Router routing**.

### What I would learn next

If you're learning Next.js systematically, the best order is:

```text
1. page.tsx
2. layout.tsx
3. Link + useRouter
4. Dynamic routes [id]
5. searchParams
6. loading.tsx
7. error.tsx
8. not-found.tsx
9. route.ts
10. Route Groups
11. Authentication + proxy
12. Parallel Routes
13. Intercepting Routes
14. Metadata / SEO
```

The first 9 are the ones you'll use constantly; **Parallel Routes and Intercepting Routes are advanced features** that are worth learning after you're comfortable with the fundamentals.
