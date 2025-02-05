<?php
namespace Config;

use CodeIgniter\Config\BaseConfig;

class ViewConfig extends BaseConfig
{
    // Layout for the views to extend
    public $landingLayout = [
        'layout' => 'Views/landing/layout/_default'
    ];

    public $adminLayout = [
        'layout' => 'Views/admin/layout/_default',
        'sidebar' => 'Views/admin/layout/_sidebar',
    ];

    public $adminViews = [
        'login' => 'Views/admin/auth/login'
    ];
}
