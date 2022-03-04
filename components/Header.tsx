import Link from 'next/link';
import { User } from '../util/database';

type Props = {
  userObject?: User;
};

export default function Header(props: Props) {
  return (
    <header>
      <Link href="/signup">
        <a>Sign up</a>
      </Link>
      <Link href="/login">
        <a>Log in</a>
      </Link>
      <Link href="/logout">
        <a>Log out</a>
      </Link>
      {props.userObject && <div>{props.userObject.username}</div>}
    </header>
  );
}
