<?php

declare(strict_types=1);

namespace App;

use PDO;

final class SellerRepository
{
    public function __construct(private readonly PDO $database)
    {
    }

    public function findAll(): array
    {
        $statement = $this->database->query(
            "SELECT id, name
             FROM seller
             ORDER BY id ASC",
        );

        $sellers = [];
        foreach ($statement->fetchAll() as $seller) {
            $sellers[] = $this->formatSeller($seller);
        }

        return $sellers;
    }

    public function findById(int $id): ?array
    {
        $statement = $this->database->prepare(
            "SELECT id, name
             FROM seller
             WHERE id = :id",
        );
        $statement->execute(["id" => $id]);
        $seller = $statement->fetch();

        return $seller === false ? null : $this->formatSeller($seller);
    }

    public function findAllByProductId(int $productId): array
    {
        $statement = $this->database->prepare(
            "SELECT
                s.id,
                s.name,
                ps.price,
                ps.cashback_percentage
             FROM seller s
             INNER JOIN productSeller ps ON ps.seller_id = s.id
             WHERE ps.product_id = :product_id
             ORDER BY ps.price ASC",
        );
        $statement->execute(["product_id" => $productId]);

        $sellers = [];
        foreach ($statement->fetchAll() as $seller) {
            $sellers[] = [
                "id" => (int) $seller["id"],
                "name" => $seller["name"],
                "price" => (float) $seller["price"],
                "cashbackPercentage" => (float) $seller["cashback_percentage"],
            ];
        }

        return $sellers;
    }

    private function formatSeller(array $seller): array
    {
        return [
            "id" => (int) $seller["id"],
            "name" => $seller["name"],
        ];
    }
}
