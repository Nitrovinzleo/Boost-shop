<?php
require_once __DIR__ . '/../model/Order.php';
require_once __DIR__ . '/../model/User.php';

class CommandeController {
    private $db;
    private $orderModel;
    private $userModel;

    public function __construct($db) {
        $this->db = $db;
        $this->orderModel = new Order($db);
        $this->userModel = new User($db);
    }

    public function passerCommande() {
        // Vérifier si l'utilisateur est connecté
        if (!isset($_SESSION['user_id'])) {
            $_SESSION['redirect_after_login'] = 'commander';
            header('Location: /MVC/index.php?action=login');
            exit();
        }

        // Vérifier si le panier n'est pas vide
        if (empty($_SESSION['panier'])) {
            $_SESSION['message'] = 'Votre panier est vide';
            header('Location: /MVC/index.php?action=panier');
            exit();
        }

        try {
            // Démarrer une transaction
            $this->db->beginTransaction();

            // Calculer le total de la commande
            $total = 0;
            foreach ($_SESSION['panier'] as $item) {
                $total += $item['prix'] * $item['quantite'];
            }

            // Créer la commande
            $query = "INSERT INTO commandes (user_id, total) VALUES (?, ?)";
            $stmt = $this->db->prepare($query);
            $stmt->execute([$_SESSION['user_id'], $total]);
            $commandeId = $this->db->lastInsertId();

            // Ajouter les articles de la commande
            $query = "INSERT INTO commande_items (commande_id, produit_id, quantity, price) VALUES (?, ?, ?, ?)";
            $stmt = $this->db->prepare($query);

            foreach ($_SESSION['panier'] as $item) {
                $stmt->execute([
                    $commandeId,
                    $item['id'],
                    $item['quantite'],
                    $item['prix']
                ]);
            }

            // Valider la transaction
            $this->db->commit();

            // Vider le panier
            unset($_SESSION['panier']);

            // Rediriger vers la page de confirmation
            $_SESSION['message_success'] = 'Votre commande a été validée avec succès !';
            header('Location: /MVC/index.php?action=mon-compte');
            exit();

        } catch (Exception $e) {
            // En cas d'erreur, annuler la transaction
            $this->db->rollBack();
            
            // Journaliser l'erreur (à implémenter correctement en production)
            error_log('Erreur lors de la commande : ' . $e->getMessage());
            
            // Rediriger avec un message d'erreur
            $_SESSION['message_error'] = 'Une erreur est survenue lors de la validation de votre commande. Veuillez réessayer.';
            header('Location: /MVC/index.php?action=panier');
            exit();
        }
    }
}
?>
