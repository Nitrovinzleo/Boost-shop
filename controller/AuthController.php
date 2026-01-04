<?php
require_once __DIR__ . '/../model/User.php';

class AuthController {
    private $userModel;

    public function __construct($db) {
        $this->userModel = new User($db);
    }

    public function showLogin() {
        require_once __DIR__ . '/../view/auth/login.php';
    }

    public function showRegister() {
        require_once __DIR__ . '/../view/auth/register.php';
    }

  public function login() {
    if ($_SERVER['REQUEST_METHOD'] === 'POST') {
        $email = filter_input(INPUT_POST, 'email', FILTER_SANITIZE_EMAIL);
        $password = $_POST['password'];
        $user = $this->userModel->login($email, $password);
        if ($user) {
            session_start();
            $_SESSION['user_id'] = $user['id'];
            $_SESSION['username'] = $user['username'];
            
            // Rediriger vers le panier s'il y a une URL de redirection
            $redirect = $_SESSION['redirect_after_login'] ?? 'home';
            unset($_SESSION['redirect_after_login']);
            
            header('Location: /MVC/index.php?action=' . $redirect);
            exit();
        } else {
            $error = "Email ou mot de passe incorrect";
            require_once __DIR__ . '/../view/auth/login.php';
        }
    }
}

    public function register() {
        if ($_SERVER['REQUEST_METHOD'] === 'POST') {
            $username = filter_input(INPUT_POST, 'username', FILTER_SANITIZE_STRING);
            $email = filter_input(INPUT_POST, 'email', FILTER_SANITIZE_EMAIL);
            $password = $_POST['password'];
            $confirm_password = $_POST['confirm_password'];

            $errors = [];

            if (strlen($password) < 6) {
                $errors[] = "Le mot de passe doit contenir au moins 6 caractères";
            }

            if ($password !== $confirm_password) {
                $errors[] = "Les mots de passe ne correspondent pas";
            }

            if ($this->userModel->emailExists($email)) {
                $errors[] = "Cet email est déjà utilisé";
            }

            if (empty($errors)) {
                if ($this->userModel->register($username, $email, $password)) {
                    header('Location: /MVC/index.php?action=login&registered=1');
                    exit();
                } else {
                    $errors[] = "Une erreur est survenue lors de l'inscription";
                }
            }
            
            require_once __DIR__ . '/../view/auth/register.php';
        }
    }

    public function logout() {
        session_start();
        session_destroy();
        header('Location: /MVC/index.php?action=home');
        exit();
    }
}
?>
