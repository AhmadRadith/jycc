import Document, { Html, Head, Main, NextScript } from 'next/document';

const themeBootstrapScript = `
(function() {
  try {
    var storageKey = 'mbg-theme';
    var stored = window.localStorage.getItem(storageKey);
    var prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    if (stored === 'dark' || (!stored && prefersDark)) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  } catch (err) {
    console.warn('Unable to set initial theme', err);
  }
})();
`;

class MyDocument extends Document {
  render() {
    return (
      <Html lang="id" className="h-full">
        <Head>
          <meta charSet="UTF-8" />
          <script dangerouslySetInnerHTML={{ __html: themeBootstrapScript }} />
          <link
            rel="stylesheet"
            href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.0/css/all.min.css"
          />
          <link
            href="https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600;700&display=swap"
            rel="stylesheet"
          />
        </Head>
        <body className="min-h-full bg-white text-slate-900">
          <Main />
          <NextScript />
        </body>
      </Html>
    );
  }
}

export default MyDocument;
