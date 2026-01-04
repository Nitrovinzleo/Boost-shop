<?php include __DIR__ . '/../header.php'; ?>

<div class="auth-container">
    <div class="auth-card">
        <div class="auth-header">
            <h3><i class="fas fa-user-plus me-2"></i>Créer un compte</h3>
        </div>
        <div class="auth-body">
            <?php if (isset($error)): ?>
                <div class="alert alert-error">
                    <i class="fas fa-exclamation-circle me-2"></i><?php echo htmlspecialchars($error); ?>
                </div>
            <?php endif; ?>

            <form action="/MVC/index.php?action=register" method="POST" class="auth-form">
                <!-- Nom d'utilisateur -->
                <div class="form-group">
                    <label for="username">
                        <i class="fas fa-user me-2"></i>Nom d'utilisateur
                    </label>
                    <div class="input-with-icon">
                        <input type="text" class="form-control" id="username" name="username" required 
                               placeholder="Votre pseudo" 
                               value="<?php echo isset($_POST['username']) ? htmlspecialchars($_POST['username']) : ''; ?>">
                        <i class="fas fa-user input-icon"></i>
                    </div>
                </div>

                <!-- Email -->
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

                <!-- Mot de passe -->
                <div class="form-group">
                    <label for="password">
                        <i class="fas fa-lock me-2"></i>Mot de passe
                    </label>
                    <div class="input-with-icon">
                        <input type="password" class="form-control" id="password" name="password" required 
                               placeholder="••••••••">
                        <i class="fas fa-lock input-icon"></i>
                    </div>
                    <div class="password-strength mt-1" id="passwordStrength">
                        <div class="strength-meter">
                            <div class="strength-meter-fill" data-strength="0"></div>
                        </div>
                        <small class="text-muted">Force du mot de passe: <span id="strengthText">Faible</span></small>
                    </div>
                </div>

                <!-- Confirmation MDP -->
                <div class="form-group">
                    <label for="confirm_password">
                        <i class="fas fa-check-circle me-2"></i>Confirmer le mot de passe
                    </label>
                    <div class="input-with-icon">
                        <input type="password" class="form-control" id="confirm_password" 
                               name="confirm_password" required placeholder="••••••••">
                        <i class="fas fa-check-circle input-icon"></i>
                    </div>
                    <div id="passwordMatch" class="mt-1" style="display: none; color: #28a745; font-size: 0.85rem;">
                        <i class="fas fa-check-circle"></i> Les mots de passe correspondent
                    </div>
                </div>

                <!-- Bouton de termine -->
                <button type="submit" class="btn-auth">
                    <i class="fas fa-user-plus me-2"></i>Créer mon compte
                </button>
            </form>
                
                <div class="auth-footer">
                    <p>Déjà inscrit ? 
                        <a href="/MVC/index.php?action=login" class="auth-link">
                            Connectez-vous ici
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
    max-width: 500px;
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

/* Indicateur de force du mot de passe */
.password-strength {
    margin-top: 0.5rem;
}

.strength-meter {
    height: 5px;
    background: #eee;
    border-radius: 3px;
    margin-bottom: 0.5rem;
    overflow: hidden;
}

.strength-meter-fill {
    height: 100%;
    width: 0%;
    border-radius: 3px;
    transition: width 0.3s ease, background-color 0.3s ease;
}

/* Bouton d'inscription */
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
    margin-top: 1rem;
}

.btn-auth:hover {
    background: #9a00a8;
    transform: translateY(-2px);
    box-shadow: 0 4px 15px rgba(182, 0, 198, 0.3);
}

.btn-auth i {
    margin-right: 8px;
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

/* Message de succès pour la correspondance des mots de passe */
#passwordMatch {
    display: none;
    color: #28a745;
    font-size: 0.85rem;
    margin-top: 0.5rem;
}

#passwordMatch i {
    margin-right: 5px;
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

<script>
// Vérification de la correspondance des mots de passe en temps réel
document.addEventListener('DOMContentLoaded', function() {
    const password = document.getElementById('password');
    const confirmPassword = document.getElementById('confirm_password');
    const passwordMatch = document.getElementById('passwordMatch');
    const passwordStrength = document.querySelector('.strength-meter-fill');
    const strengthText = document.getElementById('strengthText');

    // Vérification de la force du mot de passe
    password.addEventListener('input', function() {
        const strength = checkPasswordStrength(password.value);
        updatePasswordStrength(strength);
        checkPasswordMatch();
    });

    // Vérification de la correspondance des mots de passe
    confirmPassword.addEventListener('input', checkPasswordMatch);

    function checkPasswordMatch() {
        if (password.value && confirmPassword.value) {
            if (password.value === confirmPassword.value) {
                passwordMatch.style.display = 'block';
                confirmPassword.style.borderColor = '#28a745';
            } else {
                passwordMatch.style.display = 'none';
                confirmPassword.style.borderColor = '#dc3545';
            }
        
        if (password.value === confirmPassword.value) {
            passwordMatch.style.display = 'block';
            passwordMatch.innerHTML = '<i class="fas fa-check-circle text-success"></i> Les mots de passe correspondent';
            passwordMatch.className = 'mt-1 text-success';
        } else {
            passwordMatch.style.display = 'block';
            passwordMatch.innerHTML = '<i class="fas fa-times-circle text-danger"></i> Les mots de passe ne correspondent pas';
            passwordMatch.className = 'mt-1 text-danger';
        }
    }
    
    password.addEventListener('input', checkPasswordMatch);
    confirmPassword.addEventListener('input', checkPasswordMatch);
    
    // Validation du formulaire
    document.getElementById('registerForm').addEventListener('submit', function(e) {
        if (password.value !== confirmPassword.value) {
            e.preventDefault();
            alert('Les mots de passe ne correspondent pas.');
            return false;
        }
        return true;
    });
});
</script>

<style>
/* Styles spécifiques à la page d'inscription */
.input-with-icon {
    position: relative;
}

.input-icon {
    position: absolute;
    left: 15px;
    top: 40px;
    color: #b600c6;
}

.form-control {
    padding-left: 45px !important;
    padding-top: 12px !important;
    padding-bottom: 12px !important;
}

.form-check {
    padding-left: 1.5rem;
}

.form-check-input {
    margin-left: -1.5rem;
    margin-top: 0.2rem;
}

.form-check-label {
    font-size: 0.9rem;
    color: #636e72;
}

.form-check-label a {
    color: #b600c6;
    text-decoration: none;
    font-weight: 500;
}

.form-check-label a:hover {
    text-decoration: underline;
}

.btn-google {
    background: #fff;
    color: #757575;
    border: 1px solid #ddd;
    margin-bottom: 12px;
}

.btn-google:hover {
    background: #f5f5f5;
    color: #757575;
}

.btn-facebook {
    background: #3b5998;
    color: white;
    border: 1px solid #3b5998;
}

.btn-facebook:hover {
    background: #344e86;
    color: white;
}

.btn-social {
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 0.8rem;
    border-radius: 6px;
    margin-bottom: 1rem;
    text-decoration: none;
    transition: all 0.3s ease;
    font-weight: 500;
}

.btn-social i {
    font-size: 1.1rem;
}

/* Style pour les messages d'erreur de formulaire */
.alert-error ul {
    margin: 0.5rem 0 0 1rem;
    padding-left: 1rem;
}

.alert-error li {
    margin-bottom: 0.25rem;
}

/* Style pour les champs invalides */
.is-invalid {
    border-color: #dc3545 !important;
    padding-right: calc(1.5em + 0.75rem);
    background-image: url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 12 12' width='12' height='12' fill='none' stroke='%23dc3545'%3e%3ccircle cx='6' cy='6' r='4.5'/%3e%3cpath stroke-linejoin='round' d='M5.8 3.6h.4L6 6.5z'/%3e%3ccircle cx='6' cy='8.2' r='.6' fill='%23dc3545' stroke='none'/%3e%3c/svg%3e");
    background-repeat: no-repeat;
    background-position: right calc(0.375em + 0.1875rem) center;
    background-size: calc(0.75em + 0.375rem) calc(0.75em + 0.375rem);
}

.invalid-feedback {
    display: none;
    width: 100%;
    margin-top: 0.25rem;
    font-size: 0.875em;
    color: #dc3545;
}

.was-validated .form-control:invalid ~ .invalid-feedback,
.form-control.is-invalid ~ .invalid-feedback {
    display: block;
}
</style>