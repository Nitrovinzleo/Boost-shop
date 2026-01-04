<?php 

$page = isset($_GET['page']) ? $_GET['page'] : 'home';  

switch ($page) {
    case 'home':
        include 'home.php';
        break;
    case 'contact':
        include '../view/contact.php';
        break;
    default:
        include '../view/404.php';
        break;
}