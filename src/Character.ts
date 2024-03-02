import Archetype, { Mage } from './Archetypes';
import Energy from './Energy';
import Fighter, { SimpleFighter } from './Fighter';
import Race, { Elf } from './Races';
import getRandomInt from './utils';

export default class Character implements Fighter {
  private _name: string;
  private _dexterity: number;
  private _race: Race;
  private _archetype: Archetype;
  private _maxLifePoints: number;
  private _lifePoints: number;
  private _strength: number;
  private _defense: number;
  private _energy: Energy;

  constructor(name: string) {
    this._name = name;
    this._dexterity = getRandomInt(1, 10);
    this._race = new Elf(name, this._dexterity);
    this._archetype = new Mage(name);
    this._maxLifePoints = this._race.maxLifePoints / 2;
    this._lifePoints = this._maxLifePoints;
    this._strength = getRandomInt(1, 10);
    this._defense = getRandomInt(1, 10);
    this._energy = {
      type_: this._archetype.energyType,
      amount: getRandomInt(1, 10),
    };
  }

  get race(): Race {
    return this._race;
  }

  get archetype(): Archetype {
    return this._archetype;
  }
  
  get lifePoints(): number {
    return this._lifePoints;
  }

  get strength(): number {
    return this._strength;
  }

  get defense(): number {
    return this._defense;
  }
  
  get dexterity(): number {
    return this._dexterity;
  }

  get energy(): Energy {
    return {
      amount: this._energy.amount,
      type_: this._energy.type_,
    };
  }

  setMaxLifePoints(newMaxLifePoints: number) {
    if ((this._maxLifePoints + newMaxLifePoints) > this.race.maxLifePoints) {
      this._maxLifePoints = this.race.maxLifePoints;
    } else {
      this._maxLifePoints += newMaxLifePoints;
    }
  }

  useEnergy(amount: number): void {
    if (amount < 0) {
      throw new Error('The quantity must be greater than 0');
    }

    if ((this._energy.amount - amount) < 0) {
      return console.log(`Insufficient ${this._energy.type_}`);
    }

    this._energy.amount -= amount;
  }

  attack(enemy: SimpleFighter): void {
    enemy.receiveDamage(this._strength);
    this.useEnergy(1);
  }

  special(enemy: Fighter): void {
    const breakDefense = Math.ceil((40 / 100) * enemy.defense);
    const doubleAttack = (this._strength * 2) + breakDefense;

    enemy.receiveDamage(doubleAttack);
    this.useEnergy(5);
  }

  levelUp(): void {
    this.setMaxLifePoints(getRandomInt(1, 10));
    this._strength += getRandomInt(1, 10);
    this._dexterity += getRandomInt(1, 10);
    this._defense += getRandomInt(1, 10);
    this._energy.amount = 10;
    this._lifePoints = this._maxLifePoints;
  }

  receiveDamage(attackPoints: number): number {
    const damage = attackPoints - this._defense;
    if (damage > 0 && this._energy.amount > 1) {
      this._lifePoints -= damage;
    } else if (damage <= 0) {
      this._lifePoints -= 1;
    }

    return this._lifePoints <= 0 ? -1 : this._lifePoints;
  }
}