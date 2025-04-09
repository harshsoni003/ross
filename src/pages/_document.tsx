import { Html, Head, Main, NextScript } from 'next/document';

export default function Document() {
  return (
    <Html lang="en">
      <Head>
        {/* Force styles to be loaded */}
        <link rel="stylesheet" href="/_next/static/css/app/layout.css" />
      </Head>
      <body className="bg-gray-900 text-white" style={{backgroundColor: '#111827', color: '#ffffff'}}>
        <Main />
        <NextScript />
      </body>
    </Html>
  );
} 