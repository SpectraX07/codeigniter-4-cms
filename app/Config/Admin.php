<?php

use CodeIgniter\Router\RouteCollection;
use App\Controllers\Admin\{
    AuthController,
    DashboardController
};

/**
 * @var RouteCollection $routes
 */

$routes->group('admin', static function ($routes) {
    // Authentication Routes
    $routes->get('/', [AuthController::class, 'renderLogin'], ['as' => 'admin.login']);
    $routes->group('auth', static function ($routes) {
        $routes->post('attemptLogin', [AuthController::class, 'attemptToLogin'], ['as' => 'admin.doLogin']);
    });

    $routes->get('dashboard', [DashboardController::class, 'render'], ['as' => 'admin.dashboard']);
    
});


