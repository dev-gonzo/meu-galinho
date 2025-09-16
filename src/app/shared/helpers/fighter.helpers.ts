import levelData from "../../shared/data/levelData.json";
import { Level } from "../type/level";
import { ResultAttackResponse, ResultDefenseResponse } from "../type/result";
import { CharacterHelper } from "./character.helper";
import { DiceHelper } from "./dice.helper";
import { RollDicePlayerHelper } from "./roll-dice-player.helper";

/**
 * Helper para concentar a mecanica do jogo
 */
export class FigtherHelper {
  readonly levels = levelData;

  character: CharacterHelper;

  selectLevel: Level;

  lose = false;

  constructor(character: CharacterHelper) {
    // Se receber uma instância de CharacterHelper, clona ela
    // Se receber dados simples, cria uma nova instância
    if (character instanceof CharacterHelper) {
      this.character = character.clone();
    } else {
      this.character = new CharacterHelper(character);
    }

    // Garante que os atributos avançados estão calculados
    this.character.calculateAdvancedAttributes();

    this.selectLevel = this.character.getLevelData() || {
      level: this.character.level,
      dice: 1,
      modifier: 0,
    };
  }

  initiative(): number {
    const rollResult = DiceHelper.rollD6Sum(3);
    const baseInitiative = this.character.calculateInitiative();

    return baseInitiative + rollResult;
  }

  attack(): ResultAttackResponse {
    const skill =
      this.character.attackSkill +
      this.character.attackBonus +
      this.character.modifier +
      10;

    const rollResult = RollDicePlayerHelper.roll(skill);

    const damageResult = this.damage(rollResult.result);

    return {
      ...rollResult,
      damage: damageResult,
    };
  }

  attackSpecial(): ResultAttackResponse {
    const skill = this.character.attackSkill + this.character.modifier + 8;

    const rollResult = RollDicePlayerHelper.roll(skill, 18, 3);

    const damageResult = this.damage(rollResult.result);

    return {
      ...rollResult,
      damage: damageResult,
    };
  }

  defend(): ResultDefenseResponse {
    const skill =
      this.character.defenseSkill +
      this.character.defenseBonus +
      this.character.modifier +
      10;

    const rollResult = RollDicePlayerHelper.roll(skill);
    let decreaseDamage =
      Math.ceil(this.character.resistance / 2) +
      this.character.damageResistance;

    if (rollResult.result == "CRITICAL_SUCCESS") {
      decreaseDamage = decreaseDamage * 2;
    }

    if (
      rollResult.result == "CRITICAL_FAILURE" ||
      rollResult.result == "FAILURE"
    ) {
      decreaseDamage = 0;
    }

    return {
      ...rollResult,
      damageResistance: decreaseDamage,
    };
  }

  dodge(): ResultDefenseResponse {
    const skill =
      Math.ceil(this.character.dodgeSkill / 2) +
      this.character.dodgeBonus +
      this.character.modifier +
      8;

    return RollDicePlayerHelper.roll(skill);
  }

  private damage(result: string) {
    let damageTotal = 0;
    if (result == "CRITICAL_SUCCESS" || result == "SUCCESS") {
      const amountDices: number = this.character.getDamageDice();
      const minDamage: number = amountDices * 2;

      const valueDices = DiceHelper.rollMultipleD6(amountDices).reduce(
        (sum, roll) => sum + roll,
        0
      );

      const levelModifier = this.character.calculateLevelModifier();
      const damageSum = valueDices + levelModifier;

      if (valueDices < minDamage) {
        damageTotal = minDamage + this.character.damageBonus;
      } else {
        damageTotal = damageSum + this.character.damageBonus;
      }
    }

    return damageTotal;
  }

  loseLife(
    opponentResult: ResultAttackResponse,
    defendDodge: {
      defend?: ResultDefenseResponse;
      dodge?: ResultDefenseResponse;
    } = { defend: undefined, dodge: undefined }
  ) {
    const calculateLife = (
      damageReceived: number,
      damageResistance = 0,
      isBlockCriticalSuccess = false,
      isDodgeSuccessful = false
    ) => {
      let damageCalculate = Math.max(0, damageReceived - damageResistance);

      // O dano nunca pode ser zero, é no mínimo 1, exceto se:
      // - Bloqueio for critical success
      // - Esquiva for bem-sucedida
      if (
        damageCalculate === 0 &&
        !isBlockCriticalSuccess &&
        !isDodgeSuccessful &&
        damageReceived > 0
      ) {
        damageCalculate = 1;
      }

      if (damageCalculate >= this.character.lifePoints) {
        // O personagem morre
        this.lose = true;
        this.character.lifePoints = 0;
        this.character.updatePercentageLife();
        return;
      }

      // O personagem sobrevive ao dano
      if (damageCalculate >= Math.ceil(this.character.totalLife / 2)) {
        this.character.knockdown = true;
      }

      this.character.lifePoints = this.character.lifePoints - damageCalculate;
      this.character.updatePercentageLife();
    };

    if (opponentResult.result == "CRITICAL_SUCCESS") {
      calculateLife(opponentResult.damage);
    }

    if (opponentResult.result == "SUCCESS") {
      if (defendDodge?.defend) {
        const isBlockCriticalSuccess =
          defendDodge.defend.result === "CRITICAL_SUCCESS";
        calculateLife(
          opponentResult.damage,
          defendDodge.defend.damageResistance,
          isBlockCriticalSuccess,
          false
        );
      }

      if (defendDodge?.dodge) {
        if (
          defendDodge.dodge.result == "FAILURE" ||
          defendDodge.dodge.result == "CRITICAL_FAILURE"
        ) {
          calculateLife(opponentResult.damage, 0, false, false);
        }
        // Se a esquiva foi bem-sucedida, não aplica dano
      }
    }
  }

  recoverLife(recover: number) {
    const newLifePoints = this.character.lifePoints + recover;

    if (newLifePoints > this.character.totalLife) {
      this.character.lifePoints = this.character.totalLife;
      return;
    }

    this.character.lifePoints = newLifePoints;
  }

  revive() {
    this.character.lifePoints = Math.ceil(this.character.totalLife / 3);
    this.character.updatePercentageLife();
    this.lose = false;
  }

  /**
   * Obtém as estatísticas completas do lutador
   */
  getStats() {
    return {
      ...this.character.getStats(),
      fighter: {
        lose: this.lose,
        levelData: this.selectLevel,
      },
    };
  }

  /**
   * Atualiza o nível do lutador
   */
  updateLevel(newLevel: number): void {
    this.character.levelUp(newLevel);
    this.selectLevel = this.character.getLevelData() || {
      level: this.character.level,
      dice: 1,
      modifier: 0,
    };
  }

  /**
   * Verifica se o lutador pode continuar lutando
   */
  canFight(): boolean {
    return this.character.isAlive() && !this.lose;
  }

  /**
   * Aplica cura baseada na resistência do personagem
   */
  naturalHealing(): void {
    const healAmount = Math.floor(this.character.resistance / 2) + 1;
    this.recoverLife(healAmount);
  }

  /**
   * Calcula a iniciativa com bônus de combate
   */
  calculateCombatInitiative(): number {
    const baseInitiative = this.character.calculateInitiative();
    const rollResult = DiceHelper.rollD6Sum(3);
    return baseInitiative + rollResult;
  }

  /**
   * Reseta o estado de combate
   */
  resetCombatState(): void {
    this.lose = false;
    this.character.knockdown = false;
    this.character.fullHeal();
  }

  /**
   * Obtém os pontos de vida máximos do personagem
   */
  getMaxHP(): number {
    return this.character.totalLife;
  }

  /**
   * Obtém os pontos de vida atuais do personagem
   */
  getCurrentHP(): number {
    return this.character.lifePoints;
  }

  /**
   * Obtém a porcentagem de vida atual
   */
  getHPPercentage(): number {
    return this.character.percentageLifePoints * 100;
  }

  getGolpes(): {
    nome: string;
    velocidade: string;
    dano: string;
    atributo: string;
  }[] {
    return this.character.listaGolpes;
  }
}
