
import BLOCKS from "./blocks.js"
//DOM
const playground = document.querySelector(".playground > ul");
const gameText = document.querySelector(".Game-Text");
const scoreDisplay = document.querySelector(".score");
const restartButton = document.querySelector(".Game-Text > button ");
// console.log (playground);

// setting
const GAME_ROWS = 20;
const GAME_COLS = 10;

//variables
let score = 0;
let duration = 500;
let downInterval;
let tempMovingItem;


const movingItem={
    type: "",
    direction: 0,
    top: 0,
    left: 3

};

init()  

//functions
function init(){

    tempMovingItem =  {...movingItem};
    
     for (let i = 0; i < GAME_ROWS; i++){
         prependNewLine();
     }
     //renderBlocks();
     generateNewBlock();
}

function prependNewLine(){
    const li = document.createElement("li");
    const ul = document.createElement("ul");
    for(let j = 0 ; j < GAME_COLS ; j++){
        const matrix = document.createElement("li");
        ul.prepend(matrix);
    }

    li.prepend(ul);
    playground.prepend(li);
}

function renderBlocks(moveType=""){
    const {type, direction, top, left} = tempMovingItem;
    const movingBlocks = document.querySelectorAll(".moving");
    movingBlocks.forEach(moving => {
        moving.classList.remove(type, "moving");
        //console.log(moving);
    });

    BLOCKS[type][direction].some(block => {
        const x = block[0] + left;
        const y = block[1] + top;
        //console.log(playground.childNodes[y]);
        const target = playground.childNodes[y] ? playground.childNodes[y].childNodes[0].childNodes[x] : null;
        //console.log(target);
        const isAvailable = checkEmpty(target);

        if (isAvailable) {
            target.classList.add(type,"moving");
        } else {
            tempMovingItem = { ...movingItem};

            if ( moveType === 'retry') {
                clearInterval(downInterval);
                showGameOverText();
            }
            setTimeout(()=>{
                renderBlocks();

                if (moveType === "top"){
                    seizeBlock();
                }
            }, 0)
            return true;
        }
    })

    movingItem.left = left;
    movingItem.top = top;
    movingItem.direction = direction;

}

function showGameOverText(){
    gameText.getElementsByClassName.display = 'flex';
}

function seizeBlock(){
    //console.log("seize Block");
    const movingBlocks = document.querySelectorAll(".moving");
    movingBlocks.forEach(moving => {
        moving.classList.remove("moving");
        moving.classList.add("seized");
    })
    checkMatch();
    //generateNewBlock();
}

function checkMatch(){
    const childNodes = playground.childNodes;
    childNodes.forEach(child =>{
        let matched = true;
        child.children[0].childNodes.forEach(li=>{
            if(!li.classList.contains("seized")){
                matched = false;
            }
        })
        if (matched) {
            child.remove();
            prependNewLine();
            score++;
            scoreDisplay.innerHTML = score;
        }
    })
    generateNewBlock();
}

function generateNewBlock(){
    clearInterval(downInterval);
    downInterval = setInterval(() => {
        moveBlock('top',1);        
    }, duration);

//    console.log(Object.entries(BLOCKS).length);
    const blockArray = Object.entries(BLOCKS);
    const randomIndex = Math.floor(Math.random() * blockArray.length);

   //console.log(blockArray[randomIndex][0]);

    movingItem.type = blockArray[randomIndex][0];
    movingItem.top = 0;
    movingItem.left = 3;
    movingItem.direction = 0;
    tempMovingItem = {...movingItem};
    renderBlocks(); 

}

function checkEmpty(target){
    if (!target || target.classList.contains("seized")){
        return false;
    }
    return true;

} 

function moveBlock(moveType, amount){
    tempMovingItem[moveType] += amount;
    renderBlocks(moveType);
}

function changeDirection(){
    
    const direction = tempMovingItem.direction;
    //console.log('old direction : ' + direction);
    direction === 3 ? tempMovingItem.direction = 0 : tempMovingItem.direction += 1;
    //console.log('new direction : ' + direction);
    renderBlocks();
}

function dropBlock(){
    clearInterval(downInterval);
    downInterval = setInterval(() => {
        moveBlock("top",1);
    }, 10);
}
//event handling
document.addEventListener("keydown", function(e) {
    //console.log(e.keyCode);
    switch(e.keyCode){
        case 37:
            moveBlock("left", -1);
            break;
        case 38:
            changeDirection();
            break;
        case 39:
            moveBlock("left", 1);
            break;
        case 40:            
            moveBlock("top", 1);
            break;
        case 32:            
            dropBlock("top", 1);
            break;            
        default:
            break;
    }
    
})

restartButton.addEventListener("click",() => {
    playground.innerHTML = "";
    gameText.style.display = "none";
    init();
})