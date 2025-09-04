import './globals.css'
import '../styles/tokens.css'
import type { ReactNode } from 'react'
import { PageTransition } from '../components/ui/PageTransition'
import { SkipLink } from '../components/access/SkipLink'
import { DockNav } from '../components/nav/DockNav'
import { Baloo_2, Nunito } from 'next/font/google'
import { ThemeToggle } from '../components/ui/ThemeToggle'
import { AmbientBackground } from '../components/ui/AmbientBackground'
import { CommandPalette } from '../components/command/CommandPalette'
import { AnnouncerProvider } from '../components/access/Announcer'

const display = Baloo_2({ subsets: ['latin'], weight: ['600','700','800'], variable: '--font-display' })
const bodyFont = Nunito({ subsets: ['latin'], weight: ['400','600','700'], variable: '--font-body' })

export const metadata = { title: 'Store', description: 'A living commerce experience' }

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" className={`${display.variable} ${bodyFont.variable} h-full`}>
      <body className="bg-bg text-text antialiased">
        <AmbientBackground />
        <AnnouncerProvider>
          <SkipLink />
          <DockNav />
          <PageTransition>{children}</PageTransition>
          <ThemeToggle />
          <CommandPalette />
        </AnnouncerProvider>
      </body>
    </html>
  )
}

