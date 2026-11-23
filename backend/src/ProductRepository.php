<?php

declare(strict_types=1);

namespace App;

use PDO;

final class ProductRepository
{
    public function __construct(private readonly PDO $database)
    {
    }

    public function findAll(): array
    {
        $statement = $this->database->query(
            "SELECT
                p.id,
                p.name,
                p.kind,
                p.region,
                p.platform,
                p.description,
                p.release_date,
                p.publisher,
                p.creators,
                p.languages,
                p.currency_amount,
                MIN(ps.price) AS price,
                (
                    SELECT ps2.cashback_percentage
                    FROM productSeller ps2
                    WHERE ps2.product_id = p.id
                    ORDER BY ps2.price ASC
                    LIMIT 1
                ) AS cashback_percentage
             FROM product p
             LEFT JOIN productSeller ps ON ps.product_id = p.id
             GROUP BY p.id
             ORDER BY p.id ASC",
        );

        $products = [];
        foreach ($statement->fetchAll() as $product) {
            $products[] = $this->formatProduct($product);
        }

        return $products;
    }

    public function findById(int $id): ?array
    {
        $statement = $this->database->prepare(
            "SELECT
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
             FROM product
             WHERE id = :id",
        );
        $statement->execute(["id" => $id]);
        $product = $statement->fetch();

        if ($product === false) {
            return null;
        }

        $sellerStatement = $this->database->prepare(
            "SELECT
                s.id,
                s.name,
                ps.price,
                ps.cashback_percentage
             FROM productSeller ps
             INNER JOIN seller s ON s.id = ps.seller_id
             WHERE ps.product_id = :product_id
             ORDER BY ps.price ASC",
        );
        $sellerStatement->execute(["product_id" => $id]);

        $result = $this->formatProduct($product);
        $result["sellers"] = [];

        foreach ($sellerStatement->fetchAll() as $seller) {
            $result["sellers"][] = [
                "id" => (int) $seller["id"],
                "name" => $seller["name"],
                "price" => (float) $seller["price"],
                "cashbackPercentage" => (float) $seller["cashback_percentage"],
            ];
        }

        return $result;
    }

    private function formatProduct(array $product): array
    {
        $languages = null;
        if ($product["languages"] !== null) {
            $decodedLanguages = json_decode((string) $product["languages"], true);
            $languages = is_array($decodedLanguages) ? $decodedLanguages : null;
        }

        $result = [
            "id" => (int) $product["id"],
            "name" => $product["name"],
            "kind" => $product["kind"],
            "region" => $product["region"],
            "platform" => $product["platform"],
            "description" => $product["description"],
            "releaseDate" => $product["release_date"],
            "publisher" => $product["publisher"],
            "creators" => $product["creators"],
            "languages" => $languages,
            "currencyAmount" => $product["currency_amount"] === null
                ? null
                : (float) $product["currency_amount"],
        ];

        if (array_key_exists("price", $product)) {
            $result["price"] = $product["price"] === null
                ? null
                : (float) $product["price"];
        }

        if (array_key_exists("cashback_percentage", $product)) {
            $result["cashbackPercentage"] = $product["cashback_percentage"] === null
                ? null
                : (float) $product["cashback_percentage"];
        }

        return $result;
    }
}
