<?php

namespace App\Database\Migrations;

use CodeIgniter\Database\Migration;

class CreateAdministrationTable extends Migration
{
    public function up()
    {
        $this->forge->addField([
            'id' => [
                'type' => 'BIGINT',
                'constraint' => 20,
                'unsigned' => true,
                'auto_increment' => true,
            ],
            'name' => [
                'type' => 'VARCHAR',
                'constraint' => 255,
                'null' => false,
            ],
            'email' => [
                'type' => 'VARCHAR',
                'constraint' => 255,
                'null' => false,
                'unique' => true,
            ],
            'username' => [
                'type' => 'VARCHAR',
                'constraint' => 255,
                'null' => false,
                'unique' => true,
            ],
            'userType' => [
                'type' => 'ENUM',
                'constraint' => ['Super Admin', 'Admin'],
                'null' => false,
                'default' => 'Admin',
            ],
            'email_verified_at' => [
                'type' => 'DATETIME',
                'null' => true,
            ],
            'password' => [
                'type' => 'VARCHAR',
                'constraint' => 255,
                'null' => false,
            ],
            'remember_token' => [
                'type' => 'VARCHAR',
                'constraint' => 100,
                'null' => true,
            ],
            'permission' => [
                'type' => 'JSON',
                'null' => true,
            ],
            'created_at' => [
                'type' => 'DATETIME',
                'null' => false,
            ],
            'updated_at' => [
                'type' => 'DATETIME',
                'null' => false,
            ],
            'deleted_at' => [
                'type' => 'DATETIME',
                'null' => true,
            ],
        ]);

        // Set primary key
        $this->forge->addPrimaryKey('id');

        // Add indexes
        $this->forge->addKey('email', false, true, 'uniq_email');
        $this->forge->addKey('username', false, true, 'uniq_username');

        // Create table
        $this->forge->createTable('administration', true);
    }

    public function down()
    {
        $this->forge->dropTable('administration', true);
    }
}
