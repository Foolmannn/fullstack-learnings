
//  SO WITH THE HELP OF THE ROUTE GROUPS WE CAN DEFINE THE MULTIPLE ROOTLAYOUT WHICH HELPS US TO APPLY DIFFERENT LAYOUT TO DIFFERENT TYPE OF THE PAGES . 
'use client'

import type { Metadata } from "next";
import '../globals.css'

import { Geist, Geist_Mono } from "next/font/google";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

// export const metadata: Metadata = {
//   title: "Welcome to First Next App.",
//   description: "Learning Next js ",
// };

const navLinks = [
  {name:"Register",href:"/register"},
  {name:"Login",href:"/login"},
  {name:"Forgot-Password",href:"/forgot-password"},
]

export default function AuthLayout({ children }: LayoutProps<"/">) {
  const pathname = usePathname()
  const [input, setInput] = useState("")
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <div>
          <input value={input} onChange={(e)=>setInput(e.target.value)}/>
        </div>
        {navLinks.map((link)=>{
          const isActive = pathname === link.href || (pathname.startsWith(link.href) && link.href !=='/')
          return (
            <Link href={link.href} key={link.name} style={{padding:'10px'}} className={isActive ? "font-bold mr-4": 'text-blue-500 mr-4'}>
              {link.name}
            </Link>
          )
        })}

        {children}

        </body>
    </html>
  );
}
