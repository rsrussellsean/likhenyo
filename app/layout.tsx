import type { Metadata } from 'next'
import { DM_Sans, Instrument_Serif } from 'next/font/google'
import './globals.css'

const dmSans = DM_Sans({
  variable: '--font-sans',
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700'],
})

const instrumentSerif = Instrument_Serif({
  variable: '--font-heading',
  subsets: ['latin'],
  weight: '400',
})

export const metadata: Metadata = {
  title: 'WorkHub PH — Hire Any Skilled Professional in the Philippines',
  description:
    'Verified freelancers across engineering, technology, design, business, and more — all in one structured platform.',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html
      lang="en"
      className={`${dmSans.variable} ${instrumentSerif.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-background text-foreground">
        {children}
      </body>
    </html>
  )
}
