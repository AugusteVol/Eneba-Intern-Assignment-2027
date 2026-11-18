import type { HomeSection } from "../types/home";

interface ProductSectionProps {
  section: HomeSection;
  loading: boolean;
}

export function ProductSection({ section, loading }: ProductSectionProps) {
  return (
    <section className="content-section">
      <div className="section-heading">
        <h2>{loading ? "" : section.title}</h2>
        {!loading && section.showAllUrl ? <button type="button">Show all</button> : null}
      </div>
      {loading ? (
        <div className="product-grid">
          {Array.from({ length: 6 }).map((_, index) => <div className="product-card-skeleton" key={index} />)}
        </div>
      ) : (
        <div className="product-grid">
          {section.items.map((product) => (
            <button className="product-card" type="button" key={product.id}>
              <div className="product-image-wrap">
                <img src={product.imageUrl} alt="" onError={(event) => {
                  event.currentTarget.src = "/images/product-placeholder.svg";
                }} />
                {product.cashbackPercentage ? <span className="cashback">Cashback {product.cashbackPercentage}%</span> : null}
              </div>
              <div className="product-details">
                <span className="product-region">{[product.region, product.platform].filter(Boolean).join(" · ")}</span>
                <strong>{product.title}</strong>
                {product.sellerName ? <span className="seller-name">{product.sellerName}</span> : null}
                <div className="price-row"><span>From</span><strong>€ {product.price.toFixed(2)}</strong></div>
              </div>
            </button>
          ))}
        </div>
      )}
    </section>
  );
}
