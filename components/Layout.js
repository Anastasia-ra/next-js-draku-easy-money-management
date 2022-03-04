import Head from 'next/head';
import Header from './Header';

export default function Layout(props) {
  return (
    <>
      <Head>{/* favicon */}</Head>

      <Header userObject={props.userObject} />

      <main>{props.children}</main>
    </>
  );
}
