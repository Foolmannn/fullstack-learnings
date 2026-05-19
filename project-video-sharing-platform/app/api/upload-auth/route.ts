// app/api/upload-auth/route.ts

import { getUploadAuthParams } from "@imagekit/next/server";

import jwt from "jsonwebtoken";
import { cookies } from "next/headers";

export async function GET() {
  const userToken = (await cookies()).get("token")?.value;

  if (!userToken) {
    return Response.json(
      {
        error: "Unauthorized",
      },

      {
        status: 401,
      },
    );
  }

  try {
    jwt.verify(userToken, process.env.JWT_SECRET!);

    const { token, expire, signature } = getUploadAuthParams({
      privateKey: process.env.IMAGEKIT_PRIVATE_KEY!,

      publicKey: process.env.IMAGEKIT_PUBLIC_KEY!,
    });

    return Response.json({
      token,
      expire,
      signature,

      publicKey: process.env.IMAGEKIT_PUBLIC_KEY,
    });
  } catch {
    return Response.json(
      {
        error: "Invalid token",
      },

      {
        status: 401,
      },
    );
  }
}
