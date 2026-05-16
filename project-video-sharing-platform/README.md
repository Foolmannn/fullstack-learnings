If you've already copied the **MongoDB Atlas connection string**, the issue is usually in one of: Atlas setup, `.env.local`, IP access, DB user permissions, or Next.js env loading.

Follow this checklist in order.

---

# 1. Create a database user in Atlas

Go to:

[MongoDB Atlas](https://www.mongodb.com/cloud/atlas?utm_source=chatgpt.com)

Then:

```txt
Security
→ Database Access
→ Add New Database User
```

Create:

```txt
Username: yourUsername
Password: strongPassword
Role:
Read and write to any database
```

Save credentials.

Example:

```txt
Username:
shopsathiAdmin

Password:
abc123XYZ!
```

You need these for connection string.

---

# 2. Allow your IP address

Go to:

```txt
Security
→ Network Access
→ Add IP Address
```

For development:

Choose:

```txt
Allow Access From Anywhere

0.0.0.0/0
```

This is easiest for testing.

Later restrict IPs for production.

Without this, you'll get:

```txt
MongoServerError:
IP not whitelisted
```

---

# 3. Get correct connection string

Go:

```txt
Clusters
→ Connect
→ Drivers
→ Node.js
```

Atlas gives:

Example:

```txt
mongodb+srv://username:
password@cluster0.xyz.mongodb.net/
?retryWrites=true&w=majority
```

Replace:

```txt
username
password
```

with actual values.

Also add database name:

Example:

```txt
mongodb+srv://admin:
mypassword123@
cluster0.abcd.mongodb.net/blogDB
?retryWrites=true&w=majority
```

Notice:

```txt
/blogDB
```

This is database name.

---

# 4. Put in `.env.local`

Create:

```txt
.env.local
```

NOT:

```txt
.env
```

for Next.js.

Add:

```env
MONGODB_URI=
mongodb+srv://admin:
mypassword@
cluster.mongodb.net/blogDB
?retryWrites=true&w=majority
```

One line only:

Example:

```env
MONGODB_URI=mongodb+srv://admin:mypass123@cluster0.abcd.mongodb.net/blogDB?retryWrites=true&w=majority
```

No quotes.

Avoid:

Wrong:

```env
MONGODB_URI="mongodb..."
```

---

# 5. Restart Next server

Environment variables load only on startup.

Run:

```bash
npm run dev
```

again.

Not:

Hot reload.

Actually stop:

```bash
Ctrl+C
```

then:

```bash
npm run dev
```

---

# 6. Test connection manually

Update DB code:

```ts
import mongoose
from "mongoose";

export async function
connectToDatabase(){

try{

await mongoose.connect(
process.env
.MONGODB_URI!
);

console.log(
"MongoDB Connected"
);

}
catch(error){

console.log(
error
);

}

}
```

Then call route.

Terminal should show:

```txt
MongoDB Connected
```

If not:

Error tells us what's wrong.

---

# 7. Call DB connection in API

Ensure:

```ts
await connectToDatabase();
```

before:

```ts
User.findOne()

User.create()
```

Like:

```ts
export async function
POST(req){

await connectToDatabase();

const body =
await req.json();

...
}
```

---

# 8. Verify Atlas cluster is running

Go:

```txt
Clusters
```

Need:

```txt
Status:
Available
```

Not paused.

Free clusters may pause.

---

# Final working example

### `.env.local`

```env
MONGODB_URI=mongodb+srv://admin:password123@cluster0.abcd.mongodb.net/blogDB?retryWrites=true&w=majority
```

---

### `lib/db.ts`

```ts
import mongoose
from "mongoose";

export async function
connectToDatabase(){

if(
mongoose.connection
.readyState >= 1
){

return;

}

await mongoose.connect(
process.env
.MONGODB_URI!
);

console.log(
"Connected"
);

}
```

---

### API

```ts
await connectToDatabase();

await User.create({

email,

password

});
```

---

The most common failures:

```txt
❌ Password contains special chars
→ URL encode password

❌ IP not whitelisted

❌ Wrong env filename

❌ Forgot server restart

❌ Missing DB user

❌ Wrong connection string
```

If it still fails, paste the **exact terminal error**. That's the fastest way to pinpoint it.
