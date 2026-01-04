<?php include __DIR__ . '/header.php'; ?>

<div class="panier-container">
    <h1 class="mb-4">Votre Panier</h1>

    <?php if (isset($message)): ?>
        <div class="alert alert-success"><?php echo htmlspecialchars($message); ?></div>
    <?php endif; ?>

    <?php if (!empty($panier)): ?>
        <div class="table-responsive">
            <table class="table table-hover">
                <thead class="table-dark">
                    <tr>
                        <th>Service</th>
                        <th class="text-center">Quantité</th>
                        <th class="text-end">Prix Unitaire</th>
                        <th class="text-end">Sous-total</th>
                        <th class="text-center">Actions</th>
                    </tr>
                </thead>
                <tbody>
                    <?php foreach ($panier as $item): ?>
                        <tr>
                            <td><?php echo htmlspecialchars($item['nom']); ?></td>
                            <td class="text-center">
                                <form action="index.php?action=modifier_quantite" method="POST" class="d-inline quantity-control">
                                    <input type="hidden" name="service_id" value="<?php echo $item['id']; ?>">
                                    <input type="number" name="quantite" value="<?php echo $item['quantite']; ?>" min="1" class="quantity-input" style="width: 60px;">
                                    <button type="submit" class="btn btn-sm btn-outline-primary">
                                        <i class="fas fa-sync-alt"></i>
                                    </button>
                                </form>
                            </td>
                            <td class="text-end"><?php echo number_format($item['prix'], 2, ',', ' '); ?> €</td>
                            <td class="text-end"><?php echo number_format($item['prix'] * $item['quantite'], 2, ',', ' '); ?> €</td>
                            <td class="text-center">
                                <a href="index.php?action=supprimer_du_panier&id=<?php echo $item['id']; ?>" 
                                   class="btn-delete-item" 
                                   onclick="return confirm('Êtes-vous sûr de vouloir supprimer ce service de votre panier ?')">
                                    <i class="fas fa-trash-alt"></i>
                                    <span class="btn-text">Supprimer</span>
                                </a>
                            </td>
                        </tr>
                    <?php endforeach; ?>
                </tbody>
                <tfoot>
                    <tr class="table-active">
                        <td colspan="3" class="text-end fw-bold">Total :</td>
                        <td class="text-end fw-bold"><?php echo number_format($total, 2, ',', ' '); ?> €</td>
                        <td></td>
                    </tr>
                </tfoot>
            </table>
        </div>

        <div class="cart-footer">
            <a href="index.php" class="btn btn-outline-secondary">
                <i class="fas fa-arrow-left me-1"></i> Continuer mes achats
            </a>
            <div>
                <a href="index.php?action=vider_panier" class="btn btn-outline-danger me-2" onclick="return confirm('Êtes-vous sûr de vouloir vider votre panier ?')">
                    <i class="fas fa-trash-alt me-1"></i> Vider le panier
                </a>
                <?php if (isset($_SESSION['user_id'])): ?>
                    <a href="index.php?action=commander" class="btn btn-success">
                        <i class="fas fa-check me-1"></i> Valider la commande
                    </a>
                <?php else: ?>
                    <a href="index.php?action=login" class="btn btn-primary">
                        <i class="fas fa-sign-in-alt me-1"></i> Se connecter pour commander
                    </a>
                <?php endif; ?>
            </div>
        </div>
    <?php else: ?>
        <div class="empty-cart">
            <i class="fas fa-shopping-cart fa-5x text-muted mb-4"></i>
            <br>
            <h3>Votre panier est vide</h3>
            <p class="text-muted">Parcourez nos services et ajoutez des articles à votre panier.</p>
            <a href="index.php" class="btn btn-primary">
                <i class="fas fa-store me-1"></i> Découvrir nos services
            </a>
        </div>
    <?php endif; ?>
</div>

<?php include __DIR__ . '/footer.php'; ?>

<style>
/* Styles généraux */
.panier-container {
    max-width: 1100px;
    margin: 2rem auto;
    padding: 0 20px;
    font-family: 'Inter', sans-serif;
}

/* Titre */
h1 {
    color: #2d3436;
    text-align: center;
    margin: 2rem 0;
    font-weight: 600;
    position: relative;
    padding-bottom: 0.8rem;
}

h1:after {
    content: '';
    position: absolute;
    bottom: 0;
    left: 50%;
    transform: translateX(-50%);
    width: 100px;
    height: 3px;
    background: #b600c6;
}

/* Tableau */
.table-responsive {
    background: white;
    border-radius: 10px;
    box-shadow: 0 2px 10px rgba(0,0,0,0.05);
    overflow: hidden;
    margin-bottom: 2rem;
    border: 1px solid #eee;
}

table {
    width: 100%;
    border-collapse: collapse;
}

th, td {
    padding: 1.2rem;
    text-align: left;
    border-bottom: 1px solid #f1f2f6;
}

th {
    background: #2d3436;
    color: white;
    font-weight: 500;
    text-transform: uppercase;
    font-size: 0.85rem;
    letter-spacing: 0.5px;
}

tr:hover {
    background-color: #f8f9fa;
}

/* Boutons */
.btn {
    padding: 0.6rem 1.2rem;
    border-radius: 5px;
    font-weight: 500;
    transition: all 0.3s ease;
    border: none;
    cursor: pointer;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    gap: 0.5rem;
    font-size: 0.9rem;
}

.btn i {
    font-size: 0.9rem;
}

.btn-outline-secondary {
    border: 1px solid #b600c6;
    color: #b600c6;
    background: transparent;
}

.btn-outline-secondary:hover {
    background: #b600c6;
    color: white;
}

.btn-outline-danger {
    border: 1px solid #e74c3c;
    color: #e74c3c;
    background: transparent;
}

.btn-outline-danger:hover {
    background: #e74c3c;
    color: white;
}

.btn-success {
    background: #b600c6;
    color: white;
    border: none;
    padding: 0.8rem 2rem;
    font-weight: 600;
    text-transform: uppercase;
    letter-spacing: 0.5px;
}

.btn-success:hover {
    background: #9a00a8;
    transform: translateY(-2px);
    box-shadow: 0 4px 15px rgba(182, 0, 198, 0.3);
}

.btn-primary {
    background: #2d3436;
    color: white;
    border: none;
    padding: 0.8rem 2rem;
    font-weight: 600;
    text-transform: uppercase;
    letter-spacing: 0.5px;
}

.btn-primary:hover {
    background: #1a1f21;
    transform: translateY(-2px);
    box-shadow: 0 4px 15px rgba(45, 52, 54, 0.3);
}

/* Formulaire quantité */
.quantity-control {
    display: flex;
    align-items: center;
    gap: 0.5rem;
}

.quantity-input {
    width: 70px;
    text-align: center;
    padding: 0.5rem;
    border: 1px solid #ddd;
    border-radius: 5px;
    -moz-appearance: textfield;
    font-size: 1rem;
}

.quantity-input:focus {
    border-color: #b600c6;
    outline: none;
    box-shadow: 0 0 0 2px rgba(182, 0, 198, 0.1);
}

.quantity-input::-webkit-outer-spin-button,
.quantity-input::-webkit-inner-spin-button {
    -webkit-appearance: none;
    margin: 0;
}

/* Panier vide */
.empty-cart {
    text-align: center;
    padding: 4rem 2rem;
    background: white;
    border-radius: 10px;
    box-shadow: 0 2px 10px rgba(0,0,0,0.05);
    border: 1px solid #eee;
    margin: 2rem 0;
}

.empty-cart i {
    font-size: 4rem;
    color: #b600c6;
    margin-bottom: 1.5rem;
    opacity: 0.8;
}

.empty-cart h3 {
    color: #2d3436;
    margin-bottom: 1rem;
    font-size: 1.8rem;
}

.empty-cart p {
    color: #636e72;
    margin-bottom: 2rem;
    font-size: 1.1rem;
}

/* Pied de page du panier */
.cart-footer {
    display: flex;
    justify-content: space-between;
    align-items: center;
    flex-wrap: wrap;
    gap: 1.5rem;
    margin: 3rem 0;
    padding: 1.5rem 0;
    border-top: 1px solid #eee;
}

.cart-total {
    font-size: 1.4rem;
    font-weight: 600;
    color: #2d3436;
}

.cart-total span {
    color: #b600c6;
    font-size: 1.6rem;
}

/* Bouton de suppression */
.btn-delete-item {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    padding: 0.5rem 1rem;
    background: #fff;
    color: #e74c3c;
    border: 1px solid #e74c3c;
    border-radius: 5px;
    font-size: 0.85rem;
    text-decoration: none;
    transition: all 0.3s ease;
    cursor: pointer;
}

.btn-delete-item:hover {
    background: #e74c3c;
    color: white;
    transform: translateY(-2px);
    box-shadow: 0 2px 8px rgba(231, 76, 60, 0.3);
}

.btn-delete-item i {
    margin-right: 5px;
    font-size: 0.9rem;
}

.btn-delete-item .btn-text {
    display: inline-block;
    transition: all 0.3s ease;
}

.btn-delete-item:hover .btn-text {
    transform: translateX(2px);
}

/* Message d'alerte */
.alert {
    padding: 1rem;
    margin-bottom: 2rem;
    border-radius: 5px;
    font-weight: 500;
}

.alert-success {
    background-color: #d4edda;
    color: #155724;
    border: 1px solid #c3e6cb;
}

/* Responsive */
@media (max-width: 768px) {
    .cart-footer {
        flex-direction: column;
        align-items: stretch;
        text-align: center;
    }
    
    .btn {
        width: 100%;
        margin-bottom: 0.5rem;
    }
    
    .table-responsive {
        overflow-x: auto;
        border-radius: 8px;
    }
    
    .empty-cart {
        padding: 3rem 1.5rem;
        margin: 1rem 0;
    }
    
    .empty-cart i {
        font-size: 3.5rem;
    }
    
    .empty-cart h3 {
        font-size: 1.5rem;
    }
    
    .empty-cart p {
        font-size: 1rem;
    }
    
    .cart-total {
        width: 100%;
        text-align: center;
        margin-bottom: 1.5rem;
    }
}
</style>