import { gameOver } from "./gameOver";

export function resetSpawnTimer(scene: Phaser.Scene): void {
    const spawnTimer = scene.data.get('spawnTimer');
    if (spawnTimer) {
        spawnTimer.remove(false);
        scene.data.set('spawnTimer', null);
    }
}

export function setNewCorrectTarget(scene: Phaser.Scene): number {
    const currentCorrectTargetID = scene.data.get('correctTargetID');
    let correctTargetID = getRandomTargedId();
    
    do {
        correctTargetID = getRandomTargedId();
    } while (correctTargetID === currentCorrectTargetID);

    const correctTargetImage = scene.data.get('correctTargetImage');
    scene.data.set('correctTargetID', correctTargetID);
    correctTargetImage.setTexture(`target${correctTargetID}`);

    return correctTargetID;
}

export function clearActiveTargets(scene: Phaser.Scene): void {
    const activeTargets = scene.data.get('activeTargets');
    activeTargets.forEach((target: Phaser.GameObjects.Sprite) => {
        if (target && target.active) {
            target.destroy();
        }
    });
    scene.data.set('activeTargets', []);
}

export function isOverlapping(
    newX: number,
    newY: number,
    size: number,
    targets: Phaser.GameObjects.Sprite[]
): boolean {
    return targets.some(target => {
        const distance = Phaser.Math.Distance.Between(newX, newY, target.x, target.y);
        return distance < size;
    });
}

export function setupGlobalClickTrigger(scene: Phaser.Scene): void {
    const { width, height } = scene.scale;

    const background = scene.add.rectangle(0, 0, width, height, 0x000000, 0);
    background.setOrigin(0, 0);
    background.setInteractive();

    background.on('pointerdown', () => {
        gameOver(scene);
    });

    background.setDepth(-1);
}

export function getRandomTargedId() {
    const targetId = Phaser.Math.Between(1, 4);

    return targetId;
}