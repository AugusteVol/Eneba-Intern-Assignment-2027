import { useEffect, useState } from "react";
import { fetchProductById } from "../services/homeApi";
import type { ApiProduct, Banner } from "../types/home";

const bannerProductIds = [1, 2, 3, 4];

export function BannerCarousel() {
  const [banners, setBanners] = useState<Banner[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;

    Promise.all(bannerProductIds.map((id) => fetchProductById(id)))
      .then((products: ApiProduct[]) => {
        if (!active) return;

        setBanners(
          products.map((product) => ({
            id: String(product.id),
            title: product.name,
            imageUrl: product.imageUrl || "/images/banner-placeholder.svg",
          })),
        );
      })
      .catch(() => {
        if (!active) return;

        setBanners(
          bannerProductIds.map((id) => ({
            id: String(id),
            title: `Product ${id}`,
            imageUrl: "/images/banner-placeholder.svg",
          })),
        );
      })
      .finally(() => {
        if (active) setLoading(false);
      });

    return () => {
      active = false;
    };
  }, []);

  return (
    <section className="banner-section" aria-label="Promotions">
      {loading ? (
        <div className="banner-skeleton" />
      ) : (
        <div className="banner-track">
          {banners.map((banner) => (
            <button className="banner-card" type="button" disabled key={banner.id} aria-label={banner.title}>
              <img
                src={banner.imageUrl}
                alt=""
                onError={(event) => {
                  event.currentTarget.src = "/images/banner-placeholder.svg";
                }}
              />
            </button>
          ))}
        </div>
      )}
    </section>
  );
}
