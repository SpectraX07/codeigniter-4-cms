<?php

namespace App\Controllers\Admin;

use App\Controllers\BaseController;
use CodeIgniter\HTTP\ResponseInterface;

class AuthController extends BaseController
{
    public function renderLogin()
    {
        $this->data['title'] = 'Login';
        return view($this->adminViews['login'], $this->data);
    }
}
