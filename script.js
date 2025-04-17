const height = 6; //number of guesses
const width = 5; //length of words

let row = 0; //current guess
let col = 0; //current letter in the guess

let gameOver = false;
//let word = "SQUID";
let word;
let wordsList;
//console.log(word);

window.onload = async function() {
    wordsList = await getWord("words.txt");
    word = wordsList[Math.floor(Math.random() * wordsList.length)].toUpperCase();

    console.log(word);


    initialize();
};


function initialize() {
    for(let r = 0; r < height; r++) {
        for(let c = 0; c < width; c++) {
            //<span id="0-0" class="tile"></span>
            let tile = document.createElement("span");
            tile.id = r.toString() + "-" + c.toString();
            tile.classList.add("tile");
            tile.innerText = "";
            document.getElementById("board").appendChild(tile);
        }
    }

    // Create Keyboard
    let keyboard = [
        ["Q", "W", "E", "R", "T", "Y", "U", "I", "O", "P"],
        ["A", "S", "D", "F", "G", "H", "J", "K", "L", " "],
        ["Enter", "Z", "X", "C", "V", "B", "N", "M", "⌫" ]
    ]

    for(let i = 0; i < keyboard.length; i++) {
        let currentRow = keyboard[i];
        let keyboardRow = document.createElement("div");
        keyboardRow.classList.add("keyboard-row");

        for(let j = 0; j < currentRow.length; j++) {
            let keyTile = document.createElement("div");
            let key = currentRow[j];
            keyTile.innerText = key;

            if(key == "Enter") {
                keyTile.id = "Enter";
            }

            else if(key == "⌫") {
                keyTile.id = "Backspace"
            }

            else if(key >= "A" && key <= "Z") {
                keyTile.id = "Key"+key;
            }

            keyTile.addEventListener("click", processKey);

            if(key == "Enter") {
                keyTile.classList.add("enter-key-tile");
            }

            else {
                keyTile.classList.add("key-tile");
            }

            keyboardRow.appendChild(keyTile);
        }

        document.body.appendChild(keyboardRow);
    }

    //Listen for Key Press
    document.addEventListener("keyup", (e) => {
        processInput(e);
    });

}

function processKey() {
    let e = {"code" : this.id};
    processInput(e);
}

function processInput(e) {
    if(gameOver) return;
    // alert(e.code);

    if("KeyA" <= e.code && e.code <= "KeyZ") {
        if(col < width) {
            let currentTile = document.getElementById(row.toString() + "-" + col.toString());
            if(currentTile.innerText == "") {
                currentTile.innerText = e.code[3];
                col++;
            }
        }
    }

    else if(e.code == "Backspace") {
        if(col > 0 && col <= width) {
            col--;
        }
        let currentTile = document.getElementById(row.toString() + "-" + col.toString());
        currentTile.innerText = "";
    }

    else if(e.code == "Enter" && fullRow()) {
        update();
    }

    if(!gameOver && row == height) {
        gameOver = true;
        document.getElementById("answer").innerText = word;
    }
}


function fullRow(){
    for(let c = 0; c < width; c++) {
        let currentTile = document.getElementById(row.toString() + "-" + c.toString());
        if(currentTile.innerText == "")
            return false;
    }

    return true;
}

function update() {
    let guess = "";
    document.getElementById("answer").innerText = "";

    for(let c = 0; c < width; c++) {
        let currentTile = document.getElementById(row.toString() + "-" + c.toString());
        let letter = currentTile.innerText;
        guess+=letter;
    }

    guess = guess.toLowerCase();
    if(!wordsList.includes(guess)) {
        document.getElementById("answer").innerText = "Not in Word List";
        return;
    }


    //Start processing guess

    let correct = 0;
    let pool = [...word];

    for(let c = 0; c < width; c++) {
        let currentTile = document.getElementById(row.toString() + "-" + c.toString());
        let letter = currentTile.innerText;

        //Is it in the correct pos

        if(word[c] == letter) {
            currentTile.classList.add("correct");

            let keyTile = document.getElementById("Key"+letter);
            keyTile.classList.remove("present");
            keyTile.classList.add("correct");
            correct++;
            pool.splice(pool.indexOf(word[c]),1);
        }
    }

    for(let c = 0; c < width; c++) {
        let currentTile = document.getElementById(row.toString() + "-" + c.toString());
        let letter = currentTile.innerText;

        if(currentTile.classList.contains("correct")) {
            continue;
        }
        
        //Is it in the word

        if(pool.includes(letter)) {
            currentTile.classList.add("present");

            let keyTile = document.getElementById("Key"+letter);

            if(!keyTile.classList.contains("correct")) {
                keyTile.classList.add("present");
            }

            pool.splice(pool.indexOf(letter),1);
        }

        //Not in the word
        
        else {
            currentTile.classList.add("absent");
            let keyTile = document.getElementById("Key"+letter);
            if(!keyTile.classList.contains("correct") && !keyTile.classList.contains("present")) {
                keyTile.classList.add("absent");
            }
        }
    }

    if(correct == width) {
        gameOver = true;
    }

    row++; //next row
    col = 0; //first letter
}

async function getWord(filePath) {
    try {
        const response = await fetch(filePath);
        if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
        }
        const text = await response.text();
        const wordsList = text.split(/\s+/);
        return wordsList;
    } catch (error) {
        console.error("Error reading the file:", error);
        return [];
  }
}
