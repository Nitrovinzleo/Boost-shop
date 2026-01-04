<?php
session_start();

// Configuration de la base de données
require_once 'config/database.php';
try {
    $db = getDBConnection();
} catch(PDOException $e) {
    die('Erreur de connexion à la base de données : ' . $e->getMessage() . 
        '. Vérifiez les informations de connexion dans config/database.php');
}
require_once 'controller/AuthController.php';
require_once 'controller/PanierController.php';
require_once 'controller/CompteController.php';
require_once 'controller/CommandeController.php';

$authController = new AuthController($db);
$panierController = new PanierController($db);
$compteController = new CompteController($db);
$commandeController = new CommandeController($db);


$action = isset($_GET['action']) ? $_GET['action'] : 'home';

switch ($action) {
    case 'login':
        if ($_SERVER['REQUEST_METHOD'] === 'POST') {
            $authController->login();
        } else {
            $authController->showLogin();
        }
        break;
        
    case 'register':
        if ($_SERVER['REQUEST_METHOD'] === 'POST') {
            $authController->register();
        } else {
            $authController->showRegister();
        }
        break;
        
    case 'logout':
        $authController->logout();
        break;
        
    case 'mon-compte':
        $compteController->monCompte();
        break;
        
    case 'commander':
        $commandeController->passerCommande();
        break;
        
    case 'panier':
        $panierController->afficherPanier();
        break;
        
    case 'ajouter_au_panier':
        $panierController->ajouterAuPanier();
        break;
        
    case 'modifier_quantite':
        if ($_SERVER['REQUEST_METHOD'] === 'POST') {
            $panierController->modifierQuantite();
        } else {
            header('Location: index.php?action=panier');
            exit();
        }
        break;
        
    case 'supprimer_du_panier':
        $id = $_GET['id'] ?? null;
        if ($id) {
            $panierController->supprimerDuPanier($id);
        } else {
            header('Location: index.php?action=panier');
            exit();
        }
        break;
        
    case 'vider_panier':
        $panierController->viderPanier();
        break;
        
    default:
        
        include 'view/header.php';
        include 'view/home.php';    
        include 'view/footer.php';
        break;
}
?>