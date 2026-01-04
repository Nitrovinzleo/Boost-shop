<?php
require_once __DIR__ . '/../model/User.php';
require_once __DIR__ . '/../model/Order.php';

class CompteController {
    private $userModel;
    private $orderModel;

    public function __construct($db) {
        $this->userModel = new User($db);
        $this->orderModel = new Order($db);
    }

    public function monCompte() {
        // Vérifier si l'utilisateur est connecté
        if (!isset($_SESSION['user_id'])) {
            $_SESSION['redirect_after_login'] = 'mon-compte';
            header('Location: /MVC/index.php?action=login');
            exit();
        }

        // Récupérer les commandes de l'utilisateur
        $userId = $_SESSION['user_id'];
        $commandes = $this->orderModel->getOrdersByUserId($userId);

        // Afficher la vue
        require_once __DIR__ . '/../view/compte/mon_compte.php';
    }
}
?>
