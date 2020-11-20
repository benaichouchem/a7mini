// First we get the viewport height and we multiple it by 1% to get a value for a vh unit
let vh = window.innerHeight * 0.01;
// Then we set the value in the --vh custom property to the root of the document
document.documentElement.style.setProperty('--vh', `${vh}px`);

//Getting render data from sheet
const request = new XMLHttpRequest();
request.open("GET", '/getData', false);
request.send(null);
const response = request.responseText;
const renderData = JSON.parse(response);
console.log("Obtained data from sheet : " +  renderData);

//Initializing elments
function initilizeStatusNumbers(status, worldStatus) {
    status[0].innerHTML = renderData.cases;
    status[1].innerHTML = renderData.recovered;
    status[2].innerHTML = renderData.reanimated;
    status[3].innerHTML = renderData.dead;

    worldStatus[0].innerHTML = renderData.worldCases;
    worldStatus[1].innerHTML = renderData.worldDead;
}

window.onresize = function () {
    let vh = window.innerHeight * 0.01;
    console.log(vh);
    document.documentElement.style.setProperty('--vh', `${vh}px`);
};


function loadHeroImage() {
    var loader = document.getElementById("loader");
    var content = document.getElementById("content-wrapper");
    var body = document.getElementById("document");

    content.style.opacity = "1";
    loader.style.opacity = 0;
    setTimeout(() => {
            AOS.init();
            loader.parentNode.removeChild(loader);
            body.style.overflowY = "scroll";
        },
        2000);
}