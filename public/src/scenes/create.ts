import { setNewCorrectTarget } from '../utils/helpers';
import { spawnTargets } from '../utils/spawnTargets';

export default function create(this: Phaser.Scene): void {
    const scoreText = this.add.text(25, 25, 'Score: 0', {
        fontSize: '32px',
        color: '#ffffff'
    });
    this.data.set('scoreText', scoreText);

    const correctTargetImage = this.add.image(window.innerWidth - 75, 50, 'target1');
    correctTargetImage.setDisplaySize(80, 80);
    correctTargetImage.setOrigin(0.5);

    this.data.set('correctTargetImage', correctTargetImage);

    this.time.addEvent({
        delay: 1000,
        callback: () => spawnTargets(this),
        callbackScope: this,
        loop: true
    });

    setNewCorrectTarget(this);
}