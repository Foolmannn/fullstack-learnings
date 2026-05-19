import {
    getUploadAuthParams
}
from "@imagekit/next/server"

import {
    getServerSession
}
from "next-auth"

import { authOptions } from "@/lib/auth"



export async function GET() {

    const session =
        await
        getServerSession(
            authOptions
        )


    if (
        !session
    ) {

        return Response
            .json(

            {
                error:
                "Unauthorized"
            },

            {
                status:
                401
            }

        )

    }


    const {

        token,

        expire,

        signature

    } =

        getUploadAuthParams({

            privateKey:
            process.env
            .IMAGEKIT_PRIVATE_KEY!,

            publicKey:
            process.env
            .IMAGEKIT_PUBLIC_KEY!

        })


    return Response
        .json({

            token,

            expire,

            signature,

            publicKey:
            process.env
            .IMAGEKIT_PUBLIC_KEY

        })

}