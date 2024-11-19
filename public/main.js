let score = 0; 
let scoreText; 
let isGameOver = false;
let correctTargetID; 
let correctTargetImage;
let activeTargets = [];
let spawnTimer = null; //mozno zbytocne ale necham to tam aj funckiu resetSpawnTimer(zajtra sa na to pozriem ak tak to zmazem)
let isPaused = false;

const config = {
    type: Phaser.AUTO,
    width: window.innerWidth,
    height: window.innerHeight,
    physics: {
        default: 'arcade',
        arcade: {
            debug: false 
        }
    },
    scene: {
        preload: preload,
        create: create,
        update: update
    },
    scale: {
        mode: Phaser.Scale.FIT,
        autoCenter: Phaser.Scale.CENTER_BOTH
    }
};

const game = new Phaser.Game(config);

function preload() {
    this.load.image('target1', 'assets/target1.png');
    this.load.image('target2', 'assets/target2.png');
    this.load.image('target3', 'assets/target3.png');
    this.load.image('target4', 'assets/target4.png');
}

function create() {
    scoreText = this.add.text(25, 25, 'Score: 0', {
        fontSize: '32px',
        fill: '#ffffff'
    });

    correctTargetImage = this.add.image(window.innerWidth - 75, 50, 'target1');
    correctTargetImage.setDisplaySize(80, 80);
    correctTargetImage.setOrigin(0.5);

    this.time.addEvent({
        delay: 1000, // uz na 400 ms sa to zacne spawnovat na seba (overlapping) moc moja funckia isOverlapping nezabrala no na takom spawne by to aj tak bolo nehratelne
        callback: spawnTargets,
        callbackScope: this,
        loop: true
    });

    setNewCorrectTarget();
}

function update() {
    if(isGameOver) {
        return;
    }
}

function spawnTargets() {
    if(isGameOver){
        return;
    }

    spawnTarget(this, `target${correctTargetID}`, true);

    const wrongTargetID = Phaser.Math.Between(1, 4);
    if (wrongTargetID !== correctTargetID) {
        spawnTarget(this, `target${wrongTargetID}`, false);
    }
}

function isOverlapping(newX, newY, size, targets) {
    for (const target of targets) {
        if (target.active) {
            const existingX = target.x;
            const existingY = target.y;
            const distance = Phaser.Math.Distance.Between(newX, newY, existingX, existingY);
            if (distance < size) {
                return true;
            }
        }
    }
    return false;
}

function spawnTarget(scene, texture, isCorrect) {
    if (isPaused) return;
    const maxAttempts = 20; 
    const size = 120; 
    let attempts = 0;

    let x, y;

    do {
        x = Phaser.Math.Between(50, window.innerWidth - 50);
        y = Phaser.Math.Between(100, window.innerHeight - 100);
        attempts++;
    } while (isOverlapping(x, y, size, activeTargets) && attempts < maxAttempts);


    const target = scene.physics.add.sprite(x, y, texture);
    target.setInteractive(); 
    target.setDisplaySize(100, 100);
    activeTargets.push(target);

    // dorobit klik mimo targetov => gameOver(scene); (moznost sklbit so zlym targetom )

    if (isCorrect) {
        target.on('pointerdown', () => {
            score += 1;
            scoreText.setText('Score: ' + score);
            target.destroy();
            if (score % 15 === 0) {
                setNewCorrectTarget();
                pauseGame(scene);
            }
        });
    } else { // toto je zly target
        target.on('pointerdown', () => {
            clearActiveTargets();
            gameOver(scene); 
        });
    }


    scene.time.addEvent({
        delay: 3000,
        callback: () => {
            if (!target.scene) return; 
            if (isCorrect) {
                clearActiveTargets();
                gameOver(scene); 
            }
            target.destroy(); 
            activeTargets = activeTargets.filter(t => t !== target);
        },
        callbackScope: scene
    });


}

function pauseGame(scene) {
    isPaused = true; 

    clearActiveTargets();

    const activeTargetImage = scene.add.image(
        window.innerWidth / 2,
        window.innerHeight / 2 - 50, 
        `target${correctTargetID}`
    );
    activeTargetImage.setDisplaySize(150, 150);
    activeTargetImage.setInteractive(); 

    const messageText = scene.add.text(
        window.innerWidth / 2,
        window.innerHeight / 2 - 175, 
        'Active Target',
        {
            fontSize: '32px',
            fill: '#ffffff',
            align: 'center'
        }
    ).setOrigin(0.5);

    activeTargetImage.on('pointerdown', () => {
        activeTargetImage.destroy(); 
        messageText.destroy(); 
        isPaused = false; 
        resetSpawnTimer(scene); 
    });
}



function clearActiveTargets(){
    activeTargets.forEach(target => {
        if (target && target.active) {
            target.destroy(); 
        }
    });
    activeTargets = [];
}

function setNewCorrectTarget() {
    correctTargetID = Phaser.Math.Between(1, 4);
    correctTargetImage.setTexture(`target${correctTargetID}`);
}

function resetSpawnTimer(scene) {
    if (spawnTimer) {
        spawnTimer.remove(false);
        spawnTimer = null;
    }
}


function gameOver(scene) {
    if (isGameOver) return;

    isGameOver = true;

    scene.time.clearPendingEvents();
    resetSpawnTimer(scene);
    clearActiveTargets();

    const gameOverText = scene.add.text(
        window.innerWidth / 2,
        window.innerHeight / 3,
        'Game Over',
        {
            fontSize: '64px',
            fill: '#ff0000'
        }
    ).setOrigin(0.5);

    const restartButton = createButton(scene, {
        x: window.innerWidth / 2,
        y: window.innerHeight / 2,
        text: 'Restart',
        backgroundColor: '#1e90ff',
        callback: () => {
            location.reload(); 
        }
    });

    const continueButton = createButton(scene, {
        x: window.innerWidth / 2,
        y: window.innerHeight / 2 + 60,
        text: 'Continue [Watch Ad]',
        backgroundColor: '#32cd32',
        callback: () => {
            continueGame(scene);
        }
    });

    /*const coinsContinueButton = createButton(scene, {
        x: window.innerWidth / 2,
        y: window.innerHeight / 2 + 60,
        text: 'Continue [30 coins]',
        backgroundColor: '#32cd32',
        callback: () => {
            continueGame(scene);
        }
    });*/
}


function createButton(scene, { x, y, text, backgroundColor, callback }) {
    const button = scene.add.text(x, y, text, {
        fontSize: '32px',
        fill: '#ffffff',
        backgroundColor: backgroundColor,
        padding: { left: 20, right: 20, top: 10, bottom: 10 }
    }).setOrigin(0.5);

    button.setInteractive();
    button.on('pointerdown', callback);

    return button;
}

function continueGame(scene) {
    isGameOver = false;

    const gameOverUI = [];
    scene.children.list.forEach(child => {
        if (child.text === 'Game Over' || child.text === 'Restart' || child.text === 'Continue [Watch Ad]') { // || child.text === 'Continue [30 coins]')
            gameOverUI.push(child);
        }
    });
    gameOverUI.forEach(uiElement => uiElement.destroy());

    clearActiveTargets();

    scene.time.addEvent({
        delay: 1000,
        callback: () => {
            resetSpawnTimer(scene);
        }
    });
}
