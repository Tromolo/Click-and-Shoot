export function createButton(
    scene: Phaser.Scene,
    {
        x,
        y,
        text,
        backgroundColor,
        callback,
    }: {
        x: number;
        y: number;
        text: string;
        backgroundColor: string;
        callback: () => void;
    }
): Phaser.GameObjects.Text {
    const button = scene.add.text(x, y, text, {
        fontSize: '32px',
        color: '#ffffff',
        backgroundColor: backgroundColor,
        padding: { left: 20, right: 20, top: 10, bottom: 10 },
    }).setOrigin(0.5);

    button.setInteractive();
    button.on('pointerdown', callback);

    return button;
}