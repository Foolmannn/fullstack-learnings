import {Connection} from "mongoose";

declare global {
    var mongoose :{
        conn:Connection | null
        promise: Promise<Connection> | null 
    }
}

export {};

/*
This code is written in TypeScript and is commonly used in Next.js + Mongoose projects to avoid creating multiple MongoDB connections during development.

Let's break it down step by step.

---

# Full Code

```ts
import { Connection } from "mongoose";

declare global {
    var mongoose: {
        conn: Connection | null
        promise: Promise<Connection> | null
    }
}

export {};
```

---

# 1. What is Happening Overall?

This code is:

* adding a custom variable to the global object
* telling TypeScript what type it has
* preventing TypeScript errors

---

# Why Do We Need This?

In Next.js development mode:

* files reload frequently
* database connection code reruns many times

Without caching:

* many MongoDB connections get created

So developers store connection globally:

```ts
global.mongoose
```

This survives hot reloads.

---

# 2. `import { Connection } from "mongoose";`

```ts
import { Connection } from "mongoose";
```

This imports the `Connection` type from Mongoose.

---

## What is `Connection`?

It represents a MongoDB connection object.

Example:

```ts
const conn = await mongoose.connect(uri);
```

The connection internally contains:

* DB state
* sockets
* methods
* configuration

---

# 3. `declare global`

```ts
declare global {

}
```

This is a TypeScript feature.

It means:

> "I want to add custom properties to the global object."

---

# What is Global Object?

In Node.js:

```ts
global
```

is similar to:

```js
window
```

in browsers.

---

# Example

```ts
global.name = "Suman";
```

Now accessible anywhere:

```ts
console.log(global.name);
```

---

# Problem in TypeScript

TypeScript says:

```text
Property 'name' does not exist on type 'global'
```

because TypeScript is strict.

So we must declare it first.

---

# 4. `var mongoose`

```ts
var mongoose: {

}
```

This says:

```text
global.mongoose will exist
```

and it has a specific structure.

---

# Structure

```ts
{
   conn: Connection | null
   promise: Promise<Connection> | null
}
```

So:

```ts
global.mongoose = {
   conn: ...,
   promise: ...
}
```

---

# 5. `conn: Connection | null`

```ts
conn: Connection | null
```

Means:

```text
conn can either be:
- a MongoDB connection
OR
- null
```

---

# What is `|` ?

In TypeScript:

```ts
|
```

means OR.

---

## Example

```ts
let age: number | string;
```

Valid:

```ts
age = 20;
age = "twenty";
```

---

# Here

```ts
Connection | null
```

means:

```ts
conn = actualConnection
```

or

```ts
conn = null
```

---

# Why `null`?

Initially:

* no connection exists yet

So:

```ts
conn: null
```

Later:

```ts
conn: databaseConnection
```

---

# 6. `promise: Promise<Connection> | null`

This stores the pending connection promise.

---

# What is Promise?

When connecting:

```ts
mongoose.connect(uri)
```

takes time.

It returns:

```ts
Promise<Connection>
```

because DB connection is asynchronous.

---

# Visualization

```text
Start Connecting
      ↓
Promise created
      ↓
Connection completes
      ↓
Returns Connection
```

---

# Why Store Promise?

Suppose 5 requests come simultaneously.

Without promise caching:

```text
Request 1 → create connection
Request 2 → create another connection
Request 3 → another connection
```

Bad.

---

Instead:

```text
First request creates promise
Others reuse same promise
```

Efficient.

---

# Real Usage Example

Usually used like this:

```ts
import mongoose from "mongoose";

const MONGO_URI = process.env.MONGO_URI!;

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
    cached.promise = mongoose.connect(MONGO_URI);
  }

  cached.conn = await cached.promise;

  return cached.conn;
}
```

---

# Flow of This Code

## First Time

```text
conn = null
promise = null
```

↓

Create promise:

```text
promise = mongoose.connect()
```

↓

Wait:

```text
await promise
```

↓

Store final connection:

```text
conn = actualConnection
```

---

# Next Request

```text
conn already exists
```

↓

Reuse existing connection.

No new DB connection created.

---

# 7. Why `export {};`

```ts
export {};
```

Very important.

---

# What It Does

It converts the file into a module.

---

# Why Needed?

Without it:

```ts
declare global
```

may not work properly.

TypeScript only allows global augmentation inside modules.

---

# Simple Understanding

```ts
export {};
```

basically tells TypeScript:

```text
"This file is a module."
```

even though nothing is exported.

---

# Important TypeScript Concepts Used Here

| Concept             | Meaning               |
| ------------------- | --------------------- |
| Type Annotation     | `: Connection`        |
| Union Type          | `Connection \| null`  |
| Promise Type        | `Promise<Connection>` |
| Global Augmentation | `declare global`      |
| Module              | `export {}`           |

---

# Beginner-Friendly Analogy

Imagine:

```text
global = big storage box
```

This code says:

```text
Inside the box,
there is a mongoose object
with:
- conn
- promise
```

TypeScript needs this description so it knows:

* what exists
* what types are allowed

---

# JavaScript vs TypeScript Version

## JavaScript

```js
global.mongoose = {
  conn: null,
  promise: null
};
```

Works directly.

---

## TypeScript

Needs type declaration:

```ts
declare global {
   var mongoose: ...
}
```

because TS checks types before running code.

---

# Most Important Beginner Takeaway

This code does NOT create a database connection.

It only:

* defines the type
* tells TypeScript about `global.mongoose`

The actual connection happens elsewhere using:

```ts
mongoose.connect()
```


*/