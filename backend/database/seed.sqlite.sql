DROP TABLE IF EXISTS cartItem;
DROP TABLE IF EXISTS cart;
DROP TABLE IF EXISTS banner;
DROP TABLE IF EXISTS productSeller;
DROP TABLE IF EXISTS product;
DROP TABLE IF EXISTS seller;
DROP TABLE IF EXISTS account;

CREATE TABLE account (
    id INTEGER PRIMARY KEY,
    username TEXT NOT NULL UNIQUE,
    password_hash TEXT NOT NULL,
    role TEXT NOT NULL CHECK (role IN ('admin', 'user'))
);
DROP TABLE IF EXISTS account;

CREATE TABLE account (
    id INTEGER PRIMARY KEY,
    username TEXT NOT NULL UNIQUE,
    password_hash TEXT NOT NULL,
    role TEXT NOT NULL CHECK (role IN ('admin', 'user'))
);

CREATE TABLE seller (
    id INTEGER PRIMARY KEY,
    name TEXT NOT NULL
);

CREATE TABLE product (
    id INTEGER PRIMARY KEY,
    name TEXT NOT NULL,
    kind TEXT NOT NULL CHECK (kind IN ('game_key', 'game_currency_key')),
    region TEXT NOT NULL,
    platform TEXT NOT NULL,
    description TEXT NOT NULL,
    release_date TEXT NOT NULL,
    publisher TEXT NOT NULL,
    creators TEXT NOT NULL,
    languages TEXT,
    currency_amount REAL,
    image_url TEXT NULL
);

CREATE TABLE productSeller (
    product_id INTEGER NOT NULL,
    seller_id INTEGER NOT NULL,
    price REAL NOT NULL,
    cashback_percentage REAL NOT NULL,
    PRIMARY KEY (product_id, seller_id),
    FOREIGN KEY (product_id) REFERENCES product(id) ON DELETE CASCADE,
    FOREIGN KEY (seller_id) REFERENCES seller(id) ON DELETE CASCADE
);

CREATE TABLE cart (
    id INTEGER PRIMARY KEY,
    account_id INTEGER NOT NULL UNIQUE,
    created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (account_id) REFERENCES account(id) ON DELETE CASCADE
);

CREATE TABLE cartItem (
    id INTEGER PRIMARY KEY,
    cart_id INTEGER NOT NULL,
    product_id INTEGER NOT NULL,
    seller_id INTEGER NOT NULL,
    quantity INTEGER NOT NULL DEFAULT 1 CHECK (quantity > 0),
    added_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
    UNIQUE (cart_id, product_id, seller_id),
    FOREIGN KEY (cart_id) REFERENCES cart(id) ON DELETE CASCADE,
    FOREIGN KEY (product_id, seller_id)
        REFERENCES productSeller(product_id, seller_id) ON DELETE CASCADE
);

CREATE TABLE banner (
    id INTEGER PRIMARY KEY,
    product_id INTEGER NOT NULL,
    FOREIGN KEY (product_id) REFERENCES product(id) ON DELETE CASCADE
);

INSERT INTO seller (id, name) VALUES
    (1, 'Digital Games Store'),
    (2, 'Global Keys'),
    (3, 'Instant Games');

INSERT INTO product (
    id, name, kind, region, platform, description, release_date,
    publisher, creators, languages, currency_amount, image_url
) VALUES
    (1, 'Cyberpunk 2077', 'game_key', 'Global', 'Steam', 'An open-world action-adventure game set in Night City.', '2020-12-10', 'CD Projekt', 'CD Projekt Red', '["English","French","German","Polish"]', NULL, '/images/products/cyberpunk-2077.jpg'),
    (2, 'Fortnite', 'game_currency_key', 'Global', 'Epic Games Store', 'A digital package for Fortnite in-game currency.', '2017-07-21', 'Epic Games', 'Epic Games', NULL, 1000.0, '/images/products/fortnite.jpg'),
    (3, 'Grand Theft Auto V', 'game_key', 'Europe', 'RockStar Games Launcher', 'An action-adventure game set in the city of Los Santos.', '2015-04-14', 'Rockstar Games', 'Rockstar North', '["English","French","Italian","German","Spanish"]', NULL, '/images/products/grand-theft-auto-v.jpg'),
    (4, 'EA Sports FC 25', 'game_currency_key', 'Europe', 'Origin/EA App', 'A digital package for EA Sports FC Ultimate Team currency.', '2024-09-27', 'Electronic Arts', 'EA Vancouver', '["English","French","Spanish"]', 2800.0, '/images/products/ea-sports-fc-25.jpg'),
    (5, 'The Witcher 3: Wild Hunt', 'game_key', 'Global', 'GOG.com', 'A story-driven open-world RPG.', '2015-05-18', 'CD Projekt', 'CD Projekt Red', '["English","French","German","Japanese"]', NULL, '/images/products/the-witcher-3-wild-hunt.jpg'),
    (6, 'PlayStation Plus', 'game_currency_key', 'North America', 'PSN', 'A PlayStation Network wallet or membership currency package.', '2022-06-13', 'Sony Interactive Entertainment', 'Sony Interactive Entertainment', NULL, 50.0, '/images/products/playstation-plus.jpg'),
    (7, 'Assassin''s Creed Valhalla', 'game_key', 'Global', 'Ubisoft Connect', 'A Viking-age open-world action RPG.', '2020-11-10', 'Ubisoft', 'Ubisoft Montreal', '["English","French","Arabic","Russian"]', NULL, '/images/products/assassins-creed-valhalla.jpg'),
    (8, 'Xbox Gift Card', 'game_currency_key', 'United States', 'XboxLive', 'A digital gift card for the Xbox and Microsoft store.', '2013-09-12', 'Microsoft', 'Microsoft', NULL, 25.75, '/images/products/xbox-gift-card.jpg'),
    (9, 'The Legend of Zelda: Tears of the Kingdom', 'game_key', 'Japan', 'Nintendo', 'An open-world adventure set across the lands and skies of Hyrule.', '2023-05-12', 'Nintendo', 'Nintendo', '["English","Japanese","French","German"]', NULL, '/images/products/the-legend-of-zelda-tears-of-the-kingdom.jpg');

INSERT INTO productSeller (product_id, seller_id, price, cashback_percentage) VALUES
    (1, 1, 29.99, 4.5),
    (1, 2, 27.49, 6.0),
    (1, 3, 31.25, 3.0),
    (2, 1, 8.99, 5.0),
    (2, 2, 8.49, 7.5),
    (3, 2, 18.75, 5.5),
    (3, 3, 20.25, 2.5),
    (4, 1, 24.50, 4.0),
    (4, 3, 22.99, 6.5),
    (5, 1, 12.99, 3.5),
    (5, 2, 11.49, 8.0),
    (6, 2, 44.99, 5.0),
    (6, 3, 46.25, 2.0),
    (7, 1, 34.99, 4.5),
    (7, 3, 32.75, 7.0),
    (8, 1, 24.99, 5.0),
    (8, 2, 23.49, 6.0),
    (9, 2, 55.99, 3.5),
    (9, 3, 57.25, 2.5);

INSERT INTO banner (id, product_id) VALUES
    (1, 1),
    (2, 2),
    (3, 3),
    (4, 4);
