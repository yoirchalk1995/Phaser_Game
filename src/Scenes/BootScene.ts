import Phaser from "phaser";

export default class BootScene extends Phaser.Scene{
  constructor(){
    super('BootScene')
  }

  preload(){
    this.load.image('background','/background.png')
    this.load.image('full-trolly', '/shoppingcart.png')
    this.load.image('empty-trolly', '/emptytrolly.png')
    this.load.image('ground', '/ground.png')
    this.load.spritesheet('guy','/rabbit.png',{
      frameWidth:500,
      frameHeight: 667
    })
    this.load.audio('bgAudio', '/audio/bg.mp3')
    this.load.audio('catchAudio', '/audio/catch.mp3')
    this.load.audio('crashAudio', '/audio/crash.mp3')
  }

  create(){
    this.scene.start('WelcomeScene')
  }
} 