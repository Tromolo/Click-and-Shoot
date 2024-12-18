import { getRandomTargedId, setNewCorrectTarget, setupGlobalClickTrigger } from '../utils/helpers';
import { spawnTargets } from '../utils/spawnTargets';

export default function create(this: Phaser.Scene): void {
    const scoreText = this.add.text(25, 25, 'Score: 0', {
        fontSize: '32px',
        color: '#ffffff'
    });
    this.data.set('scoreText', scoreText);

    const correctTargetID = getRandomTargedId();
    const correctTargetImage = this.add.image(window.innerWidth - 10, 10, `target${correctTargetID}`);
    this.data.set('correctTargetID', correctTargetID);
    correctTargetImage.setDisplaySize(80, 80);
    correctTargetImage.setOrigin(1, 0);

    this.data.set('correctTargetImage', correctTargetImage);

    setupGlobalClickTrigger(this);

    this.time.addEvent({
        delay: 500,
        callback: () => spawnTargets(this),
        callbackScope: this,
        loop: true
    });

    this.data.set('changeTargetTimer', this.time.addEvent({
        delay: 7000,
        callback: () => setNewCorrectTarget(this),
        callbackScope: this,
        loop: true
    }));
}