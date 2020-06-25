<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8" />
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <title>Работа со спутниковыми снимками</title>
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <link rel="stylesheet" type="text/css" media="screen" href="css/style.css" />

    <script src="js/jquery-3.4.1.js" type="text/javascript"></script>
    <script src="js/script.js" type="text/javascript"></script>
</head>
<body>
        <nav>
                <img class="logo" alt="" src="img/5.png">
                    <ul>
                        <li><a href="index.php" class="navlink">Работа с картой</a></li>
                        <li><a href="site/index.html" class="navlink">О разработке</a></li>
                    </ul>
                    <button id="nmaps"><a href="https://n.maps.yandex.ru" class="navlink">Перейти на Народную карту</a></button>
                </nav>
            <?php
            require "auth/auth.php";
            ?>
<footer>
          Разработано в команде <a href="http://polyweb.agency" >Polyweb.Agency</a>
    </footer>
</body>
</html>