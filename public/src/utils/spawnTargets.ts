import { isOverlapping, clearActiveTargets } from './helpers';
import { gameOver } from './gameOver';

export function spawnTargets(scene: Phaser.Scene): void {
    if (scene.data.get('isGameOver')) return;

    const correctTargetID = scene.data.get('correctTargetID');
    spawnTarget(scene, `target${correctTargetID}`, true);

    const wrongTargetID = Phaser.Math.Between(1, 4);
    if (wrongTargetID !== correctTargetID) {
        spawnTarget(scene, `target${wrongTargetID}`, false);
    }
}

function spawnTarget(scene: Phaser.Scene, texture: string, isCorrect: boolean): void {
    const maxAttempts = 20;
    const size = 120;
    let attempts = 0;
    let x: number, y: number;

    const activeTargets = scene.data.get('activeTargets') as Phaser.GameObjects.Sprite[];

    do {
        x = Phaser.Math.Between(50, window.innerWidth - 50);
        y = Phaser.Math.Between(100, window.innerHeight - 100);
        attempts++;
    } while (isOverlapping(x, y, size, activeTargets) && attempts < maxAttempts);

    const target = scene.physics.add.sprite(x, y, texture);
    target.setInteractive();
    target.setDisplaySize(100, 100);
    activeTargets.push(target);

    if (isCorrect) {
        target.on('pointerdown', () => {
            const scoreText = scene.data.get('scoreText');
            const updatedScore = scene.data.get('score') as number + 1;        
            scene.data.set('score', updatedScore);
            scoreText.setText('Score: ' + updatedScore);

            target.destroy();
        });
    } else {
        target.on('pointerdown', () => {
            clearActiveTargets(scene);
            gameOver(scene);
        });
    }

    scene.time.addEvent({
        delay: 3000,
        callback: () => {
            if (!target.scene) return;
            target.destroy();
        }
    });
}