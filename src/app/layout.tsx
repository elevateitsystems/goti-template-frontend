import type { Metadata } from 'next'
import './globals.css'
import { ReduxProvider } from '@/redux/provider'

export const metadata: Metadata = {
  title: 'PrimeIQ Intelligence',
  description: 'The Bloomberg Terminal for Sports Betting — Premium Analytics Platform',
  icons: { icon: '/favicon.ico' },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="bg-[#0A1423]">
        <ReduxProvider>
          {children}
        </ReduxProvider>
      </body>
    </html>
  )
}
