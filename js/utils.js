function rectangularCollision({rectangle1, rectangle2}) {
    return(
        rectangle1.attackBox.position.x + rectangle1.attackBox.width >= rectangle2.position.x
        && rectangle1.attackBox.position.x <= rectangle2.position.x + rectangle2.width
        && rectangle1.attackBox.position.y + rectangle1.attackBox.height >= rectangle2.position.y
        && rectangle1.attackBox.position.y <= rectangle2.position.y + rectangle2.height
        )
}

//sets variable FinalText for later use.
const finalText = document.querySelector("#final-text")

function determineWinner({player, enemy, timerId}) {
    clearTimeout(timerId)
    finalText.style.display = "flex"
    if(player.health === enemy.health){
        finalText.innerHTML = 'Tie'
    }
    else if(player.health > enemy.health){
        finalText.innerHTML = 'Player Wins'
    }
    else{
        finalText.innerHTML = 'Enemy Wins'
    }
}

// This sets the timer to 60, and decreases it by 1 every second and displays it in the time span.

let timer = 60;
let timerId
function decreaseTimer() {
    timerId = setTimeout(decreaseTimer, 1000)
    if(timer > 0){
        timer --
        document.querySelector("#time").innerHTML = timer
    }

    if(timer === 0){
        determineWinner({player, enemy})
    }
}