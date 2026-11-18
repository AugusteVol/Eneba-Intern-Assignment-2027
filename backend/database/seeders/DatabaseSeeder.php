<?php

declare(strict_types=1);

namespace App\Database\Seeders;

final class DatabaseSeeder
{
    public function run(): array
    {
        return [
            "sellers" => SellerSeeder::items(),
            "products" => ProductSeeder::items(),
            "product_sellers" => ProductSellerSeeder::items(),
        ];
    }
}
