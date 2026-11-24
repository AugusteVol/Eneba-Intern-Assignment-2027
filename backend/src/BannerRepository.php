<?php

declare(strict_types=1);

namespace App;

use PDO;

final class BannerRepository
{
    public function __construct(private readonly PDO $database)
    {
    }

    public function findAll(): array
    {
        $statement = $this->database->query(
            "SELECT
                b.id,
                b.product_id,
                p.name,
                p.image_url
             FROM banner b
             INNER JOIN product p ON p.id = b.product_id
             ORDER BY b.id ASC",
        );

        $banners = [];
        foreach ($statement->fetchAll() as $banner) {
            $banners[] = $this->formatBanner($banner);
        }

        return $banners;
    }

    public function findById(int $id): ?array
    {
        $statement = $this->database->prepare(
            "SELECT
                b.id,
                b.product_id,
                p.name,
                p.image_url
             FROM banner b
             INNER JOIN product p ON p.id = b.product_id
             WHERE b.id = :id",
        );
        $statement->execute(["id" => $id]);
        $banner = $statement->fetch();

        return $banner === false ? null : $this->formatBanner($banner);
    }

    private function formatBanner(array $banner): array
    {
        return [
            "id" => (int) $banner["id"],
            "productId" => (int) $banner["product_id"],
            "title" => $banner["name"],
            "imageUrl" => $banner["image_url"] ?? "/images/product-placeholder.svg",
            "linkUrl" => "/products/" . $banner["product_id"],
        ];
    }
}
