// pages/404.tsx
import Head from "next/head";
import Link from "next/link";
import Image from "next/image";

export default function NotFoundPage() {
  return (
    <>
      <Head>
        <title>Not Found</title>
        <style
          dangerouslySetInnerHTML={{
            __html: `
      *, *::before, *::after {
        box-sizing: border-box;
      }
      html, body {
        margin: 0;
        padding: 0;
        height: 100%;
        line-height: 1.5;
        -webkit-text-size-adjust: 100%;
        font-family: ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
      }
      body {
        color: #0f172a;
      }
      .min-h-screen { min-height: 100vh; }
      .bg-white { background-color: #ffffff; }
      .text-slate-900 { color: #0f172a; }
      .shadow {
        box-shadow:
          0 1px 3px 0 rgba(15, 23, 42, 0.1),
          0 1px 2px -1px rgba(15, 23, 42, 0.06);
      }
      .sticky { position: sticky; }
      .top-0 { top: 0; }
      .z-40 { z-index: 40; }
      .mx-auto { margin-left: auto; margin-right: auto; }
      .max-w-7xl { max-width: 80rem; }
      .px-2 { padding-left: 0.5rem; padding-right: 0.5rem; }
      .flex { display: flex; }
      .inline-flex { display: inline-flex; }
      .items-center { align-items: center; }
      .justify-center { justify-content: center; }
      .justify-between { justify-content: space-between; }
      .relative { position: relative; }
      .absolute { position: absolute; }
      .inset-y-0 { top: 0; bottom: 0; }
      .right-0 { right: 0; }
      .h-20 { height: 5rem; }
      .gap-4 { gap: 1rem; }
      .flex-shrink-0 { flex-shrink: 0; }
      .mt-2 { margin-top: 0.5rem; }
      .h-12 { height: 3rem; }
      .w-auto { width: auto; }
      .w-screen { width: 100vw; }
      .h-screen { height: 100vh; }
      .h-5\\/6 { height: 83.333333%; }
      .w-full { width: 100%; }
      .flex-col { flex-direction: column; }
      .h-auto { height: auto; }
      .text-center { text-align: center; }
      .text-gray-600 { color: #4b5563; }
      .text-gray-500 { color: #6b7280; }
      .text-10xl {
        font-size: 10rem;
        line-height: 1;
        font-weight: 800;
      }
      .hidden { display: none; }
      .w-2 { width: 0.5rem; }
      .h-\\[200px\\] { height: 200px; }
      .rounded-sm { border-radius: 0.125rem; }
      .bg-gray-200 { background-color: #e5e7eb; }
      .w-3\\/4 { width: 75%; }
      .text-4xl {
        font-size: 2.25rem;
        line-height: 2.5rem;
        font-weight: 600;
      }
      .text-base {
        font-size: 1rem;
        line-height: 1.5rem;
      }
      .gap-2 { gap: 0.5rem; }

      @media (min-width: 640px) {
        .sm\\:px-6 {
          padding-left: 1.5rem;
          padding-right: 1.5rem;
        }
      }

      @media (min-width: 768px) {
        .md\\:flex-row { flex-direction: row; }
        .md\\:block { display: block; }
        .md\\:w-2\\/6 { width: 33.333333%; }
        .md\\:text-5xl {
          font-size: 3rem;
          line-height: 1.1;
          font-weight: 700;
        }
        .md\\:text-start { text-align: left; }
        .md\\:gap-0 { gap: 0; }
      }

      @media (min-width: 1024px) {
        .lg\\:px-8 {
          padding-left: 2rem;
          padding-right: 2rem;
        }
      }
        `,
          }}
        />
      </Head>
    
      <div className="min-h-screen bg-white text-slate-900">
        <nav className="bg-white shadow sticky top-0 z-40">
          <div className="mx-auto max-w-7xl px-2 sm:px-6 lg:px-8">
            <div className="absolute inset-y-0 right-0 flex items-center relative flex h-20 justify-between items-center gap-4">
              <div className="flex flex-shrink-0 items-center mt-2">
                <Link href="/" className="inline-flex items-center">
                  <Image
                    className="h-12 w-auto"
                    src="/404-assets/BGN_LOGO.png"
                    alt="Badan Gizi Nasional (BGN)"
                    width={1762}
                    height={742}
                    priority
                  />
                </Link>
              </div>
            </div>
          </div>
        </nav>
        <main className="w-screen h-screen">
          <section className="h-5/6 w-full flex items-center justify-center">
            <div className="flex flex-col md:flex-row h-auto justify-center items-center gap-4">
              <span className="text-10xl text-center text-gray-600">404</span>
              <span className="hidden md:block w-2 h-[200px] rounded-sm bg-gray-200" />
              <div className="w-3/4 md:w-2/6 flex flex-col   text-center md:text-start gap-2 md:gap-0">
                <h1 className="text-4xl md:text-5xl text-gray-600">
                  Ups! Halaman Tidak Ditemukan
                </h1>
                <p className="text-base text-gray-500">
                  Maaf ya, halaman yang Anda cari tidak tersedia. Silakan
                  periksa kembali alamat URL atau kembali ke beranda untuk
                  menemukan informasi yang Anda butuhkan.
                </p>
              </div>
            </div>
          </section>
        </main>
      </div>
    </>
  );
}
