import type { Metadata } from 'next'
import './globals.css'
import {Providers} from '@/context/providers'

export const metadata: Metadata = {
  title: 'Amafor Gladiators FC - Nigerian Football Club',
  description: 'Official website of Amafor Gladiators FC - Youth development, professional football, and community engagement in Nigerian football.',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>
    
        <Providers>
        {children}
        </Providers>
      </body>
      
    </html>
  )
}
