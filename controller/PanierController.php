<?php
class PanierController {
    private $db;

    public function __construct($db) {
        $this->db = $db;
        // La session est déjà démarrée dans index.php
    }

    public function afficherPanier() {
        $panier = $_SESSION['panier'] ?? [];
        $total = 0;
        
        // Calculer le total du panier
        if (!empty($panier)) {
            foreach ($panier as $item) {
                $total += $item['prix'] * $item['quantite'];
            }
        }

        // Afficher la vue du panier
        require_once __DIR__ . '/../view/panier.php';
    }

   public function ajouterAuPanier() {
    $this->verifierAuthentification();
    if ($_SERVER['REQUEST_METHOD'] === 'POST') {
        $produitId = $_POST['produit_id'] ?? null;
        $quantite = $_POST['quantite'] ?? 1;
        // Remplacer "services" par "produits" si c'est le nom de votre table
        $query = "SELECT * FROM produits WHERE id = ?";
        $stmt = $this->db->prepare($query);
        $stmt->execute([$produitId]);
        $produit = $stmt->fetch(PDO::FETCH_ASSOC);
        if ($produit) {
            if (!isset($_SESSION['panier'])) {
                $_SESSION['panier'] = [];
            }
            $trouve = false;
            foreach ($_SESSION['panier'] as &$item) {
                if ($item['id'] == $produitId) {
                    $item['quantite'] += $quantite;
                    $trouve = true;
                    break;
                }
            }
            if (!$trouve) {
                $_SESSION['panier'][] = [
                    'id' => $produit['id'],
                    'nom' => $produit['nom'],
                    'prix' => $produit['prix'],
                    'quantite' => $quantite
                ];
            }
            $_SESSION['message'] = 'Le produit a été ajouté à votre panier';
            header('Location: index.php?action=panier');
            exit();
        }
    }
    header('Location: index.php?action=home');
    exit();
}

    public function supprimerDuPanier($serviceId) {
        if (isset($_SESSION['panier'])) {
            foreach ($_SESSION['panier'] as $key => $item) {
                if ($item['id'] == $serviceId) {
                    unset($_SESSION['panier'][$key]);
                    break;
                }
            }
            // Réindexer le tableau
            $_SESSION['panier'] = array_values($_SESSION['panier']);
        }
        
        header('Location: index.php?action=panier');
        exit();
    }

    public function modifierQuantite() {
        if ($_SERVER['REQUEST_METHOD'] === 'POST' && isset($_POST['service_id'], $_POST['quantite'])) {
            $serviceId = $_POST['service_id'];
            $quantite = (int)$_POST['quantite'];
            
            // Vérifier que la quantité est valide (au moins 1)
            if ($quantite < 1) {
                $quantite = 1;
            }
            
            // Mettre à jour la quantité dans le panier
            if (isset($_SESSION['panier'])) {
                foreach ($_SESSION['panier'] as &$item) {
                    if ($item['id'] == $serviceId) {
                        $item['quantite'] = $quantite;
                        break;
                    }
                }
            }
            
            // Rediriger vers le panier avec un message de succès
            $_SESSION['message'] = 'La quantité a été mise à jour';
        }
        
        header('Location: index.php?action=panier');
        exit();
    }
    
    public function viderPanier() {
        unset($_SESSION['panier']);
        $_SESSION['message'] = 'Votre panier a été vidé';
        header('Location: index.php?action=panier');
        exit();
    }
    
    public function verifierAuthentification() {
        if (!isset($_SESSION['user_id'])) {
            // Stocker la page actuelle pour rediriger après la connexion
            $_SESSION['redirect_after_login'] = 'panier';
            header('Location: /MVC/index.php?action=login');
            exit();
        }
        return true;
    }
}