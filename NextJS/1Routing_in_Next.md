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
