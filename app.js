
$("body").append(`

  <aside id="gk_popup">
      <div class="gk_closeBtnTab flex flex-row flex-space">
        <span class="tiny highlight">Made by <a href="https://twitter.com/harowitzblack" target="_blank">@harowitzblack</a></span>
        <button id="#gk_popup_close" type="button" name="button" class="gk_xbtn"> X </button>
      </div>

      <input id="gk_search_bar" class="gk_ph_gif_search" type="text" name="" value="" placeholder="Search gifs and hit enter">
      <div class="gk_gif_display_bar">
      </div>
  </aside>

`)

console.log("loaded");

let txt_area = document.querySelectorAll(".rta__textarea");
let search_field = document.querySelector("#gk_search_bar");
let xbtn = document.querySelector("#gk_popup_close");



function GifPopupProperties(){

  let gifPopup = document.querySelector("#gk_popup");
  let gifImageContainer = document.querySelector(".gk_gif_display_bar");
  let currentTextBox = null;

  this.hide = function(){
    gifPopup.style.display = "none";
  },

  this.show = function(textbox){
    console.log("lalala");
    currentTextBox = textbox;

    let textboxCount = currentTextBox.value.split(" ");
    let last_element = textboxCount[textboxCount.length - 1];
    textboxCount = [];
    let caret = getCaretCoordinates(currentTextBox, currentTextBox.selectionEnd);
    console.log(caret);
    if (last_element == "$:") {
      console.log("NICE!");

      gifPopup.style.top = caret.top + 40 + "px";
      gifPopup.style.left = caret.left + "px";
      gifPopup.style.display = "flex";

    }
  },

  this.ClearGifBox = function(){
    // clears out all the contents of the container
    while (gifImageContainer.firstChild) {
        gifImageContainer.removeChild(gifImageContainer.firstChild);
    }
  },

  // generates gif image cards and adds them to the container
  this.MakeGif = function(url){
    let img_ele = document.createElement("img");
    img_ele.src = url;
    img_ele.classList.add("gk_gif_images")
    img_ele.onclick = function(event){
      // add the url to the text box
      currentTextBox.value = currentTextBox.value.replace("$:",url);
      gifPopup.style.display = "none";
    }
    gifImageContainer.append(img_ele);
  }
}


let gifKittyBox = new GifPopupProperties();

for (let count=0; count < txt_area.length; count++) {
  let current_box = txt_area[count];

  current_box.addEventListener("keyup", function(e){
      console.log("event added");
      gifKittyBox.show(current_box)

  });

}


search_field.addEventListener("keyup", function(event){

  if (event.keyCode == 13) {
    console.log("ok searching");
    gifKittyBox.ClearGifBox();

    let query = search_field.value.split(" ").join("%20");
    let api_key = "NTsd5Y09pIR3j37RFdRGpqaV23KiVHfS";
    let endpoint = `http://api.giphy.com/v1/gifs/search?api_key=${api_key}&q=${query}`;
    search_for(endpoint);

  }
})

// hide the container
xbtn.addEventListener("click",function(e){
  console.log("click");
  gifKittyBox.hide()
});



// search function
function search_for(gif_endpoint){

  fetch(gif_endpoint)
  .then(data => data.json())
  .then(function(gif_data){
    for (let gif_count in gif_data) {
      console.log(gif_data[gif_count]);
      let len_gifar = gif_data[gif_count].length;
      for (let i = 0; i < len_gifar; i++) {
        let img_url = gif_data[gif_count][i]["images"]["preview_gif"]["url"];
        gifKittyBox.MakeGif(img_url);
      }
    }
  })
}
