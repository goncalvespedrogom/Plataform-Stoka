import Head from "next/head";
import "@/styles/globals.css";
import type { AppProps } from "next/app";
import 'react-datepicker/dist/react-datepicker.css';

export default function App({ Component, pageProps }: AppProps) {
  const getLayout = (Component as any).getLayout || ((page: React.ReactNode) => page);
  return (
    <>
      <Head>
        <title>STOKA</title>
        <meta name="description" content="Sistema de gestao de estoque e vendas" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.svg" type="image/svg+xml" />
        <link rel="apple-touch-icon" href="/favicon.svg" />
        <meta name="theme-color" content="#000000" />
        
        {/* Open Graph / Facebook */}
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://plataform-stoka.vercel.app/" />
        <meta property="og:title" content="STOKA - Sistema de Gestao de Estoque" />
        <meta property="og:description" content="Plataforma completa para gestao de estoque, vendas e controle de produtos. Simplifique sua operacao comercial." />
        <meta property="og:image" content="https://plataform-stoka.vercel.app/og-image.svg" />
        <meta property="og:image:width" content="1200" />
        <meta property="og:image:height" content="630" />
        <meta property="og:site_name" content="STOKA" />
        
        {/* Twitter */}
        <meta property="twitter:card" content="summary_large_image" />
        <meta property="twitter:url" content="https://plataform-stoka.vercel.app/" />
        <meta property="twitter:title" content="STOKA - Sistema de Gestao de Estoque" />
        <meta property="twitter:description" content="Plataforma completa para gestao de estoque, vendas e controle de produtos. Simplifique sua operacao comercial." />
        <meta property="twitter:image" content="https://plataform-stoka.vercel.app/og-image.svg" />
        
        {/* Additional SEO */}
        <meta name="keywords" content="gestao de estoque, vendas, controle de produtos, sistema comercial, estoque, inventario" />
        <meta name="author" content="STOKA" />
        <meta name="robots" content="index, follow" />
      </Head>
      {getLayout(<Component {...pageProps} />)}
    </>
  );
}
