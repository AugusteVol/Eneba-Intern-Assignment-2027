import { useState } from "react";
import type { FormEvent } from "react";
import { login } from "../services/authApi";
import { mergeGuestCartIntoAccount } from "../services/cartApi";

export function LoginPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError("");
    setSuccess("");

    try {
      const account = await login(username.trim(), password);
      await mergeGuestCartIntoAccount(account.id);
      localStorage.setItem("accountId", String(account.id));
      setSuccess(`Welcome, ${account.username}!`);
      window.location.href =
        new URLSearchParams(window.location.search).get("returnTo") === "/payment"
          ? "/payment"
          : "/";
    } catch (requestError) {
      setError(
        requestError instanceof Error
          ? requestError.message
          : "Unable to log in or transfer your cart",
      );
    }
  };

  return (
    <main className="login-page">
      <div className="login-promo">
        <button className="brand" type="button" aria-label="Home" onClick={() => { window.location.href = "/"; }}>
          <img
            className="login-brand"
            src="/images/logoFull.svg"
            alt="Eneba"
          />
        </button>
        <h1>
          Hi!
          <br />
          It's nice to
          <br />
          see you!
        </h1>
      </div>

      <section className="login-card" aria-labelledby="login-title">
        <div className="login-card-heading">
          <h2 id="login-title">Log in</h2>
          <p>New user? <button type="button" onClick={() => { window.location.href = `/register${window.location.search}`; }}>Create account</button></p>
        </div>

        <form className="login-form" onSubmit={handleSubmit}>
          <label htmlFor="login-username">Username</label>
          <input
            id="login-username"
            name="username"
            type="text"
            value={username}
            onChange={(event) => setUsername(event.target.value)}
            autoComplete="username"
            required
          />

          <label htmlFor="login-password">Password</label>
          <input
            id="login-password"
            name="password"
            type="password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            autoComplete="current-password"
            required
          />

          {error ? <p className="login-error" role="alert">{error}</p> : null}
          {success ? <p className="login-success" role="status">{success}</p> : null}

          <button className="login-submit" type="submit">Log in</button>
        </form>
      </section>
    </main>
  );
}
