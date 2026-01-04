<?php include __DIR__ . '/../header.php'; ?>

<div class="auth-page">
    <div class="auth-container">
        <div class="auth-card">
            <div class="auth-header">
                <h2><i class="fas fa-sign-in-alt me-2"></i>Connexion</h2>
                <p>Accédez à votre compte</p>
            </div>
            
            <div class="auth-body">
                <?php if (isset($error)): ?>
                    <div class="alert alert-error">
                        <i class="fas fa-exclamation-circle me-2"></i><?php echo htmlspecialchars($error); ?>
                    </div>
                <?php endif; ?>

                <form action="/MVC/index.php?action=login" method="POST" class="auth-form">
                    <div class="form-group">
                        <label for="email">
                            <i class="fas fa-envelope me-2"></i>Adresse email
                        </label>
                        <div class="input-with-icon">
                            <input type="email" class="form-control" id="email" name="email" required 
                                   placeholder="votre@email.com" 
                                   value="<?php echo isset($_POST['email']) ? htmlspecialchars($_POST['email']) : ''; ?>">
                            <i class="fas fa-envelope input-icon"></i>
                        </div>
                    </div>

                    <div class="form-group">
                        <label for="password">
                            <i class="fas fa-lock me-2"></i>Mot de passe
                        </label>
                        <div class="input-with-icon">
                            <input type="password" class="form-control" id="password" name="password" required 
                                   placeholder="••••••••">
                            <i class="fas fa-lock input-icon"></i>
                        </div>
                        <div class="text-right">
                            <a href="#" class="forgot-password">
                                Mot de passe oublié ?
                            </a>
                        </div>
                    </div>

                    <button type="submit" class="btn-auth">
                        <i class="fas fa-sign-in-alt me-2"></i>Se connecter
                    </button>
                </form>
                
                <div class="auth-footer">
                    <p>Pas encore de compte ? 
                        <a href="/MVC/index.php?action=register" class="auth-link">
                            Créer un compte
                        </a>
                    </p>
                </div>
            </div>
        </div>
    </div>
</div>

<style>
/* Styles généraux de la page d'authentification */
.auth-page {
    min-height: 100vh;
    display: flex;
    align-items: center;
    background-color: #f8f9fa;
    padding: 2rem 0;
}

.auth-container {
    width: 100%;
    max-width: 450px;
    margin: 0 auto;
    padding: 0 15px;
}

/* Carte d'authentification */
.auth-card {
    background: white;
    border-radius: 10px;
    box-shadow: 0 5px 20px rgba(0, 0, 0, 0.1);
    overflow: hidden;
}

/* En-tête */
.auth-header {
    background: linear-gradient(135deg, #2d3436, #b600c6);
    color: white;
    padding: 2rem;
    text-align: center;
}

.auth-header h2 {
    margin: 0 0 0.5rem 0;
    font-size: 1.8rem;
    font-weight: 600;
}

.auth-header p {
    margin: 0;
    opacity: 0.9;
    font-size: 0.95rem;
}

/* Corps de la carte */
.auth-body {
    padding: 2rem;
}

/* Formulaire */
.auth-form {
    margin-bottom: 1.5rem;
}

.form-group {
    margin-bottom: 1.5rem;
}

.form-group label {
    display: block;
    margin-bottom: 0.5rem;
    color: #2d3436;
    font-weight: 500;
    font-size: 0.95rem;
}

.input-with-icon {
    position: relative;
}

.input-icon {
    position: absolute;
    left: 15px;
    top: 50%;
    transform: translateY(-50%);
    color: #b600c6;
}

.form-control {
    width: 100%;
    padding: 0.8rem 1rem 0.8rem 3rem;
    border: 1px solid #ddd;
    border-radius: 5px;
    font-size: 1rem;
    transition: all 0.3s ease;
}

.form-control:focus {
    border-color: #b600c6;
    outline: none;
    box-shadow: 0 0 0 2px rgba(182, 0, 198, 0.1);
}

/* Bouton de connexion */
.btn-auth {
    width: 100%;
    padding: 1rem;
    background: #b600c6;
    color: white;
    border: none;
    border-radius: 5px;
    font-size: 1rem;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.3s ease;
    display: flex;
    align-items: center;
    justify-content: center;
}

.btn-auth:hover {
    background: #9a00a8;
    transform: translateY(-2px);
    box-shadow: 0 4px 15px rgba(182, 0, 198, 0.3);
}

.btn-auth i {
    margin-right: 8px;
}

/* Lien mot de passe oublié */
.forgot-password {
    color: #b600c6;
    text-decoration: none;
    font-size: 0.9rem;
    transition: color 0.2s ease;
}

.forgot-password:hover {
    color: #2d3436;
    text-decoration: underline;
}

/* Pied de page */
.auth-footer {
    text-align: center;
    padding-top: 1.5rem;
    border-top: 1px solid #eee;
    margin-top: 1.5rem;
    color: #636e72;
    font-size: 0.95rem;
}

.auth-link {
    color: #b600c6;
    font-weight: 600;
    text-decoration: none;
    transition: color 0.2s ease;
}

.auth-link:hover {
    color: #2d3436;
    text-decoration: underline;
}

/* Message d'erreur */
.alert {
    padding: 1rem;
    margin-bottom: 1.5rem;
    border-radius: 5px;
    font-size: 0.95rem;
}

.alert-error {
    background-color: #ffebee;
    color: #c62828;
    border-left: 4px solid #ef5350;
    padding: 1rem 1rem 1rem 2.5rem;
    position: relative;
}

.alert-error i {
    position: absolute;
    left: 1rem;
    top: 1.1rem;
}

/* Responsive */
@media (max-width: 576px) {
    .auth-container {
        padding: 0 20px;
    }
    
    .auth-body {
        padding: 1.5rem;
    }
    
    .auth-header {
        padding: 1.5rem;
    }
    
    .auth-header h2 {
        font-size: 1.5rem;
    }
}
</style>

<?php include __DIR__ . '/../footer.php'; ?>