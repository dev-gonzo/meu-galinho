import { Component, inject, OnInit } from "@angular/core";
import { Router } from "@angular/router";
import { CombatService } from "../../../features/game/services/combat-scene.service";

@Component({
  selector: "app-control",
  standalone: true,
  imports: [],
  templateUrl: "./control.component.html",
  styleUrls: ["./control.component.scss"],
})
export class ControlComponent implements OnInit {
  private readonly combatService = inject(CombatService);
  private readonly router = inject(Router);

  ngOnInit(): void {
    // Inicializar combate antes de listar golpes
    this.combatService.initializeCombat();

    // // Listar golpes dos personagens
    // this.combatService.listarGolpesPersonagens();
  }

  exitGame() {
    // Confirmar se o usuário realmente quer sair
    if (confirm("Tem certeza que deseja sair do jogo?")) {
      // Navegar para a página inicial ou fechar o jogo
      this.router.navigate(["/"]);
    }
  }

  punch() {
    // this.combatService.executePunchTurn();
  }

  defend() {
    // this.combatService.executeDefendTurn();
  }

  special() {
    // this.combatService.executeSpecialTurn();
  }

  usePotion() {
    // this.combatService.executePotionTurn();
  }
}
