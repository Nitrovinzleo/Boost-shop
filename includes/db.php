<?php
// config/db.php

$host = 'localhost';
$dbname = 'lol_boost_db';
$username = 'root';
$password = ''; // Par défaut sur XAMPP c'est vide

try {
    // Connexion via PDO
    $pdo = new PDO("mysql:host=$host;dbname=$dbname;charset=utf8", $username, $password);
    
    // Configuration pour afficher les erreurs SQL pendant le TP
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
    
} catch (PDOException $e) {
    die("Erreur de connexion à la base de données : " . $e->getMessage());
}

// On démarre la session ici pour tout le site
if (session_status() === PHP_SESSION_NONE) {
    session_start();
}
?>