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

// Title as Simple string 
// export const metadata: Metadata = {
//   title: "Welcome to First Next App.",
//   description: "Learning Next js ",
// };


// Title as Object
export const metadata: Metadata = {
  title: {
    default:"basic next js app",
    template:"%s | Basic web app ", // this %s will be replaced by the title set on the components  // visit docs page
    // absolute:"Blog", if set to the child it will overwrite the parent layout  // visit blog page 

  },
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
