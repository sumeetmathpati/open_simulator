const savesFolder = __dirname + "/../saves/";
const fs = require("fs");
let saves = [];

let openedSaveFile;

// Read save files from "saves" folder
function readSaveFiles() {
    const updatedSaves = [];
    const files = fs.readdirSync(savesFolder);

    files.forEach(file => {
        const found = saves.find(save => save.fileName == file);
        if(found) return updatedSaves.push(found);

        function getName(file) {
            try {
                return file.getName;
            } catch(e) {
                return false;
            }
        }
        

        updatedSaves.push({
            name: getName(file) || file,
            fileSize: fs.statSync(savesFolder + file).size,
            fileName: file,
            location: savesFolder + file
        });
    });

    saves = updatedSaves;
}


Saving = new Object();

Saving.save = function () {
    var obj = { ics: [], root: LogicSim.save() };

    for (var i = 0; i < LogicSim.customGroup.items.length; ++i) {
        var ic = LogicSim.customGroup.items[i];
        obj.ics.push({ name: ic.name, env: ic.environment.save() });
    }

    var str = LZString.compressToBase64(JSON.stringify(obj));

    if (fileName == '') {

        // window.open("data:text/plain;charset=UTF-8," + str, "_blank");

        prompt({
            title: 'Enter name',
            label: 'Enter file name for new board, File will be saved in "saves" folder.',
            value: fileName,
            inputAttrs: {
                type: 'url'
            },
            height: 150
        })
            .then((r) => {
                if (r === null) {
                    console.log('user cancelled');
                } else {
                    fileName = r
                    fs.writeFileSync(
                        savesFolder + fileName,
                        str,
                        "utf-8"
                    );
                }
            })
            .catch(console.error);
    } else {
        fs.writeFileSync(
            savesFolder + fileName,
            str,
            "utf-8"
        );

        alert("Saved at saves folder with name '" + fileName + "'");

        fileName = '';
    }

}

Saving.loadFromHash = function () {
    if (window.location.hash === null || window.location.hash.length <= 1) return;
    Saving.load(window.location.hash.substring(1));
}

Saving.loadFromPrompt = function () {
    // var str = prompt("Paste a previously copied save code with Ctrl+V.", "");
    // Prompt using electron-prompt for electronjs
    prompt({
        title: 'Input',
        label: 'Paste a previously copied save code with Ctrl+V.',
        value: '',
        inputAttrs: {
            type: 'text'
        },
        width: 500
    })
        .then((r) => {
            if (r === null) {
                return;
            } else {
                str = r
            }
            if (str != null && str.length > 0) Saving.load(str);
        })
        .catch(console.error);

}

Saving.load = function (str) {
    var obj = JSON.parse(LZString.decompressFromBase64(str));

    var ics = new Array();
    for (var i = 0; i < obj.ics.length; ++i) {
        var ic = obj.ics[i];
        var env = new Environment();
        env.load(ic.env, ics);
        ics[i] = new CustomIC(ic.name, env);
        LogicSim.customGroup.addItem(ics[i]);
    }

    LogicSim.load(obj.root, ics);
}

function openSaveFile(save) {
    const saveFile = fs.readFileSync(savesFolder + save.fileName, "utf-8");
    Saving.load(saveFile);
}
