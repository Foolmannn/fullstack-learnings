# Database Connection in Next.js

In Next.js, database connection depends on:

* Which database you use
* Whether you use App Router or Pages Router
* Whether you use ORM or raw queries

---

# 1. Common Databases Used with Next.js

| Database   | Type    | Popular Driver/ORM      |
| ---------- | ------- | ----------------------- |
| MongoDB    | NoSQL   | Mongoose                |
| MySQL      | SQL     | mysql2 / Prisma         |
| PostgreSQL | SQL     | pg / Prisma             |
| SQLite     | File DB | Prisma / better-sqlite3 |

---

# 2. Basic Architecture

Frontend (React UI) → API Route / Server Action → Database

```text
User → Next.js Route → DB Query → Response
```

In Next.js:

* Database code should run on the **server**
* Never expose DB passwords to frontend
* Use `.env.local` for secrets

---

# 3. Environment Variables

Create:

```bash
.env.local
```

Example:

```env
DATABASE_URL="mongodb://localhost:27017/mydb"
```

or

```env
DATABASE_URL="postgresql://user:password@localhost:5432/mydb"
```

Access it:

```js
process.env.DATABASE_URL
```

---

# 4. MongoDB Connection Example

Install:

```bash
npm install mongoose
```

---

## Create DB Connection File

```bash
lib/db.js
```

```js
import mongoose from "mongoose";

const MONGODB_URI = process.env.DATABASE_URL;

if (!MONGODB_URI) {
  throw new Error("Please define DATABASE_URL");
}

let cached = global.mongoose;

if (!cached) {
  cached = global.mongoose = {
    conn: null,
    promise: null,
  };
}

async function connectDB() {
  if (cached.conn) {
    return cached.conn;
  }

  if (!cached.promise) {
    cached.promise = mongoose.connect(MONGODB_URI, {
      bufferCommands: false,
    });
  }

  cached.conn = await cached.promise;
  return cached.conn;
}

export default connectDB;
```

---

## Why This Pattern?

In development, Next.js reloads frequently.

Without caching:

* Multiple DB connections are created
* MongoDB may crash or slow down

This caching pattern avoids reconnecting repeatedly.

---

# 5. Using Connection in API Route

App Router:

```bash
app/api/users/route.js
```

```js
import connectDB from "@/lib/db";
import User from "@/models/User";

export async function GET() {
  await connectDB();

  const users = await User.find();

  return Response.json(users);
}
```

---

# 6. User Model Example

```bash
models/User.js
```

```js
import mongoose from "mongoose";

const UserSchema = new mongoose.Schema({
  name: String,
  email: String,
});

export default mongoose.models.User ||
  mongoose.model("User", UserSchema);
```

---

# 7. PostgreSQL Connection Example

Install:

```bash
npm install pg
```

---

## Create Connection

```js
import { Pool } from "pg";

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

export default pool;
```

---

## Use It

```js
import pool from "@/lib/db";

export async function GET() {
  const result = await pool.query("SELECT * FROM users");

  return Response.json(result.rows);
}
```

---

# 8. Using Prisma (Most Popular Modern Method)

Prisma is widely used with Next.js.

Advantages:

* Type safety
* Auto migrations
* Easy queries
* Cleaner code

---

## Install Prisma

```bash
npm install prisma @prisma/client
```

Initialize:

```bash
npx prisma init
```

---

## Prisma Schema

```prisma
model User {
  id    Int    @id @default(autoincrement())
  name  String
  email String @unique
}
```

---

## Generate Client

```bash
npx prisma generate
```

---

## Create Prisma Client

```js
import { PrismaClient } from "@prisma/client";

const globalForPrisma = global;

export const prisma =
  globalForPrisma.prisma ||
  new PrismaClient();

if (process.env.NODE_ENV !== "production")
  globalForPrisma.prisma = prisma;
```

---

## Query Example

```js
import { prisma } from "@/lib/prisma";

export async function GET() {
  const users = await prisma.user.findMany();

  return Response.json(users);
}
```

---

# 9. Where Database Code Should Go

Good structure:

```text
project/
│
├── app/
├── lib/
│   └── db.js
├── models/
├── prisma/
├── .env.local
```

---

# 10. Server Components vs Client Components

## Server Components ✅

Can access database directly.

```js
async function Page() {
  const users = await prisma.user.findMany();
}
```

---

## Client Components ❌

Cannot safely access DB directly.

Wrong:

```js
"use client";

await prisma.user.findMany();
```

Because:

* Prisma runs on server
* Secrets would leak

Instead:

* Call API route
* Or use Server Actions

---

# 11. Server Actions (Modern Next.js)

```js
"use server";

import { prisma } from "@/lib/prisma";

export async function createUser(data) {
  await prisma.user.create({
    data,
  });
}
```

---

# 12. Connection Pooling

Very important in production.

Without pooling:

* Too many connections
* Database crashes

Solutions:

* Prisma Accelerate
* PgBouncer
* Neon
* PlanetScale

---

# 13. Best Databases for Next.js

## Beginners

* MongoDB + Mongoose
* PostgreSQL + Prisma

---

## Production

* PostgreSQL + Prisma
* Neon DB
* Supabase
* PlanetScale

---

# 14. Common Errors

## Error: Too Many Connections

Fix:

* Cache DB connection
* Use pooling

---

## Error: DATABASE_URL Undefined

Fix:

```env
DATABASE_URL=...
```

Restart server after changing `.env.local`.

---

## Error: Prisma Client Already Running

Fix:
Use global caching pattern.

---

# 15. Recommended Stack for Learning

Since you're learning full-stack development:

## Best Modern Stack

* Next.js
* Prisma
* PostgreSQL
* Supabase or Neon

This stack is currently very common in modern web development.

---

# 16. Full Flow Example

```text
Frontend Form
      ↓
Server Action / API Route
      ↓
Database Query
      ↓
Save Data
      ↓
Return Response
```

---

# 17. Learning Order

1. SQL basics
2. PostgreSQL
3. Prisma ORM
4. Next.js API routes
5. Authentication
6. Deployment
7. Production databases

---

# 18. Example Real Project Structure

```text
src/
├── app/
│   ├── api/
│   ├── dashboard/
│   └── login/
│
├── components/
├── lib/
│   ├── prisma.js
│   └── auth.js
│
├── models/
├── actions/
└── utils/
```

---

# 19. Which Should You Learn First?

For your learning path:

## Easiest

MongoDB + Mongoose

## Best Industry Choice

PostgreSQL + Prisma

## Best Long-Term

PostgreSQL + Prisma + Next.js Server Actions
