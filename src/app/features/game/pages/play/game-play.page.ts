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
import { InitiativeComponent } from "../../../../shared/components/initiative/initiative.component";
import { MarkerComponent } from "../../../../shared/components/marker/marker.component";
import { CombatService } from "../../services/combat-scene.service";

@Component({
  selector: "app-game-play",
  standalone: true,
  imports: [
    CommonModule,
    MarkerComponent,
    ControlComponent,
    // InitialRoundComponent,
    InitiativeComponent,
    // RoundEndComponent,
    // FightEndComponent,
  ],
  templateUrl: "./game-play.page.html",
  styleUrls: ["./game-play.page.scss"],
})
export class GamePlayPage implements AfterViewInit, OnDestroy {
  @ViewChild("gameContainer", { static: false }) gameContainer!: ElementRef;

  readonly combatService = inject(CombatService);
  private readonly cdr = inject(ChangeDetectorRef);

  playerInitiative = true;

  // Propriedades para controle dos componentes de round
  showInitialRound = true;
  showInitiative = false;
  showRoundEnd = false;
  playerWonRound = false;

  // Propriedades para controle do fim de luta
  showFightEnd = false;
  fightResult: "victory" | "defeat" = "victory";

  ngAfterViewInit(): void {
    // Aguardar o DOM estar pronto e inicializar via CombatService
    setTimeout(() => {
      this.initGameViaService();
    }, 200);

    this.combatService.getPlayerInitiativeObs().subscribe((value) => {
      this.playerInitiative = value;
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
}
