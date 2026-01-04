<!DOCTYPE html>
<html lang="fr">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>RiotShop | Accueil</title>
    <link rel="stylesheet" href="/MVC/view/images/style.css">
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;600&display=swap" rel="stylesheet">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0-beta3/css/all.min.css">
</head>
<body>

    <header class="navbar">
        <div class="container">
            <a href="index.php" class="logo">Legit<span>RiotShop</span></a>
            <nav>
                <ul>
                    <li><a href="index.php">Boutique</a></li>
                    <li><a href="index.php?action=panier">Panier</a></li>
                    
                    <?php if (isset($_SESSION['user_id'])): ?>
                        <li><a href="index.php?action=mon-compte" class="btn-profile">
                            <i class="fas fa-user-circle me-1"></i>Mon Compte
                        </a></li>
                        <li><a href="index.php?action=logout" class="btn-logout">
                            <i class="fas fa-sign-out-alt me-1"></i>Déconnexion (<?= htmlspecialchars($_SESSION['username'] ?? 'Utilisateur') ?>)
                        </a></li>
                    <?php else: ?>
                        <li><a href="index.php?action=login" class="btn-login">Connexion</a></li>
                        <li><a href="index.php?action=register" class="btn-register">Inscription</a></li>
                    <?php endif; ?>
                </ul>
            </nav>
        </div>
    </header>