import Phaser from "phaser";

export default class GameOver extends Phaser.Scene{
  private background!: Phaser.GameObjects.TileSprite;
  private spaceKey?: Phaser.Input.Keyboard.Key;

  constructor(){
    super('GameOver')
  }

  create(){
    const imageWidth = 1060;
    const imageHeight = 951;
    const gameWidth = 600;
    const gameHeight = 300;
    const aspectRatio = imageWidth / imageHeight;
    const newHeight = gameWidth / aspectRatio;

    this.background = this.add.tileSprite(0, 0, imageWidth, imageHeight, 'background');
    this.background.setOrigin(0, 0);
    this.background.setDisplaySize(gameWidth, newHeight);

    this.add.rectangle(0,0,gameWidth,gameHeight,0x000000, 0.5).setOrigin(0).setFillStyle(0xcccccc, 0.5)

    this.add.text(gameWidth/2, gameHeight/2 -20, 'game over.', {
      fontSize: '20px',
      color: '0x000000',
      fontStyle:'bold'
    }).setOrigin(0.5)
    this.add.text(gameWidth/2, gameHeight/2 +10, 'press space to play again.', {
      fontSize: '20px',
      color: '0x000000',
      fontStyle:'bold'
    }).setOrigin(0.5)

    this.spaceKey = this.input.keyboard?.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE)
  }

  update(){
    if(this.spaceKey?.isDown){
      this.scene.start('GameScene')
    }
  }
}