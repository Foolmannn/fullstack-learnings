"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"

export default function LoginPage() {
    const [email, setEmail] =
        useState("")

    const [password, setPassword] =
        useState("")

    const router = useRouter()

    async function handleLogin(
        e: React.FormEvent
    ) {
        e.preventDefault()

        const response =
            await fetch(
                "/api/auth/login",
                {
                    method: "POST",

                    headers: {
                        "Content-Type":
                            "application/json",
                    },

                    body:
                        JSON.stringify({
                            email,
                            password,
                        }),
                }
            )

        const data =
            await response.json()

        if (response.ok) {
            alert("Login success")

            router.push("/")
        } else {
            alert(data.error)
        }
    }

    return (
        <div>
            <h1>Login</h1>

            <form
                onSubmit={
                    handleLogin
                }
            >
                <input
                    type="email"
                    placeholder="Email"
                    value={email}
                    onChange={(e)=>
                        setEmail(
                            e.target
                                .value
                        )
                    }
                />

                <input
                    type="password"
                    placeholder="Password"
                    value={
                        password
                    }
                    onChange={(e)=>
                        setPassword(
                            e.target
                                .value
                        )
                    }
                />

                <button>
                    Login
                </button>
            </form>
        </div>
    )
}