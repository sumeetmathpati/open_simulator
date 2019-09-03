"use strict";

var fileName =  '';

setTimeout(() => {

    const buttons = mainMenu.querySelectorAll(".main-menu > button");
    for(let i of buttons) {
        i.style.top = 0;
        i.style.opacity = 1;
        i.style.transform = "translateX(0px)";

        i.querySelector(".material-icons").style.transform = "translateX(0px)";
    }
});