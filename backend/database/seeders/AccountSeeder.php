<?php

declare(strict_types=1);

namespace App\Database\Seeders;

final class AccountSeeder
{
    public static function items(): array
    {
        return [
            [
                "id" => 1,
                "username" => "admin",
                "password_hash" => password_hash("Admin123!", PASSWORD_DEFAULT),
                "role" => "admin",
            ],
            [
                "id" => 2,
                "username" => "demo_user",
                "password_hash" => password_hash("User123!", PASSWORD_DEFAULT),
                "role" => "user",
            ],
            [
                "id" => 3,
                "username" => "market_user",
                "password_hash" => password_hash("Market123!", PASSWORD_DEFAULT),
                "role" => "user",
            ],
        ];
    }
}