<?php

declare(strict_types=1);

namespace App;

use PDO;

final class OrderRepository
{
    public function __construct(private readonly PDO $database)
    {
    }

    public function findByAccountId(int $accountId): array
    {
        $statement = $this->database->prepare(
            "SELECT po.id, po.created_at, po.total, po.payment_method, p.name AS product_name
             FROM purchaseOrder po
             LEFT JOIN purchaseKey pk ON pk.order_id = po.id
             LEFT JOIN product p ON p.id = pk.product_id
             WHERE po.account_id = :account_id
             ORDER BY po.id DESC, pk.id ASC",
        );
        $statement->execute(["account_id" => $accountId]);

        $orders = [];
        foreach ($statement->fetchAll() as $row) {
            $id = (int) $row["id"];
            if (!isset($orders[$id])) {
                $orders[$id] = [
                    "id" => $id,
                    "date" => $row["created_at"],
                    "products" => [],
                    "total" => (float) $row["total"],
                    "paymentMethod" => $row["payment_method"],
                ];
            }
            if ($row["product_name"] !== null) {
                $orders[$id]["products"][] = $row["product_name"];
            }
        }

        return array_values($orders);
    }
}
