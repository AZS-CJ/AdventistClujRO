import React from 'react'
import { AppProps } from 'next/app'
import Head from 'next/head'
import '../styles/globals.css'

const MyApp = ({ Component, pageProps }: AppProps) => {
  return (
    <>
      <Head>
        <title>Biserica Adventistă de Ziua a Șaptea</title>
        <meta name="description" content="Pagina oficială a Bisericii Adventiste de Ziua a Șaptea" />
        <link rel="icon" href="/logo-color.png" />
      </Head>
      <Component {...pageProps} />
    </>
  )
}

export default MyApp
