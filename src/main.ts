import Phaser from "phaser";
import BootScene from "./Scenes/BootScene";
import GameScene from "./Scenes/GameScene";
import GameOver from "./Scenes/GameOver";
import WelcomeScene from "./Scenes/WelcomeScreen";
import HighScoreScene from "./Scenes/HighScoreScene";

var config: Phaser.Types.Core.GameConfig = {
  type: Phaser.AUTO,
  width: 600,
  height: 300,
  scene:[BootScene, GameScene, GameOver, WelcomeScene,HighScoreScene ],
  physics: {
    default:'arcade'
  }
}

new Phaser.Game(config)