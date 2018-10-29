
/*


# Gif Picker for Product Hunt because nobody built one for it!


# Word of Warning

My JS is shit and if you die by looking at it, tell your family
that I'm not responsible!

Signed by
  - harowitzblack

*/



// adds the popup into the current page that's loaded (works only for ProductHunt)

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

/*

  # Gif popup properties


  hide: hides the popup
  show: Displays the popup near the current mouse position
  ClearGifBox : Clears all the images inside the gif box if present
  MakeGif : Requests for gif images and adds them to the gif box

*/
function GifPopupProperties(){

  let gifPopup = document.querySelector("#gk_popup");
  let gifImageContainer = document.querySelector(".gk_gif_display_bar");
  let currentTextBox = null;

  this.hide = function(){
    gifPopup.style.display = "none";
  },

  this.show = function(textbox){

    currentTextBox = textbox;
    let textboxCount = currentTextBox.value.split(" ");
    let last_element = textboxCount[textboxCount.length - 1];
    textboxCount = [];

    let textboxRect = currentTextBox.getBoundingClientRect();

    if (last_element === "$:") {
      console.log(textboxRect);
      gifPopup.style.top = textboxRect.bottom + 10 + "px";
      gifPopup.style.left = textboxRect.left + "px";
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
  this.MakeGif = function(url,big_img){
    let img_ele = document.createElement("img");
    img_ele.src = url;
    img_ele.classList.add("gk_gif_images");
    console.log(img_ele);
    img_ele.onclick = function(e){
      // add the url to the text box
      console.log(currentTextBox);
      currentTextBox.value = currentTextBox.value.replace("$:",big_img);
      gifPopup.style.display = "none";
    }
    gifImageContainer.append(img_ele);
  }
}


let gifKittyBox = new GifPopupProperties();


// this is the part that slows down everything

let mutationObserver = new MutationObserver(function(mutations) {
  //console.log(mutations);

  mutations.forEach(function(mutation){
    // code to detect changes in the first textbox
    if (mutation.type === "attributes") {
      if (mutation.target.className.split(" ").includes("rta__textarea")) {
        console.log("fine");
        let currentTextBox = mutation.target;
        currentTextBox.addEventListener("keyup",function(e){
          gifKittyBox.show(currentTextBox)
        })
      }
    }
  })


});

// mutation observer configs
mutationObserver.observe(document.documentElement, {
  attributes: true,
  characterData: false,
  childList: true,
  subtree: true,
  attributeOldValue: false,
  characterDataOldValue: false
});


let txt_area = document.querySelectorAll(".rta__textarea");
let search_field = document.querySelector("#gk_search_bar");
let xbtn = document.querySelector(".gk_xbtn");


search_field.addEventListener("keyup", function(event){

  if (event.keyCode == 13) {
    gifKittyBox.ClearGifBox();

    let query = search_field.value.split(" ").join("%20");
    let api_key = "NTsd5Y09pIR3j37RFdRGpqaV23KiVHfS";
    let endpoint = `http://api.giphy.com/v1/gifs/search?api_key=${api_key}&q=${query}`;
    search_for(endpoint);

  }
})

// hide the gif popup on close
xbtn.addEventListener("click",function(e){
  gifKittyBox.hide()
});


// search function
function search_for(gif_endpoint){

  $.ajax({
    url : gif_endpoint,
    type: "GET",
    success: function(data){
      //console.log(data);
      generateGifs(data);
    }
  })
  // no fetch cause it doest work
}


// generate the freaking gif cards!!!
function generateGifs(gif_data){

  for (let gif_count in gif_data) {
    let len_gifar = gif_data[gif_count].length;
    for (let i = 0; i < len_gifar; i++) {
      let img_url = gif_data[gif_count][i]["images"]["preview_gif"]["url"];
      let big_img = gif_data[gif_count][i]["images"]["downsized_medium"]["url"]
      console.log(gif_data[gif_count][i]["images"]);
      gifKittyBox.MakeGif(img_url,big_img);
    }
  }
}
