import Head from 'next/head';
import Header from './Header';

export default function Layout(props) {
  return (
    <>
      <Head>{/* favicon */}</Head>

      <Header />

      <main>{props.children}</main>
    </>
  );
}
