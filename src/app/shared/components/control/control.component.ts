import {
  animate,
  state,
  style,
  transition,
  trigger,
} from "@angular/animations";
import { Component, EventEmitter, inject, OnInit, Output } from "@angular/core";
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
  @Output() toogleChosseScam = new EventEmitter<void>();
  @Output() toogleDefender = new EventEmitter<void>();
  @Output() toogleGoGiveUp = new EventEmitter<void>();
  @Output() tooglePotion = new EventEmitter<void>();
  @Output() toogleSpecial = new EventEmitter<void>();

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
    console.log("Open Exit");
    this.toogleGoGiveUp.emit();
  }

  openChosseScam() {
    console.log("Open Chosse Scam");
    this.toogleChosseScam.emit();
  }

  defend() {
    console.log("Open Defender");
    this.toogleDefender.emit();
  }

  special() {
    this.toogleSpecial.emit();
  }

  potion() {
    this.tooglePotion.emit();
  }
}
