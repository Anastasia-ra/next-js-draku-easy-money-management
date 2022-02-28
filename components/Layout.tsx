import Head from 'next/head';
import Header from './Header';

export default function Layout(props: any) {
  return (
    <>
      <Head>{/* favicon */}</Head>
      <Header />
      <main>{props.children}</main>
    </>
  );
}
