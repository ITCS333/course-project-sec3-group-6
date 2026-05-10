<?php

function getDBConnection() {
    $host = '127.0.0.1';
    $dbname = 'course_project';
    $username = 'root';
    $password = '';

    $pdo = new PDO(
        "mysql:host=$host;dbname=$dbname;charset=utf8",
        $username,
        $password
    );

    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

    return $pdo;
}

?>
