<?php
define('DB_HOST', 'localhost');
define('DB_NAME', 'mvc_db');
define('DB_USER', 'root');
define('DB_PASS', 'dab1234!');

function getDBConnection() {
    try {
        $dsn = 'mysql:host=' . DB_HOST . ';dbname=' . DB_NAME . ';charset=utf8';
        $db = new PDO($dsn, DB_USER, DB_PASS);
        $db->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
        $db->setAttribute(PDO::ATTR_DEFAULT_FETCH_MODE, PDO::FETCH_ASSOC);
        return $db;
    } catch(PDOException $e) {
        die('Erreur de connexion à la base de données : ' . $e->getMessage());
    }
}
?>
