<?php

declare(strict_types=1);

namespace App;

use PDO;

final class Database
{
    public static function connection(): PDO
    {
        $databaseFile = dirname(__DIR__) . "/database/database.sqlite";
        $database = new PDO("sqlite:" . $databaseFile);
        $database->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
        $database->setAttribute(PDO::ATTR_DEFAULT_FETCH_MODE, PDO::FETCH_ASSOC);
        $database->exec("PRAGMA foreign_keys = ON");

        return $database;
    }
}
