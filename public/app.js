$('#scrape').on("click",function(event){
  event.preventDefault();
  $.ajax({
    method:"GET",
    url:"/scrape"
  }).then(function(data){

  })
});

// Grab the articles as a json
$.getJSON("/articles", function(data) {
  // For each one
  for (var i = 0; i < data.length; i++) {
    // Display the apropos information on the page
    let temp = "";
    if (data[i].saved){
      temp = '<button type="button" class="btn btn-primary disabled">Saved</button>'
    }else{
      temp = '<button data-id = "'+data[i]._id+'" type="button" class="save btn btn-primary active">Save Article</button>'
    }
    $("#articles").append("<p data-id='" + data[i]._id + "'>" + data[i].title + 
      "<br />" + data[i].link +"<br />"+temp+"<br />****************************************" +"</p>");

  }
});

$.getJSON("/articles", function(data) {
  // For each one
  for (var i = 0; i < data.length; i++) {
    // Display the apropos information on the page
    let temp = "";
    if (data[i].saved){
      temp = '<button data-id = "'+data[i]._id+'" type="button" class="btn btn-primary active remove">Remove from Saved</button>'+
      '<button data-id = "'+data[i]._id+'" data-toggle = "modal" data-target = "#notesABC" type="button" class="view btn btn-primary active">View Notes</button>'
      $("#saved_articles").append("<p data-id='" + data[i]._id + "'>" + data[i].title + 
      "<br />" + data[i].link +"<br />"+temp+"<br />****************************************" +"</p>");
    }
    

  }
});

$(document).on("click",'.save',function(event){
  var thisId = $(this).attr("data-id");
  $.ajax({
    method:"POST",
    url:"/saved/"+thisId
  }).then(function(data){
    window.location.redirect('./saved.html');
    console.log('clicked')
  })
  window.location.replace('/saved.html');
})

$(document).on("click",'.remove',function(event){
  var thisId = $(this).attr("data-id");
  $.ajax({
    method:"POST",
    url:"/remove/"+thisId
  }).then(function(data){
  })
  window.location.replace('/');
})

// Whenever someone clicks a note tag
$(document).on("click",".view",  function(event) {
  // Empty the notes from the note section
  // $("#notes").empty();
  // Save the id from the p tag
  var thisId = $(this).attr("data-id");
  $("#modal_content").empty();
  $("#notes_content").empty();
  $("#input_content").empty();
  // Now make an ajax call for the Article
  $.ajax({
    method: "GET",
    url: "/articles/" + thisId
  })
    // With that done, add the note information to the page
    .then(function(data) {
      console.log(data);
      // The title of the article
      $("#modalHeader").html("<h2>" + data.title + "</h2>");
      
      // An input to enter a new title
      // for(let i =0;i<data.notes.length;i++){
      //   $("#notes_content").append("<div class='container'><p class='center'>" + data.notes[i].body + "<button class='deleteNote right' data-id=" + data.notes[i]._id + " data-article=" + data._id + ">Delete</button></p></div>")
      // }
      // $("#notes_content").append("<h2>" + data.title + "</h2>");
      // A textarea to add a new note body
      $("#input_content").append("<textarea id='bodyinput' name='body'></textarea>");
      // A button to submit a new note, with the id of the article saved to it
      $("#input_content").append("<button data-id='" + data._id + "' class='saveNote'>Save Note</button>");

      // If there's a note in the article
      if (data.note) {
        // Place the title of the note in the title input
        $("#titleinput").val(data.note.title);
        // Place the body of the note in the body textarea
        $("#bodyinput").val(data.note.body);
      }
    });

});

// When you click the savenote button
$(document).on("click",".saveNote", function() {
  // Grab the id associated with the article from the submit button
  var thisId = $(this).attr("data-id");
  var newNote = $('#noteInfo').val();
console.log('ewfewf')
  // Run a POST request to change the note, using what's entered in the inputs
  $.ajax({
    method: "POST",
    url: "/articles/" + thisId,
    data: {
      // Value taken from title input
      title: $("#titleinput").val(),
      // Value taken from note textarea
      body: $("#bodyinput").val()
    }
  })
    // With that done
    .then(function(data) {
      // Log the response
      console.log(data);
      // Empty the notes section
      // $("#notes").empty();
    });

  // Also, remove the values entered in the input and textarea for note entry
  $("#titleinput").val("");
  $("#bodyinput").val("");
});
