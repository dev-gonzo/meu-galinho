import { Component, OnInit, OnDestroy, inject } from "@angular/core";
import { CombatService } from "../../../features/game/services/combat-scene.service";
import { FigtherHelper } from "../../helpers/fighter.helpers";
import { Subscription } from "rxjs";
import { CommonModule } from "@angular/common";

@Component({
  selector: "app-marker",
  standalone: true,
  imports: [CommonModule],
  templateUrl: "./marker.component.html",
  styleUrls: ["./marker.component.scss"],
})
export class MarkerComponent implements OnInit, OnDestroy {
  private readonly combatService = inject(CombatService);

  public playerFighter: FigtherHelper | null = null;
  public opponentFighter: FigtherHelper | null = null;

  public playerHPPercentage = 100;
  public opponentHPPercentage = 100;
  public currentRound = 1;
  public currentTurn = 1;
  public showLifeBars = false;

  private hpUpdateSubscription?: Subscription;
  private gameStateSubscription?: Subscription;

  ngOnInit(): void {
    // Inicializar combate se ainda não foi inicializado
    this.combatService.initializeCombat();
    
    // Inscrever-se no estado do jogo para receber atualizações de vida
    this.gameStateSubscription = this.combatService.getGameStateObs().subscribe(gameState => {
      this.playerHPPercentage = gameState.playerLifePercentage;
      this.opponentHPPercentage = gameState.opponentLifePercentage;
      this.currentRound = gameState.currentRound;
      this.currentTurn = gameState.currentTurn;
    });
    
    // Ativar animação das barras de vida após um pequeno delay
    setTimeout(() => {
      this.showLifeBars = true;
    }, 500);
  }

  ngOnDestroy(): void {
    this.hpUpdateSubscription?.unsubscribe();
    this.gameStateSubscription?.unsubscribe();
  }

}
