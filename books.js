$(document).ready(function() {

  var tradeId_1 = "";

  $("#homeButton").css("color", "black");
  $("#home").show();
  $("#user").hide();
  $("#myBooks").hide();
  $("#otherBooks").hide();
  $("#trades").hide();

  $("#homeButton").on("click", function(){
    $("#homeButton").css("color", "black");
    $("#myBooksButton").css("color", "");
    $("#otherBooksButton").css("color", "");
    $("#tradesButton").css("color", "");
    $("#home").show();
    $("#user").hide();
    $("#myBooks").hide();
    $("#otherBooks").hide();
    $("#trades").hide();
  });

  $("#myBooksButton").on("click", function(){

    // download books from server
    $.ajax({
      url: 'books.php',
      type: 'POST',
      dataType: 'json',
      data: ({func: "getBooks" }),
      success: function(data){
        // output to html
        var html = '';
        if (data.length > 0) {
          html += '        <div class="row">';
          html += '          <div class="col-md-12 centery">';
          html += '            <div id="errorMsg">&nbsp;</div>';
          html += '            <input id="newBookTitle" class="updateBox" placeholder="enter book title..." onkeydown = "if (event.keyCode == 13) document.getElementById(\'addBook\').click()"><button type="button" id="addBook" class="btn-xsm btn-primary">Add</button>';
          html += '          </div>';
          html += '        </div>';
        }
        for (var i = 0; i < data.length; i++) {
          html += '            <div class="books">';
          html += '              <img src="' + data[i].pix_url + '" /><br>';
          html += '              <button id="trade_' + data[i].book_id + '" class="btn-sm btn-primary bookButton tradeMyBook">Trade</button>';
          html += '              <button id="' + data[i].book_id + '" class="btn-sm btn-danger bookButton delBook">Delete</button>';
          html += '            </div>';
        }
        $("#homeButton").css("color", "");
        $("#myBooksButton").css("color", "black");
        $("#otherBooksButton").css("color", "");
        $("#tradesButton").css("color", "");
        $("#errorMsg").html('&nbsp;');
        $("#newBookTitle").val('');
        $("#home").hide();
        $("#user").hide();
        $("#myBooks").show();
        $("#booksHtml").html(html);
        $("#otherBooks").hide();
        $("#trades").hide();

        $('.delBook').on('click', function() {
          var bookId = this.id;
          $.ajax({
            url: 'books.php',
            type: 'POST',
            dataType: 'json',
            data: ({func: "deleteBook",
                    bookId: bookId }),
            success: function(data){
              $("#myBooksButton").trigger("click");
            }
          });
        });

        $('.tradeMyBook').on('click', function() {
          //$("#debug").html("hi");
          tradeId_1 = this.id;
          $("#otherTradeMsg").html("Choose a book to request from another member");
          $("#otherBooksButton").trigger("click");
        });

  $('#addBook').on('click', function() {

    $("#errorMsg").html('&nbsp;');
    // search and retrieve image link from Google Books
    var newBookTitle = $("#newBookTitle").val();

    url = "https://www.googleapis.com/books/v1/volumes?q=" + newBookTitle;
    $.getJSON(url, function(json) {
      if (json.totalItems === 0) {
        $("#errorMsg").html('Invalid title');
      } else {
        var bookPix = json.items[0].volumeInfo.imageLinks.thumbnail;
        $.ajax({
          url: 'books.php',
          type: 'POST',
          dataType: 'json',
          data: ({func: "addBook",
                  bookPix: bookPix }),
          success: function(data){
            $("#myBooksButton").trigger("click");
          }
        });
      }
    });

  });



      }
    });

  });


  $("#otherBooksButton").on("click", function(){

    // download books from server
    $.ajax({
      url: 'books.php',
      type: 'POST',
      dataType: 'json',
      data: ({func: "getOtherBooks" }),
      success: function(data){
        // output to html
        var html = '';
        for (var i = 0; i < data.length; i++) {
          html += '            <div class="books">';
          html += '              <img src="' + data[i].pix_url + '" /><br>';
          if (tradeId_1 != "") {html += '              <button id="trade_' + data[i].book_id + '" class="btn-sm btn-primary bookButton tradeOtherBook">Trade</button>';};
          html += '            </div>';
        }
        $("#homeButton").css("color", "");
        $("#myBooksButton").css("color", "");
        $("#otherBooksButton").css("color", "black");
        $("#tradesButton").css("color", "");
        $("#home").hide();
        $("#user").hide();
        $("#myBooks").hide();
        $("#otherBooks").show();
        $("#otherBooksHtml").html(html);
        $("#trades").hide();

        $('.tradeOtherBook').on('click', function() {
          tradeId_2 = this.id;
          $("#otherTradeMsg").html("");

          $.ajax({
            url: 'books.php',
            type: 'POST',
            dataType: 'json',
            data: ({func: "requestTrade",
              tradeId_1: tradeId_1,
              tradeId_2: tradeId_2 }),
            success: function(data){
              $("#tradesButton").trigger("click");
            }
          });
        });

      }
    });
  });


  $("#tradesButton").on("click", function(){

    // download my requests from server
    $.ajax({
      url: 'books.php',
      type: 'POST',
      dataType: 'json',
      data: ({func: "getMyTrades" }),
      success: function(data){

        // output to html
        var html = '';

        if (data.length > 0) {
          html += '        <div class="row">';
          html += '          <div class="col-md-12"><div class="titles">My Trade Requests</div></div>';
          html += '        </div>';
        }

        for (var i = 0; i < data.length; i++) {
          html += '        <div class="row">';
          html += '          <div class="col-md-12 centery">';
          html += '            <div class="books">';
          html += '              <img class="spacey" src="' + data[i].pix_url_1 + '" />';
          html += '              <img src="' + data[i].pix_url_2 + '" /><br>';
          html += '              <button type="button" id="cancel_' + data[i].trade_id + '" class="btn-sm btn-danger bookButton cancelTrade">Cancel</button>';
          html += '            </div>';
          html += '          </div>';
          html += '        </div>';
        }


        // download other requests from server
        $.ajax({
          url: 'books.php',
          type: 'POST',
          dataType: 'json',
          data: ({func: "getOtherTrades" }),
          success: function(data2){

            // output to html
            var html2 = '';

            if (data2.length > 0) {
              html2 += '        <div class="row">';
              html2 += '          <div class="col-md-12"><div class="titles">Trade Requests from Other Members</div></div>';
              html2 += '        </div>';
            }

            for (var i = 0; i < data2.length; i++) {
              html2 += '        <div class="row">';
              html2 += '          <div class="col-md-12 centery">';
              html2 += '            <div class="books">';
              html2 += '              <img class="spacey" src="' + data2[i].pix_url_1 + '" />';
              html2 += '              <img src="' + data2[i].pix_url_2 + '" /><br>';
              html2 += '              <button type="button" id="accept_' + data2[i].trade_id + '" class="btn-sm btn-success bookButton acceptTrade">Accept</button>';
              html2 += '              <button type="button" id="reject_' + data2[i].trade_id + '" class="btn-sm btn-danger bookButton rejectTrade">Reject</button>';
              html2 += '            </div>';
              html2 += '          </div>';
              html2 += '        </div>';
            }

            $("#homeButton").css("color", "");
            $("#myBooksButton").css("color", "");
            $("#otherBooksButton").css("color", "");
            $("#tradesButton").css("color", "black");
            $("#home").hide();
            $("#user").hide();
            $("#myBooks").hide();
            $("#otherBooks").hide();
            $("#trades").show();
            $("#myPendingTrades").html(html);
            $("#otherPendingTrades").html(html2);

            $('.cancelTrade').on('click', function() {
              tradeId = this.id;

              $.ajax({
                url: 'books.php',
                type: 'POST',
                dataType: 'json',
                data: ({func: "cancelTrade",
                  tradeId: tradeId }),
                success: function(data){
                  $("#tradesButton").trigger("click");
                }
              });
            });

            $('.rejectTrade').on('click', function() {
              tradeId = this.id;

              $.ajax({
                url: 'books.php',
                type: 'POST',
                dataType: 'json',
                data: ({func: "rejectTrade",
                  tradeId: tradeId }),
                success: function(data){
                  $("#tradesButton").trigger("click");
                }
              });
            });

            $('.acceptTrade').on('click', function() {
              tradeId = this.id;

              $.ajax({
                url: 'books.php',
                type: 'POST',
                dataType: 'json',
                data: ({func: "acceptTrade",
                  tradeId: tradeId }),
                success: function(data){
                  $("#tradesButton").trigger("click");
                }
              });
            });

          }
        });
      }
    });
  });



  $('#userUpdate').on('click', function() {
    $.ajax({
      url: 'books.php',
      type: 'POST',
      dataType: 'json',
      data: ({func: "getUserInfo" }),
      success: function(data){
        $("#name").val(data[0].name);
        $("#street").val(data[0].street);
        $("#city").val(data[0].city);
        $("#state").val(data[0].state);
        $("#zip").val(data[0].zip);
        $("#home").hide();
        $("#user").show();
        $("#myBooks").hide();
        $("#otherBooks").hide();
        $("#trades").hide();
      }
    });
  });

  
  $('#updateUserInfo').on('click', function() {
    var newName = $("#name").val();
    var newStreet = $("#street").val();
    var newCity = $("#city").val();
    var newState = $("#state").val();
    var newZip = $("#zip").val();

    $.ajax({
      url: 'books.php',
      type: 'POST',
      dataType: 'json',
      data: ({func: "updateUserInfo",
              name: newName,
              street: newStreet,
              city: newCity,
              state: newState,
              zip: newZip }),
      success: function(data){
        $("#homeButton").css("color", "black");
        $("#myBooksButton").css("color", "");
        $("#otherBooksButton").css("color", "");
        $("#tradeBooksButton").css("color", "");
        $("#home").show();
        $("#user").hide();
        $("#myBooks").hide();
        $("#otherBooks").hide();
        $("#tradeBooks").hide();
      }
    });

  });


  if (document.cookie.indexOf("ezchxBooks") >= 0) {
    $("#userUpdate").html('<img id="gear" src="http://ezchx.com/books/gear.png">');
    $("#loginButton").html('<button type="button" id="logoutButton" class="btn-sm btn-danger">Logout</button>');
  }

  $('#logoutButton').on('click', function() {
    document.cookie = "ezchxBooks=; expires=Thu, 01 Jan 1970 00:00:00 UTC";
    $("#userUpdate").html('');
    $("#loginButton").html('<a href="login.php?login=yes"><img src="http://ezchx.com/twitteroauth/sign-in-with-twitter-gray.png" /></a>');
  });

  
});