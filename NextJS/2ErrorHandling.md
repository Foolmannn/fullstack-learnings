In **Next.js App Router**, error handling is built around special files such as **`error.tsx`**, **`not-found.tsx`**, and **`global-error.tsx`**.

A good mental model is:

```text
Request
   ↓
Page / Server Component
   ↓
Something goes wrong?
   ├── Expected error → handle it normally
   ├── Unexpected error → error.tsx
   ├── Resource doesn't exist → notFound()
   └── Root layout error → global-error.tsx
```

## 1. `error.tsx` — handling runtime errors

Suppose you have:

```text
app/
├── dashboard/
│   ├── page.tsx
│   └── error.tsx
```

If something throws inside `dashboard/page.tsx`, Next.js can render `dashboard/error.tsx`.

### `page.tsx`

```tsx
export default async function Dashboard() {
  const data = await getDashboardData();

  return <h1>{data.title}</h1>;
}
```

If `getDashboardData()` throws an error, the error boundary can catch it.

### `error.tsx`

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
      <h2>Something went wrong!</h2>

      <button onClick={() => reset()}>
        Try again
      </button>
    </div>
  );
}
```

Important:

> `error.tsx` must be a **Client Component**, so it needs `"use client"`.

---

# 2. What is `reset()`?

`reset()` attempts to re-render the failed route segment.

For example:

```tsx
<button onClick={() => reset()}>
  Try again
</button>
```

The flow is:

```text
/dashboard
     ↓
Server Component
     ↓
Error occurs
     ↓
error.tsx
     ↓
User clicks "Try again"
     ↓
reset()
     ↓
Route tries again
```

This is useful for temporary problems such as failed network requests.

---

# 3. Error boundaries are segment-based

Consider:

```text
app/
├── layout.tsx
├── page.tsx
│
└── dashboard/
    ├── layout.tsx
    ├── page.tsx
    └── error.tsx
```

The `dashboard/error.tsx` boundary handles errors occurring within that route segment and its descendants.

Conceptually:

```text
Root Layout
│
├── Home
│
└── Dashboard
    │
    ├── Dashboard Layout
    │
    ├── Dashboard Page
    │
    └── Error Boundary
```

This allows you to make errors **local** instead of replacing your entire application UI.

---

# 4. `global-error.tsx`

For errors involving the root layout itself, Next.js provides:

```text
app/
├── layout.tsx
└── global-error.tsx
```

Example:

```tsx
"use client";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <html>
      <body>
        <h1>Something went wrong!</h1>

        <button onClick={() => reset()}>
          Try again
        </button>
      </body>
    </html>
  );
}
```

Unlike normal `error.tsx`, a global error UI needs to provide its own `<html>` and `<body>` because it replaces the root layout.

---

# 5. `notFound()` is different from `error.tsx`

Suppose you have:

```text
/products/123
```

but product `123` doesn't exist.

That's not necessarily a server error.

It's a **404**.

Use:

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

Then create:

```text
app/
├── products/
│   ├── [id]/
│   │   ├── page.tsx
│   │   └── not-found.tsx
```

### `not-found.tsx`

```tsx
export default function NotFound() {
  return (
    <div>
      <h1>Product not found</h1>
      <p>The product you're looking for doesn't exist.</p>
    </div>
  );
}
```

So:

```text
Unexpected failure
       ↓
   error.tsx

Resource doesn't exist
       ↓
   notFound()
       ↓
 not-found.tsx
```

---

# 6. Global `not-found.tsx`

You can also create:

```text
app/
├── not-found.tsx
├── layout.tsx
└── page.tsx
```

This provides a general 404 UI for the application.

Example:

```tsx
export default function NotFound() {
  return (
    <main>
      <h1>404</h1>
      <p>Page not found.</p>
    </main>
  );
}
```

If someone visits:

```text
/something-that-does-not-exist
```

they can see this UI.

---

# 7. Handling API errors

Suppose you're fetching data:

```tsx
const response = await fetch("/api/products");

if (!response.ok) {
  throw new Error("Failed to fetch products");
}
```

If that error propagates through a route segment, an appropriate `error.tsx` boundary can handle it.

But you should distinguish **expected failures** from **unexpected exceptions**.

For example, an invalid form submission might be expected:

```text
Invalid email
Password too short
Username already exists
```

Those shouldn't necessarily become a generic "Something went wrong" page.

Instead, return structured information to the UI and display the validation error near the form.

---

# 8. Expected vs unexpected errors

This distinction is very important in Next.js.

### Expected error

```text
User enters invalid email
          ↓
Validation fails
          ↓
Show "Invalid email"
```

You generally handle this explicitly.

### Unexpected error

```text
Database crashes
API unexpectedly fails
Programming bug
Unhandled exception
          ↓
error.tsx
```

You generally let the error boundary handle this.

Think:

```text
Expected → UI handles it

Unexpected → Error boundary handles it
```

---

# 9. Error handling in Server Components

Example:

```tsx
export default async function UsersPage() {
  const response = await fetch("https://example.com/api/users");

  if (!response.ok) {
    throw new Error("Unable to fetch users");
  }

  const users = await response.json();

  return (
    <ul>
      {users.map((user: any) => (
        <li key={user.id}>{user.name}</li>
      ))}
    </ul>
  );
}
```

If the error isn't handled locally, it can propagate to the nearest `error.tsx`.

Structure:

```text
app/
└── users/
    ├── page.tsx
    └── error.tsx
```

---

# 10. Error handling in Client Components

Client Components can also have errors handled by an appropriate error boundary.

For example:

```tsx
"use client";

export default function Profile() {
  const user = getUser();

  if (!user) {
    throw new Error("User unavailable");
  }

  return <h1>{user.name}</h1>;
}
```

The nearest applicable error boundary can display the error UI.

---

# 11. Logging errors

You shouldn't expose sensitive internal error details to users.

Instead of showing:

```text
Database connection failed:
postgres://admin:password@...
```

show:

```text
Something went wrong. Please try again.
```

while logging the actual error internally.

For example:

```tsx
"use client";

import { useEffect } from "react";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

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

In production, you would typically send the error to an error-monitoring system rather than relying only on `console.error`.

---

# 12. The `digest` property

Next.js may provide:

```tsx
error.digest
```

on an error.

Example:

```tsx
console.error(error.digest);
```

A digest can help correlate an error shown to the user with server-side logs.

Don't treat it as the actual error message or expose sensitive server details to the client.

---

# 13. `loading.tsx` vs `error.tsx` vs `not-found.tsx`

These three are easy to confuse.

### `loading.tsx`

Used while content is loading:

```text
Request
  ↓
Loading
  ↓
Page
```

### `error.tsx`

Used when an unexpected error occurs:

```text
Request
  ↓
Page
  ↓
ERROR
  ↓
error.tsx
```

### `not-found.tsx`

Used when the requested resource doesn't exist:

```text
Request
  ↓
Find product
  ↓
Not found
  ↓
not-found.tsx
```

---

# 14. A realistic folder structure

A production application could look like:

```text
app/
│
├── layout.tsx
├── page.tsx
├── error.tsx
├── global-error.tsx
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
│       └── not-found.tsx
│
└── dashboard/
    ├── layout.tsx
    ├── page.tsx
    ├── loading.tsx
    └── error.tsx
```

Now different failures can have different UI.

```text
/products
    ↓
products/error.tsx

/products/123
    ↓
product error
    ↓
products/[id]/error.tsx

/products/999
    ↓
product doesn't exist
    ↓
products/[id]/not-found.tsx

Entire root layout fails
    ↓
global-error.tsx
```

---

# 15. Very important: don't use `try/catch` everywhere

You might be tempted to do:

```tsx
try {
  const data = await fetchData();
} catch (error) {
  return <p>Error</p>;
}
```

everywhere.

That's not always necessary.

For unexpected errors, it's often cleaner to allow the error to propagate to your route's `error.tsx`.

Use `try/catch` when you actually want to **recover from or transform an error**.

For example:

```tsx
try {
  await saveUser();
} catch {
  return {
    success: false,
    message: "Unable to save user",
  };
}
```

That's different from simply catching every exception and rendering a generic error.

---

# 16. The complete mental model

Think of Next.js error handling like this:

```text
                       Request
                          │
                          ▼
                     Route/Page
                          │
              ┌───────────┴───────────┐
              │                       │
          Resource?              Unexpected error?
              │                       │
        ┌─────┴─────┐                 │
        │           │                 ▼
      Found       Missing          error.tsx
        │           │
        │           ▼
        │      notFound()
        │           │
        │           ▼
        │      not-found.tsx
        │
        ▼
      Render
```

And for the whole application:

```text
error.tsx
    ↓
local route/segment error

global-error.tsx
    ↓
root-level error

not-found.tsx
    ↓
404

loading.tsx
    ↓
loading state
```

### For interviews, remember these four:

**`error.tsx`** → unexpected runtime errors
**`not-found.tsx`** → 404 / missing resource
**`global-error.tsx`** → root-level errors
**`loading.tsx`** → loading UI

And the most important practical distinction is:

> **Don't treat every failed operation as an `error.tsx` problem. Expected errors such as validation failures should usually be represented as normal application state; unexpected exceptions should be allowed to reach an error boundary.**
