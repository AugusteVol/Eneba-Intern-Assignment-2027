import { useEffect, useState } from "react";
import { ProductGrid } from "../components/ProductGrid";
import { fetchAllProducts } from "../services/productApi";
import type { ApiProduct } from "../types/productselleroffer";

interface AllGamesPageProps {
  categoriesOpen: boolean;
  onSelectProduct: (id: number) => void;
}

export function AllGamesPage({ categoriesOpen, onSelectProduct }: AllGamesPageProps) {
  const [products, setProducts] = useState<ApiProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [platforms, setPlatforms] = useState<string[]>([]);
  const [region, setRegion] = useState("");
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");

  useEffect(() => {
    let active = true;
    fetchAllProducts()
      .then((items) => {
        if (active) setProducts(items);
      })
      .catch((requestError: unknown) => {
        if (active) {
          setError(requestError instanceof Error ? requestError.message : "Failed to load products");
        }
      })
      .finally(() => {
        if (active) setLoading(false);
      });
    return () => {
      active = false;
    };
  }, []);

  const availablePlatforms = [...new Set(products.map((product) => product.platform).filter(Boolean))].sort();
  const availableRegions = [...new Set(products.map((product) => product.region).filter(Boolean))].sort();
  const minimum = minPrice === "" ? null : Number(minPrice);
  const maximum = maxPrice === "" ? null : Number(maxPrice);
  const invalidPrice =
    (minimum !== null && (!Number.isFinite(minimum) || minimum < 0)) ||
    (maximum !== null && (!Number.isFinite(maximum) || maximum < 0)) ||
    (minimum !== null && maximum !== null && minimum > maximum);
  const filteredProducts = products.filter((product) => {
    if (platforms.length > 0 && !platforms.includes(product.platform)) return false;
    if (region && product.region !== region) return false;
    if (invalidPrice) return true;
    if (minimum !== null && (product.price === null || product.price < minimum)) return false;
    if (maximum !== null && (product.price === null || product.price > maximum)) return false;
    return true;
  });

  return (
    <section className="cheap-games-page">
      <div className="content-section page-section-heading">
        <h1>All Games</h1>
      </div>
      <div className="cheap-games-layout">
        <div className={`category-filters-wrap${categoriesOpen ? " is-open" : ""}`}>
          <aside id="category-filters" className="category-filters" aria-label="Product filters" aria-hidden={!categoriesOpen} inert={!categoriesOpen}>
            <div className="category-filter-group">
              <h2>Price range (EUR)</h2>
              <div className="category-price-inputs">
                <input type="number" min="0" step="0.01" aria-label="Minimum price" placeholder="Min" value={minPrice} onChange={(event) => setMinPrice(event.target.value)} />
                <span aria-hidden="true">-</span>
                <input type="number" min="0" step="0.01" aria-label="Maximum price" placeholder="Max" value={maxPrice} onChange={(event) => setMaxPrice(event.target.value)} />
              </div>
              {invalidPrice ? <p role="alert">Enter a valid price range.</p> : null}
            </div>
            <div className="category-filter-group">
              <label htmlFor="category-region">Region</label>
              <select id="category-region" value={region} onChange={(event) => setRegion(event.target.value)}>
                <option value="">All regions</option>
                {availableRegions.map((option) => <option value={option} key={option}>{option}</option>)}
              </select>
            </div>
            <fieldset className="category-filter-group">
              <legend>Platform</legend>
              {availablePlatforms.map((platform) => (
                <label className="category-platform" key={platform}>
                  <input
                    type="checkbox"
                    checked={platforms.includes(platform)}
                    onChange={(event) => {
                      const checked = event.target.checked;
                      setPlatforms((selected) => checked
                        ? [...selected, platform]
                        : selected.filter((item) => item !== platform));
                    }}
                  />
                  <span>{platform}</span>
                  <span className="category-platform-count" aria-hidden="true">{products.filter((product) => product.platform === platform).length}</span>
                </label>
              ))}
            </fieldset>
            <button className="category-clear" type="button" onClick={() => {
              setPlatforms([]);
              setRegion("");
              setMinPrice("");
              setMaxPrice("");
            }}>Clear filters</button>
          </aside>
        </div>
        <div className="cheap-games-results">
          <ProductGrid
            products={filteredProducts}
            loading={loading}
            error={error}
            onSelectProduct={onSelectProduct}
            emptyMessage={products.length === 0 ? "No products available." : "No products match your filters."}
          />
        </div>
      </div>
    </section>
  );
}
