<!DOCTYPE html>
<html lang="fr">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Détail du Produit | RiotShopp</title>
    <link rel="stylesheet" href="style.css">
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;600&display=swap" rel="stylesheet">
</head>
<body>

    <header class="navbar">
        <div class="container">
            <a href="index.php" class="logo">Legit<span>RiotShop</span></a>
            <nav>
                <ul>
                    <li><a href="index.php">Boutique</a></li>
                    <li><a href="panier.php">Panier (0)</a></li>
                    <li><a href="https://account.riotgames.com/fr/euw" class="btn-login">Connexion</a></li>
                </ul>
            </nav>
        </div>
    </header>

    <main class="container">
        <div class="product-detail-container">
            
            <div class="product-detail-image">
                <img src="image/10.jpg" alt="Nom du produit">
            </div>

            <div class="product-detail-info">
                <nav class="breadcrumb">
                    <a href="index.php">Accueil</a> > <a href="#">Money Virtuel riot games only</a>
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

                <form action="ajouter_panier.php" method="POST" class="add-to-cart-form">
                    <input type="hidden" name="product_id" value="1">
                    
                    <div class="quantity-selector">
                        <label for="quantity">Quantité :</label>
                        <input type="number" id="quantity" name="quantity" value="1" min="1" max="12">
                    </div>

                    <button type="submit" class="btn-add-cart">Ajouter au panier</button>
                </form>
            </div>

        </div>
    </main>

    <footer>
        <p>&copy; 2025 Riot Games store - EUW only</p>
    </footer>

</body>
</html>