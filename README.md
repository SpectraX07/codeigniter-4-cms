# CodeIgniter 4 Admin Panel CMS Management

## Overview
This project is a **Content Management System (CMS)** built using **CodeIgniter 4**, designed to provide an efficient and flexible admin panel for managing website content. It includes role-based access, dynamic content management, and other essential CMS features.

## Features
- User Authentication & Role-Based Access Control (RBAC)
- Dashboard with key insights and statistics
- Content Management (Pages, Posts, Categories, Tags, etc.)
- Media Library for file uploads
- User & Admin Management
- SEO-Friendly URLs
- Database Management (MySQL or other supported databases)
- REST API Support for integration
- Responsive UI using Bootstrap (or other frontend framework)

## Installation Guide

### Prerequisites
Ensure you have the following installed on your system:
- PHP 7.4 or later
- MySQL (or any supported database)
- Apache/Nginx Server
- Composer

### Steps to Install
1. **Clone the Repository**
   ```bash
   git clone https://github.com/your-repo/codeigniter4-cms.git
   cd codeigniter4-cms
   ```

2. **Install Dependencies**
   ```bash
   composer install
   ```

3. **Set Up Environment**
   Rename `.env.example` to `.env` and configure database settings:
   ```ini
   database.default.hostname = localhost
   database.default.database = your_database_name
   database.default.username = your_database_user
   database.default.password = your_database_password
   database.default.DBDriver = MySQLi
   ```

4. **Run Migrations**
   ```bash
   php spark migrate
   ```

5. **Seed the Database** (Optional, for default admin user and settings)
   ```bash
   php spark db:seed UserSeeder
   ```

6. **Start the Development Server**
   ```bash
   php spark serve
   ```
   The application will be accessible at `http://localhost:8080`.

## Default Admin Credentials
```
Username: admin@example.com
Password: admin123
```
(Change credentials after first login)

## Usage
- Login to the admin panel (`/admin` route)
- Manage website content (pages, posts, media, etc.)
- Create and manage user roles & permissions
- Configure site settings from the admin dashboard

## Folder Structure
```
/codeigniter4-cms
│── app/
│   ├── Controllers/
│   ├── Models/
│   ├── Views/
│── public/
│── writable/
│── .env
│── composer.json
│── README.md
```

## Troubleshooting
- **404 Not Found?** Enable `mod_rewrite` for Apache and check `.htaccess`.
- **Database errors?** Verify database connection settings in `.env`.
- **Assets not loading?** Ensure proper base URL settings in `app/Config/App.php`.

## Contribution
Contributions are welcome! Feel free to fork this repository and submit a pull request.

## License
This project is licensed under the **MIT License**.

## Contact
For any issues or feature requests, create an issue on GitHub or contact [spectraxcodes07@gmail.com].

