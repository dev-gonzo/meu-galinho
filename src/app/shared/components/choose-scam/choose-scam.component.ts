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
  ElementRef,
  EventEmitter,
  inject,
  Input,
  Output
} from "@angular/core";

@Component({
  selector: "app-choose-scam",
  standalone: true,
  imports: [CommonModule],
  templateUrl: "./choose-scam.component.html",
  styleUrls: ["./choose-scam.component.scss"],
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
export class ChooseScamComponent {
  @Input() playerIniciative = true;
  @Output() toogleInitiative = new EventEmitter<void>();

  private readonly elementRef = inject(ElementRef);
  playerStarts = false;

  imageAnimationState = "in";

  // ngOnInit(): void {
  //   // A animação de entrada acontece automaticamente com o estado 'in'

  //   // Fechar automaticamente após 2 segundos (tempo para apreciar a animação)
  //   // setTimeout(() => {
  //   //   // Aplicar animação de saída
  //   //   this.imageAnimationState = "out";

  //   //   // Aguardar a animação de saída terminar antes de emitir o evento
  //   //   setTimeout(() => {
  //   //     this.toogleInitiative.emit();
  //   //   }, 250); // Tempo da animação de saída
  //   // }, 2000);
  // }
}
