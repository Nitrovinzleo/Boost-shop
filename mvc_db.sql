-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Hôte : 127.0.0.1:3306
-- Généré le : lun. 22 déc. 2025 à 15:08
-- Version du serveur : 8.0.39
-- Version de PHP : 8.3.14

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Base de données : `mvc_db`
--

-- --------------------------------------------------------

--
-- Structure de la table `categories`
--

DROP TABLE IF EXISTS `categories`;
CREATE TABLE IF NOT EXISTS `categories` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL,
  `description` text COLLATE utf8mb4_unicode_ci,
  `icon` varchar(50) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `is_active` tinyint(1) DEFAULT '1',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Déchargement des données de la table `categories`
--

INSERT INTO `categories` (`id`, `name`, `description`, `icon`, `is_active`, `created_at`) VALUES
(1, 'Boosting', 'Services de boosting de compte', 'fa-arrow-up', 1, '2025-12-22 14:34:30'),
(2, 'Coaching', 'Cours particuliers avec des joueurs professionnels', 'fa-graduation-cap', 1, '2025-12-22 14:34:30'),
(3, 'Placement', 'Services de placement en ranked', 'fa-trophy', 1, '2025-12-22 14:34:30');

-- --------------------------------------------------------

--
-- Structure de la table `notifications`
--

DROP TABLE IF EXISTS `notifications`;
CREATE TABLE IF NOT EXISTS `notifications` (
  `id` int NOT NULL AUTO_INCREMENT,
  `user_id` int NOT NULL,
  `title` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `message` text COLLATE utf8mb4_unicode_ci NOT NULL,
  `is_read` tinyint(1) DEFAULT '0',
  `type` enum('order_update','payment','support','system') COLLATE utf8mb4_unicode_ci NOT NULL,
  `related_id` int DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `user_id` (`user_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Structure de la table `orders`
--

DROP TABLE IF EXISTS `orders`;
CREATE TABLE IF NOT EXISTS `orders` (
  `id` int NOT NULL AUTO_INCREMENT,
  `user_id` int NOT NULL,
  `order_number` varchar(50) COLLATE utf8mb4_unicode_ci NOT NULL,
  `total_amount` decimal(10,2) NOT NULL,
  `status` enum('pending','in_progress','completed','cancelled','disputed') COLLATE utf8mb4_unicode_ci DEFAULT 'pending',
  `discord_tag` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL,
  `game_username` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `server_region` varchar(50) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `additional_notes` text COLLATE utf8mb4_unicode_ci,
  `admin_notes` text COLLATE utf8mb4_unicode_ci,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `order_number` (`order_number`),
  KEY `user_id` (`user_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Structure de la table `order_items`
--

DROP TABLE IF EXISTS `order_items`;
CREATE TABLE IF NOT EXISTS `order_items` (
  `id` int NOT NULL AUTO_INCREMENT,
  `order_id` int NOT NULL,
  `service_id` int NOT NULL,
  `quantity` int NOT NULL DEFAULT '1',
  `price` decimal(10,2) NOT NULL,
  `selected_options` json DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `order_id` (`order_id`),
  KEY `service_id` (`service_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Structure de la table `payments`
--

DROP TABLE IF EXISTS `payments`;
CREATE TABLE IF NOT EXISTS `payments` (
  `id` int NOT NULL AUTO_INCREMENT,
  `order_id` int NOT NULL,
  `user_id` int NOT NULL,
  `amount` decimal(10,2) NOT NULL,
  `payment_method` enum('paypal','stripe','crypto','balance') COLLATE utf8mb4_unicode_ci NOT NULL,
  `transaction_id` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `status` enum('pending','completed','failed','refunded') COLLATE utf8mb4_unicode_ci DEFAULT 'pending',
  `payment_details` text COLLATE utf8mb4_unicode_ci,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `order_id` (`order_id`),
  KEY `user_id` (`user_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Structure de la table `services`
--

DROP TABLE IF EXISTS `services`;
CREATE TABLE IF NOT EXISTS `services` (
  `id` int NOT NULL AUTO_INCREMENT,
  `category_id` int DEFAULT NULL,
  `name` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `description` text COLLATE utf8mb4_unicode_ci,
  `price` decimal(10,2) NOT NULL,
  `estimated_time` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `is_available` tinyint(1) DEFAULT '1',
  `image_url` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `category_id` (`category_id`)
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Déchargement des données de la table `services`
--

INSERT INTO `services` (`id`, `category_id`, `name`, `description`, `price`, `estimated_time`, `is_available`, `image_url`, `created_at`, `updated_at`) VALUES
(1, 1, 'Boosting Solo/Duo', 'Boosting en Solo/Duo jusqu\'au rang souhaité', 50.00, '1-3 jours', 1, NULL, '2025-12-22 14:34:30', '2025-12-22 14:34:30'),
(2, 1, 'Boosting Flex', 'Boosting en Flex jusqu\'au rang souhaité', 45.00, '1-3 jours', 1, NULL, '2025-12-22 14:34:30', '2025-12-22 14:34:30'),
(3, 2, 'Coaching 1h', 'Session de coaching personnalisée de 1h', 30.00, '1h', 1, NULL, '2025-12-22 14:34:30', '2025-12-22 14:34:30'),
(4, 2, 'Coaching 5h', 'Forfait de 5h de coaching avec réduction', 125.00, '5h', 1, NULL, '2025-12-22 14:34:30', '2025-12-22 14:34:30'),
(5, 3, 'Placement en Ranked', '10 parties de classées avec garantie de victoire', 100.00, '3-5 jours', 1, NULL, '2025-12-22 14:34:30', '2025-12-22 14:34:30');

-- --------------------------------------------------------

--
-- Structure de la table `service_options`
--

DROP TABLE IF EXISTS `service_options`;
CREATE TABLE IF NOT EXISTS `service_options` (
  `id` int NOT NULL AUTO_INCREMENT,
  `service_id` int NOT NULL,
  `name` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL,
  `description` text COLLATE utf8mb4_unicode_ci,
  `price_multiplier` decimal(5,2) DEFAULT '1.00',
  `is_required` tinyint(1) DEFAULT '0',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `service_id` (`service_id`)
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Déchargement des données de la table `service_options`
--

INSERT INTO `service_options` (`id`, `service_id`, `name`, `description`, `price_multiplier`, `is_required`, `created_at`) VALUES
(1, 1, 'Division Actuelle', 'Votre division actuelle', 1.00, 1, '2025-12-22 14:34:30'),
(2, 1, 'Division Cible', 'La division que vous souhaitez atteindre', 1.00, 1, '2025-12-22 14:34:30'),
(3, 1, 'Priorité', 'Traitement prioritaire de votre commande', 1.50, 0, '2025-12-22 14:34:30'),
(4, 2, 'Division Actuelle', 'Votre division actuelle', 1.00, 1, '2025-12-22 14:34:30'),
(5, 2, 'Division Cible', 'La division que vous souhaitez atteindre', 1.00, 1, '2025-12-22 14:34:30');

-- --------------------------------------------------------

--
-- Structure de la table `users`
--

DROP TABLE IF EXISTS `users`;
CREATE TABLE IF NOT EXISTS `users` (
  `id` int NOT NULL AUTO_INCREMENT,
  `username` varchar(50) COLLATE utf8mb4_unicode_ci NOT NULL,
  `email` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL,
  `password` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `email` (`email`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Déchargement des données de la table `users`
--

INSERT INTO `users` (`id`, `username`, `email`, `password`, `created_at`) VALUES
(1, 'root', 'vhoebler@gmail.com', '$2y$10$hRbLSZ.k8eR59DvJzXlr8.ArBHXo3QrU5.crYh8Y18eUvANCGG9rm', '2025-12-22 14:17:15');

-- --------------------------------------------------------

--
-- Structure de la table `wallet_transactions`
--

DROP TABLE IF EXISTS `wallet_transactions`;
CREATE TABLE IF NOT EXISTS `wallet_transactions` (
  `id` int NOT NULL AUTO_INCREMENT,
  `user_id` int NOT NULL,
  `amount` decimal(10,2) NOT NULL,
  `type` enum('deposit','withdrawal','order_payment','refund','bonus') COLLATE utf8mb4_unicode_ci NOT NULL,
  `status` enum('pending','completed','failed','cancelled') COLLATE utf8mb4_unicode_ci DEFAULT 'pending',
  `payment_method` varchar(50) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `transaction_id` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `notes` text COLLATE utf8mb4_unicode_ci,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `user_id` (`user_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Contraintes pour les tables déchargées
--

--
-- Contraintes pour la table `notifications`
--
ALTER TABLE `notifications`
  ADD CONSTRAINT `notifications_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE;

--
-- Contraintes pour la table `orders`
--
ALTER TABLE `orders`
  ADD CONSTRAINT `orders_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE;

--
-- Contraintes pour la table `order_items`
--
ALTER TABLE `order_items`
  ADD CONSTRAINT `order_items_ibfk_1` FOREIGN KEY (`order_id`) REFERENCES `orders` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `order_items_ibfk_2` FOREIGN KEY (`service_id`) REFERENCES `services` (`id`);

--
-- Contraintes pour la table `payments`
--
ALTER TABLE `payments`
  ADD CONSTRAINT `payments_ibfk_1` FOREIGN KEY (`order_id`) REFERENCES `orders` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `payments_ibfk_2` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE;

--
-- Contraintes pour la table `services`
--
ALTER TABLE `services`
  ADD CONSTRAINT `services_ibfk_1` FOREIGN KEY (`category_id`) REFERENCES `categories` (`id`) ON DELETE SET NULL;

--
-- Contraintes pour la table `service_options`
--
ALTER TABLE `service_options`
  ADD CONSTRAINT `service_options_ibfk_1` FOREIGN KEY (`service_id`) REFERENCES `services` (`id`) ON DELETE CASCADE;

--
-- Contraintes pour la table `wallet_transactions`
--
ALTER TABLE `wallet_transactions`
  ADD CONSTRAINT `wallet_transactions_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
