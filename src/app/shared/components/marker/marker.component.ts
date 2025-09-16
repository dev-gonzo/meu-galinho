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
  public enemyFighter: FigtherHelper | null = null;

  public playerHPPercentage = 100;
  public enemyHPPercentage = 100;
  public currentRound = 1;
  public currentTurn = 1;

  private hpUpdateSubscription?: Subscription;
  private gameStateSubscription?: Subscription;

  ngOnInit(): void {
    // Inicializar combate se ainda não foi inicializado
    this.combatService.initializeCombat();

    // Obter referências dos personagens
    this.playerFighter = this.combatService.getPlayer();
    this.enemyFighter = this.combatService.getEnemy();

    // Calcular porcentagens de HP
    this.updateHPPercentages();

    // Se inscrever para atualizações de HP
    this.hpUpdateSubscription = this.combatService.hpUpdate$.subscribe(
      (hpData) => {
        this.updateHPPercentagesFromData(hpData);
      }
    );

    // Se inscrever para atualizações do estado do jogo (turno e round)
    this.gameStateSubscription = this.combatService.gameState$.subscribe(
      (gameState) => {
        this.currentRound = gameState.currentRound ?? 1;
        this.currentTurn = gameState.currentTurn ?? 1;
      }
    );
  }

  ngOnDestroy(): void {
    this.hpUpdateSubscription?.unsubscribe();
    this.gameStateSubscription?.unsubscribe();
  }

  private updateHPPercentages(): void {
    // Obter referências atualizadas dos personagens
    const currentPlayer = this.combatService.getPlayer();
    const currentEnemy = this.combatService.getEnemy();

    if (currentPlayer) {
      const playerMaxHP = currentPlayer.getMaxHP();
      const playerCurrentHP = currentPlayer.getCurrentHP();
      this.playerHPPercentage = Math.max(
        0,
        (playerCurrentHP / playerMaxHP) * 100
      );
    }

    if (currentEnemy) {
      const enemyMaxHP = currentEnemy.getMaxHP();
      const enemyCurrentHP = currentEnemy.getCurrentHP();
      this.enemyHPPercentage = Math.max(0, (enemyCurrentHP / enemyMaxHP) * 100);
    }
  }

  private updateHPPercentagesFromData(hpData: {
    playerHP: number;
    playerMaxHP: number;
    enemyHP: number;
    enemyMaxHP: number;
  }): void {
    this.playerHPPercentage = Math.max(
      0,
      (hpData.playerHP / hpData.playerMaxHP) * 100
    );
    this.enemyHPPercentage = Math.max(
      0,
      (hpData.enemyHP / hpData.enemyMaxHP) * 100
    );
  }

  public refreshHP(): void {
    this.updateHPPercentages();
  }
}
