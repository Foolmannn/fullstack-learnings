In **Next.js**, routing is mainly handled by the **App Router** (`app/` directory) in modern Next.js. There is also the older **Pages Router** (`pages/` directory).

I'll explain the **App Router in detail**, then briefly compare it with the Pages Router.

---

# 1. What is routing in Next.js?

Routing means deciding **which UI should be displayed for a particular URL**.

For example:

```text
/                 → Home
/about            → About
/products         → Products
/products/10      → Product 10
/blog/hello       → Blog post "hello"
```

Next.js uses **file-system based routing**.

That means your folder/file structure determines your URLs.

For example:

```text
app/
├── page.tsx
├── about/
│   └── page.tsx
└── products/
    ├── page.tsx
    └── [id]/
        └── page.tsx
```

creates:

```text
/                  → app/page.tsx
/about             → app/about/page.tsx
/products           → app/products/page.tsx
/products/123       → app/products/[id]/page.tsx
```

---

# 2. Basic routing

A minimal Next.js application:

```text
app/
├── page.tsx
├── about/
│   └── page.tsx
└── contact/
    └── page.tsx
```

### `app/page.tsx`

```tsx
export default function Home() {
  return <h1>Home Page</h1>;
}
```

URL:

```text
/
```

### `app/about/page.tsx`

```tsx
export default function About() {
  return <h1>About Page</h1>;
}
```

URL:

```text
/about
```

### `app/contact/page.tsx`

```tsx
export default function Contact() {
  return <h1>Contact Page</h1>;
}
```

URL:

```text
/contact
```

The important rule is:

> **A folder represents a URL segment, and `page.tsx` represents the page for that route.**

---

# 3. Nested routes

You can create routes inside other routes.

```text
app/
└── dashboard/
    ├── page.tsx
    ├── settings/
    │   └── page.tsx
    └── profile/
        └── page.tsx
```

This produces:

```text
/dashboard
/dashboard/settings
/dashboard/profile
```

For example:

```tsx
// app/dashboard/settings/page.tsx

export default function Settings() {
  return <h1>Dashboard Settings</h1>;
}
```

Visiting:

```text
/dashboard/settings
```

renders that component.

---

# 4. Dynamic routes

Dynamic routes are extremely important.

Suppose you have products:

```text
/products/1
/products/2
/products/3
/products/100
```

You don't want to create:

```text
1/page.tsx
2/page.tsx
3/page.tsx
...
```

Instead, use a **dynamic segment**:

```text
app/
└── products/
    └── [id]/
        └── page.tsx
```

The `[id]` means:

> "This part of the URL is dynamic."

Example:

```tsx
export default async function ProductPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  return <h1>Product ID: {id}</h1>;
}
```

Now:

```text
/products/10
```

gives:

```text
Product ID: 10
```

And:

```text
/products/500
```

gives:

```text
Product ID: 500
```

---

# 5. Multiple dynamic parameters

You can have multiple dynamic segments.

```text
app/
└── users/
    └── [userId]/
        └── posts/
            └── [postId]/
                └── page.tsx
```

URL:

```text
/users/25/posts/100
```

You can access both parameters:

```tsx
export default async function PostPage({
  params,
}: {
  params: Promise<{
    userId: string;
    postId: string;
  }>;
}) {
  const { userId, postId } = await params;

  return (
    <div>
      User: {userId}
      <br />
      Post: {postId}
    </div>
  );
}
```

Result:

```text
User: 25
Post: 100
```

---

# 6. Catch-all routes

Sometimes you don't know how many URL segments you'll receive.

For example:

```text
/docs/javascript
/docs/javascript/react
/docs/javascript/react/hooks
```

You can use:

```text
app/
└── docs/
    └── [...slug]/
        └── page.tsx
```

The `[...slug]` syntax is called a **catch-all dynamic segment**.

For:

```text
/docs/javascript/react/hooks
```

you might receive:

```tsx
{
  slug: ["javascript", "react", "hooks"]
}
```

Example:

```tsx
export default async function DocsPage({
  params,
}: {
  params: Promise<{ slug: string[] }>;
}) {
  const { slug } = await params;

  return <h1>{slug.join(" / ")}</h1>;
}
```

Output:

```text
javascript / react / hooks
```

---

# 7. Optional catch-all routes

There's another variation:

```text
[[...slug]]
```

Example:

```text
app/
└── docs/
    └── [[...slug]]/
        └── page.tsx
```

This can match:

```text
/docs
/docs/javascript
/docs/javascript/react
/docs/javascript/react/hooks
```

Difference:

```text
[...slug]
```

requires at least one segment.

```text
[[...slug]]
```

can also match **zero segments**.

---

# 8. Route groups

Sometimes you want to organize your application without adding a URL segment.

Use parentheses:

```text
app/
├── (marketing)/
│   ├── page.tsx
│   └── about/
│       └── page.tsx
└── (dashboard)/
    └── settings/
        └── page.tsx
```

The parentheses create a **route group**.

For example:

```text
app/(marketing)/about/page.tsx
```

still produces:

```text
/about
```

Not:

```text
/(marketing)/about
```

This is useful for organizing large applications.

---

# 9. Layouts

One of the most important features of the App Router is `layout.tsx`.

Suppose:

```text
app/
├── layout.tsx
├── page.tsx
├── about/
│   └── page.tsx
└── dashboard/
    ├── layout.tsx
    ├── page.tsx
    └── settings/
        └── page.tsx
```

The root layout applies to the entire application.

```tsx
export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <header>My Website</header>

        {children}

        <footer>Footer</footer>
      </body>
    </html>
  );
}
```

Then:

```text
/dashboard
/dashboard/settings
```

can have another layout.

```tsx
export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="dashboard">
      <aside>Sidebar</aside>

      <main>{children}</main>
    </div>
  );
}
```

The result conceptually looks like:

```text
RootLayout
   │
   ├── Header
   │
   ├── DashboardLayout
   │      ├── Sidebar
   │      └── Page
   │
   └── Footer
```

Layouts are **nested**.

---

# 10. Navigation with `Link`

For navigation between pages, Next.js provides `Link`.

```tsx
import Link from "next/link";

export default function Home() {
  return (
    <nav>
      <Link href="/">Home</Link>
      <Link href="/about">About</Link>
      <Link href="/dashboard">Dashboard</Link>
    </nav>
  );
}
```

You should generally use `Link` instead of:

```html
<a href="/about">
```

for internal navigation.

`Link` enables Next.js client-side navigation and can provide prefetching benefits.

---

# 11. Dynamic links

Suppose you have products:

```tsx
import Link from "next/link";

const products = [
  { id: 1, name: "Laptop" },
  { id: 2, name: "Phone" },
];

export default function Products() {
  return (
    <div>
      {products.map((product) => (
        <Link
          key={product.id}
          href={`/products/${product.id}`}
        >
          {product.name}
        </Link>
      ))}
    </div>
  );
}
```

This generates:

```text
Laptop → /products/1
Phone  → /products/2
```

---

# 12. Programmatic navigation

Sometimes you need to navigate after an action.

For example:

```text
User submits form
       ↓
Save data
       ↓
Navigate to /dashboard
```

In a Client Component, use `useRouter`.

```tsx
"use client";

import { useRouter } from "next/navigation";

export default function LoginButton() {
  const router = useRouter();

  function handleLogin() {
    // Login logic

    router.push("/dashboard");
  }

  return (
    <button onClick={handleLogin}>
      Login
    </button>
  );
}
```

Common methods include:

```tsx
router.push("/dashboard");
```

Navigate to another page.

```tsx
router.replace("/dashboard");
```

Navigate without keeping the current route in browser history.

```tsx
router.back();
```

Go back.

```tsx
router.forward();
```

Go forward.

```tsx
router.refresh();
```

Request a refresh of the current route's server-rendered data/UI.

---

# 13. `usePathname`

You can get the current pathname in a Client Component:

```tsx
"use client";

import { usePathname } from "next/navigation";

export default function Navigation() {
  const pathname = usePathname();

  return <p>Current route: {pathname}</p>;
}
```

If the user visits:

```text
/products/10
```

then:

```tsx
pathname
```

is:

```text
/products/10
```

This is useful for active navigation links.

---

# 14. Query parameters

Query parameters are different from dynamic route parameters.

Example:

```text
/products?category=phone&sort=price
```

Here:

```text
/products
```

is the pathname.

And:

```text
category=phone
sort=price
```

are query/search parameters.

In a Server Component:

```tsx
export default async function ProductsPage({
  searchParams,
}: {
  searchParams: Promise<{
    category?: string;
    sort?: string;
  }>;
}) {
  const params = await searchParams;

  return (
    <div>
      Category: {params.category}
      <br />
      Sort: {params.sort}
    </div>
  );
}
```

URL:

```text
/products?category=phone&sort=price
```

Result:

```text
Category: phone
Sort: price
```

---

# 15. Reading query parameters in Client Components

Use `useSearchParams`.

```tsx
"use client";

import { useSearchParams } from "next/navigation";

export default function Products() {
  const searchParams = useSearchParams();

  const category = searchParams.get("category");

  return <p>Category: {category}</p>;
}
```

For:

```text
/products?category=phone
```

you get:

```text
phone
```

---

# 16. Dynamic params vs query params

This distinction is very important.

### Dynamic route

```text
/products/123
```

Folder:

```text
products/[id]
```

Parameter:

```text
id = 123
```

### Query parameter

```text
/products?id=123
```

Folder:

```text
products
```

Parameter:

```text
id = 123
```

They are different mechanisms.

Generally:

```text
/products/123
```

is useful when `123` identifies the resource itself.

```text
/products?category=phones
```

is useful for filtering, searching, sorting, pagination, etc.

---

# 17. Route handlers / API routes

Next.js routing isn't only for UI pages.

You can create backend API endpoints using `route.ts`.

Example:

```text
app/
└── api/
    └── users/
        └── route.ts
```

This creates:

```text
/api/users
```

Example:

```tsx
import { NextResponse } from "next/server";

export async function GET() {
  return NextResponse.json({
    users: ["John", "Alice"],
  });
}
```

Now:

```text
GET /api/users
```

returns JSON.

You can also handle POST:

```tsx
export async function POST(request: Request) {
  const body = await request.json();

  return NextResponse.json({
    message: "User created",
    data: body,
  });
}
```

So:

```text
app/api/users/route.ts
```

can contain:

```text
GET
POST
PUT
PATCH
DELETE
```

handlers.

---

# 18. Static and dynamic routes

Next.js can determine whether a route can be statically rendered or needs dynamic behavior based on what the route does and the APIs it uses.

For example:

```tsx
export default function About() {
  return <h1>About</h1>;
}
```

doesn't require request-specific information.

But a route that depends on request-specific data, such as certain cookies or headers, may need dynamic rendering.

This is one reason the App Router is more than simply "folders become URLs": **rendering behavior is integrated with the routing system.**

---

# 19. Loading UI

You can create:

```text
app/
└── dashboard/
    ├── page.tsx
    └── loading.tsx
```

`loading.tsx` provides a loading UI while the route's content is being loaded.

Example:

```tsx
export default function Loading() {
  return <p>Loading dashboard...</p>;
}
```

This is especially useful when your page performs asynchronous data fetching.

---

# 20. Error handling

You can also create:

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
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div>
      <h2>Something went wrong.</h2>

      <button onClick={() => reset()}>
        Try again
      </button>
    </div>
  );
}
```

`error.tsx` must be a Client Component.

---

# 21. Not-found routes

You can create:

```text
app/
└── not-found.tsx
```

for a global not-found UI.

You can also have route-specific `not-found.tsx` files.

For example:

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

If the product doesn't exist, Next.js renders the appropriate not-found UI.

---

# 22. Redirects

You can redirect from a Server Component or server-side code using `redirect`.

```tsx
import { redirect } from "next/navigation";

export default function Dashboard() {
  const isLoggedIn = false;

  if (!isLoggedIn) {
    redirect("/login");
  }

  return <h1>Dashboard</h1>;
}
```

The flow is:

```text
/dashboard
     ↓
Is user logged in?
     ↓
   No
     ↓
/login
```

For permanent/temporary URL redirects at the configuration level, Next.js also supports redirects in `next.config.js`.

---

# 23. Middleware / Proxy-style request handling

Historically, Next.js has used `middleware.ts` for request interception. In newer Next.js versions, the request interception feature is being transitioned toward the `proxy.ts` convention.

The idea is that a request can be inspected before it reaches the route.

Typical use cases include:

```text
Authentication
Authorization
Redirects
Rewrites
Locale detection
Request-based routing
```

For example, conceptually:

```text
Request
   ↓
Proxy / middleware
   ↓
Check authentication
   ↓
Route
```

The exact APIs and conventions depend on the Next.js version you're using, so this is one area where checking the current Next.js documentation is worthwhile.

---

# 24. Parallel routes

App Router supports **parallel routes**, which allow multiple UI sections to be rendered independently within the same layout.

You use `@folder` syntax.

Example:

```text
app/
└── dashboard/
    ├── layout.tsx
    ├── page.tsx
    ├── @analytics/
    │   └── page.tsx
    └── @team/
        └── page.tsx
```

You can think of it as:

```text
Dashboard
├── Analytics
└── Team
```

being rendered as separate route slots.

This is useful for complex dashboards and independently navigable UI sections.

---

# 25. Intercepting routes

App Router also supports **intercepting routes**.

These are useful for patterns such as:

```text
Gallery
   ↓
Click image
   ↓
Open image as modal
```

while still having a real URL for the image page.

The special folder conventions include:

```text
(.)
(..)
(..)(..)
(...)
```

They allow one route to intercept another route's rendering within a particular navigation context.

This is an advanced feature, but it's particularly useful for modal-based navigation.

---

# 26. Route groups + layouts

A real application might look like:

```text
app/
├── layout.tsx
│
├── (marketing)/
│   ├── layout.tsx
│   ├── page.tsx
│   ├── about/
│   │   └── page.tsx
│   └── pricing/
│       └── page.tsx
│
└── (dashboard)/
    ├── layout.tsx
    ├── dashboard/
    │   ├── page.tsx
    │   ├── settings/
    │   │   └── page.tsx
    │   └── users/
    │       └── page.tsx
```

URLs:

```text
/
/about
/pricing
/dashboard
/dashboard/settings
/dashboard/users
```

Notice that:

```text
(marketing)
(dashboard)
```

don't appear in the URL.

This is a very common way to structure larger applications.

---

# 27. Complete example

Imagine you're building an e-commerce application.

You might structure it like this:

```text
app/
│
├── layout.tsx
├── page.tsx
│
├── products/
│   ├── page.tsx
│   └── [id]/
│       └── page.tsx
│
├── categories/
│   └── [category]/
│       └── page.tsx
│
├── cart/
│   └── page.tsx
│
├── account/
│   ├── layout.tsx
│   ├── page.tsx
│   ├── orders/
│   │   └── page.tsx
│   └── settings/
│       └── page.tsx
│
└── api/
    └── products/
        └── route.ts
```

This gives:

```text
/                           Home
/products                   All products
/products/123               Product 123
/categories/electronics    Electronics
/cart                       Cart
/account                    Account
/account/orders             Orders
/account/settings           Settings
/api/products               Products API
```

That's the core mental model you need.

---

# 28. App Router vs Pages Router

Next.js has two routing systems.

| Feature                  | App Router              | Pages Router          |
| ------------------------ | ----------------------- | --------------------- |
| Directory                | `app/`                  | `pages/`              |
| Main page file           | `page.tsx`              | `index.tsx`           |
| Dynamic route            | `[id]`                  | `[id]`                |
| Layout system            | Built-in nested layouts | Usually custom        |
| Server Components        | Supported               | Not the same model    |
| Route handlers           | `route.ts`              | API routes            |
| Loading UI               | `loading.tsx`           | Usually custom        |
| Error UI                 | `error.tsx`             | `_error.tsx` / custom |
| Recommended for new apps | Yes                     | Mainly existing apps  |

If you're learning Next.js today, **learn the App Router first**.

---

# 29. The most important routing concepts

If you're preparing for interviews or building projects, understand these especially well:

```text
1. Static routes
2. Nested routes
3. Dynamic routes
4. Catch-all routes
5. Optional catch-all routes
6. Route groups
7. Layouts
8. Link navigation
9. Programmatic navigation
10. Query parameters
11. Route handlers
12. Loading states
13. Error handling
14. notFound()
15. redirect()
16. Parallel routes
17. Intercepting routes
18. Authentication/authorization around routes
```

The fundamental pattern to remember is:

```text
app/
│
├── page.tsx                  → /
│
├── about/
│   └── page.tsx              → /about
│
├── products/
│   ├── page.tsx              → /products
│   └── [id]/
│       └── page.tsx          → /products/:id
│
└── blog/
    └── [...slug]/
        └── page.tsx          → /blog/*
```

Once this folder-to-URL relationship is clear, most Next.js routing becomes much easier to understand.
