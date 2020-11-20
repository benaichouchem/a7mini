var dots = document.getElementsByClassName("dot");
var slides = document.getElementsByClassName("slide");
var slideShow = document.getElementsByClassName("slideShow")[0];


var selectedDot = 0;

for (let i = 0; i < dots.length; i++) {
    dots[i].onclick = function () {
        toggleClass(i);
        toggleSlide(i);
    }
}

function toggleClass(m) {
    dots[m].classList.add("dot-selected");
    dots[(m + 1) % 3].classList.remove("dot-selected");
    dots[(m + 2) % 3].classList.remove("dot-selected");

    selectedDot = m;
}

function toggleSlide(m) {
    switch (m) {
        case 0:
            slideShow.classList.add("slide-1-show");
            slideShow.classList.remove("slide-2-show");
            slideShow.classList.remove("slide-3-show");
            break;
        case 1:
            slideShow.classList.add("slide-2-show");
            slideShow.classList.remove("slide-1-show");
            slideShow.classList.remove("slide-3-show");
            break;
        case 2:
            slideShow.classList.add("slide-3-show");
            slideShow.classList.remove("slide-1-show");
            slideShow.classList.remove("slide-2-show");
            break;

    }
    slides[m].classList.add("slide-show");
    slides[(m + 1) % 3].classList.remove("slide-show");
    slides[(m + 2) % 3].classList.remove("slide-show");
}

function nextSlide() {
    toggleClass((selectedDot + 1) % 3);
    toggleSlide((selectedDot ) % 3);

}

function previousSlide() {
    toggleClass((selectedDot + 2) % 3);
    toggleSlide((selectedDot + 3) % 3);

}