import type { Metadata } from 'next'
import { Inter, JetBrains_Mono } from 'next/font/google'
import './globals.css'
import LayoutShell from './components/LayoutShell'

// Load fonts via next/font — zero render-blocking, self-hosted automatically
const inter = Inter({
    subsets: ['latin'],
    display: 'swap',
    variable: '--font-inter',
    preload: true,
})

const jetbrainsMono = JetBrains_Mono({
    subsets: ['latin'],
    display: 'swap',
    variable: '--font-mono',
    preload: false, // mono font is non-critical
})

export const metadata: Metadata = {
    title: 'ForexEdge – Professional Forex Education & PAMM Investing',
    description:
        'Learn Forex trading for free, join our community, and grow your wealth through managed PAMM investment groups. Professional education, real results.',
    keywords:
        'forex trading, forex education, PAMM investing, trading academy, forex signals, managed accounts',
    openGraph: {
        title: 'ForexEdge – Professional Forex Education & PAMM Investing',
        description:
            'Free Forex education, community, and managed PAMM investment groups.',
        type: 'website',
    },
}

export default function RootLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return (
        <html
            lang="en"
            className={`dark ${inter.variable} ${jetbrainsMono.variable}`}
        >
            <body className="bg-dark-500 text-slate-100 min-h-screen flex flex-col font-sans antialiased">
                <LayoutShell>{children}</LayoutShell>
            </body>
        </html>
    )
}
