import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Welcome to First Next App.",
  description: "Learning Next js ",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <header style={{backgroundColor:"lightgreen",
          padding:'1rem'
        }}>
          <p>Header </p>
        </header>
        {children}

        <footer style={{backgroundColor:"lightcyan",
          padding:'1rem'
        }}>
          <p>Footer</p>
        </footer>
        </body>
    </html>
  );
}
