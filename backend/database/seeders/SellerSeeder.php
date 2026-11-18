<?php

declare(strict_types=1);

namespace App\Database\Seeders;

final class SellerSeeder
{
    public static function items(): array
    {
        return [
            [
                "id" => 1,
                "name" => "Digital Games Store",
            ],
            [
                "id" => 2,
                "name" => "Global Keys",
            ],
            [
                "id" => 3,
                "name" => "Instant Games",
            ],
        ];
    }
}
