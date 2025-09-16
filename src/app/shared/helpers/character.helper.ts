import levelData from "../data/levelData.json";
import { Character } from "../type/character";
import { Level } from "../type/level";

/**
 * Helper para criar e gerenciar personagens
 */
export class CharacterHelper {
  level = 1;

  // Atributos base
  resistance = 0;
  strength = 0;
  speed = 0;

  // Habilidades de combate
  totalLife = 0;
  attackSkill = 0;
  defenseSkill = 0;
  dodgeSkill = 0;
  damageResistance = 0;

  // Modificador de dificuldade
  modifier = 0;

  // Bônus
  attackBonus = 0;
  defenseBonus = 0;
  dodgeBonus = 0;
  damageBonus = 0;

  // Pontos de vida
  lifePoints = 0;
  percentageLifePoints = 1.0;

  // Estados
  knockdown = false;

  // Lista de golpes disponíveis
  listaGolpes: {
    nome: string;
    velocidade: string;
    dano: string;
    atributo: string;
  }[] = [];

  constructor(data?: Character | CharacterHelper) {
    if (data) {
      this.initializeFromData(data);
    } else {
      this.initializeDefault();
    }
  }

  /**
   * Inicializa o personagem com dados fornecidos
   */
  private initializeFromData(data: Character | CharacterHelper): void {
    this.level = data.level ?? 1;
    this.resistance = data.resistance ?? 0;
    this.strength = data.strength ?? 0;
    this.speed = data.speed ?? 0;
    this.attackSkill = data.attackSkill ?? 0;
    this.defenseSkill = data.defenseSkill ?? 0;
    this.dodgeSkill = data.dodgeSkill ?? 0;
    this.damageResistance = data.damageResistance ?? 0;
    this.modifier = data.modifier ?? 0;
    this.attackBonus = data.attackBonus ?? 0;
    this.defenseBonus = data.defenseBonus ?? 0;
    this.dodgeBonus = data.dodgeBonus ?? 0;
    this.damageBonus = data.damageBonus ?? 0;
    this.totalLife = data.totalLife ?? this.calculateTotalLife();
    this.lifePoints = data.lifePoints ?? this.totalLife;
    this.percentageLifePoints = this.lifePoints / this.totalLife;
    this.knockdown = false;
  }

  /**
   * Inicializa o personagem com valores padrão
   */
  private initializeDefault(): void {
    this.level = 1;
    this.resistance = 1;
    this.strength = 1;
    this.speed = 1;
    this.calculateAttributes();
    this.totalLife = this.calculateTotalLife();
    this.lifePoints = this.totalLife;
    this.percentageLifePoints = 1.0;
    this.knockdown = false;

    // Inicializar golpes básicos
    this.listaGolpes = [
      {
        nome: "Bicar",
        velocidade: "iniciativaBasica - 2",
        dano: "fr - 2",
        atributo: "fr",
      },
      {
        nome: "Esporar",
        velocidade: "iniciativaBasica - 3",
        dano: "fr - 1",
        atributo: "fr",
      },
      {
        nome: "Empurrar",
        velocidade: "iniciativaBasica - 1",
        dano: "fr - 3",
        atributo: "fr",
      },
    ];
  }

  /**
   * Calcula os atributos baseados no nível e atributos base
   */
  calculateAttributes(): void {
    // Cálculos baseados nas fórmulas do mock
    // pontosDeVida: "fr + rs + 3 + nivel"
    this.totalLife =
      Math.ceil(this.strength / 2) + this.resistance + this.level + 10;

    // Habilidades de combate baseadas nos atributos
    this.attackSkill = this.strength + this.level;
    this.defenseSkill = this.resistance + this.level;
    this.dodgeSkill = this.speed + this.level;

    // Resistência a dano baseada na resistência
    this.damageResistance = Math.ceil(this.resistance / 2);

    // Atualiza os pontos de vida se necessário
    if (this.lifePoints === 0) {
      this.lifePoints = this.totalLife;
    }

    this.updatePercentageLife();
  }

  /**
   * Calcula o total de pontos de vida
   */
  private calculateTotalLife(): number {
    return Math.ceil(this.strength / 2) + this.resistance + this.level + 10;
  }

  /**
   * Atualiza a porcentagem de vida
   */
  updatePercentageLife(): void {
    this.percentageLifePoints =
      this.totalLife > 0 ? this.lifePoints / this.totalLife : 0;
  }

  /**
   * Define os atributos base do personagem
   */
  setAttributes(strength: number, speed: number, resistance: number): void {
    this.strength = strength;
    this.speed = speed;
    this.resistance = resistance;
    this.calculateAttributes();
  }

  /**
   * Define o nível do personagem
   */
  setLevel(level: number): void {
    this.level = level;
    this.calculateAttributes();
  }

  /**
   * Adiciona bônus aos atributos
   */
  addBonus(
    attackBonus = 0,
    defenseBonus = 0,
    dodgeBonus = 0,
    damageBonus = 0
  ): void {
    this.attackBonus += attackBonus;
    this.defenseBonus += defenseBonus;
    this.dodgeBonus += dodgeBonus;
    this.damageBonus += damageBonus;
  }

  /**
   * Define o modificador de dificuldade
   */
  setModifier(modifier: number): void {
    this.modifier = modifier;
  }

  /**
   * Restaura a vida completamente
   */
  fullHeal(): void {
    this.lifePoints = this.totalLife;
    this.percentageLifePoints = 1.0;
    this.knockdown = false;
  }

  /**
   * Verifica se o personagem está vivo
   */
  isAlive(): boolean {
    return this.lifePoints > 0;
  }

  /**
   * Verifica se o personagem está em estado crítico (menos de 25% da vida)
   */
  isCritical(): boolean {
    return this.percentageLifePoints < 0.25;
  }

  /**
   * Clona o personagem
   */
  clone(): CharacterHelper {
    return new CharacterHelper(this);
  }

  /**
   * Obtém os dados de nível baseado no nível atual
   */
  getLevelData(): Level | undefined {
    return levelData.find((data) => data.level === this.level);
  }

  /**
   * Calcula o modificador baseado no nível usando levelData
   */
  calculateLevelModifier(): number {
    const levelInfo = this.getLevelData();
    return levelInfo ? levelInfo.modifier : 0;
  }

  /**
   * Obtém a quantidade de dados de dano baseado no nível
   */
  getDamageDice(): number {
    const levelInfo = this.getLevelData();
    return levelInfo ? levelInfo.dice : 1;
  }

  /**
   * Calcula atributos avançados baseados no nível e dados de progressão
   */
  calculateAdvancedAttributes(): void {
    const levelInfo = this.getLevelData();

    if (levelInfo) {
      // Atualiza o modificador baseado no nível
      this.modifier = levelInfo.modifier;
    }

    // Recalcula todos os atributos
    this.calculateAttributes();
  }

  /**
   * Calcula a iniciativa do personagem
   */
  calculateInitiative(): number {
    // iniciativaBasica: "ag + fr/2 + nivel" (speed = agilidade)
    return this.speed + Math.floor(this.strength / 2) + this.level;
  }

  /**
   * Calcula a esquiva do personagem
   */
  calculateDodge(): number {
    // esquiva: "iniciativaBasica + nivel"
    return this.calculateInitiative() + this.level;
  }

  /**
   * Calcula o bloqueio do personagem
   */
  calculateBlock(): number {
    // bloqueio: "fr/3 + nivel"
    return Math.floor(this.strength / 3) + this.level;
  }

  /**
   * Calcula a fadiga máxima do personagem
   */
  calculateMaxFatigue(): number {
    // fadiga: "rs + ag + nivel"
    return this.resistance + this.speed + this.level;
  }

  /**
   * Atualiza o personagem para um novo nível
   */
  levelUp(newLevel: number): void {
    const oldLevel = this.level;
    this.level = newLevel;

    // Recalcula atributos com o novo nível
    this.calculateAdvancedAttributes();

    // Aumenta a vida máxima baseado no aumento de nível
    const lifeIncrease = newLevel - oldLevel;
    this.totalLife += lifeIncrease;
    this.lifePoints += lifeIncrease; // Ganha vida ao subir de nível

    this.updatePercentageLife();
  }

  /**
   * Aplica modificadores temporários
   */
  applyTemporaryModifiers(modifiers: {
    attackBonus?: number;
    defenseBonus?: number;
    dodgeBonus?: number;
    damageBonus?: number;
    modifier?: number;
  }): void {
    if (modifiers.attackBonus) this.attackBonus += modifiers.attackBonus;
    if (modifiers.defenseBonus) this.defenseBonus += modifiers.defenseBonus;
    if (modifiers.dodgeBonus) this.dodgeBonus += modifiers.dodgeBonus;
    if (modifiers.damageBonus) this.damageBonus += modifiers.damageBonus;
    if (modifiers.modifier) this.modifier += modifiers.modifier;
  }

  /**
   * Remove modificadores temporários
   */
  removeTemporaryModifiers(modifiers: {
    attackBonus?: number;
    defenseBonus?: number;
    dodgeBonus?: number;
    damageBonus?: number;
    modifier?: number;
  }): void {
    if (modifiers.attackBonus) this.attackBonus -= modifiers.attackBonus;
    if (modifiers.defenseBonus) this.defenseBonus -= modifiers.defenseBonus;
    if (modifiers.dodgeBonus) this.dodgeBonus -= modifiers.dodgeBonus;
    if (modifiers.damageBonus) this.damageBonus -= modifiers.damageBonus;
    if (modifiers.modifier) this.modifier -= modifiers.modifier;
  }

  /**
   * Obtém estatísticas completas do personagem
   */
  getStats(): {
    level: number;
    attributes: { strength: number; speed: number; resistance: number };
    combat: { attackSkill: number; defenseSkill: number; dodgeSkill: number };
    life: { current: number; max: number; percentage: number };
    calculated: {
      initiative: number;
      dodge: number;
      block: number;
      maxFatigue: number;
    };
    bonuses: { attack: number; defense: number; dodge: number; damage: number };
    levelData?: Level;
  } {
    return {
      level: this.level,
      attributes: {
        strength: this.strength,
        speed: this.speed,
        resistance: this.resistance,
      },
      combat: {
        attackSkill: this.attackSkill,
        defenseSkill: this.defenseSkill,
        dodgeSkill: this.dodgeSkill,
      },
      life: {
        current: this.lifePoints,
        max: this.totalLife,
        percentage: this.percentageLifePoints,
      },
      calculated: {
        initiative: this.calculateInitiative(),
        dodge: this.calculateDodge(),
        block: this.calculateBlock(),
        maxFatigue: this.calculateMaxFatigue(),
      },
      bonuses: {
        attack: this.attackBonus,
        defense: this.defenseBonus,
        dodge: this.dodgeBonus,
        damage: this.damageBonus,
      },
      levelData: this.getLevelData(),
    };
  }

  /**
   * Converte para objeto simples
   */
  toJSON(): Character {
    return {
      level: this.level,
      strength: this.strength,
      speed: this.speed,
      resistance: this.resistance,
      attackSkill: this.attackSkill,
      defenseSkill: this.defenseSkill,
      dodgeSkill: this.dodgeSkill,
      damageResistance: this.damageResistance,
      modifier: this.modifier,
      attackBonus: this.attackBonus,
      defenseBonus: this.defenseBonus,
      dodgeBonus: this.dodgeBonus,
      damageBonus: this.damageBonus,
      totalLife: this.totalLife,
      lifePoints: this.lifePoints,
    };
  }
}
