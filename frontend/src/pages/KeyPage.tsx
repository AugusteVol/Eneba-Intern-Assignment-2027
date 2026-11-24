export function KeyPage() {
  return (
    <section className="key-page" aria-labelledby="key-page-title">
      <h1 id="key-page-title">Your key</h1>

      <div className="key-delivery-card">
        <div className="key-product-overview">
          <div className="key-product-image">
            <img src="/images/product-placeholder.svg" alt="Product placeholder" />
          </div>

          <div className="key-product-information">
            <h2>Product name</h2>
            <div className="key-product-facts">
              <div className="key-product-fact">
                <span className="key-fact-icon key-region-icon" aria-hidden="true">◎</span>
                <div>
                  <span className="key-fact-label">Region</span>
                  <strong>Region details</strong>
                  <span className="key-fact-note">Check activation restrictions</span>
                </div>
              </div>

              <div className="key-product-fact">
                <span className="key-fact-icon key-platform-icon" aria-hidden="true">◉</span>
                <div>
                  <span className="key-fact-label">Platform</span>
                  <strong>Platform name</strong>
                  <span className="key-fact-note">Activation instructions</span>
                </div>
              </div>

              <div className="key-product-fact">
                <span className="key-fact-icon key-code-icon" aria-hidden="true">⚿</span>
                <div>
                  <span className="key-fact-label">Product type</span>
                  <strong>Activation key</strong>
                </div>
              </div>

              <div className="key-product-fact key-compatible-fact">
                <div>
                  <span className="key-fact-label">Compatible with</span>
                  <strong>Platform details</strong>
                </div>
              </div>
            </div>
          </div>
        </div>

        <h3 className="key-code-heading">Digital product code</h3>
        <section className="key-code-panel" aria-label="Product key">
          <div className="key-code-value">
            <strong>XXXXX-XXXXX-XXXXX</strong>
            <button type="button" aria-label="Copy product code">▢</button>
          </div>

          <div className="key-action-buttons">
            <button className="key-activate-button" type="button">
              Activate on platform
            </button>
            <button className="key-gift-button" type="button">
              Print as a gift
            </button>
          </div>

          <div className="key-library-row">
            <span>Not ready to use it yet? You can always find your code in your library.</span>
            <button type="button">My games</button>
          </div>
        </section>

        <p className="key-refund-note">
          This is a digital product. Once a product key has been viewed, it may no longer be eligible for a refund.
        </p>

        <div className="key-seller-row">
          <div className="key-seller-information">
            <span className="key-seller-avatar" aria-hidden="true">★</span>
            <div>
              <span className="key-seller-label">Sold by</span>
              <strong>Seller information</strong>
              <span className="key-seller-rating-placeholder" aria-hidden="true" />
            </div>
          </div>
          <button className="key-report-button" type="button">
            <span aria-hidden="true">⚠</span>
            Report a problem
          </button>
        </div>
      </div>
    </section>
  );
}
