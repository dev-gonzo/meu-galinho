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
import { ControlComponent } from "../../../../shared/components/control/control.component";
import { InitialRoundComponent } from "../../../../shared/components/initial-round/initial-round.component";
import { MarkerComponent } from "../../../../shared/components/marker/marker.component";
import { CombatService } from "../../services/combat-scene.service";
import { GameState } from "../../../../shared/type/game";
import { InitiativeComponent } from "../../../../shared/components/initiative/initiative.component";
import { ChooseScamComponent } from "../../../../shared/components/choose-scam/choose-scam.component";

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
  ],
  templateUrl: "./game-play.page.html",
  styleUrls: ["./game-play.page.scss"],
})
export class GamePlayPage implements AfterViewInit, OnDestroy {
  @ViewChild("gameContainer", { static: false }) gameContainer!: ElementRef;

  readonly combatService = inject(CombatService);
  private readonly cdr = inject(ChangeDetectorRef);

  gameState: GameState = {
    currentRound: 0,
    currentTurn: 0,
    gameActive: false,
    sceneReady: false,
    playerRoundVictory: 0,
    opponentRoundVictory: 0,
    totalRounds: 0,
    fightFinished: false,
    roundStarter: "PLAYER",
  };

  // Propriedades para controle dos componentes de round
  showInitialRound = true;
  showInitiative = false;
  showRoundEnd = false;
  showChooseScam = false;
  showControl = false;
  playerWonRound = false;

  // Propriedades para controle do fim de luta
  showFightEnd = false;
  fightResult: "victory" | "defeat" = "victory";

  ngAfterViewInit(): void {
    // Aguardar o DOM estar pronto e inicializar via CombatService
    setTimeout(() => {
      this.initGameViaService();
    }, 200);

    this.combatService.getGameStateObs().subscribe((value) => {
      this.gameState = value;
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
   * Inicializa round
   */
  toogleRound() {
    console.log("start round");
    this.combatService.executeIniciative();
    this.showInitiative = true;
    this.showInitialRound = false;
  }

  /**
   * Fecha estatista
   */
  toogleInitative() {
    console.log("Close initiative");
    this.showInitiative = false;
    this.showControl = true;
  }

  /**
   * Fecha estatista
   */
  toogleChooseScam() {
    console.log("Abre Listga de gopes");
    this.showChooseScam = true;
  }
}
