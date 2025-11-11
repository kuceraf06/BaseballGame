<head>
    <meta charset="UTF-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">

    <meta name="viewport" content="width=device-width, initial-scale=1.0">

    <title><?= $pageTitle ?? '2D Baseball'; ?></title>
    <meta name="description" content="<?= $pageDescription ?? 'Description is missing'; ?>">
    <meta name="author" content="Filip Kučera">

    <link rel="canonical" href="https://xeon.spskladno.cz/~kuceraf/2DBaseball/BaseballWeb/<?php echo $_SERVER['REQUEST_URI']; ?>">

    <link rel="icon" type="image/x-icon" href="<?= $baseUrl ?>public/images/favicon/favicon.ico?v=<?= time(); ?>">

    <link rel="stylesheet" href="<?= $baseUrl ?>public/css/pageshared.css?v=<?= time(); ?>">
    <?php if (!empty($pageCSS)) echo $pageCSS; ?>

    <meta name="robots" content="index, follow">
    <meta name="theme-color" content="rgb(17, 17, 17)">

    <link href='https://unpkg.com/boxicons@2.1.4/css/boxicons.min.css' rel='stylesheet'>

    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Poppins:ital,wght@0,100;0,200;0,300;0,400;0,500;0,600;0,700;0,800;0,900;1,100;1,200;1,300;1,400;1,500;1,600;1,700;1,800;1,900&display=swap" rel="stylesheet">
    <link href="https://fonts.googleapis.com/css2?family=Jersey+10&display=swap" rel="stylesheet">
</head>


