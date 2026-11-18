import type { Banner } from "../types/home";

interface BannerCarouselProps {
  banners: Banner[];
  loading: boolean;
}

export function BannerCarousel({ banners, loading }: BannerCarouselProps) {
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
