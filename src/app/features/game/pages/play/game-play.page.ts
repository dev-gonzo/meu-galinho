import { CommonModule } from "@angular/common";
import {
  AfterViewInit,
  ChangeDetectorRef,
  Component,
  ElementRef,
  OnDestroy,
  ViewChild,
  inject,
} from "@angular/core";
import { ChooseScamComponent } from "../../../../shared/components/choose-scam/choose-scam.component";
import { ControlComponent } from "../../../../shared/components/control/control.component";
import { DefenderComponent } from "../../../../shared/components/defender/defender.component";
import { InitialRoundComponent } from "../../../../shared/components/initial-round/initial-round.component";
import { InitiativeComponent } from "../../../../shared/components/initiative/initiative.component";
import { MarkerComponent } from "../../../../shared/components/marker/marker.component";
import { PotionComponent } from "../../../../shared/components/potion/potion.component";
import { GoGiveUpComponent } from "../../../../shared/components/to-give-up/to-give-up.component";
import { FigtherHelper } from "../../../../shared/helpers/fighter.helpers";
import { BackgroundMusicService } from "../../../../shared/services/background-music.service";
import { GameState } from "../../../../shared/type/game";
import { CombatService } from "../../services/combat-scene.service";
import { SpecialComponent } from "../../../../shared/components/special/special.component";

@Component({
  selector: "app-game-play",
  standalone: true,
  imports: [
    CommonModule,
    MarkerComponent,
    ControlComponent,
    InitialRoundComponent,
    InitiativeComponent,
    ChooseScamComponent,
    DefenderComponent,
    GoGiveUpComponent,
    PotionComponent,
    SpecialComponent,
  ],
  templateUrl: "./game-play.page.html",
  styleUrls: ["./game-play.page.scss"],
})
export class GamePlayPage implements AfterViewInit, OnDestroy {
  @ViewChild("gameContainer", { static: false }) gameContainer!: ElementRef;

  readonly combatService = inject(CombatService);
  private readonly cdr = inject(ChangeDetectorRef);
  private readonly backgroundMusicService = inject(BackgroundMusicService);

  private musicStarted = false;

  gameState: GameState = {
    currentRound: 0,
    currentTurn: 0,
    gameActive: false,
    sceneReady: false,
    playerRoundVictory: 0,
    opponentRoundVictory: 0,
    playerLife: 0,
    opponentLife: 0,
    playerLifePercentage: 0,
    opponentLifePercentage: 0,
    totalRounds: 0,
    fightFinished: false,
    roundStarter: "PLAYER",
  };

  playerFighter: FigtherHelper | null = null;

  // Propriedades para controle dos componentes de round
  showInitialRound = true;
  showInitiative = false;
  showRoundEnd = false;
  showChooseScam = false;
  showControl = false;
  showDefender = false;
  showToGiveUp = false;
  showPotion = false;
  showSpecial = false;
  playerWonRound = false;

  // Propriedades para controle do fim de luta
  showFightEnd = false;
  fightResult: "victory" | "defeat" = "victory";

  ngAfterViewInit(): void {
    // Inicializar dados do combate primeiro
    this.combatService.initializeCombatData();

    // Iniciar música de fundo
    this.startBackgroundMusic();

    // Aguardar o DOM estar pronto e inicializar via CombatService
    setTimeout(() => {
      this.initGameViaService();
    }, 200);

    this.combatService.getGameStateObs().subscribe((value) => {
      this.gameState = value;
      this.cdr.detectChanges();
    });

    this.combatService.getPlayerFighterObs().subscribe((value) => {
      console.log("PlayerFighter recebido:", value);
      this.playerFighter = value;
      this.cdr.detectChanges();
    });
  }

  ngOnDestroy(): void {
    // Destruir jogo via CombatService
    this.combatService.destroyGame();
  }

  /**
   * Inicializa o jogo via CombatService
   */
  private initGameViaService(): void {
    try {
      this.combatService.initializeGame(this.gameContainer);
    } catch {
      // Erro ao inicializar jogo via CombatService
    }
  }

  /**
   * Inicia a música de fundo
   */
  private startBackgroundMusic(): void {
    if (!this.musicStarted) {
      try {
        this.backgroundMusicService.play(0, false); // Inicia a primeira música em loop com shouldPlay = true
        this.musicStarted = true;
      } catch {
        // Se falhar (por exemplo, por política de autoplay), será tentado novamente na primeira interação
        console.log(
          "Música de fundo será iniciada na primeira interação do usuário"
        );
      }
    }
  }

  /**
   * Garante que a música seja iniciada na primeira interação do usuário
   */
  private ensureBackgroundMusic(): void {
    if (!this.musicStarted) {
      this.startBackgroundMusic();
    }
  }

  /**
   * Inicializa round
   */
  toogleRound() {
    this.ensureBackgroundMusic();
    console.log("start round");
    this.combatService.executeIniciative();
    this.showInitiative = true;
    this.showInitialRound = false;
  }

  /**
   * Fecha estatista
   */
  toogleInitative() {
    this.ensureBackgroundMusic();
    console.log("Close initiative");
    this.showInitiative = false;
    this.showControl = true;
  }

  /**
   * Toogle estatista
   */
  toogleChooseScam() {
    this.ensureBackgroundMusic();
    console.log("Abre Lista de gopes");
    this.showChooseScam = !this.showChooseScam;
    this.showControl = !this.showControl;
  }

  /**
   * Toogle Defender
   */
  toogleDefender() {
    this.ensureBackgroundMusic();
    console.log("Abre Defesa");
    this.showDefender = !this.showDefender;
    this.showControl = !this.showControl;
  }

  /**
   * Toogle Fugir
   */
  toogleGoGiveUp() {
    this.ensureBackgroundMusic();
    console.log("Abre Fugir");
    this.showToGiveUp = !this.showToGiveUp;
    this.showControl = !this.showControl;
  }

  /**
   * Toogle Poção
   */
  tooglePotion() {
    this.ensureBackgroundMusic();
    console.log("Abre Poção");
    this.showPotion = !this.showPotion;
    this.showControl = !this.showControl;
  }

  /**
   * Toogle Especial
   */
  toogleSpecial() {
    this.ensureBackgroundMusic();
    console.log("1Abre Especial");
    this.showSpecial = !this.showSpecial;
    this.showControl = !this.showControl;
  }
}
