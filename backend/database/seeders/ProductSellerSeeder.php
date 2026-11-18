<?php

declare(strict_types=1);

namespace App\Database\Seeders;

final class ProductSellerSeeder
{
    public static function items(): array
    {
        return [
            ["product_id" => 1, "seller_id" => 1, "price" => 29.99, "cashback_percentage" => 4.5],
            ["product_id" => 1, "seller_id" => 2, "price" => 27.49, "cashback_percentage" => 6.0],
            ["product_id" => 1, "seller_id" => 3, "price" => 31.25, "cashback_percentage" => 3.0],
            ["product_id" => 2, "seller_id" => 1, "price" => 8.99, "cashback_percentage" => 5.0],
            ["product_id" => 2, "seller_id" => 2, "price" => 8.49, "cashback_percentage" => 7.5],
            ["product_id" => 3, "seller_id" => 2, "price" => 18.75, "cashback_percentage" => 5.5],
            ["product_id" => 3, "seller_id" => 3, "price" => 20.25, "cashback_percentage" => 2.5],
            ["product_id" => 4, "seller_id" => 1, "price" => 24.50, "cashback_percentage" => 4.0],
            ["product_id" => 4, "seller_id" => 3, "price" => 22.99, "cashback_percentage" => 6.5],
            ["product_id" => 5, "seller_id" => 1, "price" => 12.99, "cashback_percentage" => 3.5],
            ["product_id" => 5, "seller_id" => 2, "price" => 11.49, "cashback_percentage" => 8.0],
            ["product_id" => 6, "seller_id" => 2, "price" => 44.99, "cashback_percentage" => 5.0],
            ["product_id" => 6, "seller_id" => 3, "price" => 46.25, "cashback_percentage" => 2.0],
            ["product_id" => 7, "seller_id" => 1, "price" => 34.99, "cashback_percentage" => 4.5],
            ["product_id" => 7, "seller_id" => 3, "price" => 32.75, "cashback_percentage" => 7.0],
            ["product_id" => 8, "seller_id" => 1, "price" => 24.99, "cashback_percentage" => 5.0],
            ["product_id" => 8, "seller_id" => 2, "price" => 23.49, "cashback_percentage" => 6.0],
            ["product_id" => 9, "seller_id" => 2, "price" => 55.99, "cashback_percentage" => 3.5],
            ["product_id" => 9, "seller_id" => 3, "price" => 57.25, "cashback_percentage" => 2.5],
        ];
    }
}
