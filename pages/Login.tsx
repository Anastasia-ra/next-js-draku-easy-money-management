export default function Login() {
  return (
    <div>
      <form onSubmit={(event) => event.preventDefault()}>
        <label>
          Username
          <input></input>
        </label>
        <br />
        <label>
          Password
          <input type="password"></input>
        </label>
        <button>Log-in</button>
      </form>
    </div>
  );
}
