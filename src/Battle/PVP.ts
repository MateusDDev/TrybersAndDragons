import Fighter from '../Fighter';
import getRandomInt from '../utils';
import Battle from './Battle';

export default class PVP extends Battle {
  private _player2: Fighter;

  constructor(player: Fighter, player2: Fighter) {
    super(player);
    this._player2 = player2;
  }

  static randomAction(attacking: Fighter, defending: Fighter) {
    const rand = getRandomInt(1, 3);
    if (rand === 1) {
      attacking.attack(defending);
    } else {
      attacking.levelUp();
    }
  }

  fight(): number {
    const turns = 10;
    for (let index = 0; index < turns; index += 1) {
      PVP.randomAction(this.player, this._player2);
      PVP.randomAction(this._player2, this.player);
    }
    
    if (this.player.lifePoints < this._player2.lifePoints) {
      return -1;
    }

    return 1;
  }
}
