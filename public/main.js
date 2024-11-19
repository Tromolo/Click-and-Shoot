let score = 0; 
let scoreText; 

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
    this.load.image('target', 'assets/target.png');
}

function create() {
    scoreText = this.add.text(25, 25, 'Score: 0', {
        fontSize: '32px',
        fill: '#ffffff'
    });

    this.time.addEvent({
        delay: 1000, 
        callback: spawnTarget,
        callbackScope: this,
        loop: true
    });
}

function update() {
}

function spawnTarget() {
    const x = Phaser.Math.Between(75, window.innerWidth - 75);
    const y = Phaser.Math.Between(75, window.innerHeight - 75);

    const target = this.physics.add.sprite(x, y, 'target');
    target.setInteractive();

    target.on('pointerdown', () => {
        score += 1; 
        scoreText.setText('Score: ' + score); 
        target.destroy(); 
    });

    this.time.addEvent({
        delay: 3000, 
        callback: () => target.destroy(),
        callbackScope: this
    });
}
