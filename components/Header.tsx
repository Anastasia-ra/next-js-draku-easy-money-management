import { css, Interpolation, Theme } from '@emotion/react';
import Link from 'next/link';
import { AnchorHTMLAttributes } from 'react';
import { User } from '../util/database';

const mainStyle = css`
  background: #01aca3;
  height: 40px;
  font-size: 24px;
  color: white;
  display: flex;
  justify-content: space-between;
  align-self: center;
  line-height: 34px;
  box-shadow: 80px 0;

  a {
    margin: 0 10px;

    /* text-align: center; */
  }
`;

const rightLinksStyle = css`
  display: flex;
  justify-content: flex-end;
  margin-left: auto;
`;

const pageLinksStyle = css`
  color: white;

  :hover {
    color: #04403d;
  }
`;

const usernameStyle = css`
  margin-left: 10px;
`;

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
    <header css={mainStyle}>
      {props.userObject && (
        <div css={usernameStyle}>Hi, {props.userObject.username}!</div>
      )}

      <div css={rightLinksStyle}>
        {props.userObject ? (
          <>
            <Link href="/">
              <a css={pageLinksStyle}>Home</a>
            </Link>
            <Anchor href="/logout" css={pageLinksStyle}>
              Logout
            </Anchor>
          </>
        ) : (
          <>
            <Link href="/login">
              <a css={pageLinksStyle}>Login</a>
            </Link>
            <Link href="/signup">
              <a css={pageLinksStyle}>Sign-up</a>
            </Link>
          </>
        )}
      </div>
    </header>
  );
}
