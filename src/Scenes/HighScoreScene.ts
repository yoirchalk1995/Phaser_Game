import Phaser from "phaser";

interface scoreObject{
  name: string,
  score: number
}

export default class HighScoreScene extends Phaser.Scene{
  private background!: Phaser.GameObjects.TileSprite;
  score!: number;
  userName!: string  
  isHighScore!: boolean
  index = 0;
  private spaceKey?: Phaser.Input.Keyboard.Key;

  constructor(){
    super("HighScoreScene")
  }

  preload(){
    this.load.json('topScores', '../data/highScore.json')
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

    this.score = this.registry.get('score')    
    const topScores = this.cache.json.get('topScores').topScores;
    let isNewHighScore = false;
    for (let i = 0; i < topScores.length; i++) {
      if (this.score > topScores[i].score) {
        this.index = i;
        isNewHighScore = true;
        break; // Exit the loop once the index is found
      }
    }
  
    if (isNewHighScore) {
      this.showNameInput(this.score, this.index);
    } else {
      this.displayTopScores(topScores);
    }

    this.spaceKey = this.input.keyboard?.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE)

  }

   showNameInput(score: number, i: number){
    console.log('show name input called');
    
    const inputText = this.add.dom(400, 150).createFromHTML(`
      <div>
        <label for="name">Enter your name: </label>
        <input type="text" id="name" name="name" />
        <button id="submit">Submit</button>
      </div>
    `);

    const submitButton = inputText.getChildByID('submit');
    submitButton?.addEventListener('click', ()=>{
      const nameInput = inputText.getChildByID('name') as HTMLInputElement;
      this.userName = nameInput.value;
      this.addNewHighScore (this.userName, i, score)
      inputText.destroy()
    })

  }

  addNewHighScore( name: string, index: number, score: number){
    const topScores : scoreObject[] = this.cache.json.get('topScores').topScores
    topScores.splice(index, 0, {name, score})
    topScores.length = 3;
    localStorage.setItem('topScores', JSON.stringify(topScores))
    this.displayTopScores(topScores)
  }

  displayTopScores(topScores: scoreObject[]) {
    const topScoresText = topScores.map((score, index) => {
      return `${index + 1}. ${score.name}: ${score.score}`;
    }).join('\n');
  
    const textStyle = { font: '32px Arial', fill: '#fff' };
    this.add.text(100, 100, 'Top Scores:', textStyle);
    this.add.text(100, 150, topScoresText, textStyle);
  }

  update(){
    this.time.delayedCall(1000, ()=>{
      if(this.spaceKey?.isDown){
        this.scene.start('GameOver')
      }
    })
    
  }
  
}