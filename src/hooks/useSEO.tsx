import React from 'react';
import Head from 'next/head';

interface SEOProps {
  title?: string;
  description?: string;
  image?: string;
  url?: string;
  keywords?: string;
}

export const useSEO = (props: SEOProps = {}) => {
  const {
    title = "STOKA - Sistema de Gestao de Estoque",
    description = "Plataforma completa para gestao de estoque, vendas e controle de produtos. Simplifique sua operacao comercial.",
    image = "https://plataform-stoka.vercel.app/og-image.svg",
    url = "https://plataform-stoka.vercel.app/",
    keywords = "gestao de estoque, vendas, controle de produtos, sistema comercial, estoque, inventario"
  } = props;
  
  const SEOHead = React.memo(() => {
    return (
      <Head>
        <title>{title}</title>
        <meta name="description" content={description} />
        <meta name="keywords" content={keywords} />
        
        <meta property="og:type" content="website" />
        <meta property="og:url" content={url} />
        <meta property="og:title" content={title} />
        <meta property="og:description" content={description} />
        <meta property="og:image" content={image} />
        <meta property="og:image:width" content="1200" />
        <meta property="og:image:height" content="630" />
        <meta property="og:site_name" content="STOKA" />
        
        <meta property="twitter:card" content="summary_large_image" />
        <meta property="twitter:url" content={url} />
        <meta property="twitter:title" content={title} />
        <meta property="twitter:description" content={description} />
        <meta property="twitter:image" content={image} />
      </Head>
    );
  });

  return { SEOHead };
}; 