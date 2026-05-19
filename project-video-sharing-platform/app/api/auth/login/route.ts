// import bcrypt from "bcryptjs";
// import jwt from "jsonwebtoken";
// import { cookies } from "next/headers";

// import User from "@/models/User";
// import { connectToDatabase } from "@/lib/db";

// export async function POST(request: Request) {
//   const { email, password } = await request.json();

//   await connectToDatabase();

//   const user = await User.findOne({
//     email,
//   });

//   if (!user) {
//     return Response.json(
//       {
//         error: "User not found",
//       },

//       {
//         status: 404,
//       },
//     );
//   }

//   const valid = await bcrypt.compare(
//     password,

//     user.password,
//   );

//   if (!valid) {
//     return Response.json(
//       {
//         error: "Wrong password",
//       },

//       {
//         status: 401,
//       },
//     );
//   }

//   const token = jwt.sign(
//     {
//       userId: user._id,
//     },

//     process.env.JWT_SECRET!,

//     {
//       expiresIn: "7d",
//     },
//   );

//   (await cookies()).set(
//     "token",

//     token,

//     {
//       httpOnly: true,

//       secure: process.env.NODE_ENV === "production",

//       sameSite: "strict",
//     },
//   );

//   return Response.json({
//     message: "Login success",
//   });
// }
