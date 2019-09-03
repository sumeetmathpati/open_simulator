const mainMenu = document.querySelector(".main-menu");

mainMenu.show = function() {
    this.style.display = "block";

    setTimeout(() => {
        this.style.opacity = 1;
    },10);

    this.querySelector("h1").style.top = 0;

    const buttons = this.querySelectorAll(".main-menu > button");
    for(let i of buttons) {
        i.style.top = 0;
        i.style.opacity = 1;
        i.style.transform = "translateX(0px)";

        i.querySelector(".material-icons").style.transform = "translateX(0px)";
    }

    setTimeout(() => loading.style.display = "none");
    setTimeout(clearBoard,1000);
}

mainMenu.hide = function() {
    for(let i of sub) i.hide();

    const buttons = this.querySelectorAll("button");
    for(let i of buttons) {
        i.style.top = "100%";
    }

    this.querySelector("h1").style.top = "-100%";

    this.style.opacity = 0;

    setTimeout(() => {
        this.style.display = "none";
        c.focus();

        if(!localStorage.pwsData) {
            dialog.welcome();
        }
    }, 500);
}

// Sub menu's
const sub = document.querySelectorAll(".main-menu .sub");

// Apply show and hide methods to sub menu's
for(let i of sub) {
    i.show = function() {
        i.onopen && i.onopen();

        this.style.display = "block";
        const height = Math.min(innerHeight - this.getBoundingClientRect().bottom, 0) - 100;

        setTimeout(() => {
            this.style.opacity = 1;
            this.style.transform = "translateY(0px)";
            mainMenu.style.transform = `translateY(${height}px)`;
        },10);

        setTimeout(() => this.querySelector("input") && this.querySelector("input") .focus(), 10);

        for(let j of sub) i != j && j.hide();
    }

    i.hide = function() {
        this.style.opacity = 0;
        this.style.transform = "translateY(-50px)";
        mainMenu.style.transform = "translateY(0px)";
        setTimeout(() => this.style.display = "none", 500);

        i.onclose && i.onclose();
    }

    i.toggle = function() {
        if(this.style.display != "block") this.show();
        else this.hide();
    }

    i.onkeydown = function(e) {
        if(e.which == 13) {
            const buttons = this.querySelectorAll("button");
            buttons[buttons.length - 1] && buttons[buttons.length - 1].click();
        } else if(e.which == 27) {
            this.hide();
        }
    }
}

document.body.onkeydown = e => {
    if(e.which == 27) {
        for(let i of sub) i.hide();
    }
}

const newBoardMenu = document.querySelector(".main-menu .new-board");
const openBoardMenu = document.querySelector(".main-menu .open-board");


newBoardMenu.onopen = function() {
    this.querySelector("#boardname").value = "";

    setTimeout(() => this.querySelector("#boardname").focus(), 10);
}

openBoardMenu.onopen = function() {
    const list = document.querySelector(".open-board ul");

    list.innerHTML = "";
    readSaveFiles();

    if(saves.length < 1) {
        const li = document.createElement("li");
        li.innerHTML = "You have no saved boards";
        li.style.textAlign = "center";
        li.style.color = "#888";
        list.appendChild(li);
        return;
    }

    for(let save of saves) {
        const li = document.createElement("li");
        li.save = save;

        li.appendChild(document.createTextNode(`${save.name}`));


        li.onclick = () => {
            openBoardMenu.hide();
            mainMenu.hide();
            openSaveFile(save);

        }

        list.appendChild(li);
    }
}

