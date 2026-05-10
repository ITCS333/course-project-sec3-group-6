<?php

class Database {

    private $host = "127.0.0.1";
    private $db_name = "course_project";
    private $username = "root";
    private $password = "";

    public function getConnection() {

        try {

            $conn = new PDO(
                "mysql:host=" . $this->host .
                ";dbname=" . $this->db_name .
                ";charset=utf8",
                $this->username,
                $this->password
            );

            $conn->setAttribute(
                PDO::ATTR_ERRMODE,
                PDO::ERRMODE_EXCEPTION
            );

            return $conn;

        } catch (PDOException $exception) {

            die(
                "Database connection error: " .
                $exception->getMessage()
            );
        }
    }
}
?>
