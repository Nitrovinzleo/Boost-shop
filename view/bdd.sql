-- Création de la base de données
CREATE DATABASE IF NOT EXISTS lol_boost_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE lol_boost_db;

-- 1. Table des CATÉGORIES (Ex: DuoQ, Coaching, Win Boost)
CREATE TABLE categories (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nom VARCHAR(100) NOT NULL
) ENGINE=InnoDB;

-- 2. Table des UTILISATEURS (Pour le Login/Logout)
CREATE TABLE utilisateurs (
    id INT AUTO_INCREMENT PRIMARY KEY,
    pseudo VARCHAR(50) NOT NULL,
    email VARCHAR(150) UNIQUE NOT NULL,
    mot_de_passe VARCHAR(255) NOT NULL,
    date_inscription DATETIME DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB;

-- 3. Table des PRODUITS (Tes services de Boost)
CREATE TABLE produits (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nom VARCHAR(100) NOT NULL,
    description TEXT,
    prix_unitaire DECIMAL(10,2) NOT NULL, -- 2.00€ dans ton cas
    image VARCHAR(255),
    id_categorie INT,
    FOREIGN KEY (id_categorie) REFERENCES categories(id) ON DELETE SET NULL
) ENGINE=InnoDB;

-- 4. Table des COMMANDES (L'en-tête de la commande)
CREATE TABLE commandes (
    id INT AUTO_INCREMENT PRIMARY KEY,
    id_utilisateur INT,
    date_commande DATETIME DEFAULT CURRENT_TIMESTAMP,
    total_prix DECIMAL(10,2) NOT NULL,
    statut VARCHAR(50) DEFAULT 'En attente', -- En attente, En cours, Terminé
    FOREIGN KEY (id_utilisateur) REFERENCES utilisateurs(id) ON DELETE CASCADE
) ENGINE=InnoDB;

-- 5. Table des PANIERS / DÉTAILS (Le contenu des commandes)
-- Cette table fait le lien entre une commande et les produits (ou nombre de games)
CREATE TABLE commande_details (
    id INT AUTO_INCREMENT PRIMARY KEY,
    id_commande INT,
    id_produit INT,
    quantite INT, -- Ici, ce sera ton "nb_games"
    prix_unitaire DECIMAL(10,2),
    FOREIGN KEY (id_commande) REFERENCES commandes(id) ON DELETE CASCADE,
    FOREIGN KEY (id_produit) REFERENCES produits(id) ON DELETE CASCADE
) ENGINE=InnoDB;

-- INSERTION DE DONNÉES DE TEST
INSERT INTO categories (nom) VALUES ('Rank Boost');
INSERT INTO produits (nom, description, prix_unitaire, image, id_categorie) 
VALUES ('DuoQ Boost', 'Boost de LP par tranche de 25 LP', 2.00, 'challenger.jpg', 1);