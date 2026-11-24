<?php

declare(strict_types=1);

namespace App;

use PDO;
use RuntimeException;
use Throwable;

final class CartRepository
{
    public function __construct(private readonly PDO $database)
    {
    }

    public function findByAccountId(int $accountId): array
    {
        $cartStatement = $this->database->prepare(
            "SELECT id
             FROM cart
             WHERE account_id = :account_id",
        );
        $cartStatement->execute(["account_id" => $accountId]);
        $cartId = $cartStatement->fetchColumn();

        if ($cartId === false) {
            return [];
        }

        return $this->findItemsByCartId((int) $cartId);
    }

    public function addItem(
        int $accountId,
        int $productId,
        int $sellerId,
        int $quantity,
    ): ?array {
        $offerStatement = $this->database->prepare(
            "SELECT 1
             FROM productSeller
             WHERE product_id = :product_id
               AND seller_id = :seller_id",
        );
        $offerStatement->execute([
            "product_id" => $productId,
            "seller_id" => $sellerId,
        ]);

        if ($offerStatement->fetchColumn() === false) {
            return null;
        }

        $this->database->beginTransaction();

        try {
            $cartStatement = $this->database->prepare(
                "INSERT INTO cart (account_id)
                 VALUES (:account_id)
                 ON CONFLICT (account_id) DO NOTHING",
            );
            $cartStatement->execute(["account_id" => $accountId]);

            $cartIdStatement = $this->database->prepare(
                "SELECT id
                 FROM cart
                 WHERE account_id = :account_id",
            );
            $cartIdStatement->execute(["account_id" => $accountId]);
            $cartId = $cartIdStatement->fetchColumn();

            if ($cartId === false) {
                throw new RuntimeException("Unable to create cart");
            }

            $itemStatement = $this->database->prepare(
                "INSERT INTO cartItem (cart_id, product_id, seller_id, quantity)
                 VALUES (:cart_id, :product_id, :seller_id, :quantity)
                 ON CONFLICT (cart_id, product_id, seller_id)
                 DO UPDATE SET quantity = cartItem.quantity + excluded.quantity",
            );
            $itemStatement->execute([
                "cart_id" => (int) $cartId,
                "product_id" => $productId,
                "seller_id" => $sellerId,
                "quantity" => $quantity,
            ]);

            $this->touchCart((int) $cartId);
            $item = $this->findItemByProductSeller(
                (int) $cartId,
                $productId,
                $sellerId,
            );
            $this->database->commit();

            return $item;
        } catch (Throwable $error) {
            if ($this->database->inTransaction()) {
                $this->database->rollBack();
            }

            throw $error;
        }
    }

    public function updateQuantity(int $accountId, int $itemId, int $quantity): bool
    {
        $statement = $this->database->prepare(
            "UPDATE cartItem
             SET quantity = :quantity
             WHERE id = :item_id
               AND cart_id = (
                   SELECT id FROM cart WHERE account_id = :account_id
               )",
        );
        $statement->execute([
            "quantity" => $quantity,
            "item_id" => $itemId,
            "account_id" => $accountId,
        ]);

        if ($statement->rowCount() === 0) {
            return false;
        }

        $this->touchCartByAccountId($accountId);

        return true;
    }

    public function removeItem(int $accountId, int $itemId): bool
    {
        $statement = $this->database->prepare(
            "DELETE FROM cartItem
             WHERE id = :item_id
               AND cart_id = (
                   SELECT id FROM cart WHERE account_id = :account_id
               )",
        );
        $statement->execute([
            "item_id" => $itemId,
            "account_id" => $accountId,
        ]);

        if ($statement->rowCount() === 0) {
            return false;
        }

        $this->touchCartByAccountId($accountId);

        return true;
    }

    public function clear(int $accountId): void
    {
        $statement = $this->database->prepare(
            "DELETE FROM cartItem
             WHERE cart_id = (
                 SELECT id FROM cart WHERE account_id = :account_id
             )",
        );
        $statement->execute(["account_id" => $accountId]);
        $this->touchCartByAccountId($accountId);
    }

    private function findItemsByCartId(int $cartId): array
    {
        $statement = $this->database->prepare(
            "SELECT
                ci.id,
                p.id AS product_id,
                p.name,
                p.image_url,
                p.region,
                p.platform,
                s.id AS seller_id,
                s.name AS seller_name,
                ps.price AS unit_price,
                ci.quantity,
                ps.cashback_percentage
             FROM cartItem ci
             INNER JOIN product p ON p.id = ci.product_id
             INNER JOIN seller s ON s.id = ci.seller_id
             INNER JOIN productSeller ps
                ON ps.product_id = ci.product_id
               AND ps.seller_id = ci.seller_id
             WHERE ci.cart_id = :cart_id
             ORDER BY ci.id ASC",
        );
        $statement->execute(["cart_id" => $cartId]);

        return array_map(
            fn (array $item): array => $this->formatItem($item),
            $statement->fetchAll(),
        );
    }

    private function findItemByProductSeller(
        int $cartId,
        int $productId,
        int $sellerId,
    ): ?array {
        $items = $this->findItemsByCartId($cartId);
        foreach ($items as $item) {
            if ($item["productId"] === $productId && $item["sellerId"] === $sellerId) {
                return $item;
            }
        }

        return null;
    }

    private function formatItem(array $item): array
    {
        $unitPrice = (float) $item["unit_price"];
        $quantity = (int) $item["quantity"];

        return [
            "id" => (int) $item["id"],
            "productId" => (int) $item["product_id"],
            "name" => $item["name"],
            "imageUrl" => $item["image_url"] ?? "/images/product-placeholder.svg",
            "region" => $item["region"],
            "platform" => $item["platform"],
            "sellerId" => (int) $item["seller_id"],
            "sellerName" => $item["seller_name"],
            "unitPrice" => $unitPrice,
            "quantity" => $quantity,
            "cashbackPercentage" => (float) $item["cashback_percentage"],
            "total" => round($unitPrice * $quantity, 2),
        ];
    }

    private function touchCart(int $cartId): void
    {
        $statement = $this->database->prepare(
            "UPDATE cart
             SET updated_at = CURRENT_TIMESTAMP
             WHERE id = :cart_id",
        );
        $statement->execute(["cart_id" => $cartId]);
    }

    private function touchCartByAccountId(int $accountId): void
    {
        $statement = $this->database->prepare(
            "UPDATE cart
             SET updated_at = CURRENT_TIMESTAMP
             WHERE account_id = :account_id",
        );
        $statement->execute(["account_id" => $accountId]);
    }
}
