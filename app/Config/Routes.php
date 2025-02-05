<?php

use CodeIgniter\Router\RouteCollection;
use Config\Services;

/**
 * @var RouteCollection $routes
 */
if (strpos(current_url(), '/api/') !== false) {
    $routes->set404Override(function () use ($routes) {
        $response = Services::response()->setStatusCode(404)->setJSON([
            'type' => 'error',
            'code' => 404,
            'message' => 'The requested API endpoint or method was not found on the server. Please check the API documentation for valid endpoints and methods.',
        ]);
        $response->send();
    });
}

require_once __DIR__ . '/Admin.php';
