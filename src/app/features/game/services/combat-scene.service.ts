import { Injectable } from "@angular/core";
import * as Phaser from "phaser";
import { BehaviorSubject, Subject } from "rxjs";
import { CharacterHelper } from "../../../shared/helpers/character.helper";
import { FigtherHelper } from "../../../shared/helpers/fighter.helpers";
import { Character } from "../../../shared/type/character";
import { GameState } from "../../../shared/type/game";

/**
 * Interface para eventos de combate
 */
interface CombatEvent {
  type: 'damage' | 'heal' | 'victory' | 'defeat' | 'turn_start' | 'turn_end' | 'round_start' | 'round_end';
  data?: {
    amount?: number;
    target?: 'player' | 'enemy';
    round?: number;
    turn?: number;
    winner?: 'player' | 'enemy';
  };
}

/**
 * Interface para container do Phaser
 */
interface PhaserContainer {
  nativeElement?: HTMLElement;
  clientWidth?: number;
  clientHeight?: number;
}

/**
 * Classe unificada que combina Phaser.Scene e serviço Angular de combate
 */
@Injectable({
  providedIn: "root",
})
export class CombatService extends Phaser.Scene {
  // Propriedades do Phaser
  public override game!: Phaser.Game;
  private background!: Phaser.GameObjects.Image;

  // Propriedades de combate
  private playerFighter: FigtherHelper | null = null;
  private enemyFighter: FigtherHelper | null = null;

  // Observables para comunicação com componentes
  private readonly hpUpdateSubject = new Subject<{
    playerHP: number;
    playerMaxHP: number;
    enemyHP: number;
    enemyMaxHP: number;
  }>();

  private readonly gameStateSubject = new BehaviorSubject<Partial<GameState>>({
    currentRound: 1,
    currentTurn: 1,
    gameActive: false,
    sceneReady: false,
    playerRoundVictory: 0,
    enemyRoundVictory: 0,
    totalRounds: 3,
    fightFinished: false
  });

  public hpUpdate$ = this.hpUpdateSubject.asObservable();
  public gameState$ = this.gameStateSubject.asObservable();

  // Callbacks para comunicação
  private callbacks: {
    hpUpdate?: () => void;
    victory?: () => void;
    defeat?: () => void;
    nextTurn?: () => void;
  } = {};

  // Estado atual do jogo
  public currentGameState = {
    fightFinished: false,
    winner: null as string | null
  };

  // Round atual
  public currentRound = 1;

  // Observable para eventos de combate
  private readonly combatEventSubject = new Subject<CombatEvent>();
  public combatEvent$ = this.combatEventSubject.asObservable();


  constructor() {
    super({ key: "CombatScene" });
  }

  /**
   * Inicializa o round inicial
   */
  initialRound(): void {
    console.log('Iniciando round inicial');
    // Lógica para inicializar o round pode ser adicionada aqui
  }

  /**
   * Verifica se o jogador começa primeiro
   */
  readonly playerStarts: boolean = true; // Por padrão, jogador sempre começa

  /**
   * Emite evento de vitória
   */
  emitVictory(): void {
    console.log('Vitória!');
    if (this.callbacks.victory) {
      this.callbacks.victory();
    }
  }

  /**
   * Emite evento de derrota
   */
  emitDefeat(): void {
    console.log('Derrota!');
    if (this.callbacks.defeat) {
      this.callbacks.defeat();
    }
  }

  /**
   * Lista golpes dos personagens
   */
  listarGolpesPersonagens(): void {
    console.log('Listando golpes dos personagens');
    // Implementar lógica para listar golpes
  }

  /**
   * Executa turno de soco
   */
  executePunchTurn(): void {
    console.log('Executando turno de soco');
    
    if (!this.playerFighter || !this.enemyFighter) {
      console.error('Fighters não inicializados');
      return;
    }

    // Simular dano do soco (10-20 de dano)
    const damage = Math.floor(Math.random() * 11) + 10;
    
    // Aplicar dano ao inimigo
    this.enemyFighter.character.lifePoints = Math.max(0, this.enemyFighter.character.lifePoints - damage);
    this.enemyFighter.character.updatePercentageLife();
    
    console.log(`Soco causou ${damage} de dano. HP inimigo: ${this.enemyFighter.character.lifePoints}`);
    
    // Emitir evento de dano
    this.emitCombatEvent({ 
      type: 'damage', 
      data: { amount: damage, target: 'enemy' } 
    });
    
    this.notifyHPUpdate();
  }

  /**
   * Executa turno de defesa
   */
  executeDefendTurn(): void {
    console.log('Executando turno de defesa');
    
    if (!this.playerFighter || !this.enemyFighter) {
      console.error('Fighters não inicializados');
      return;
    }

    // Simular contra-ataque do inimigo com dano reduzido
    const damage = Math.floor(Math.random() * 6) + 5; // 5-10 de dano
    
    // Aplicar dano ao jogador
    this.playerFighter.character.lifePoints = Math.max(0, this.playerFighter.character.lifePoints - damage);
    this.playerFighter.character.updatePercentageLife();
    
    console.log(`Defesa: inimigo contra-atacou causando ${damage} de dano. HP jogador: ${this.playerFighter.character.lifePoints}`);
    
    // Emitir evento de dano
    this.emitCombatEvent({ 
      type: 'damage', 
      data: { amount: damage, target: 'player' } 
    });
    
    this.notifyHPUpdate();
  }

  /**
   * Executa turno especial
   */
  executeSpecialTurn(): void {
    console.log('Executando turno especial');
    
    if (!this.playerFighter || !this.enemyFighter) {
      console.error('Fighters não inicializados');
      return;
    }

    // Simular dano do golpe especial (15-30 de dano)
    const damage = Math.floor(Math.random() * 16) + 15;
    
    // Aplicar dano ao inimigo
    this.enemyFighter.character.lifePoints = Math.max(0, this.enemyFighter.character.lifePoints - damage);
    this.enemyFighter.character.updatePercentageLife();
    
    console.log(`Golpe especial causou ${damage} de dano. HP inimigo: ${this.enemyFighter.character.lifePoints}`);
    
    // Emitir evento de dano
    this.emitCombatEvent({ 
      type: 'damage', 
      data: { amount: damage, target: 'enemy' } 
    });
    
    this.notifyHPUpdate();
  }

  /**
   * Executa turno de poção
   */
  executePotionTurn(): void {
    console.log('Executando turno de poção');
    
    if (!this.playerFighter || !this.enemyFighter) {
      console.error('Fighters não inicializados');
      return;
    }

    // Simular cura da poção (10-20 de cura)
    const healing = Math.floor(Math.random() * 11) + 10;
    const maxHP = this.playerFighter.character.totalLife;
    
    // Aplicar cura ao jogador
    this.playerFighter.character.lifePoints = Math.min(maxHP, this.playerFighter.character.lifePoints + healing);
    this.playerFighter.character.updatePercentageLife();
    
    console.log(`Poção curou ${healing} HP. HP jogador: ${this.playerFighter.character.lifePoints}/${maxHP}`);
    
    // Emitir evento de cura
    this.emitCombatEvent({ 
      type: 'heal', 
      data: { amount: healing, target: 'player' } 
    });
    
    this.notifyHPUpdate();
  }

  /**
   * Define o total de rounds
   */
  setTotalRounds(rounds: number): void {
    console.log(`Definindo total de rounds: ${rounds}`);
    // Implementar lógica para definir rounds
  }

  /**
   * Verifica se ainda pode lutar
   */
  canFight(): boolean {
    return (this.playerFighter?.getCurrentHP() ?? 0) > 0 && (this.enemyFighter?.getCurrentHP() ?? 0) > 0;
  }

  /**
   * Destrói o jogo
   */
  destroyGame(): void {
    console.log('Destruindo jogo');
    if (this.game) {
      this.game.destroy(true);
    }
  }

  /**
   * Inicializa o jogo
   */
  initializeGame(container: PhaserContainer | HTMLElement): void {
    console.log('Inicializando jogo');
    
    // Determinar o elemento HTML correto
    let element: HTMLElement;
    if ('nativeElement' in container && container.nativeElement) {
      element = container.nativeElement;
    } else if (container instanceof HTMLElement) {
      element = container;
    } else {
      throw new Error('Container inválido fornecido para initializeGame');
    }
    
    const config: Phaser.Types.Core.GameConfig = {
      type: Phaser.AUTO,
      width: element.clientWidth || 800,
      height: element.clientHeight || 600,
      parent: element,
      scene: this,
      physics: {
        default: 'arcade',
        arcade: {
          gravity: { y: 0, x: 0 },
          debug: false
        }
      }
    };
    
    this.game = new Phaser.Game(config);
  }

  // Métodos do Phaser.Scene
  preload(): void {
    // Carregar a imagem de fundo do cenário (versão web)
    this.load.image("background", "assets/cenario/cenario.001/mobile.png");

    // Carregar personagens para duelo
    this.load.image("player-back", "assets/person/001/back.png"); // Jogador de costas
    this.load.image("opponent-front", "assets/person/002/main.png"); // Oponente de frente
  }

  create(): void {
    // Função para ajustar o background
    const adjustBackground = (): void => {
      if (this.background) {
        const scaleX = this.scale.width / this.background.width;
        const scaleY = this.scale.height / this.background.height;
        const scale = Math.max(scaleX, scaleY);

        this.background.setScale(scale);
        this.background.setPosition(
          this.scale.width / 2,
          this.scale.height / 2
        );
      }
    };

    // Adicionar a imagem de fundo centralizada
    this.background = this.add.image(0, 0, "background");
    adjustBackground();

    // Adicionar personagens estilo duelo Pokémon
    const screenWidth = this.scale.width;
    const screenHeight = this.scale.height;

    // Jogador (de costas) - posição inferior esquerda
    const playerX = screenWidth * 0.25; // 25% da largura
    const playerY = screenHeight * 0.75; // 75% da altura (parte inferior)
    const player = this.add.image(playerX, playerY, "player-back");
    player.setScale(0.9); // Ajustar tamanho para mobile

    // Oponente (de frente) - posição superior direita
    const opponentX = screenWidth * 0.75; // 75% da largura
    const opponentY = screenHeight * 0.35; // 35% da altura (parte superior)
    const opponent = this.add.image(opponentX, opponentY, "opponent-front");
    opponent.setScale(0.9); // Ajustar tamanho para mobile

    // Listener para redimensionamento
    this.scale.on("resize", () => {
      adjustBackground();

      // Reposicionar personagens
      const newScreenWidth = this.scale.width;
      const newScreenHeight = this.scale.height;

      // Reposicionar jogador
      player.setPosition(newScreenWidth * 0.25, newScreenHeight * 0.75);

      // Reposicionar oponente
      opponent.setPosition(newScreenWidth * 0.75, newScreenHeight * 0.35);
    });

    // Iniciar loop de animações de demonstração
    this.startDamageLoop();

    // Inicializar combate quando a cena estiver pronta
    this.initializeCombat();
  }

  /**
   * Instancia player e oponente
   */
  initializeCombat(): void {
    // Verificar se já foi inicializado para evitar múltiplas execuções
    if (this.playerFighter && this.enemyFighter) {
      return;
    }

    // Dados do jogador - valores ajustados para combate equilibrado
    const playerData: Character = {
      level: 1,
      strength: 2,
      speed: 3,
      resistance: 2, // Reduzido para permitir dano
    };

    // Dados do oponente - valores ajustados para combate equilibrado
    const enemyData: Character = {
      level: 1,
      strength: 2,
      speed: 3,
      resistance: 2, // Reduzido para permitir dano
      modifier: 1,
    };

    // Instanciar personagens
    const playerCharacter = new CharacterHelper(playerData);
    const enemyCharacter = new CharacterHelper(enemyData);

    this.playerFighter = new FigtherHelper(playerCharacter);
    this.enemyFighter = new FigtherHelper(enemyCharacter);
  }

  /**
   * Obtém o jogador
   */
  getPlayer(): FigtherHelper | null {
    return this.playerFighter;
  }

  /**
   * Obtém o oponente
   */
  getEnemy(): FigtherHelper | null {
    return this.enemyFighter;
  }

  /**
   * Configura callbacks para comunicação com outros serviços
   */
  setCallbacks(callbacks: {
    hpUpdate?: () => void;
    victory?: () => void;
    defeat?: () => void;
    nextTurn?: () => void;
  }): void {
    this.callbacks = callbacks;
  }

  /**
   * Obtém referência para a cena do jogo
   */
  getGameScene(): Phaser.Scene | null {
    return this as Phaser.Scene;
  }

  /**
   * Emite um evento de combate tipado
   */
  private emitCombatEvent(event: CombatEvent): void {
    this.combatEventSubject.next(event);
  }

  /**
   * Notifica que as barras de HP precisam ser atualizadas
   */
  notifyHPUpdate(): void {
    console.log("HP atualizado:");
    console.log("Player HP:", this.playerFighter?.getCurrentHP());
    console.log("Enemy HP:", this.enemyFighter?.getCurrentHP());

    // Emitir atualização de HP através do observable
    if (this.playerFighter && this.enemyFighter) {
      this.hpUpdateSubject.next({
        playerHP: this.playerFighter.getCurrentHP(),
        playerMaxHP: this.playerFighter.getMaxHP(),
        enemyHP: this.enemyFighter.getCurrentHP(),
        enemyMaxHP: this.enemyFighter.getMaxHP()
      });
    }

    if (this.callbacks.hpUpdate) {
      this.callbacks.hpUpdate();
    }

    // Verificar se o jogo acabou
    if (!this.canFight()) {
      console.log("Jogo acabou!");
      if (this.playerFighter?.getCurrentHP() === 0) {
        this.emitDefeat();
        this.emitCombatEvent({ type: 'defeat', data: { winner: 'enemy' } });
      } else {
        this.emitVictory();
        this.emitCombatEvent({ type: 'victory', data: { winner: 'player' } });
      }
    }
  }

  /**
   * Método para mostrar números de dano flutuantes
   */
  showDamage(x: number, y: number, damage: number, isPlayer = false): void {
    if (damage <= 0) return;

    // Criar texto de dano
    const damageText = this.add.text(x, y, `-${damage}`, {
      fontSize: "32px",
      color: isPlayer ? "#ff4444" : "#ffaa00",
      fontStyle: "bold",
      stroke: "#000000",
      strokeThickness: 3,
    });

    // Centralizar o texto
    damageText.setOrigin(0.5, 0.5);

    // Posição inicial aleatória (centralizada com pequena variação)
    const randomOffsetX = (Math.random() - 0.5) * 60; // Variação de -30 a +30
    damageText.x = x + randomOffsetX;

    // Animação de subida e fade-out
    this.tweens.add({
      targets: damageText,
      y: y - 180, // Sobe 120 pixels
      alpha: 0, // Fade-out
      duration: 1500, // 1.5 segundos
      ease: "Power2",
      onComplete: () => {
        damageText.destroy(); // Remove o texto após a animação
      },
    });

    // Animação adicional de escala para dar mais impacto
    this.tweens.add({
      targets: damageText,
      scaleX: 1.2,
      scaleY: 1.2,
      duration: 200,
      ease: "Back.easeOut",
      yoyo: true,
    });
  }

  /**
   * Loop contínuo de animações de demonstração
   */
  startDamageLoop(): void {
    const showRandomDamage = (): void => {
      const screenWidth = this.scale.width;
      const screenHeight = this.scale.height;

      // Alternar entre jogador e inimigo
      const isPlayer = Math.random() < 0.5;
      const damage = Math.floor(Math.random() * 50) + 10; // Dano entre 10-59

      if (isPlayer) {
        // Posição do jogador
        const playerX = screenWidth * 0.24;
        const playerY = screenWidth * 1.7;
        this.showDamage(playerX, playerY - 50, damage, true);
      } else {
        // Posição do inimigo
        const opponentX = screenWidth * 0.7;
        const opponentY = screenHeight * 0.45;
        this.showDamage(opponentX, opponentY - 50, damage, false);
      }
    };

    // Mostrar dano a cada 2 segundos
    this.time.addEvent({
      delay: 2000,
      callback: showRandomDamage,
      loop: true,
    });

    // Mostrar primeiro dano imediatamente
    showRandomDamage();
  }
}
