<?php

namespace App\Controllers\Admin;

use App\Controllers\BaseController;
use CodeIgniter\HTTP\ResponseInterface;

class DashboardController extends BaseController
{
    public function render()
    {
        $this->data['title'] = 'Dashboard';
        return view($this->adminViews['dashboard'], $this->data);
    }
}
