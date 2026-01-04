<?php
class Order {
    private $db;

    public function __construct($db) {
        $this->db = $db;
    }

    public function getOrdersByUserId($userId) {
        $query = "SELECT o.*, oi.quantity, oi.price, p.nom as product_name 
                 FROM commandes o 
                 JOIN commande_items oi ON o.id = oi.commande_id 
                 JOIN produits p ON oi.produit_id = p.id 
                 WHERE o.user_id = ? 
                 ORDER BY o.date_commande DESC";
        $stmt = $this->db->prepare($query);
        $stmt->execute([$userId]);
        
        $orders = [];
        while ($row = $stmt->fetch(PDO::FETCH_ASSOC)) {
            $orderId = $row['id'];
            if (!isset($orders[$orderId])) {
                $orders[$orderId] = [
                    'id' => $row['id'],
                    'date_commande' => $row['date_commande'],
                    'total' => $row['total'],
                    'statut' => $row['statut'],
                    'items' => []
                ];
            }
            $orders[$orderId]['items'][] = [
                'product_name' => $row['product_name'],
                'quantity' => $row['quantity'],
                'price' => $row['price']
            ];
        }
        
        return array_values($orders);
    }
}
?>
