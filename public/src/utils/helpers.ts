export function resetSpawnTimer(scene: Phaser.Scene): void {
    const spawnTimer = scene.data.get('spawnTimer');
    if (spawnTimer) {
        spawnTimer.remove(false);
        scene.data.set('spawnTimer', null);
    }
}

export function setNewCorrectTarget(scene: Phaser.Scene): number {
    const correctTargetID = Phaser.Math.Between(1, 4);
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