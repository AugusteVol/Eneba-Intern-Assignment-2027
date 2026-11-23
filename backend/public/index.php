<?php

declare(strict_types=1);

require_once dirname(__DIR__) . "/src/Database.php";
require_once dirname(__DIR__) . "/src/ProductRepository.php";
require_once dirname(__DIR__) . "/src/SellerRepository.php";

use App\Database;
use App\ProductRepository;
use App\SellerRepository;

header("Content-Type: application/json");

$method = $_SERVER["REQUEST_METHOD"] ?? "GET";
$requestUri = parse_url($_SERVER["REQUEST_URI"] ?? "/", PHP_URL_PATH);
$path = rtrim((string) $requestUri, "/");

if ($method !== "GET") {
    http_response_code(405);
    header("Allow: GET");
    echo json_encode(["error" => "Method not allowed"]);
    exit;
}

try {
    $database = Database::connection();
    $productRepository = new ProductRepository($database);
    $sellerRepository = new SellerRepository($database);

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
