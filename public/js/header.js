var header = document.querySelector("header");
var logo = header.getElementsByClassName("logo-main-page")[0];
var greenNumber = document.getElementsByClassName("green-number")[0];
var headerBg = header.getElementsByClassName("header-bg")[0];
var hero = document.getElementsByClassName("hero")[0];
headerBg.style.opacity = 0 ;
logo.style.opacity = 0;
greenNumber.style.opacity = 0;

window.addEventListener("scroll", () => {
    height = 2 * hero.offsetHeight / 3;

    headerBg.style.opacity = logo.style.opacity = greenNumber.style.opacity = window.scrollY / height ;
});



// Mobile Menu Script
function openMobileMenu() {
    var mobileMenu = document.getElementsByClassName("mobile-menu")[0];
    var burgerBtn = document.getElementsByClassName("btn-burger")[0];
    var closeBtn = document.getElementsByClassName("btn-close")[0];

    mobileMenu.classList.remove("closed-menu");
    mobileMenu.classList.add("open-menu");
    burgerBtn.style.display = "none";
    closeBtn.style.display = "block";
}

function closeMobileMenu() {
    var mobileMenu = document.getElementsByClassName("mobile-menu")[0];
    var burgerBtn = document.getElementsByClassName("btn-burger")[0];
    var closeBtn = document.getElementsByClassName("btn-close")[0];
    mobileMenu.classList.add("closed-menu");
    mobileMenu.classList.remove("open-menu");
    burgerBtn.style.display = "block";
    closeBtn.style.display = "none";
}

// **************************