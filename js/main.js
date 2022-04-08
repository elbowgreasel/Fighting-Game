const canvas = document.querySelector("canvas");
const context = canvas.getContext('2d')

canvas.width = 1024;
canvas.height = 576;

context.fillRect(
    0, 
    0, 
    canvas.width, 
    canvas.height
    )

const gravity = 0.75;

const background = new Sprite({
    position: {
        x: 0,
        y: 0
    },
    imageSrc: './Assets/background.png'
})
const shop = new Sprite({
    position: {
        x: 600,
        y: 128
    },
    imageSrc: './Assets/shop.png',
    scale: 2.75,
    framesMax: 6
})
const player = new Fighter({
    position: {
        x: 0,
        y: 0
    },
    velocity: {
        x: 0,
        y: 0
    },
    offset: {
        x: 5,
        y: 0
    },
    imageSrc: './Assets/samuraiMack/Idle.png',
    framesMax: 8,
    scale: 2.5,
    offset: {
        x: 215,
        y: 297
    },
    sprites: {
        idle: {
            imageSrc: './Assets/samuraiMack/Idle.png',
            framesMax: 8
        },
        run: {
            imageSrc: './Assets/samuraiMack/Run.png',
            framesMax: 8
        },
        jump: {
            imageSrc: './Assets/samuraiMack/Jump.png',
            framesMax: 2
        },
        fall: {
            imageSrc: './Assets/samuraiMack/Fall.png',
            framesMax: 2
        },
        attack1: {
            imageSrc: './Assets/samuraiMack/Attack1.png',
            framesMax: 6
        }
    },
    attackBox: {
        offset: {
            x: 100,
            y: -130
        },
        width: 125,
        height: 140
    }
})

const enemy = new Fighter({
    position: {
        x: 50,
        y: 100
    },
    velocity: {
        x: 0,
        y: 0
    },
    color: "blue",
    offset: {
        x: -20,
        y: 0
    },
    imageSrc: './Assets/kenji/Idle.png',
    framesMax: 4,
    scale: 2.5,
    offset: {
        x: 215,
        y: 311
    },
    sprites: {
        idle: {
            imageSrc: './Assets/kenji/Idle.png',
            framesMax: 4
        },
        run: {
            imageSrc: './Assets/kenji/Run.png',
            framesMax: 8
        },
        jump: {
            imageSrc: './Assets/kenji/Jump.png',
            framesMax: 2
        },
        fall: {
            imageSrc: './Assets/kenji/Fall.png',
            framesMax: 2
        },
        attack1: {
            imageSrc: './Assets/kenji/Attack1.png',
            framesMax: 4
        }
    },
    attackBox: {
        offset: {
            x: -160,
            y: -130
        },
        width: 125,
        height: 140
    }
})

const keys = {
    a: {
        pressed: false
    },
    d: {
        pressed: false
    },
    ArrowLeft: {
        pressed: false
    },
    ArrowRight: {
        pressed: false
    }
}

decreaseTimer()

function animate() {
    window.requestAnimationFrame(animate)
    context.fillStyle = 'black'
    context.fillRect(
        0, 
        0, 
        canvas.width, 
        canvas.height
        )
    background.update()
    shop.update()
    player.update()
    enemy.update()

    player.velocity.x = 0
    enemy.velocity.x = 0
    // player movement

    if(keys.a.pressed && player.lastKey === 'a') {
        player.velocity.x = -5
        player.switchSprite('run')
    }
    else if(keys.d.pressed && player.lastKey === 'd') {
        player.velocity.x = 5
        player.switchSprite('run')
    }
    else{
        player.switchSprite('idle')
    }

    // player jumping
    if(player.velocity.y < 0) {
        player.switchSprite('jump')
    }
    else if(player.velocity.y > 0) {
        player.switchSprite('fall')
    }

    // enemy movement
    if(keys.ArrowLeft.pressed && enemy.lastKey === 'ArrowLeft') {
        enemy.velocity.x = -5
        enemy.switchSprite('run')
    }
    else if(keys.ArrowRight.pressed && enemy.lastKey === 'ArrowRight') {
        enemy.velocity.x = 5
        enemy.switchSprite('run')
    }
    else{
        enemy.switchSprite('idle')
    }

    // enemy jumping
    if(enemy.velocity.y < 0) {
        enemy.switchSprite('jump')
    }
    else if(enemy.velocity.y > 0) {
        enemy.switchSprite('fall')
    }

    // detect for collision for player
    if(rectangularCollision({ rectangle1: player, rectangle2: enemy}) && player.isAttacking && player.framesCurrent === 4) {
        player.isAttacking = false
        enemy.health -= 35;
        document.querySelector('#enemy-health').style.background = `linear-gradient(to right, rgba(0, 0, 255, 0.6) ${enemy.health}%, rgba(255, 255, 255, 0.5) ${enemy.health}%`;
    }

    //if player misses
    if(player.isAttacking && player.framesCurrent === 4){
        player.isAttacking = false
    }

    // detect for collion for enemy
    if(rectangularCollision({ rectangle1: enemy, rectangle2: player}) && enemy.isAttacking && enemy.framesCurrent === 2) {
        enemy.isAttacking = false
        player.health -= 20;
        document.querySelector('#player-health').style.background = `linear-gradient(to left, rgba(255, 0, 0, 0.6) ${player.health}%, rgba(255, 255, 255, 0.5) ${player.health}%`;

    }

    //if enemy misses
    if(enemy.isAttacking && enemy.framesCurrent === 2){
        enemy.isAttacking = false
    }

    //if player or enemy health is 0 or less game over.
    if(enemy.health <= 0 || player.health <= 0){
        determineWinner({player, enemy, timerId})
    }
}

window.addEventListener('keydown', (event) => {
    switch (event.key) {
        //player listeners
        case 'd':
            keys.d.pressed = true
            player.lastKey = 'd'
            break
        case 'a':
            keys.a.pressed = true
            player.lastKey = 'a'
            break
        case 'w':
            player.velocity.y = -15
            break
        case " ":
            player.attack()
            break

        //enemy listeners
        case 'ArrowRight':
            keys.ArrowRight.pressed = true
            enemy.lastKey = 'ArrowRight'
            break
        case 'ArrowLeft':
            keys.ArrowLeft.pressed = true
            enemy.lastKey = 'ArrowLeft'
            break
        case 'ArrowUp':
            enemy.velocity.y = -15
            break
        case 'ArrowDown': 
            enemy.attack()
            break
    }
    console.log(event.key)
})

window.addEventListener('keyup', (event) => {
    switch (event.key) {
        case 'd':
            keys.d.pressed = false
            break
        case 'a':
            keys.a.pressed = false
            break
    }
    // Enemy Keys
    switch (event.key) {
        case 'ArrowRight':
            keys.ArrowRight.pressed = false
            break
        case 'ArrowLeft':
            keys.ArrowLeft.pressed = false
            break
    }
})

 animate()