<?php

declare(strict_types=1);

namespace App;

use PDO;
use PDOException;
use RuntimeException;

final class KeyRepository
{
    private const MAX_GENERATION_ATTEMPTS = 5;

    public function __construct(private readonly PDO $database)
    {
    }

    public function generateKey(): string
    {
        return strtoupper(bin2hex(random_bytes(8)));
    }

    public function createForOrder(
        int $orderId,
        int $productId,
        int $sellerId,
        float $unitPrice,
    ): array {
        $statement = $this->database->prepare(
            "INSERT INTO purchaseKey (order_id, product_id, seller_id, unit_price, key_value)
             VALUES (:order_id, :product_id, :seller_id, :unit_price, :key_value)",
        );

        for ($attempt = 0; $attempt < self::MAX_GENERATION_ATTEMPTS; $attempt++) {
            $keyValue = $this->generateKey();

            try {
                $statement->execute([
                    "order_id" => $orderId,
                    "product_id" => $productId,
                    "seller_id" => $sellerId,
                    "unit_price" => $unitPrice,
                    "key_value" => $keyValue,
                ]);

                return [
                    "id" => (int) $this->database->lastInsertId(),
                    "orderId" => $orderId,
                    "productId" => $productId,
                    "sellerId" => $sellerId,
                    "unitPrice" => $unitPrice,
                    "keyValue" => $keyValue,
                ];
            } catch (PDOException $exception) {
                $isDuplicateKey = str_contains(
                    $exception->getMessage(),
                    "UNIQUE constraint failed: purchaseKey.key_value",
                );

                if (!$isDuplicateKey) {
                    throw $exception;
                }
            }
        }

        throw new RuntimeException("Unable to generate a unique key");
    }

    public function findByAccountId(int $accountId, ?int $orderId = null): array
    {
        $statement = $this->database->prepare(
            "SELECT
                pk.id,
                pk.order_id,
                pk.product_id,
                pk.seller_id,
                p.name AS product_name,
                pk.unit_price,
                pk.key_value,
                po.created_at
             FROM purchaseKey pk
             INNER JOIN purchaseOrder po ON po.id = pk.order_id
             INNER JOIN product p ON p.id = pk.product_id
             WHERE po.account_id = :account_id
               AND (:order_id IS NULL OR po.id = :order_id)
             ORDER BY po.id DESC, pk.id ASC",
        );
        $statement->execute(["account_id" => $accountId, "order_id" => $orderId]);

        return array_map(
            fn (array $key): array => $this->formatKey($key),
            $statement->fetchAll(),
        );
    }

    private function formatKey(array $key): array
    {
        return [
            "id" => (int) $key["id"],
            "orderId" => (int) $key["order_id"],
            "productId" => (int) $key["product_id"],
            "sellerId" => $key["seller_id"] === null ? null : (int) $key["seller_id"],
            "productName" => $key["product_name"],
            "unitPrice" => (float) $key["unit_price"],
            "keyValue" => $key["key_value"],
            "createdAt" => $key["created_at"],
        ];
    }
}
