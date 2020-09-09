<?php

require $_SERVER["DOCUMENT_ROOT"] . '/PHPMailer/src/Exception.php';
require $_SERVER["DOCUMENT_ROOT"] . '/PHPMailer/src/PHPMailer.php';

use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\Exception;

try {
    $name = substr($_POST['name'], 0, 256);
    $phone = substr($_POST['phone'], 0, 64);
    $email = substr($_POST['email'], 0, 512);
    $comment = substr($_POST['comment'], 0, 2048);
    $title = substr($_POST['title'], 0, 64);

    $message = 'Действие на сайте: ' . $title . "\r\n";
    $message .= 'Имя: ' . $name . "\r\n";
    $message .= 'Телефон: ' . $phone . "\r\n";
    $message .= 'E-Mail: ' . $email . "\r\n";
    $message .= 'Комментарий: ' . $comment . "\r\n";

    $mail = new PHPMailer(true);

    $mail->CharSet = 'utf-8';
    $mail->Encoding = 'base64';

    $mail->From = 'noreply@transparent-promo.ru';
    $mail->FromName = 'Сайт «TT Management»';
    $mail->addAddress('belovav@aonec.ru');

    $mail->isHTML(false);

    $mail->Subject = 'Сообщение с сайта «TT Management';
    $mail->Body    = $message;

    $mail->send();

    echo "success";
} catch (\Exception $e) {
    echo "error";
}