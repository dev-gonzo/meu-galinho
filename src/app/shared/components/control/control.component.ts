import {
  animate,
  state,
  style,
  transition,
  trigger,
} from "@angular/animations";
import { Component, inject, OnInit } from "@angular/core";
import { Router } from "@angular/router";
import { CombatService } from "../../../features/game/services/combat-scene.service";

@Component({
  selector: "app-control",
  standalone: true,
  imports: [],
  templateUrl: "./control.component.html",
  styleUrls: ["./control.component.scss"],
  animations: [
    trigger("zoomAnimation", [
      state(
        "in",
        style({
          transform: "scale(1) translateY(0)",
          opacity: 1,
        })
      ),
      state(
        "out",
        style({
          transform: "scale(0.3) translateY(-50px)",
          opacity: 0,
        })
      ),
      transition("void => in", [
        style({
          transform: "scale(0.3) translateY(50px)",
          opacity: 0,
        }),
        animate("400ms cubic-bezier(0.175, 0.885, 0.32, 1.275)"),
      ]),
      transition("in => out", [
        animate("250ms cubic-bezier(0.55, 0.085, 0.68, 0.53)"),
      ]),
    ]),
  ],
})
export class ControlComponent implements OnInit {
  private readonly combatService = inject(CombatService);
  private readonly router = inject(Router);

  animationState = "in";

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
