import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

import { ClerkProvider } from '@clerk/nextjs'
import NavBar from "@/components/layout/NavBar";
import Container from "@/components/ui/Container";
import { Toaster } from "@/components/ui/toaster"
import { ThemeProvider } from "@/components/theme-provider"



const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "UniStay",
  description: "Enhancing Your Hostel Search Experience",
  icons: {icon: 'logo.svg'}
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider>
      <html lang="en" suppressHydrationWarning>
       
      <body className={inter.className}>
        <ThemeProvider  
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange>
        <main className="flx flex-col min-h-screen bg-secondary">
        <NavBar />
        <section className="flex-grow">
          <Container>
          {children}

          </Container>
        
        </section>
        
        </main>
        </ThemeProvider>
        <Toaster/> 
        </body>
    </html>
    </ClerkProvider>
    
  );
}


