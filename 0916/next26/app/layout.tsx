import Link from 'next/link';
import './globals.css';

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <header>
          <p>=== Root Layout Header ===</p>
          <nav>
            <Link href="/">Home</Link> | <Link href="/counter">Counter</Link>
            <br />
            <br />
            Slug Page Menu : &nbsp;
            <Link href="/nextjs">nextjs</Link>&nbsp;|&nbsp;
            <Link href="/routing">routing</Link>&nbsp;|&nbsp;
            <Link href="/ssr-ssg">ssr-sge</Link>&nbsp;|&nbsp;
            <Link href="/dynamic-routes">dynamic-routes</Link>
            <br />
            <br /># interleaving 예제 :{' '}
            <Link href="/interleaved">interleaving 예제</Link>
            <br /># carousel 예제 : <Link href="/carousel">carousel 예제</Link>
          </nav>
          <br />
          <br />
        </header>
        <main>{children}</main>
        <footer>=== Root Layout Footer ===</footer>
      </body>
    </html>
  );
}
