var counter = -1;
var sliders = document.getElementsByClassName("slider__nav");
var sliderArray = [].slice.call(sliders) //changing HTML collection to array, for manipulation
var lenght =sliderArray.length;

setInterval(() => {
    counter = (counter + 1) % lenght;
    sliderArray[counter].checked = true;
}, 4500);