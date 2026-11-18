import type { Category } from "../types/home";

interface CategoryRailProps {
  categories: Category[];
  loading: boolean;
}

export function CategoryRail({ categories, loading }: CategoryRailProps) {
  return (
    <section className="category-section" aria-label="Categories">
      {loading ? (
        <div className="category-skeletons">
          {Array.from({ length: 8 }).map((_, index) => (
            <div className="category-skeleton" key={index} />
          ))}
        </div>
      ) : (
        <div className="category-track">
          {categories.map((category) => (
            <button className="category-card" type="button" disabled key={category.id}>
              {category.iconUrl ? <img src={category.iconUrl} alt="" /> : <span className="category-icon-placeholder" />}
              <span>{category.name}</span>
            </button>
          ))}
        </div>
      )}
    </section>
  );
}
