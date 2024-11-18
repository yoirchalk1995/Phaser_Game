import Phaser, { Sound } from "phaser";

export default class GameScene extends Phaser.Scene {

  private background!: Phaser.GameObjects.TileSprite;
  private character!: Phaser.Physics.Arcade.Sprite;
  private trolleys: Phaser.Physics.Arcade.Sprite[] = [];
  private score: number = 0;
  private scoreText!: Phaser.GameObjects.Text;
  private spaceKey?: Phaser.Input.Keyboard.Key;
  private bgAudio? : Phaser.Sound.HTML5AudioSound |Sound.NoAudioSound|Sound.WebAudioSound
  private crashAudio? : Phaser.Sound.BaseSound
  private catchAudio? : Phaser.Sound.BaseSound
  private jumpAudio? : Phaser.Sound.BaseSound

  constructor() {
    super('GameScene');
  }

  create() {
    const imageWidth = 1060;
    const imageHeight = 951;
    const gameWidth = 600;
    const aspectRatio = imageWidth / imageHeight;
    const newHeight = gameWidth / aspectRatio;
    this.registry.set('score', 0);

    this.background = this.add.tileSprite(0, 0, imageWidth, imageHeight, 'background');
    this.background.setOrigin(0, 0);
    this.background.setDisplaySize(gameWidth, newHeight);

    this.character = this.physics.add.sprite(73, 250, 'guy').setScale(0.16).setCollideWorldBounds(true).setImmovable(true).setGravityY(300);

    this.character.setBodySize(375,495).setOffset(0,150)

    this.anims.create({
      key: "character_anim",
      frames: this.anims.generateFrameNumbers("guy"),
      frameRate: 15,
      repeat: -1
    });
    this.character.play('character_anim');

    this.spaceKey = this.input.keyboard?.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE)
    this.scoreText = this.add.text(10,10,`Score: ${this.score}`)

    this.time.addEvent({
      delay: 1900,
      callback: this.spawnTrolly,
      callbackScope: this,
      loop: true
    })

    this.physics.add.collider(
      this.character, this.trolleys, this.handleCollision, undefined, this
    )

    //prevent duplication of bgAudio
    if(this.bgAudio && this.bgAudio.isPlaying){
      this.bgAudio.destroy()
    }

    this.bgAudio = this.sound.add('bgAudio',{
      loop: true,
      volume: 0.009
    })
    this.bgAudio.play();

    this.catchAudio = this.sound.add('catchAudio',{
      loop: false,
      volume: 0.8
    })

    this.crashAudio = this.sound.add('crashAudio',{
      loop: false,
      volume: 0.8
    })

    this.jumpAudio = this.sound.add('jumpAudio',{
      loop: false,
      volume: 0.4,
      rate: 2
    })


  }

  update(): void {    
    this.background.tilePositionX += 2.5;

    if(this.spaceKey?.isDown && this.character.body?.bottom == 300){
      this.character.anims.pause();
      this.character.setFrame(1);
      this.character.setVelocityY(-245)
      this.jumpAudio?.play()
    }
    if (this.character.body?.bottom === 300 && !this.spaceKey?.isDown) {
      this.character.anims.play("character_anim", true);
    }    
  }

  spawnTrolly() {
    const isFull = Math.random() < 0.2;
    
    const trollyImage = isFull ? 'full-trolly' : 'empty-trolly';
  
    const trolly = this.physics.add.sprite(580, 270, trollyImage).setScale(0.2).setFlipX(true);
    trolly.setVelocityX(-200);
    trolly.setBodySize(trolly.width - 60, trolly.height);
    trolly.setOffset(-20, 0);
  
    // Add to the array of trolleys
    this.trolleys.push(trolly);
  
    // Destroy trolly if it goes off-screen and remove it from the array
    this.physics.world.on('worldstep', () => {
      if (trolly.body?.right < 0) {
        if(trolly.texture.key == 'empty-trolly'){
          this.score +=1
          this.scoreText.setText(`Score: ${this.score}`);
        }
        this.removeTrollyFromArray(trolly);
        trolly.destroy();
      }
    });
  }
  
  handleCollision(character: any, trolly: any) {
    if (character instanceof Phaser.Physics.Arcade.Sprite && trolly instanceof Phaser.Physics.Arcade.Sprite) {
  
      if (trolly.texture.key === 'full-trolly') {
        this.score += 3;
        this.catchAudio?.play();
        trolly.setFlipX(false);
        this.tweens.add({
          targets: trolly,
          alpha: 0,
          duration: 300,
          onComplete: () => {
            this.removeTrollyFromArray(trolly);
            trolly.destroy();
          }
        });
        this.scoreText.setText(`Score: ${this.score}`);
      } else if (trolly.texture.key === 'empty-trolly') {
        this.scene.start('GameOver');
        this.registry.set('score', this.score);
        this.crashAudio?.play()
        this.score = 0;
        this.trolleys = []
      }
    }
  }
  
  removeTrollyFromArray(trolly: Phaser.Physics.Arcade.Sprite) {
    const index = this.trolleys.indexOf(trolly);
    if (index !== -1) {
      this.trolleys.splice(index, 1);
    }
  }
}
