<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <link rel="stylesheet" href="auth_style.css">
    <title>Авторизация</title>
</head>
<body>
    <?php
        $client_id = 'af50efe901b6470d98ef2182c1ef5876'; // Id приложения
        $client_secret = '94a89595d6464fc299489b2eb0a549d4'; // Пароль приложения
        $redirect_uri = 'https://oauth.yandex.ru/verification_code'; // Callback URI
        $url = 'https://oauth.yandex.ru/authorize';
        $params = array(
            'response_type' => 'code',
            'client_id'     => $client_id,
            'display'       => 'popup'
        );
        echo $link = '<p><a href="' . $url . '?' . urldecode(http_build_query($params)) . '">Аутентификация через Yandex</a></p>';
        // https://oauth.yandex.ru/authorize?response_type=code&client_id=22d7dfc5f4358b47b41f6e1f8a80efa0&display=popup
    ?>
</body>
</html>