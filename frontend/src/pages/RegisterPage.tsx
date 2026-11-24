import { useState } from "react";
import type { FormEvent } from "react";
import { registerAccount } from "../services/homeApi";

export function RegisterPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError("");
    setSuccess("");

    try {
      const account = await registerAccount(username.trim(), password);
      localStorage.setItem("accountId", String(account.id));
      setSuccess(`Welcome, ${account.username}!`);
      window.location.href = "/";
    } catch (requestError) {
      setError(
        requestError instanceof Error
          ? requestError.message
          : "Unable to register",
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
          <h2 id="login-title">Register</h2>
          <p>Already have an account? <button type="button" onClick={() => { window.location.href = "/login"; }}>Log in</button></p>
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

          <button className="login-submit" type="submit">Register</button>
        </form>
      </section>
    </main>
  );
}
