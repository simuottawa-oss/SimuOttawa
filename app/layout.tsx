import type { Metadata } from 'next'
import type { ReactNode } from 'react'
import './globals.css'

export const metadata: Metadata = {
  title: 'SimuOttawa — Physics in motion',
  description: 'SimuOttawa is a University of Ottawa student club building SimuO, an open-source 3D physics engine.',
  icons: { icon: '/assets/gear-logo.svg' },
}

export default function RootLayout({ children }: { children: ReactNode }) {
  return <html lang="en"><body>{children}</body></html>
}
