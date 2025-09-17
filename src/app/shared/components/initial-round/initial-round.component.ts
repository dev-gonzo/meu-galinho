import {
  animate,
  state,
  style,
  transition,
  trigger,
} from "@angular/animations";
import { CommonModule } from "@angular/common";
import {
  Component,
  EventEmitter,
  inject,
  Input,
  Output
} from "@angular/core";
import { CombatService } from "../../../features/game/services/combat-scene.service";

@Component({
  selector: "app-intial-round",
  standalone: true,
  imports: [CommonModule],
  templateUrl: "./initial-round.component.html",
  styleUrls: ["./initial-round.component.scss"],
  animations: [
    trigger("zoomAnimation", [
      state("in", style({ transform: "scale(1)", opacity: 1 })),
      state("out", style({ transform: "scale(0.8)", opacity: 0 })),
      transition("void => in", [
        style({ transform: "scale(0.8)", opacity: 0 }),
        animate("300ms ease-in-out"),
      ]),
      transition("in => out", [animate("150ms ease-in-out")]),
    ]),
  ],
})
export class InitialRoundComponent {
  @Input() roundNumber = 1;
  @Output() initiativeExecuted = new EventEmitter<void>();

  imageAnimationState = "in";
  buttonAnimationState = "in";

  private readonly combatService = inject(CombatService);

  executeInitiative(): void {
    // this.combatService.initialRound();

    // Aplicar animação de zoom out
    this.imageAnimationState = "out";
    this.buttonAnimationState = "out";

    // Aguardar a animação terminar antes de emitir o evento
    setTimeout(() => {
      this.initiativeExecuted.emit();
    }, 150);
  }
}
