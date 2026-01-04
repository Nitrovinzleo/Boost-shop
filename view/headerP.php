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
                    <li><a href="panier.php">Panier</a></li>
                    
                    <?php if (isset($_SESSION['user_id'])): ?>
                        <li><a href="profil.php">Mon Profil</a></li>
                        <li><a href="logout.php" class="btn-logout">Déconnexion (<?= htmlspecialchars($_SESSION['user_pseudo']) ?>)</a></li>
                    <?php else: ?>
                        <li><a href="login.php" class="btn-login">Connexion</a></li>
                        <li><a href="register.php">Inscription</a></li>
                    <?php endif; ?>
                </ul>
            </nav>
        </div>
    </header>