<?php

error_reporting(E_ALL);

$func = $_POST["func"];


if ($func == "getUserInfo") {
  $userID = $_COOKIE["ezchxBooks"];

  mysql_connect("localhost",$username,$password);
  @mysql_select_db($database) or die( "Unable to select database");
  $query = "SELECT * FROM books_users  WHERE user_id = '$userID'";
  $result = mysql_query($query);
  $num = mysql_numrows($result);
  mysql_close();

  $user = array();
  while(($row =  mysql_fetch_assoc($result))) {
    $user[] = array(
    'user_id' => $row['user_id'],
    'name' => $row['name'],
    'street' => $row['street'],
    'city' => $row['city'],
    'state' => $row['state'],
    'zip' => $row['zip']);
  }
  echo json_encode($user);

}


if ($func == "updateUserInfo") {
  $userID = $_COOKIE["ezchxBooks"];
  $name = $_POST["name"];
  $street = $_POST["street"];
  $city = $_POST["city"];
  $state = $_POST["state"];
  $zip = $_POST["zip"];

  mysql_connect("localhost",$username,$password);
  @mysql_select_db($database) or die( "Unable to select database");
  $query = "UPDATE books_users SET
    name = '$name',
    street = '$street',
    city = '$city',
    state = '$state',
    zip = '$zip'
    WHERE user_id = '$userID'";
  mysql_query($query);
  mysql_close();
  echo json_encode($userID);

}


if ($func == "addBook") {
  $userID = $_COOKIE["ezchxBooks"];
  $bookPix = $_POST["bookPix"];

  mysql_connect("localhost",$username,$password);
  @mysql_select_db($database) or die( "Unable to select database");
    $query = "INSERT INTO books_books VALUES (
      '',
      '$userID',
      '$bookPix')";
    mysql_query($query);
  mysql_close();
  echo json_encode($userID);

}


if ($func == "getBooks") {

  $userID = $_COOKIE["ezchxBooks"];

  mysql_connect("localhost",$username,$password);
  @mysql_select_db($database) or die( "Unable to select database");
  $query = "SELECT * FROM books_books WHERE user_id = '$userID'";
  $result = mysql_query($query);
  mysql_close();

  $books = array();
  while(($row =  mysql_fetch_assoc($result))) {
    $books[] = array(
    'book_id' => $row['book_id'],
    'pix_url' => $row['pix_url']);
  }
  echo json_encode($books);

}


if ($func == "getOtherBooks") {
  if(isset($_COOKIE['ezchxBooks'])){
    $userID = $_COOKIE["ezchxBooks"];
  }
  else{
    $userID = "0";
  }

  mysql_connect("localhost",$username,$password);
  @mysql_select_db($database) or die( "Unable to select database");
  $query = "SELECT * FROM books_books WHERE user_id != '$userID'";
  $result = mysql_query($query);
  mysql_close();

  $books = array();
  while(($row =  mysql_fetch_assoc($result))) {
    $books[] = array(
    'book_id' => $row['book_id'],
    'pix_url' => $row['pix_url']);
  }
  echo json_encode($books);

}



if ($func == "deleteBook") {
  $bookId = $_POST["bookId"];

  mysql_connect("localhost",$username,$password);
  @mysql_select_db($database) or die( "Unable to select database");
  $query = "DELETE FROM books_books WHERE book_id = '$bookId'";
  mysql_query($query);
  $query = "DELETE FROM books_trades WHERE (req_book_id = '$bookId' OR tgt_book_id = '$bookId')";
  mysql_query($query);
  mysql_close();
  echo json_encode($bookId);

}


if ($func == "requestTrade") {

  $book_id_1 = $_POST["tradeId_1"];
  $book_id_1 = str_replace("trade_","",$book_id_1);
  $book_id_2 = $_POST["tradeId_2"];
  $book_id_2 = str_replace("trade_","",$book_id_2);

  mysql_connect("localhost",$username,$password);
  @mysql_select_db($database) or die( "Unable to select database");

  $query = "SELECT * FROM books_books WHERE book_id = '$book_id_1'";
  $result = mysql_query($query);
  $user_id_1 = mysql_result($result,0,"user_id");
  $pix_url_1 = mysql_result($result,0,"pix_url");

  $query = "SELECT * FROM books_books WHERE book_id = '$book_id_2'";
  $result = mysql_query($query);
  $user_id_2 = mysql_result($result,0,"user_id");
  $pix_url_2 = mysql_result($result,0,"pix_url");

  $query = "INSERT INTO books_trades VALUES (
      '',
      '$user_id_1',
      '$book_id_1',
      '$pix_url_1',
      '$user_id_2',
      '$book_id_2',
      '$pix_url_2')";
  mysql_query($query);
  mysql_close();
  echo json_encode($book_id_1);

}


if ($func == "getMyTrades") {

  $userID = $_COOKIE["ezchxBooks"];

  mysql_connect("localhost",$username,$password);
  @mysql_select_db($database) or die( "Unable to select database");
  $query = "SELECT * FROM books_trades WHERE user_id_1 = '$userID'";
  $result = mysql_query($query);
  mysql_close();

  $myTrades = array();
  while($row =  mysql_fetch_assoc($result)) {
    $myTrades[] = array(
    'trade_id' => $row['trade_id'],
    'book_id_1' => $row['book_id_1'],
    'pix_url_1' => $row['pix_url_1'],
    'book_id_2' => $row['book_id_2'],
    'pix_url_2' => $row['pix_url_2']);
  }
  echo json_encode($myTrades);

}


if ($func == "getOtherTrades") {

  $userID = $_COOKIE["ezchxBooks"];

  mysql_connect("localhost",$username,$password);
  @mysql_select_db($database) or die( "Unable to select database");
  $query = "SELECT * FROM books_trades WHERE user_id_2 = '$userID'";
  $result = mysql_query($query);
  mysql_close();

  $myTrades2 = array();
  while($row =  mysql_fetch_assoc($result)) {
    $myTrades2[] = array(
    'trade_id' => $row['trade_id'],
    'book_id_1' => $row['book_id_1'],
    'pix_url_1' => $row['pix_url_1'],
    'book_id_2' => $row['book_id_2'],
    'pix_url_2' => $row['pix_url_2']);
  }
  echo json_encode($myTrades2);

}


if ($func == "cancelTrade") {

  $tradeId = $_POST["tradeId"];
  $tradeId = str_replace("cancel_","",$tradeId);
  mysql_connect("localhost",$username,$password);
  @mysql_select_db($database) or die( "Unable to select database");
  $query = "DELETE FROM books_trades WHERE trade_id = '$tradeId'";
  mysql_query($query);
  mysql_close();
  echo json_encode($tradeId);

}


if ($func == "rejectTrade") {

  $tradeId = $_POST["tradeId"];
  $tradeId = str_replace("reject_","",$tradeId);
  mysql_connect("localhost",$username,$password);
  @mysql_select_db($database) or die( "Unable to select database");
  $query = "DELETE FROM books_trades WHERE trade_id = '$tradeId'";
  mysql_query($query);
  mysql_close();
  echo json_encode($tradeId);

}


if ($func == "acceptTrade") {

  $tradeId = $_POST["tradeId"];
  $tradeId = str_replace("accept_","",$tradeId);
  mysql_connect("localhost",$username,$password);
  @mysql_select_db($database) or die( "Unable to select database");
  $query = "SELECT * FROM books_trades WHERE trade_id = '$tradeId'";
  $result = mysql_query($query);

  $user_id_1 = mysql_result($result,0,"user_id_1");
  $book_id_1 = mysql_result($result,0,"book_id_1");
  $user_id_2 = mysql_result($result,0,"user_id_2");
  $book_id_2 = mysql_result($result,0,"book_id_2");

  $query = "UPDATE books_books SET user_id = '$user_id_2' WHERE book_id = '$book_id_1'";
  mysql_query($query);
  $query = "UPDATE books_books SET user_id = '$user_id_1' WHERE book_id = '$book_id_2'";
  mysql_query($query);

  $query = "DELETE FROM books_trades WHERE trade_id = '$tradeId'";
  mysql_query($query);

  mysql_close();
  echo json_encode($tradeId);

}


exit;


?>