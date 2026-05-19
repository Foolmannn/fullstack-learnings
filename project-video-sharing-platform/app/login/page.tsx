"use client";

import { signIn } from "next-auth/react";

import { useState } from "react";

export default function Login() {
  const [email, setEmail] = useState("");

  const [password, setPassword] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    await signIn(
      "credentials",

      {
        email,

        password,

        callbackUrl: "/",
      },
    );
  }

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />

      <input
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />

      <button>Login</button>
    </form>
  );
}
