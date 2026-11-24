import type { Category } from "../types/home";

interface CategoryRailProps {
  categories: Category[];
  loading: boolean;
}

export function CategoryRail({ loading }: CategoryRailProps) {
  return (
    <section className="category-section" aria-label="Categories">
      {loading ? (
        <div className="category-skeleton" />
      ) : (
        <div className="games-menu">
          <button className="category-card" type="button">
            <span className="category-icon-placeholder games-icon" aria-hidden="true">+</span>
            <span>Games</span>
          </button>
          <button className="category-card" type="button">
            <span className="category-icon-placeholder games-icon" aria-hidden="true">+</span>
            <span>Game Cards</span>
          </button>
          <button className="category-card" type="button">
            <span className="category-icon-placeholder games-icon" aria-hidden="true">+</span>
            <span>eGift Cards</span>
          </button>
          <button className="category-card" type="button">
            <span className="category-icon-placeholder games-icon" aria-hidden="true">+</span>
            <span>E-money</span>
          </button>
          <button className="category-card" type="button">
            <span className="category-icon-placeholder games-icon" aria-hidden="true">+</span>
            <span>Steam</span>
          </button>
          <button className="category-card" type="button">
            <span className="category-icon-placeholder games-icon" aria-hidden="true">+</span>
            <span>Steam Gift</span>
          </button>
          <button className="category-card" type="button">
            <span className="category-icon-placeholder games-icon" aria-hidden="true">+</span>
            <span>PSN</span>
          </button>
          <button className="category-card" type="button">
            <span className="category-icon-placeholder games-icon" aria-hidden="true">+</span>
            <span>Xbox</span>
          </button>
          <button className="category-card" type="button">
            <span className="category-icon-placeholder games-icon" aria-hidden="true">+</span>
            <span>FIFA</span>
          </button>
          <button className="category-card" type="button">
            <span className="category-icon-placeholder games-icon" aria-hidden="true">+</span>
            <span>Fortnite</span>
          </button>
          <button className="category-card" type="button">
            <span className="category-icon-placeholder games-icon" aria-hidden="true">+</span>
            <span>Amazon</span>
          </button>
        </div>
      )}
    </section>
  );
}
