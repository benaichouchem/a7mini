var mobileTextWrapper = document.getElementsByClassName("symptoms-text-mobile-wrapper")[0];

var imageInMobile = document.getElementById("symptoms-img-1");

imageInMobile.onload = () => {
    mobileTextWrapper.style.height = (imageInMobile.offsetHeight * 4) + "px";
};

window.onresize = () => {
    mobileTextWrapper.style.height = (imageInMobile.offsetHeight * 4) + "px";
};