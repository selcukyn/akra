
import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Akra Kemer Geri Sayım',
  description: 'Akra Kemer özel etkinliği için geri sayım.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="tr" suppressHydrationWarning>
      <head>
        {/* Özel font bağlantısı kaldırıldı, Tailwind'in varsayılan fontları kullanılacak */}
      </head>
      <body className="antialiased min-h-screen flex flex-col bg-background text-foreground">
        {children}
        {/* Toaster kaldırıldı */}
      </body>
    </html>
  );
}
