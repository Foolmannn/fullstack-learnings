import bcrypt from "bcryptjs"
import jwt from "jsonwebtoken"
import User from "@/models/User"
import { cookies } from "next/headers"

export async function POST(req: Request) {
    const { email, password } =
        await req.json()

    const user =
        await User.findOne({ email })

    if (!user) {
        return Response.json(
            { error: "User not found" },
            { status: 404 }
        )
    }

    const valid =
        await bcrypt.compare(
            password,
            user.password
        )

    if (!valid) {
        return Response.json(
            { error: "Wrong password" },
            { status: 401 }
        )
    }

    const token =
        jwt.sign(
            { userId: user._id },
            process.env.JWT_SECRET!,
            { expiresIn: "7d" }
        )

    ;(await cookies()).set(
        "token",
        token,
        {
            httpOnly: true,
            secure:
                process.env.NODE_ENV ===
                "production",
            sameSite: "strict",
            maxAge:
                60 * 60 * 24 * 7,
        }
    )

    return Response.json({
        success: true
    })
}