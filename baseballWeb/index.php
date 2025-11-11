<?php
$baseUrl = rtrim(dirname($_SERVER['SCRIPT_NAME']), '/') . '/';

$route = $_GET['route'] ?? '';
$route = rtrim($route, '/');

switch ($route) {
    case '':
        $view = 'home';
        break;

    case 'about':
        $view = 'about';
        break;

    case 'how-to-play':
        $view = 'how-to-play';
        break;

    case 'rules':
        $view = 'rules';
        break;

    case 'leaderboard':
        $view = 'leaderboard';
        break;

    case 'support':
        $view = 'support';
        break;

    case 'info':
        $view = 'info';
        break;

    default:
        http_response_code(404);
        $view = '404';
        break;
}

if ($view) {
    ob_start();
    require __DIR__ . "/app/views/$view.php";
    $content = ob_get_clean();
    ?>
    <!DOCTYPE html>
    <html lang="en">
    <?php require __DIR__ . '/app/views/layout/head.php'; ?>
    <body>
        <?php require __DIR__ . '/app/views/layout/header.php'; ?>
        <?= $content ?>
        <?php require __DIR__ . '/app/views/layout/footer.php'; ?>
    </body>
    </html>
    <?php
}
