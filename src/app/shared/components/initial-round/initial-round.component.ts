import {
  animate,
  state,
  style,
  transition,
  trigger,
} from "@angular/animations";
import { CommonModule } from "@angular/common";
import { Component, EventEmitter, inject, Input, Output } from "@angular/core";
import { CombatService } from "../../../features/game/services/combat-scene.service";

@Component({
  selector: "app-intial-round",
  standalone: true,
  imports: [CommonModule],
  templateUrl: "./initial-round.component.html",
  styleUrls: ["./initial-round.component.scss"],
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
export class InitialRoundComponent {
  @Input() roundNumber = 1;
  @Output() toogleRound = new EventEmitter<void>();

  imageAnimationState = "in";
  buttonAnimationState = "in";

  private readonly combatService = inject(CombatService);

  startRound(): void {
    // this.combatService.initialRound();

    // Aplicar animação de zoom out
    this.imageAnimationState = "out";
    this.buttonAnimationState = "out";

    // Aguardar a animação terminar antes de emitir o evento
    setTimeout(() => {
      this.toogleRound.emit();
    }, 150);
  }
}
