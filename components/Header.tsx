import { css, Interpolation, Theme } from '@emotion/react';
import Link from 'next/link';
import { AnchorHTMLAttributes } from 'react';
import { User } from '../util/database';
import Image from 'next/image';

const mainStyle = css`
  background: #01aca3;
  height: 40px;
  font-size: 24px;
  font-weight: lighter;
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

const textStyle = css`
  width: 800px;
  margin: auto;
  display: flex;
  justify-content: space-between;
  align-self: center;
  position: relative;
`;

const imageStyle = css`
  top: 1px;
  /* left: 8px; */
  position: relative;
`;

const rightLinksStyle = css`
  display: flex;
  justify-content: flex-end;
  margin-left: auto;
`;

const pageLinksStyle = css`
  color: white;
  transition: color 0.3s ease-in 0s;
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
  // console.log('props.userObject.username in header', props.userObject.username);
  return (
    <header css={mainStyle}>
      <div css={textStyle}>
        <div css={imageStyle}>
          <Image src="/draku-favicon-4.png" width="20px" height="20px" />
        </div>
        {props.userObject && (
          <div css={usernameStyle}>Hi, {props.userObject.username}!</div>
        )}
        <div css={rightLinksStyle}>
          {props.userObject ? (
            <>
              <Link href="/">
                <a css={pageLinksStyle}>Home</a>
              </Link>
              <Anchor
                data-test-id="log-out"
                href="/logout"
                css={pageLinksStyle}
              >
                Logout
              </Anchor>
            </>
          ) : (
            <>
              <Link href="/login">
                <a data-test-id="log in" css={pageLinksStyle}>
                  Login
                </a>
              </Link>
              <Link href="/signup">
                <a data-test-id="sign up" css={pageLinksStyle}>
                  Sign-up
                </a>
              </Link>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
