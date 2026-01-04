<?php
require_once 'config/db.php';

// Sécurité :
if (!isset($_SESSION['user_id']) || !isset($_SESSION['panier'])) {
    header('Location: index.php');
    exit();
}

try {
    $pdo->beginTransaction(); 

    // 1. Créer 
    $stmt = $pdo->prepare("INSERT INTO commandes (id_utilisateur, total_prix) VALUES (?, ?)");
    $stmt->execute([$_SESSION['user_id'], $_SESSION['panier']['total']]);
    $id_commande = $pdo->lastInsertId();

    // 2. Détail 
    $stmtDetail = $pdo->prepare("INSERT INTO commande_details (id_commande, id_produit, quantite, prix_unitaire) VALUES (?, ?, ?, ?)");
    $stmtDetail->execute([
        $id_commande, 
        1, 
        $_SESSION['panier']['nb_games'], 
        $_SESSION['panier']['prix_unitaire']
    ]);

    $pdo->commit(); 

    // 3. Vider panier
    unset($_SESSION['panier']);
    header('Location: profil.php?success=1'); 

} catch (Exception $e) {
    $pdo->rollBack(); // Erreur annule tout
    die("Erreur lors de la commande : " . $e->getMessage());
}