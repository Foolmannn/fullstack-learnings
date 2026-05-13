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
# `bufferCommands` in `mongoose.connect()`

In Mongoose, `bufferCommands` controls what happens when your app tries to run queries **before MongoDB is connected**.

---

# Basic Example

```js
import mongoose from "mongoose";

mongoose.connect(MONGO_URI, {
  bufferCommands: false
});
```

---

# What is Query Buffering?

Suppose:

```js
User.find();
```

runs before database connection finishes.

Mongoose has two possible behaviors:

---

# 1. `bufferCommands: true` (Default)

Mongoose stores queries temporarily in memory.

After DB connects:

* queued queries execute automatically

---

## Example

```js
mongoose.connect(uri);

User.find(); // runs immediately
```

Even if connection is not ready:

* query waits internally
* then executes later

---

## Internally

```text
Query → Queue(Buffer) → DB Connected → Execute
```

---

## Advantages

* Easier for beginners
* Queries don't instantly fail
* Convenient for small apps

---

## Disadvantages

### 1. Hides Connection Problems

Your DB may actually be disconnected but app appears frozen.

Example:

* query hangs forever
* difficult debugging

---

### 2. Memory Usage

Buffered queries stay in RAM.

If DB is down:

* memory usage increases

---

### 3. Bad for Production

Production apps should:

* fail fast
* detect DB issues immediately

---

# 2. `bufferCommands: false`

Queries fail immediately if DB is not connected.

---

## Example

```js
mongoose.connect(uri, {
  bufferCommands: false
});

User.find();
```

If DB isn't connected yet:

```text
MongooseError: Cannot execute operation before connection
```

---

# Why Modern Apps Prefer `false`

In:

* Next.js
* APIs
* serverless apps
* production systems

you usually want:

* explicit connection handling
* predictable failures
* better debugging

---

# Recommended Pattern

```js
await mongoose.connect(uri, {
  bufferCommands: false
});

const users = await User.find();
```

This ensures:

* DB is connected first
* then queries run

---

# Visualization

## `true`

```text
Query
  ↓
Stored in Buffer
  ↓
DB connects later
  ↓
Query executes
```

---

## `false`

```text
Query
  ↓
No DB?
  ↓
Throw Error Immediately
```

---

# Related Option: `bufferTimeoutMS`

Controls:

* how long buffered operations wait

Example:

```js
mongoose.connect(uri, {
  bufferCommands: true,
  bufferTimeoutMS: 5000
});
```

Meaning:

* wait max 5 seconds
* then throw timeout error

Default:

```text
10000 ms
```

---

# Other Important `mongoose.connect()` Options

---

# 1. `dbName`

Specify database name.

```js
mongoose.connect(uri, {
  dbName: "myapp"
});
```

Useful when URI doesn't include DB name.

---

# 2. `user` and `pass`

Authentication credentials.

```js
mongoose.connect(uri, {
  user: "admin",
  pass: "secret"
});
```

Usually stored in `.env`.

---

# 3. `autoIndex`

Controls automatic index creation.

```js
mongoose.connect(uri, {
  autoIndex: false
});
```

---

## Why Important?

Mongoose schemas may contain:

```js
email: {
  type: String,
  unique: true
}
```

Mongoose creates indexes automatically.

---

## Production Recommendation

```js
autoIndex: false
```

Because:

* indexing can slow startup
* large databases affected

---

# 4. `maxPoolSize`

Maximum DB connections.

```js
mongoose.connect(uri, {
  maxPoolSize: 10
});
```

---

## What is Connection Pooling?

Instead of:

* creating new connection for every query

MongoDB reuses connections.

---

## Visualization

```text
App
 ↓
Connection Pool (10)
 ↓
MongoDB
```

---

## Too Low

Requests wait.

---

## Too High

DB overload.

---

# 5. `minPoolSize`

Minimum maintained connections.

```js
mongoose.connect(uri, {
  minPoolSize: 2
});
```

Keeps some ready at all times.

---

# 6. `serverSelectionTimeoutMS`

How long to wait for MongoDB server.

```js
mongoose.connect(uri, {
  serverSelectionTimeoutMS: 5000
});
```

Meaning:

* fail after 5 seconds if no DB found

---

## Very Important

Without this:

* app may hang long time

---

# 7. `socketTimeoutMS`

How long inactive socket stays alive.

```js
mongoose.connect(uri, {
  socketTimeoutMS: 45000
});
```

Useful for:

* slow queries
* network handling

---

# 8. `family`

IP version.

```js
mongoose.connect(uri, {
  family: 4
});
```

Options:

* `4` → IPv4
* `6` → IPv6

Useful if localhost issues occur.

---

# 9. `retryWrites`

Retry failed writes automatically.

```js
mongoose.connect(uri, {
  retryWrites: true
});
```

Usually enabled in MongoDB Atlas URIs already.

---

# 10. `ssl` / `tls`

Secure encrypted connection.

```js
mongoose.connect(uri, {
  tls: true
});
```

Used in cloud databases.

---

# Common Modern Production Config

```js
await mongoose.connect(process.env.MONGO_URI, {
  dbName: "myapp",
  bufferCommands: false,
  autoIndex: false,
  maxPoolSize: 10,
  serverSelectionTimeoutMS: 5000,
});
```

---

# Development Config

```js
await mongoose.connect(process.env.MONGO_URI, {
  bufferCommands: true,
  autoIndex: true,
});
```

---

# How Mongoose Connection Works Internally

```text
Mongoose
   ↓
MongoDB Driver
   ↓
TCP Socket
   ↓
MongoDB Server
```

Mongoose is actually built on top of the official MongoDB Node driver.

---

# Difference Between Mongoose and MongoDB Driver

| Feature              | Mongoose        | MongoDB Driver |
| -------------------- | --------------- | -------------- |
| Schemas              | Yes             | No             |
| Validation           | Yes             | Manual         |
| Models               | Yes             | No             |
| Easier for beginners | Yes             | Less           |
| Performance          | Slight overhead | Faster         |

---




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
