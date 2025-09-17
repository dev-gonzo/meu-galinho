import { Injectable } from "@angular/core";
import * as Phaser from "phaser";
import { BehaviorSubject } from "rxjs";
import { CharacterHelper } from "../../../shared/helpers/character.helper";
import { FigtherHelper } from "../../../shared/helpers/fighter.helpers";
import { PhaserContainer } from "../../../shared/type/PhaserContainer";

import enemyData from "../../../shared/data/character-enemy.json";
import playerData from "../../../shared/data/character-players.json";

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

  private playerInitiative$ = new BehaviorSubject<boolean>(false);

  getPlayerInitiativeObs() {
    return this.playerInitiative$.asObservable();
  }

  // Propriedades de combate
  private playerFighter: FigtherHelper | null = null;
  private enemyFighter: FigtherHelper | null = null;
  // private currentRound: number = 1;
  // private currentTurn: number = 1;
  // private gameActive: boolean = false;
  // private sceneReady: boolean = false;
  // private playerRoundVictory: number = 0;
  // private enemyRoundVictory: number = 0;
  // private totalRounds: number = 3;
  // private fightFinished: boolean = false;
  private playerIniciative = false;

  // Estado atual do jogo
  public currentGameState = {
    fightFinished: false,
    winner: null as string | null,
  };

  constructor() {
    super({ key: "CombatScene" });
  }

  /**
   * Destrói o jogo
   */
  destroyGame(): void {
    console.log("Destruindo jogo");
    if (this.game) {
      this.game.destroy(true);
    }
  }

  /**
   * Inicializa o jogo
   */
  initializeGame(container: PhaserContainer | HTMLElement): void {
    console.log("Inicializando jogo");

    // Determinar o elemento HTML correto
    let element: HTMLElement;
    if ("nativeElement" in container && container.nativeElement) {
      element = container.nativeElement;
    } else if (container instanceof HTMLElement) {
      element = container;
    } else {
      throw new Error("Container inválido fornecido para initializeGame");
    }

    const config: Phaser.Types.Core.GameConfig = {
      type: Phaser.AUTO,
      width: element.clientWidth || 800,
      height: element.clientHeight || 600,
      parent: element,
      scene: this,
      physics: {
        default: "arcade",
        arcade: {
          gravity: { y: 0, x: 0 },
          debug: false,
        },
      },
    };

    this.game = new Phaser.Game(config);
  }

  // Métodos do Phaser.Scene
  preload(): void {
    // Carregar a imagem de fundo do cenário (versão web)
    this.load.image("background", "assets/cenario/cenario.001/mobile.png");

    // Carregar personagens para duelo
    // String(numero).padStart(quantidadeDesejada, '0')
    this.load.image("player-back", `assets/person/${"001"}/back.png`); // Jogador de costas
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

    // Instanciar personagens
    const playerCharacter = new CharacterHelper(playerData);
    const enemyCharacter = new CharacterHelper(enemyData);

    this.playerFighter = new FigtherHelper(playerCharacter);
    this.enemyFighter = new FigtherHelper(enemyCharacter);

    console.log(this.playerFighter);

    this.executeIniciative();
  }

  /**
   * Iniciatva para ver quem começa
   */
  executeIniciative() {
    const inicitavePlayer = this.playerFighter?.initiative() || 0;
    const inicitaveEnemy = this.enemyFighter?.initiative() || 0;

    console.log(inicitavePlayer, inicitaveEnemy);
    if (inicitavePlayer > inicitaveEnemy) {
      this.playerInitiative$.next(true);
      return;
    }

    if (inicitavePlayer < inicitaveEnemy) {
      this.playerInitiative$.next(false);
      return;
    }

    this.executeIniciative();
  }

  /**
   * Retorna se o player começa
   */

  getPlayerIniciative(): boolean {
    return this.playerIniciative;
  }

  /**
   * Obtém referência para a cena do jogo
   */
  getGameScene(): Phaser.Scene | null {
    return this as Phaser.Scene;
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
