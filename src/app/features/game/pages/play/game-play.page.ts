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
import { MarkerComponent } from "../../../../shared/components/marker/marker.component";
import { CombatService } from "../../services/combat-scene.service";

import { InitialRoundComponent } from "../../../../shared/components/initial-round/initial-round.component";
import { RoundEndComponent } from '../../../../shared/components/round-end/round-end.component';
import { InitiativeComponent } from "../../../../shared/components/initiative/initiative.component";
import { FightEndComponent } from "../../../../shared/components/fight-end/fight-end";

// Phaser já está importado via npm, não precisa de declare

@Component({
  selector: "app-game-play",
  standalone: true,
  imports: [
    CommonModule,
    MarkerComponent,
    ControlComponent,
    InitialRoundComponent,
    InitiativeComponent,
    RoundEndComponent,
    FightEndComponent
],
  templateUrl: "./game-play.page.html",
  styleUrls: ["./game-play.page.scss"],
})
export class GamePlayPage implements AfterViewInit, OnDestroy {
  @ViewChild("gameContainer", { static: false }) gameContainer!: ElementRef;

  readonly combatService = inject(CombatService);
  private readonly cdr = inject(ChangeDetectorRef);

  // Propriedades para controle de modais e estados

  // Propriedades para controle dos componentes de round
  showInitialRound = true;
  showInitiative = false;
  showRoundEnd = false;
  playerWonRound = false;
  
  // Propriedades para controle do fim de luta
  showFightEnd = false;
  fightResult: 'victory' | 'defeat' = 'victory';

  ngAfterViewInit(): void {
    // Aguardar o DOM estar pronto e inicializar via CombatService
    setTimeout(() => {
      this.initGameViaService();
    }, 200);

    // Inscrever-se nos eventos de combate
    this.combatService.combatEvent$.subscribe((event) => {
      console.log('🎮 Evento recebido:', event);
      if (event.message === "fight-end") {
        // Fim da luta
        console.log('🏁 FIGHT END detectado! Resultado:', event.type);
        this.fightResult = event.type;
        this.showFightEnd = true;
        this.cdr.detectChanges();
        console.log('✅ showFightEnd definido como:', this.showFightEnd);
      } else {
        // Fim de round
        console.log('🔄 Round end detectado');
        this.playerWonRound = event.type === "victory";
        this.showRoundEnd = true;
      }
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
    // Verificar se o gameContainer está disponível
    if (!this.gameContainer?.nativeElement) {
      return;
    }

    try {
      this.combatService.initializeGame(this.gameContainer);
    } catch {
      // Erro ao inicializar jogo via CombatService
    }
  }

  /**
   * Método chamado quando a iniciativa é executada
   */
  onInitiativeExecuted(): void {
    this.showInitialRound = false;
    this.showInitiative = true;
  }

  /**
   * Método chamado quando a exibição da iniciativa termina
   */
  onInitiativeFinished(): void {
    this.showInitiative = false;
  }



  /**
   * Método chamado quando a animação de fim de round termina
   */
  onRoundEndFinished(): void {
    this.showRoundEnd = false;
    // Mostrar initial round para o próximo round se a luta não terminou
    if (!this.combatService.currentGameState.fightFinished) {
      this.showInitialRound = true;
    }
  }

  /**
   * Método chamado quando a animação de fim de luta termina
   */
  onFightEndFinished(): void {
    this.showFightEnd = false;
    // TODO: Implementar navegação ou reinício do jogo
  }
}
