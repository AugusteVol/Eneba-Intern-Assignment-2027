<?php

declare(strict_types=1);

namespace App\Database\Seeders;

final class BannerSeeder
{
    public static function items(): array
    {
        return [
            [
                "id" => 1,
                "product_id" => 1, // Cyberpunk 2077
            ],
            [
                "id" => 2,
                "product_id" => 2, // Fortnite
            ],
            [
                "id" => 3,
                "product_id" => 3, // Grand Theft Auto V
            ],
            [
                "id" => 4,
                "product_id" => 4, // EA Sports FC 25
            ],
        ];
    }
}
