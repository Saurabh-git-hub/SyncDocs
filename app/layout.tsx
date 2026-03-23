import { Poppins as FontSans } from "next/font/google"

import { cn } from "@/lib/utils"

import './globals.css'
import { Metadata } from "next"
import {
  ClerkProvider,
} from '@clerk/nextjs'
import { dark } from "@clerk/themes"
import Provider from "./Provider"

const fontSans = FontSans({
  weight: ['400', '500', '600', '700'],
  subsets: ["latin"],
  variable: "--font-sans",
})

export const metadata: Metadata = {
  title: 'SyncDocs',
  description: 'Your go-to collaborative editor',
  icons: {
    icon: '/assets/images/my-favicon.png',
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    // ClerkProvider

    <ClerkProvider

      appearance={{
        baseTheme: dark,
        variables: {
          colorPrimary: '#3371FF',
          fontSize: '16px',
        }
      }}
    >
      <html lang="en" suppressHydrationWarning>
        <body
          className={cn(
            "min-h-screen font-sans antialiased",
            fontSans.variable
          )}
        >
          <Provider>
            {children}
          </Provider>
        </body>
      </html>
    </ClerkProvider>
  )
}