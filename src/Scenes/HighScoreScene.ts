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
  gameWidth = 600;
  gameHeight = 300;
  dataFetched = false;

  constructor(){
    super("HighScoreScene")
  }

  create(){
    fetch('https://phaser-game-back-end.onrender.com/highscores')
    .then((response) => response.json())
    .then((data) => {
      this.cache.json.add('topScores', data);
      this.dataFetched = true;
      this.startHighScoreLogic(); // Start directly after data is fetched
    })
    .catch((error) => console.error('Error fetching high scores:', error));

    const imageWidth = 1060;
    const imageHeight = 951;
    
    const aspectRatio = imageWidth / imageHeight;
    const newHeight = this.gameWidth / aspectRatio;

    this.background = this.add.tileSprite(0, 0, imageWidth, imageHeight, 'background');
    this.background.setOrigin(0, 0);
    this.background.setDisplaySize(this.gameWidth, newHeight);

    this.add.rectangle(0,0,this.gameWidth,this.gameHeight,0x000000, 0.5).setOrigin(0).setFillStyle(0xcccccc, 0.5)    

    this.spaceKey = this.input.keyboard?.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE)
  }

   showNameInput(score: number){
    
    const inputText = this.add.dom(this.gameWidth/2, this.gameHeight/2).createFromHTML(`
      <div style="text-align: center;">
        <h1> new high score!</h1>
        <label for="name">Enter your name: </label>
        <input type="text" id="name" name="name" />
        <button id="submit">Submit</button>
      </div>
    `);

    const submitButton = inputText.getChildByID('submit');
    submitButton?.addEventListener('click', ()=>{
      const nameInput = inputText.getChildByID('name') as HTMLInputElement;
      this.userName = nameInput.value;
      this.addNewHighScore (this.userName, score)
      inputText.destroy()
    })

  }

  addNewHighScore(name: string, score: number) {
    fetch('https://phaser-game-back-end.onrender.com/highscores', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, score }),
    })
        .then((response) => response.json())
        .then((data) => {
            this.displayTopScores(data.topScores);
        });
  }

  displayTopScores(topScores: scoreObject[]) {
    const sortedTopScores = topScores.sort((a, b) => b.score - a.score);
    const topScoresText = sortedTopScores.map((score, index) => {
      return `${index + 1}. ${score.name}: ${score.score}`;
    }).join('\n');
  
    const textStyle = { font: '32px Arial', fill: '#000000' };
    this.add.text(this.gameWidth/2-25, 75, 'Top Scores:', textStyle).setOrigin(0.5);
    this.add.text(this.gameWidth/2, 150, topScoresText, textStyle).setOrigin(0.5);
    this.add.text(this.gameWidth/2,this.gameHeight/2 + 100,"press space to continue", textStyle).setOrigin(0.5)
  }

  update(){
    this.time.delayedCall(1000, ()=>{
      if(this.spaceKey?.isDown){
        this.scene.start('GameOver')
      }
    })
    
  }

  checkDataLoaded() {
    this.time.addEvent({
      delay: 100,
      callback: () => {
        if (this.dataFetched) {
          this.startHighScoreLogic();
          return;
        } 
      },
    });
  }

  startHighScoreLogic(){
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
        this.showNameInput(this.score);
      } else {
        this.displayTopScores(topScores);
      }
  }
  
}