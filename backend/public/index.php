<?php

declare(strict_types=1);

require_once dirname(__DIR__) . "/src/Database.php";
require_once dirname(__DIR__) . "/src/ProductRepository.php";
require_once dirname(__DIR__) . "/src/SellerRepository.php";
require_once dirname(__DIR__) . "/src/AccountRepository.php";

use App\Database;
use App\ProductRepository;
use App\SellerRepository;
use App\AccountRepository;

header("Content-Type: application/json");

$method = $_SERVER["REQUEST_METHOD"] ?? "GET";
$requestUri = parse_url($_SERVER["REQUEST_URI"] ?? "/", PHP_URL_PATH);
$path = rtrim((string) $requestUri, "/");

try {
    $database = Database::connection();
    $productRepository = new ProductRepository($database);
    $sellerRepository = new SellerRepository($database);
    $accountRepository = new AccountRepository($database);

    if ($method === "POST" && $path === "/accounts") {
        $body = json_decode((string) file_get_contents("php://input"), true);

        if (!is_array($body)) {
            http_response_code(400);
            echo json_encode(["error" => "Invalid JSON body"]);
            exit;
        }

        $username = trim((string) ($body["username"] ?? ""));
        $password = (string) ($body["password"] ?? "");
        $role = (string) ($body["role"] ?? "user");

        if ($username === "" || $password === "") {
            http_response_code(400);
            echo json_encode(["error" => "Username and password are required"]);
            exit;
        }

        if (!in_array($role, ["admin", "user"], true)) {
            http_response_code(400);
            echo json_encode(["error" => "Role must be admin or user"]);
            exit;
        }

        if ($accountRepository->findByUsername($username) !== null) {
            http_response_code(409);
            echo json_encode(["error" => "Username already exists"]);
            exit;
        }

        $account = $accountRepository->create($username, $password, $role);
        http_response_code(201);
        echo json_encode($account, JSON_UNESCAPED_UNICODE);
        exit;
    }

    if ($method !== "GET") {
        http_response_code(405);
        header("Allow: GET, POST");
        echo json_encode(["error" => "Method not allowed"]);
        exit;
    }

    if ($path === "/accounts") {
        http_response_code(200);
        echo json_encode($accountRepository->findAll(), JSON_UNESCAPED_UNICODE);
        exit;
    }

    if (preg_match('#^/accounts/([1-9][0-9]*)$#', $path, $matches)) {
        $account = $accountRepository->findById((int) $matches[1]);

        if ($account === null) {
            http_response_code(404);
            echo json_encode(["error" => "Account not found"]);
            exit;
        }

        http_response_code(200);
        echo json_encode($account, JSON_UNESCAPED_UNICODE);
        exit;
    }

    if ($path === "/products") {
        http_response_code(200);
        echo json_encode($productRepository->findAll(), JSON_UNESCAPED_UNICODE);
        exit;
    }

    if (preg_match('#^/products/([1-9][0-9]*)$#', $path, $matches)) {
        $product = $productRepository->findById((int) $matches[1]);

        if ($product === null) {
            http_response_code(404);
            echo json_encode(["error" => "Product not found"]);
            exit;
        }

        http_response_code(200);
        echo json_encode($product, JSON_UNESCAPED_UNICODE);
        exit;
    }

    if (preg_match('#^/products/([1-9][0-9]*)/sellers$#', $path, $matches)) {
        $productId = (int) $matches[1];

        if ($productRepository->findById($productId) === null) {
            http_response_code(404);
            echo json_encode(["error" => "Product not found"]);
            exit;
        }

        http_response_code(200);
        echo json_encode(
            $sellerRepository->findAllByProductId($productId),
            JSON_UNESCAPED_UNICODE,
        );
        exit;
    }

    if ($path === "/sellers") {
        http_response_code(200);
        echo json_encode($sellerRepository->findAll(), JSON_UNESCAPED_UNICODE);
        exit;
    }

    if (preg_match('#^/sellers/([1-9][0-9]*)$#', $path, $matches)) {
        $seller = $sellerRepository->findById((int) $matches[1]);

        if ($seller === null) {
            http_response_code(404);
            echo json_encode(["error" => "Seller not found"]);
            exit;
        }

        http_response_code(200);
        echo json_encode($seller, JSON_UNESCAPED_UNICODE);
        exit;
    }

    http_response_code(404);
    echo json_encode(["error" => "Not found"]);
} catch (Throwable $error) {
    http_response_code(500);
    echo json_encode(["error" => "Unable to retrieve products"]);
}
