<?php

namespace App\Controllers\Admin;

use App\Controllers\BaseController;
use CodeIgniter\HTTP\Request;
use CodeIgniter\HTTP\ResponseInterface;

class AuthController extends BaseController
{
    public function renderLogin()
    {
        $this->data['title'] = 'Login';
        return view($this->adminViews['login'], $this->data);
    }

    public function attemptToLogin()
    {
        $this->data = [
            'hash' => csrf_hash(),
            'success' => false,
        ];

        if (!$this->request->is('post') || !$this->request->isAJAX()) {
            return $this->response->setStatusCode(400)->setJSON(['message' => 'Invalid request']);
        }

        $emailOrUsername = $this->request->getVar('email-username');
        $password = $this->request->getVar('password');

        $loginField = filter_var($emailOrUsername, FILTER_VALIDATE_EMAIL) ? 'email' : 'username';

        $rules = [
            'email-username' => ['label' => 'Email / Username', 'rules' => 'required'],
            'password' => ['label' => 'Password', 'rules' => 'required']
        ];

        if (!$this->validate($rules)) {
            return $this->response->setStatusCode(422)->setJSON([
                'errors' => $this->validator->getErrors()
            ]);
        }

        $auth = new AuthModel();
        $user = $auth->where($loginField, $emailOrUsername)->first();

        if (!$user || !password_verify($password, $user->password)) {
            return $this->response->setStatusCode(401)->setJSON(['message' => 'Invalid credentials.']);
        }

        $sessionData = [
            'id' => $user->id,
            'profilePicture' => $user->profilePicture ? site_url('uploads/admin/' . $user->profilePicture) : uploadUrl(DEFAULT_DP),
            'name' => $user->name
        ];
        session()->set('adminData', $sessionData);
        session()->set('isAdminLoggedIn', 1);
        setFlashMessage("Welcome {$user->name}", 'Success', 'success');

        // Determine redirect URL
        $referrer = session()->get('referUrl');
        $redirectUrl = (!empty($referrer) && $referrer !== current_url()) ? $referrer : url_to('adminDashboard');
        session()->remove('referUrl');

        return $this->response->setJSON([
            'success' => true,
            'redirect' => $redirectUrl
        ]);
    }

}
