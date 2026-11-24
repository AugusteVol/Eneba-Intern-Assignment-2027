<?php

declare(strict_types=1);

require_once __DIR__ . "/seeders/SellerSeeder.php";
require_once __DIR__ . "/seeders/ProductSeeder.php";
require_once __DIR__ . "/seeders/ProductSellerSeeder.php";
require_once __DIR__ . "/seeders/AccountSeeder.php";
require_once __DIR__ . "/seeders/BannerSeeder.php";

use App\Database\Seeders\SellerSeeder;
use App\Database\Seeders\ProductSeeder;
use App\Database\Seeders\ProductSellerSeeder;
use App\Database\Seeders\AccountSeeder;
use App\Database\Seeders\BannerSeeder;

$databaseFile = __DIR__ . "/database.sqlite";

if (file_exists($databaseFile)) {
    unlink($databaseFile);
}

$database = new PDO("sqlite:" . $databaseFile);
$database->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
$database->exec("PRAGMA foreign_keys = ON");

$database->exec("
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
");

$sellerStatement = $database->prepare(
    "INSERT INTO seller (id, name) VALUES (:id, :name)",
);
foreach (SellerSeeder::items() as $seller) {
    $sellerStatement->execute([
        "id" => $seller["id"],
        "name" => $seller["name"],
    ]);
}

$productStatement = $database->prepare(
    "INSERT INTO product (
        id, name, kind, region, platform, description,
        release_date, publisher, creators, languages, currency_amount, image_url
    ) VALUES (
        :id, :name, :kind, :region, :platform, :description,
        :release_date, :publisher, :creators, :languages, :currency_amount
        , :image_url
    )",
);
foreach (ProductSeeder::items() as $product) {
    $productStatement->execute([
        "id" => $product["id"],
        "name" => $product["name"],
        "kind" => $product["kind"],
        "region" => $product["region"],
        "platform" => $product["platform"],
        "description" => $product["description"],
        "release_date" => $product["release_date"],
        "publisher" => $product["publisher"],
        "creators" => $product["creators"],
        "languages" => $product["languages"] === null
            ? null
            : json_encode($product["languages"], JSON_UNESCAPED_UNICODE),
        "currency_amount" => $product["currency_amount"],
        "image_url" => $product["image_url"],
    ]);
}

$bannerStatement = $database->prepare(
    "INSERT INTO banner (id, product_id) VALUES (:id, :product_id)",
);
foreach (BannerSeeder::items() as $banner) {
    $bannerStatement->execute([
        "id" => $banner["id"],
        "product_id" => $banner["product_id"],
    ]);
}

$offerStatement = $database->prepare(
    "INSERT INTO productSeller (
        product_id, seller_id, price, cashback_percentage
    ) VALUES (
        :product_id, :seller_id, :price, :cashback_percentage
    )",
);
foreach (ProductSellerSeeder::items() as $offer) {
    $offerStatement->execute([
        "product_id" => $offer["product_id"],
        "seller_id" => $offer["seller_id"],
        "price" => $offer["price"],
        "cashback_percentage" => $offer["cashback_percentage"],
    ]);
}

$accountStatement = $database->prepare(
    "INSERT INTO account (id, username, password_hash, role)
     VALUES (:id, :username, :password_hash, :role)",
);
foreach (AccountSeeder::items() as $account) {
    $accountStatement->execute([
        "id" => $account["id"],
        "username" => $account["username"],
        "password_hash" => $account["password_hash"],
        "role" => $account["role"],
    ]);
}
