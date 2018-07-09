var animals = ["owl","frog","beyonce","lemur"];
var localData = JSON.parse(localStorage.getItem("allFavorites"));

if (localData==null){
    localStorage.setItem("allFavorites","{}");
    localData = {};
}

var headerHeight;
headerHeight = $("#header").height();
$("#favDiv").css("margin-top",headerHeight+40+"px");
console.log(headerHeight);

for (var key in localData){
    var favGif = localData[key];
    $("#favDiv").append($("<div>").attr({"class":"gif","id":favGif.id}));
    $("#"+favGif.id)
    .append($("<div>").text("Title: "+favGif.title).addClass("gifText"))
    .append($("<div>").text("Rating: "+favGif.rating).addClass("gifText"))
    .append($("<img>").attr({"src":favGif.images.fixed_height_still.url,
                             "data-still":favGif.images.fixed_height_still.url,
                             "data-animate":favGif.images.fixed_height.url,
                             "state":"still"}))
    // .append($("<a>").html("&#x25BC").addClass("downloadButton").attr({"href":favGif.images.original.url,"download":key}));
    //since I can't get the download button to work, i'm commenting out the download button
    .append($("<button>").html("&#x2612").addClass("removeButton").attr({"data-id":favGif.id}));
}

//for loop to create buttons for animals in array above
for (var i in animals){
    $("#buttonDiv").append($("<button>").text(animals[i]).attr({"class":"animalButton"}));
}



//on click function to create buttons for new animals
$(document).on("click","form button",function(){
    event.preventDefault();
    var animal = $("input").val();
    $("#buttonDiv").append($("<button>").text(animal).attr({"class":"animalButton"}));
    $("input").val("");
    headerHeight = $("#header").height();
    $("#favDiv").css("margin-top",headerHeight+"px");
    console.log(headerHeight);
})

//on click function to add gifs
var animal = "";
var apiKey = "zrFbMSNOTjrWkZbDs4haMGyhBG1xF7FG";
var limit = 0;
var tempStorage = [];//temp storage for everytime gifs are loaded onto the screen
var lastButton = "";

$(document).on("click",".animalButton",function(){
    animal = $(this).text();
        if (lastButton!=animal){
            $("#gifDiv").empty();//gifs are emptied only if the last animal is different than this animal, this way, each button press will add 10 more gifs to the bottom of the screen
            lastButton=animal;
            limit = 0;
            tempStorage = [];
        }
        limit = limit+10;
        var url = "http://api.giphy.com/v1/gifs/search?q="+animal+"&api_key="+apiKey+"&limit="+limit;
        $.ajax({url: url})
        .then(function(res){
            console.log(res);
            for (i=limit-10;i<limit;i++){//limit-10 ensures that only the last 10 gifs are added, therefore I don't have to empty #gifDiv everytime and less reloading is needed
                $("#gifDiv").append($("<div>").attr({"class":"gif","id":"gif"+i}));
                $("#gif"+i)
                .append($("<div>").text("Title: "+res.data[i].title).addClass("gifText"))
                .append($("<div>").text("Rating: "+res.data[i].rating).addClass("gifText"))
                .append($("<img>").attr({"src":res.data[i].images.fixed_height_still.url,
                                         "data-still":res.data[i].images.fixed_height_still.url,
                                         "data-animate":res.data[i].images.fixed_height.url,
                                         "state":"still"}))
                // .append($("<a>").html("&#x25BC").addClass("downloadButton").attr({"gif-id":res.data[i].id}))
                // .attr({"href":res.data[i].images.original.url,"download":res.data[i].id}))

                //download button does not work, opens gif in new window instead
                //<a href="path_to_file" download="proposed_file_name">Download</a>
                .append($("<button>").html("&#x2665").addClass("favButton").attr({"data-id":i}));
                tempStorage.push(res.data[i]);
            }
            console.log(tempStorage);
        });
})

//on click function to start/stop gifs
$(document).on("click","img",function(){
    var link;
    var state = $(this).attr("state");
    if (state == "still"){
    link = $(this).attr("data-animate");
    $(this).attr("src",link);
    $(this).attr("state","animate");
    } else {
    link = $(this).attr("data-still");
    $(this).attr("src",link);
    $(this).attr("state","still");
    }
})

//on click function to display faved gifs
$(document).on("click",".favButton",function(){
    var id = $(this).attr("data-id");
    //not sure if possible to search gif by id
    // var url = "http://api.giphy.com/v1/gifs/id="+id+"&api_key="+apiKey;
    // var url = "http://api.giphy.com/v1/gifs/search?id="+id+"&api_key="+apiKey;
    //https://media0.giphy.com/media/vQqeT3AYg8S5O/200.gif
    //https://media0.giphy.com/media/vQqeT3AYg8S5O/200_s.gif
    var favGif = tempStorage[id];
    //for favorites to persist after reload, the tempStorage array will probably have to move to another file or database
    $("#favDiv").append($("<div>").attr({"class":"gif","id":favGif.id}));
    $("#"+favGif.id)
    .append($("<div>").text("Title: "+favGif.title).addClass("gifText"))
    .append($("<div>").text("Rating: "+favGif.rating).addClass("gifText"))
    .append($("<img>").attr({"src":favGif.images.fixed_height_still.url,
                             "data-still":favGif.images.fixed_height_still.url,
                             "data-animate":favGif.images.fixed_height.url,
                             "state":"still"}))
    // .append($("<a>").html("&#x25BC").addClass("downloadButton").attr({
    //                                                                 "href":favGif.images.original.url,
    //                                                                 "download":favGif.id}));
    .append($("<button>").html("&#x2612").addClass("removeButton").attr({"data-id":favGif.id}));
    //data-id is used to remove the data from localStorage
    var dataID = favGif.id;
    localData[dataID] = favGif;
    localStorage.setItem("allFavorites",JSON.stringify(localData));
})

// $(document).on("click",".downloadButton",function(){
//     window.open() = $(this).attr("gif-id")+".gif";
// })              this doesn't work either...

//on click function to remove favorited gif from localStorage and from screen
$(document).on("click",".removeButton",function(){
    var key = $(this).attr("data-id");
    localData = JSON.parse(localStorage.getItem("allFavorites"));
    delete localData[key];
    localStorage.setItem("allFavorites",JSON.stringify(localData));
    $(this).closest(".gif").remove();
})