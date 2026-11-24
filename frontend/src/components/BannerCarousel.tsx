import { useEffect, useState } from "react";
import { fetchBanners } from "../services/bannerApi";
import type { Banner } from "../types/banner";

export function BannerCarousel() {
  const [banners, setBanners] = useState<Banner[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let active = true;

    fetchBanners()
      .then((items) => {
        if (active) setBanners(items);
      })
      .catch((requestError: unknown) => {
        if (active) {
          setError(
            requestError instanceof Error
              ? requestError.message
              : "Failed to load banners",
          );
        }
      })
      .finally(() => {
        if (active) setLoading(false);
      });

    return () => {
      active = false;
    };
  }, []);

  if (!loading && !error && banners.length === 0) {
    return null;
  }

  return (
    <section className="banner-section" aria-label="Promotions">
      {loading ? (
        <div className="banner-skeleton" />
      ) : error ? (
        <div className="banner-track">
          <div className="banner-card">
            <img src="/images/banner-placeholder.svg" alt="" />
          </div>
        </div>
      ) : (
        <div className="banner-track">
          {banners.map((banner) => (
            <a
              className="banner-card"
              href={banner.linkUrl}
              key={banner.id}
              aria-label={banner.title}
            >
              <img
                src={banner.imageUrl}
                alt={banner.title}
                onError={(event) => {
                  event.currentTarget.src = "/images/banner-placeholder.svg";
                }}
              />
            </a>
          ))}
        </div>
      )}
    </section>
  );
}
