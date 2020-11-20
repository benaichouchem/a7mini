function setRecommendationsAnimations() {
    var recommendationsElements = document.getElementsByClassName("recommendation");
    var recoArray = [].slice.call(recommendationsElements);
    var isOpen = [];

    for (i = 0; i < recoArray.length; i++) {
        isOpen.push(false);
    }

    recoArray.forEach((recommendation, i) => {
        var recoTitle = recommendation.getElementsByClassName("recommendation-title")[0];
        var recoContent = recommendation.getElementsByClassName("recommendation-content")[0];
        var height = recoContent.offsetHeight;
        recoContent.style.maxHeight = "0px";

        recoTitle.onclick = () => {

            if (!isOpen[i]) {
                recoContent.style.maxHeight = height + "px";
                isOpen[i] = true;
                setTimeout(() => {
                    recoContent.style.maxHeight = "none";
                }, 1200);

            } else {
                recoContent.style.maxHeight = "0px";
                isOpen[i] = false
            }
        };
    });
}
setRecommendationsAnimations();
