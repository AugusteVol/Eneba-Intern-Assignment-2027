import { useState } from "react";
import type { FormEvent, KeyboardEvent } from "react";

interface HeaderProps {
  onCheapGames: () => void;
  onHome: () => void;
  onSearch: (query: string) => void;
  onLogin: () => void;
  onRegister: () => void;
  accountUsername?: string;
  onLogout: () => void;
  onCart: () => void;
  onFavorites: () => void;
}

export function Header({
  onCheapGames,
  onHome,
  onSearch,
  onLogin,
  onRegister,
  accountUsername,
  onLogout,
  onCart,
  onFavorites,
}: HeaderProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [accountMenuOpen, setAccountMenuOpen] = useState(false);

  const submitSearch = () => {
    const query = searchQuery.trim();
    if (query) onSearch(query);
  };

  const handleSearchSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    submitSearch();
  };

  const handleSearchKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Enter") {
      event.preventDefault();
      submitSearch();
    }
  };

  return (
    <header className="site-header">
      <div className="header-main">
        <button className="brand" type="button" aria-label="Home" onClick={onHome}>
          <img src="/images/logoFull.svg" alt="Eneba" />
        </button>
        <form className="search" role="search" onSubmit={handleSearchSubmit}>
          <span className="search-icon" aria-hidden="true" />
          <input
            name="search"
            type="search"
            placeholder="Search for games, top-ups and more"
            aria-label="Search"
            value={searchQuery}
            onChange={(event) => setSearchQuery(event.target.value)}
            onKeyDown={handleSearchKeyDown}
          />
          <button
            className="search-submit"
            type="button"
            aria-label="Submit search"
            onClick={submitSearch}
          >
            Search
          </button>
        </form>
        <div className="header-actions">
          <button className="language-button" type="button">
            <span aria-hidden="true">🇪🇺</span><span>English EU | EUR</span>
          </button>
          <button className="icon-button" type="button" aria-label="Favorites" onClick={onFavorites}>♡</button>
          <button className="icon-button" type="button" aria-label="Cart" onClick={onCart}>🛒</button>
          <div className="account-actions">
            {accountUsername ? (
              <div className="account-menu">
                <button
                  className="account-button account-username"
                  type="button"
                  aria-expanded={accountMenuOpen}
                  onClick={() => setAccountMenuOpen((open) => !open)}
                >
                  <span className="account-icon" aria-hidden="true">●</span>
                  <span>{accountUsername}</span>
                </button>
                {accountMenuOpen ? (
                  <button
                    className="logout-button"
                    type="button"
                    onClick={() => {
                      setAccountMenuOpen(false);
                      onLogout();
                    }}
                  >
                    Log out
                  </button>
                ) : null}
              </div>
            ) : (
              <>
                <button className="account-button" type="button" aria-label="Log in" onClick={onLogin}>
                  <span className="account-icon" aria-hidden="true">●</span>
                  <span>Log in</span>
                </button>
                <span className="account-separator" aria-hidden="true">|</span>
                <button className="account-button" type="button" aria-label="Register" onClick={onRegister}>Register</button>
              </>
            )}
          </div>
        </div>
      </div>
      <nav className="header-nav" aria-label="Main navigation">
        <button className="nav-text-button" type="button">☰ Categories</button>
        <button className="nav-text-button" type="button" onClick={onCheapGames}>Cheap Games</button>
        <button className="nav-text-button" type="button">Software</button>
        <button className="nav-text-button" type="button">eGift Cards</button>
        <button className="nav-text-button" type="button">Eneba Gift Cards</button>
      </nav>
    </header>
  );
}
