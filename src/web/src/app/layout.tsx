import type { Metadata } from 'next';
import { Inter, Crimson_Pro } from 'next/font/google';

import '../styles/globals.css';
import '../styles/ag-grid.css';

import { ThemeProvider } from 'next-themes';
import { AuthProvider } from '@/context/AuthContext';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-sans',
});

const crimson = Crimson_Pro({
  subsets: ['latin'],
  variable: '--font-serif',
});

export const metadata: Metadata = {
  title: 'Biblioteca Polaris',
  description:
    'Sistema integrado de gestão da Biblioteca da Universidade Polaris que moderniza processos, facilita o acesso ao acervo acadêmico e oferece informações em tempo real para uma administração mais eficiente.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-br" className={`${inter.variable} ${crimson.variable} antialiased`} suppressHydrationWarning>
      <body className="" suppressHydrationWarning>
        <ThemeProvider attribute="data-theme" defaultTheme="dark">
          <AuthProvider>{children}</AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
