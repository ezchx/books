<?php

error_reporting(E_ALL);

$login = isset($_GET['login']) ? $_GET['login'] : '';

// echo $login;

session_start();
require "../twitteroauth/autoload.php";
use Abraham\TwitterOAuth\TwitterOAuth;
define('CONSUMER_KEY', "");
define('CONSUMER_SECRET', "");
define('OAUTH_CALLBACK', "http://ezchx.com/books/login.php");


if ($login) {
  $connection = new TwitterOAuth(CONSUMER_KEY, CONSUMER_SECRET);
  $request_token = $connection->oauth('oauth/request_token', array('oauth_callback' => OAUTH_CALLBACK));
  $_SESSION['oauth_token'] = $request_token['oauth_token'];
  $_SESSION['oauth_token_secret'] = $request_token['oauth_token_secret'];
  $url = $connection->url('oauth/authorize', array('oauth_token' => $request_token['oauth_token']));
  header('Location: ' . $url);
}


if(!$login && isset($_SESSION['oauth_token'])) {
  $request_token = [];
  $request_token['oauth_token'] = $_SESSION['oauth_token'];
  $request_token['oauth_token_secret'] = $_SESSION['oauth_token_secret'];
  if (isset($_REQUEST['oauth_token']) && $request_token['oauth_token'] !== $_REQUEST['oauth_token']) {
    // Abort! Something is wrong.
  }
  $connection = new TwitterOAuth(CONSUMER_KEY, CONSUMER_SECRET, $request_token['oauth_token'], $request_token['oauth_token_secret']);
  $access_token = $connection->oauth("oauth/access_token", ["oauth_verifier" => $_REQUEST['oauth_verifier']]);
  $_SESSION = Array();
  $string = implode(';', $access_token);
  $user_id = $access_token["user_id"];
  setcookie("ezchxBooks", $user_id);

  // add to user dbase if new

  mysql_connect("localhost",$username,$password);
  @mysql_select_db($database) or die( "Unable to select database");
  $query = "SELECT * FROM books_users  WHERE user_id = '$user_id'";
  $result = mysql_query($query);
  $num = mysql_numrows($result);
  if ($num === 0) {
    $query = "INSERT INTO books_users VALUES (
      '$user_id',
      '',
      '',
      '',
      '',
      '')";
    mysql_query($query);
  }

  mysql_close();
  header('Location: http://ezchx.com/books/index.html');
}


if(!$login && !isset($_SESSION['oauth_token'])) {
  header('Location: http://ezchx.com/books/index.html');
}


?>