<main class="container">
        <div class="product-detail-container">
            
            <div class="product-detail-image">
                <img src="view/images/10.jpg" alt="Nom du produit">
            </div>

            <div class="product-detail-info">
                <nav class="breadcrumb">
                    <a href="../index.php">Accueil</a> > <a href="#">Money Virtuel riot games only</a>
                </nav>
                
                <h1>10 euro carte kdo</h1>
                <p class="product-price">10 €</p>
                
                <div class="product-description">
                    <h3>À propos de cet article :<br></h3>
                    <p>
                        Accéder À Un Monde D'Expériences<br><br>
                        Affrontez une communauté mondiale de plusieurs millions de joueurs sur différents champs de bataille avec Riot Games.<br><br>
                        Utilisable dans League of Legends, Teamfight Tactics, Legends of Runeterra et VALORANT<br><br>
                    </p>
                </div>

                <div class="stock-status">
                    <span class="status-icon in-stock"></span> En stock (12 unités) <!-- TEMP    le temps que je fasse la bdd et que fasse un stock  -->
                    
                </div>

                <form action="index.php?action=ajouter_au_panier" method="POST" class="add-to-cart-form">
                    <input type="hidden" name="produit_id" value="1">
                    <input type="hidden" name="nom" value="10 euro carte kdo">
                    <input type="hidden" name="prix" value="10.00">
                    <div class="quantity-selector">
                        <label for="quantity">Quantité :</label>
                        <input type="number" id="quantity" name="quantite" value="1" min="1" max="12">
                    </div>
                    <button type="submit" class="btn-add-cart">Ajouter au panier</button>
                </form>
            </div>

        </div>
    </main>