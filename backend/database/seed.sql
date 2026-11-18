CREATE TABLE IF NOT EXISTS seller (
    id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
    name VARCHAR(255) NOT NULL,
    PRIMARY KEY (id)
) ENGINE = InnoDB;

CREATE TABLE IF NOT EXISTS product (
    id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
    name VARCHAR(255) NOT NULL,
    kind VARCHAR(32) NOT NULL,
    region VARCHAR(255) NOT NULL,
    platform VARCHAR(255) NOT NULL,
    description TEXT NOT NULL,
    release_date VARCHAR(255) NOT NULL,
    publisher VARCHAR(255) NOT NULL,
    creators VARCHAR(255) NOT NULL,
    languages JSON NULL,
    currency_amount DOUBLE NULL,
    PRIMARY KEY (id),
    CONSTRAINT chk_product_kind CHECK (kind IN ('game_key', 'game_currency_key'))
) ENGINE = InnoDB;

CREATE TABLE IF NOT EXISTS productSeller (
    product_id BIGINT UNSIGNED NOT NULL,
    seller_id BIGINT UNSIGNED NOT NULL,
    price DOUBLE NOT NULL,
    cashback_percentage DOUBLE NOT NULL,
    PRIMARY KEY (product_id, seller_id),
    CONSTRAINT fk_productSeller_product
        FOREIGN KEY (product_id) REFERENCES product (id)
        ON DELETE CASCADE,
    CONSTRAINT fk_productSeller_seller
        FOREIGN KEY (seller_id) REFERENCES seller (id)
        ON DELETE CASCADE
) ENGINE = InnoDB;

INSERT INTO seller (id, name) VALUES
    (1, 'Digital Games Store'),
    (2, 'Global Keys'),
    (3, 'Instant Games');

INSERT INTO product (
    id,
    name,
    kind,
    region,
    platform,
    description,
    release_date,
    publisher,
    creators,
    languages,
    currency_amount
) VALUES
    (1, 'Cyberpunk 2077', 'game_key', 'Global', 'Steam', 'An open-world action-adventure game set in Night City.', '2020-12-10', 'CD Projekt', 'CD Projekt Red', JSON_ARRAY('English', 'French', 'German', 'Polish'), NULL),
    (2, 'Fortnite', 'game_currency_key', 'Global', 'Epic Games Store', 'A digital package for Fortnite in-game currency.', '2017-07-21', 'Epic Games', 'Epic Games', NULL, 1000.0),
    (3, 'Grand Theft Auto V', 'game_key', 'Europe', 'RockStar Games Launcher', 'An action-adventure game set in the city of Los Santos.', '2015-04-14', 'Rockstar Games', 'Rockstar North', JSON_ARRAY('English', 'French', 'Italian', 'German', 'Spanish'), NULL),
    (4, 'EA Sports FC 25', 'game_currency_key', 'Europe', 'Origin/EA App', 'A digital package for EA Sports FC Ultimate Team currency.', '2024-09-27', 'Electronic Arts', 'EA Vancouver', JSON_ARRAY('English', 'French', 'Spanish'), 2800.0),
    (5, 'The Witcher 3: Wild Hunt', 'game_key', 'Global', 'GOG.com', 'A story-driven open-world RPG.', '2015-05-18', 'CD Projekt', 'CD Projekt Red', JSON_ARRAY('English', 'French', 'German', 'Japanese'), NULL),
    (6, 'PlayStation Plus', 'game_currency_key', 'North America', 'PSN', 'A PlayStation Network wallet or membership currency package.', '2022-06-13', 'Sony Interactive Entertainment', 'Sony Interactive Entertainment', NULL, 50.0),
    (7, 'Assassins Creed Valhalla', 'game_key', 'Global', 'Ubisoft Connect', 'A Viking-age open-world action RPG.', '2020-11-10', 'Ubisoft', 'Ubisoft Montreal', JSON_ARRAY('English', 'French', 'Arabic', 'Russian'), NULL),
    (8, 'Xbox Gift Card', 'game_currency_key', 'United States', 'XboxLive', 'A digital gift card for the Xbox and Microsoft store.', '2013-09-12', 'Microsoft', 'Microsoft', NULL, 25.75),
    (9, 'The Legend of Zelda: Tears of the Kingdom', 'game_key', 'Japan', 'Nintendo', 'An open-world adventure set across the lands and skies of Hyrule.', '2023-05-12', 'Nintendo', 'Nintendo', JSON_ARRAY('English', 'Japanese', 'French', 'German'), NULL);

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
