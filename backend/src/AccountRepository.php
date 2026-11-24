<?php

declare(strict_types=1);

namespace App;

use PDO;

final class AccountRepository
{
    public function __construct(private readonly PDO $database)
    {
    }

    public function findAll(): array
    {
        $statement = $this->database->query(
            "SELECT id, username, role
             FROM account
             ORDER BY id ASC",
        );

        $accounts = [];
        foreach ($statement->fetchAll() as $account) {
            $accounts[] = $this->formatAccount($account);
        }

        return $accounts;
    }

    public function findById(int $id): ?array
    {
        $statement = $this->database->prepare(
            "SELECT id, username, role
             FROM account
             WHERE id = :id",
        );
        $statement->execute(["id" => $id]);
        $account = $statement->fetch();

        return $account === false ? null : $this->formatAccount($account);
    }

    public function findByUsername(string $username): ?array
    {
        $statement = $this->database->prepare(
            "SELECT id, username, role
             FROM account
             WHERE username = :username",
        );
        $statement->execute(["username" => $username]);
        $account = $statement->fetch();

        return $account === false ? null : $this->formatAccount($account);
    }

    public function create(string $username, string $password, string $role): array
    {
        $statement = $this->database->prepare(
            "INSERT INTO account (username, password_hash, role)
             VALUES (:username, :password_hash, :role)",
        );
        $statement->execute([
            "username" => $username,
            "password_hash" => password_hash($password, PASSWORD_DEFAULT),
            "role" => $role,
        ]);

        $id = (int) $this->database->lastInsertId();
        return $this->findById($id) ?? [];
    }

    public function authenticate(string $username, string $password): ?array
    {
        $statement = $this->database->prepare(
            "SELECT id, username, password_hash, role
             FROM account
             WHERE username = :username",
        );
        $statement->execute(["username" => $username]);
        $account = $statement->fetch();

        if ($account === false) {
            return null;
        }

        if (!password_verify($password, (string) $account["password_hash"])) {
            return null;
        }

        return $this->formatAccount($account);
    }

    private function formatAccount(array $account): array
    {
        return [
            "id" => (int) $account["id"],
            "username" => $account["username"],
            "role" => $account["role"],
        ];
    }
}
