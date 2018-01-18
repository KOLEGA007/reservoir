const ROOT_URL = "/level/1/?format=json";
const TICKET_PRICE = 250;
document.querySelector("#price").innerText = TICKET_PRICE;

var xhr = new XMLHttpRequest();
xhr.open("GET", ROOT_URL);
xhr.send(null);
xhr.onreadystatechange = function () {
  var DONE = 4; // readyState 4 means the request is done.
  var OK = 200; // status 200 is a successful return.
  if (xhr.readyState === DONE) {
    if (xhr.status === OK)
      loadData(JSON.parse(xhr.responseText)); // 'This is the returned text.'
    } else {
      console.log('Error: ' + xhr.status); // An error occurred during the request.
    }
};

$("#reservation-form").submit(function(e){
    e.preventDefault();
    places = getSelectedPlaces();
    document.getElementById("places").innerHTML = "";
    for(let i=0; i<places.length; ++i) {
      let tmp = document.createElement("input");
      tmp.type = "hidden";
      tmp.name = "place";
      tmp.value = places[i].getId();
      document.getElementById("places").append(tmp);
    };
    var jqxhr = $.post(this.action, $(this).serialize())
    .done(function(data){
      data = JSON.parse(data);
      if(data["state"] == "ok")
      {
        //Shopovani se podarilo
        $("#shopping_done").toggleClass("show");
        $("#shopping").modal("hide");
        console.log("shopping")
        bookSelectedPlaces();
      }
      else {
        alert(data["data"] + ". Zkuste chyby napravit, nebo obnovte stránku a zkuste to úplně znovu.");
      }
    })
    .fail(function(){
      console.log("not success");
    });
});
function updatePrice() {
  let pocet = parseInt(document.getElementById("tickets_number").innerText)
  if(document.getElementById("inputBarSeats").value != "")
	  var  pocet_bar_seats = parseInt(document.getElementById("inputBarSeats").value)
  else
	  var pocet_bar_seats = 0
  document.getElementById("tickets_number_shopping").innerText = "(" + pocet + " + " + pocet_bar_seats + ")";
  document.getElementById("full_price").innerText = (pocet+pocet_bar_seats)*TICKET_PRICE;
}
$('#shopping').on('show.bs.modal', function (e) {
  updatePrice();
})
