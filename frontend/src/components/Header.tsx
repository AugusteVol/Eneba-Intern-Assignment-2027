export function Header() {
  return (
    <header className="site-header">
      <div className="header-main">
        <button className="brand" type="button" aria-label="Home">
          <img src="/images/logoFull.svg" alt="Eneba" />
        </button>
        <div className="search" role="search">
          <span className="search-icon" aria-hidden="true" />
          <input type="search" placeholder="Search for games, top-ups and more" aria-label="Search" />
        </div>
        <div className="header-actions">
          <button className="language-button" type="button">
            <span aria-hidden="true">🇪🇺</span><span>English EU | EUR</span>
          </button>
          <button className="icon-button" type="button" aria-label="Favorites">♡</button>
          <button className="icon-button" type="button" aria-label="Cart">🛒</button>
          <div className="account-actions">
            <button className="account-button" type="button" aria-label="Log in">
              <span className="account-icon" aria-hidden="true">●</span>
              <span>Log in</span>
            </button>
            <span className="account-separator" aria-hidden="true">|</span>
            <button className="account-button" type="button" aria-label="Register">Register</button>
          </div>
        </div>
      </div>
      <nav className="header-nav" aria-label="Main navigation">
        <button className="nav-text-button" type="button">☰ Categories</button>
        <button className="nav-text-button" type="button">Cheap Games</button>
        <button className="nav-text-button" type="button">Software</button>
        <button className="nav-text-button" type="button">eGift Cards</button>
        <button className="nav-text-button" type="button">Eneba Gift Cards</button>
      </nav>
    </header>
  );
}
