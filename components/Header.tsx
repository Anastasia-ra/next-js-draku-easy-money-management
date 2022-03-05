import { css, Interpolation, Theme } from '@emotion/react';
import Link from 'next/link';
import { AnchorHTMLAttributes } from 'react';
import { User } from '../util/database';

type Props = {
  userObject?: User;
};

function Anchor({
  children,
  ...restProps
}: AnchorHTMLAttributes<HTMLAnchorElement> & {
  css?: Interpolation<Theme>;
}) {
  return <a {...restProps}>{children}</a>;
}

export default function Header(props: Props) {
  return (
    <header>
      <Link href="/">
        <a>Home</a>
      </Link>
      {/* <Link href="/signup">
        <a>Sign up</a>
      </Link>
      <Link href="/login">
        <a>Log in</a>
      </Link>
      <Link href="/logout">
        <a>Log out</a>
      </Link> */}
      {props.userObject && <div>{props.userObject.username}</div>}

      {props.userObject ? (
        <Anchor href="/logout">Logout</Anchor>
      ) : (
        <>
          <Link href="/login">
            <a>Login</a>
          </Link>
          <Link href="/signup">
            <a>Sign-up</a>
          </Link>
        </>
      )}
    </header>
  );
}
