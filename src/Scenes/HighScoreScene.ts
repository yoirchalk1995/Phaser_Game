import Phaser from "phaser";

interface scoreObject{
  name: string,
  score: number
}

export default class HighScoreScene extends Phaser.Scene{
  score!: number;
  userName!: string  

  constructor(){
    super("HighScoreScene")
  }

  preload(){
    this.load.json('topScores', '../data/highScore.json')
  }

  create(){
    this.score = this.registry.get('score')
    const topScores = this.cache.json.get('topScores').topScores;
    
    for(let i =0; i<3; i++ ){
      if(this.score > topScores[i].score){
        //this.showNameInput(this.score, i)
        console.log(i)
        return;
      }
    }
  }

   showNameInput(score: number, i: number){
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
  
}