import { Injectable } from "@angular/core";
import * as Phaser from "phaser";
import { BehaviorSubject } from "rxjs";
import { CharacterHelper } from "../../../shared/helpers/character.helper";
import { FigtherHelper } from "../../../shared/helpers/fighter.helpers";
import { PhaserContainer } from "../../../shared/type/PhaserContainer";

import opponentData from "../../../shared/data/character-opponent.json";
import playerData from "../../../shared/data/character-players.json";
import { GameState } from "../../../shared/type/game";

/**
 * Classe unificada que combina Phaser.Scene e serviço Angular de combate
 */
@Injectable({
  providedIn: "root",
})
export class CombatService extends Phaser.Scene {
  constructor() {
    super({ key: "CombatScene" });
  }

  // Propriedades do Phaser
  public override game!: Phaser.Game;
  private background!: Phaser.GameObjects.Image;

  // Propriedades de combate
  private playerFighter: FigtherHelper | null = null;
  private playerSprite!: Phaser.GameObjects.Image;

  private opponentFighter: FigtherHelper | null = null;
  private opponentSprite!: Phaser.GameObjects.Image;

  private gameState: GameState = {
    currentRound: 1,
    currentTurn: 1,
    fightFinished: false,
    gameActive: false,
    opponentRoundVictory: 0,
    playerRoundVictory: 0,
    playerLife: 0,
    opponentLife: 0,
    playerLifePercentage: 100,
    opponentLifePercentage: 100,
    roundStarter: "PLAYER",
    sceneReady: false,
    totalRounds: 3,
  };

  private gameState$ = new BehaviorSubject<GameState>(this.gameState);
  private playerFighter$ = new BehaviorSubject<FigtherHelper | null>(null);

  /**
   * Observable do estado jogo
   */
  getGameStateObs() {
    return this.gameState$.asObservable();
  }

  /**
   * Observable do player fighter
   */
  getPlayerFighterObs() {
    return this.playerFighter$.asObservable();
  }

  /**
   * Método público para inicializar o combate
   */
  public initializeCombatData(): void {
    this.initializeCombat();
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
    const playerY = screenHeight * 0.60; // 75% da altura (parte inferior)
    this.playerSprite = this.add.image(playerX, playerY, "player-back");
    this.playerSprite.setScale(0.9); // Ajustar tamanho para mobile

    // Oponente (de frente) - posição superior direita
    const opponentX = screenWidth * 0.75; // 75% da largura
    const opponentY = screenHeight * 0.35; // 35% da altura (parte superior)
    this.opponentSprite = this.add.image(
      opponentX,
      opponentY,
      "opponent-front"
    );
    this.opponentSprite.setScale(0.9); // Ajustar tamanho para mobile

    // Listener para redimensionamento
    this.scale.on("resize", () => {
      adjustBackground();

      // Reposicionar personagens
      const newScreenWidth = this.scale.width;
      const newScreenHeight = this.scale.height;

      // Reposicionar jogador
      this.playerSprite.setPosition(
        newScreenWidth * 0.25,
        newScreenHeight * 0.75
      );

      // Reposicionar oponente
      this.opponentSprite.setPosition(
        newScreenWidth * 0.75,
        newScreenHeight * 0.35
      );
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
    if (this.playerFighter && this.opponentFighter) {
      return;
    }

    // Instanciar personagens
    const playerCharacter = new CharacterHelper(playerData);
    const opponentCharacter = new CharacterHelper(opponentData);

    this.playerFighter = new FigtherHelper(playerCharacter);
    this.opponentFighter = new FigtherHelper(opponentCharacter);

    this.playerFighter$.next(this.playerFighter);
    
    // Atualizar percentuais de vida iniciais
    this.updateLifePercentages();

    this.executeIniciative();
  }

  /**
   * Iniciatva para ver quem começa
   */
  executeIniciative() {
    const inicitavePlayer = this.playerFighter?.initiative() || 0;
    const inicitaveOpponent = this.opponentFighter?.initiative() || 0;

    if (inicitavePlayer > inicitaveOpponent) {
      this.gameState = {
        ...this.gameState,
        roundStarter: "PLAYER",
      };
      this.gameState$.next(this.gameState);
      return;
    }

    if (inicitavePlayer < inicitaveOpponent) {
      this.gameState = {
        ...this.gameState,
        roundStarter: "OPPONENT",
      };
      this.gameState$.next(this.gameState);
      return;
    }

    this.executeIniciative();
  }

  /**
   * Retorna se o player começa
   */

  getPlayerIniciative(): boolean {
    return this.gameState.roundStarter == "PLAYER";
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
  showDamage(damage: number, isPlayer = false): void {
    if (damage <= 0) return;

    // Pegar sprite de referência
    const targetSprite = isPlayer ? this.playerSprite : this.opponentSprite;

    if (!targetSprite) return;

    // Coordenadas baseadas no centro do sprite
    const { x, y } = targetSprite.getCenter();

    const damageText = this.add.text(x, y - 140 * 0.5, `-${damage}`, {
      fontSize: "24px",
      color: isPlayer ? "#ff4444" : "#ffaa00",
      fontStyle: "bold",
      stroke: "#000000",
      strokeThickness: 3,
    });

    damageText.setOrigin(0.5, 0.2); // centralizado embaixo

    // Animação
    this.tweens.add({
      targets: damageText,
      y: damageText.y - 50,
      alpha: 0,
      duration: 1500,
      ease: "Power2",
      onComplete: () => damageText.destroy(),
    });

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
   * Atualiza os percentuais de vida dos fighters
   */
  private updateLifePercentages(): void {
    if (this.playerFighter && this.opponentFighter) {
      const playerPercentage = this.playerFighter.getHPPercentage();
      const opponentPercentage = this.opponentFighter.getHPPercentage();
      
      this.gameState.playerLifePercentage = Math.max(0, Math.min(100, playerPercentage));
      this.gameState.opponentLifePercentage = Math.max(0, Math.min(100, opponentPercentage));
      
      // Emitir o estado atualizado
      this.gameState$.next({ ...this.gameState });
    }
  }

  /**
   * Loop contínuo de animações de demonstração
   */
  startDamageLoop(): void {
    const showRandomDamage = (): void => {
      const isPlayer = Math.random() < 0.5;
      const damage = Math.floor(Math.random() * 50) + 10;
      this.showDamage(damage, isPlayer);
    };

    this.time.addEvent({
      delay: 2000,
      callback: showRandomDamage,
      loop: true,
    });

    showRandomDamage();
  }
}
