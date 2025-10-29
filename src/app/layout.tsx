import type { Metadata } from 'next'
import { Geist, Geist_Mono } from 'next/font/google'
import './globals.css'
import { SolanaWalletProvider } from 'src/providers/WalletProvider'
import { PendingMintProvider } from 'src/context/PendingMintContext'
import { Toaster } from 'sonner'

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
})

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
})

export const metadata: Metadata = {
  title: 'Kcona',
  description: 'purchase your K-POP star',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <SolanaWalletProvider>
          <PendingMintProvider>{children}</PendingMintProvider>
        </SolanaWalletProvider>
        <Toaster position="bottom-right" richColors />
      </body>
    </html>
  )
}
