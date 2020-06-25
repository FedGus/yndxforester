<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN"
    "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml" xml:lang="ru">
<head>
    <meta http-equiv="Content-Type" content="text/html;charset=UTF-8"/>
    <link rel="stylesheet" href="style-auth.css">
    <title>Аутентификация через Yandex</title>
</head>
<body>
    
    <?php
        $client_id = '104bbb1d48a84444b503ca8240c85eeb'; // Id приложения
        $client_secret = '2b6f7a1ed14447068e0912b174532173'; // Пароль приложения
        $redirect_uri = 'http://localhost/yndxforester/src/auth/auth.php';
        // $redirect_uri = ((!empty($_SERVER['HTTPS'])) ? 'https' : 'http') . '://' . $_SERVER['HTTP_HOST'] . $_SERVER['REQUEST_URI'];
        // $redirect_uri = explode('?', $redirect_uri);
        // $redirect_uri = $redirect_uri[0]; // Callback URI
		// echo $redirect_uri;

        if (isset($_GET['code'])) {
            $result = false;

            $params = array(
                'grant_type'    => 'authorization_code',
                'code'          => $_GET['code'],
                'client_id'     => $client_id,
                'client_secret' => $client_secret
            );

            $url = 'https://oauth.yandex.ru/token';

            $curl = curl_init();
            curl_setopt($curl, CURLOPT_URL, $url);
            curl_setopt($curl, CURLOPT_POST, 1);
            curl_setopt($curl, CURLOPT_POSTFIELDS, urldecode(http_build_query($params)));
            curl_setopt($curl, CURLOPT_RETURNTRANSFER, true);
            curl_setopt($curl, CURLOPT_SSL_VERIFYPEER, false);
            $result = curl_exec($curl);
            curl_close($curl);

            $tokenInfo = json_decode($result, true);

            if (isset($tokenInfo['access_token'])) {
                $params = array(
                    'format'       => 'json',
                    'oauth_token'  => $tokenInfo['access_token']
                );

                $userInfo = json_decode(file_get_contents('https://login.yandex.ru/info' . '?' . urldecode(http_build_query($params))), true);
                if (isset($userInfo['id'])) {
                    $userInfo = $userInfo;
                    $result = true;
                }

                if ($result) {
                    $_SESSION['user'] = $userInfo;
                    echo '<div class="nk-user-bar-view">';
                    echo '<div class="nk-user-bar-view__user-icon"><span class="nk-user-icon nk-user-icon_size_middle" style="background-image: url(https://avatars.yandex.net/get-yapic/'.$userInfo['default_avatar_id'].'/islands-retina-50);"></span></div>';
                    echo '<span class="nk-user-bar-view__name nk-user-bar-view__name_color_white">' .$userInfo['real_name']. '</span>';
                    echo '</div>';
                    require 'map/index.html';
                }
        }
    }

    if (!isset($_GET['code']) || !isset($tokenInfo['access_token'])) {
        $url = 'https://oauth.yandex.ru/authorize';

            $params = array(
                'response_type' => 'code',
                'client_id'     => $client_id,
                'display'       => 'popup'
            );
            echo '<div class="auth-back">
            <div class="auth-popup">
            <img src="img/4.png" alt="" class="robot-icon">
                <h3>Привет!</h3>
                <p>Прежде, чем работать с картой, войди через сервисы Яндекса.</p>';
                echo $link = '<button class="auth-button"><a href="' . $url . '?' . urldecode(http_build_query($params)) . '" class="navlink">Аутентификация</a></button>';
            echo '</div></div>';
            
    }
       
        ?>
</body>
</html>
