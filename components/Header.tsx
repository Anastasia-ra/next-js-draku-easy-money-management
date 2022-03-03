import Link from 'next/link';

export default function Header() {
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
    </header>
  );
}
