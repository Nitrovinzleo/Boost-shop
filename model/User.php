<?php
class User {
    private $db;

    public function __construct($db) {
        $this->db = $db;
    }

    public function register($username, $email, $password) {
        $hashed_password = password_hash($password, PASSWORD_DEFAULT);
        $query = "INSERT INTO users (username, email, password) VALUES (?, ?, ?)";
        $stmt = $this->db->prepare($query);
        return $stmt->execute([$username, $email, $hashed_password]);
    }

    public function login($email, $password) {
        $query = "SELECT * FROM users WHERE email = ?";
        $stmt = $this->db->prepare($query);
        $stmt->execute([$email]);
        $user = $stmt->fetch(PDO::FETCH_ASSOC);

        if ($user && password_verify($password, $user['password'])) {
            return $user;
        }
        return false;
    }

    public function emailExists($email) {
        $query = "SELECT id FROM users WHERE email = ?";
        $stmt = $this->db->prepare($query);
        $stmt->execute([$email]);
        return $stmt->rowCount() > 0;
    }
}
?>
