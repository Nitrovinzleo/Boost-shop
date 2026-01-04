<?php include __DIR__ . '/../header.php'; ?>

<div class="container">
    <div class="account-container">
        <h1 class="account-title">
            <i class="fas fa-user-circle me-2"></i> Mon Compte
        </h1>
        
        <div class="account-welcome">
            <p>Bienvenue, <strong><?php echo htmlspecialchars($_SESSION['username']); ?></strong> !</p>
        </div>

        <div class="account-section">
            <h2 class="section-title">
                <i class="fas fa-history me-5"></i>Historique des commandes
            </h2>
            
            <?php if (empty($commandes)): ?>
                <div class="no-orders">
                    <i class="fas fa-box-open"></i>
                    <p>Vous n'avez pas encore passé de commande.</p>
                    <a href="/MVC/index.php?action=home" class="btn-shop">
                        <i class="fas fa-shopping-cart me-5"></i> Faire des achats
                    </a>
                </div>
            <?php else: ?>
                <div class="orders-list">
                    <?php foreach ($commandes as $commande): ?>
                        <div class="order-card">
                            <div class="order-header">
                                <div class="order-info">
                                    <span class="order-number">Commande #<?php echo $commande['id']; ?></span>
                                    <span class="order-date">
                                        <i class="far fa-calendar-alt me-1"></i>
                                        <?php echo date('d/m/Y', strtotime($commande['date_commande'])); ?>
                                    </span>
                                    <span class="order-status">
                                        <i class="fas fa-circle"></i>
                                        <?php echo ucfirst($commande['statut']); ?>
                                    </span>
                                </div>
                                <div class="order-total">
                                    <?php echo number_format($commande['total'], 2, ',', ' '); ?> €
                                </div>
                            </div>
                            
                            <div class="order-details">
                                <h4>Détails de la commande :</h4>
                                <ul class="order-items">
                                    <?php foreach ($commande['items'] as $item): ?>
                                        <li class="order-item">
                                            <span class="item-name"><?php echo htmlspecialchars($item['product_name']); ?></span>
                                            <span class="item-quantity">x<?php echo $item['quantity']; ?></span>
                                            <span class="item-price"><?php echo number_format($item['price'] * $item['quantity'], 2, ',', ' '); ?> €</span>
                                        </li>
                                    <?php endforeach; ?>
                                </ul>
                            </div>
                        </div>
                    <?php endforeach; ?>
                </div>
            <?php endif; ?>
        </div>
    </div>
</div>

<style>
/* Styles pour la page Mon Compte */
.account-container {
    max-width: 1000px;
    margin: 2rem auto;
    padding: 2rem;
    background: #fff;
    border-radius: 10px;
    box-shadow: 0 4px 15px rgba(0, 0, 0, 0.05);
}

.account-title {
    color: #2d3436;
    font-size: 2rem;
    margin-bottom: 2rem;
    padding-bottom: 1rem;
    border-bottom: 2px solid #f0f0f0;
}

.account-welcome {
    background: #f8f9fa;
    padding: 1.5rem;
    border-radius: 8px;
    margin-bottom: 2rem;
    font-size: 1.1rem;
}

.account-section {
    margin-bottom: 3rem;
}

.section-title {
    color: #2d3436;
    font-size: 1.5rem;
    margin-bottom: 1.5rem;
    display: flex;
    align-items: center;
}

/* Styles pour la liste commandes */
.orders-list {
    display: flex;
    flex-direction: column;
    gap: 1.5rem;
}

.order-card {
    border: 1px solid #eee;
    border-radius: 8px;
    overflow: hidden;
    transition: all 0.3s ease;
}

.order-card:hover {
    transform: translateY(-3px);
    box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
}

.order-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 1.2rem 1.5rem;
    background: #f8f9fa;
    border-bottom: 1px solid #eee;
}

.order-info {
    display: flex;
    gap: 1.5rem;
    align-items: center;
    flex-wrap: wrap;
}

.order-number {
    font-weight: 600;
    color: #2d3436;
}

.order-date, .order-status {
    display: inline-flex;
    align-items: center;
    font-size: 0.9rem;
    color: #636e72;
}

.order-status {
    padding: 0.3rem 0.8rem;
    border-radius: 20px;
    background: #e3f2fd;
    color: #1976d2;
}

.order-status i {
    font-size: 0.5rem;
    margin-right: 0.5rem;
}

.order-total {
    font-size: 1.2rem;
    font-weight: 600;
    color: #2d3436;
}

.order-details {
    padding: 1.5rem;
}

.order-details h4 {
    margin-top: 0;
    margin-bottom: 1rem;
    color: #2d3436;
    font-size: 1.1rem;
}

.order-items {
    list-style: none;
    padding: 0;
    margin: 0;
}

.order-item {
    display: flex;
    justify-content: space-between;
    padding: 0.8rem 0;
    border-bottom: 1px solid #f0f0f0;
}

.order-item:last-child {
    border-bottom: none;
}

.item-name {
    flex: 1;
    color: #2d3436;
}

.item-quantity {
    margin: 0 1rem;
    color: #636e72;
}

.item-price {
    font-weight: 500;
    color: #2d3436;
}

/* Style pour aucun historique de commande */
.no-orders {
    text-align: center;
    padding: 3rem 1rem;
    background: #f8f9fa;
    border-radius: 8px;
    color: #636e72;
}

.no-orders i {
    font-size: 3rem;
    color: #b600c6;
    margin-bottom: 1rem;
    opacity: 0.7;
}

.no-orders p {
    margin-bottom: 1.5rem;
    font-size: 1.1rem;
}

.btn-shop {
    display: inline-flex;
    align-items: center;
    background: #b600c6;
    color: white;
    padding: 0.8rem 1.5rem;
    border-radius: 5px;
    text-decoration: none;
    font-weight: 500;
    transition: all 0.3s ease;
}

.btn-shop:hover {
    background: #9a00a8;
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(182, 0, 198, 0.2);
}

/* Style pour les écrans mobiles */
@media (max-width: 768px) {
    .account-container {
        padding: 1rem;
        margin: 1rem;
    }
    
    .order-header {
        flex-direction: column;
        align-items: flex-start;
        gap: 1rem;
    }
    
    .order-info {
        flex-direction: column;
        align-items: flex-start;
        gap: 0.5rem;
    }
    
    .order-item {
        flex-wrap: wrap;
    }
    
    .item-name {
        width: 100%;
        margin-bottom: 0.3rem;
    }
}
</style>

<?php include __DIR__ . '/../footer.php'; ?>
