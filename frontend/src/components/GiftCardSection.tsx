import type { HomeSection } from "../types/home";

interface GiftCardSectionProps {
  section: HomeSection;
  loading: boolean;
}

export function GiftCardSection({ section, loading }: GiftCardSectionProps) {
  return (
    <section className="content-section gift-card-section">
      <div className="section-heading">
        <h2>{loading ? "" : section.title}</h2>
        {!loading && section.showAllUrl ? <button type="button" disabled>Show all</button> : null}
      </div>
      {loading ? (
        <div className="gift-card-grid">
          {Array.from({ length: 8 }).map((_, index) => <div className="gift-card-skeleton" key={index} />)}
        </div>
      ) : (
        <div className="gift-card-grid">
          {section.items.map((item) => (
            <button className="gift-card" type="button" disabled key={item.id} aria-label={item.title}>
              <img src={item.imageUrl} alt="" onError={(event) => {
                event.currentTarget.src = "/images/gift-card-placeholder.svg";
              }} />
            </button>
          ))}
        </div>
      )}
    </section>
  );
}
