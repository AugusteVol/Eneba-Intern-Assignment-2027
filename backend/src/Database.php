<?php

declare(strict_types=1);

namespace App;

use PDO;
use RuntimeException;

final class Database
{
    public static function connection(): PDO
    {
        throw new RuntimeException("Database configuration is not implemented.");
    }
}
