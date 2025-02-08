<?php

use CodeIgniter\Router\RouteCollection;
use App\Controllers\Admin\{
    AuthController
};

/**
 * @var RouteCollection $routes
 */

$routes->group('admin', static function ($routes) {
    $routes->get('/', [AuthController::class, 'renderLogin'], ['as' => 'admin.login']);
    $routes->post('auth/attemptLogin', [AuthController::class, 'attemptToLogin'], ['as' => 'admin.doLogin']);
});


