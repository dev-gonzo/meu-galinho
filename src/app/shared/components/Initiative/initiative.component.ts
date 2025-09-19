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
  Input,
  OnInit,
  Output,
  inject
} from "@angular/core";
import { Fighter } from "../../type/fighter";
import { SoundService } from "../../services/sound.service";

@Component({
  selector: "app-initiative",
  standalone: true,
  imports: [CommonModule],
  templateUrl: "./initiative.component.html",
  styleUrls: ["./initiative.component.scss"],
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
export class InitiativeComponent implements OnInit {
  @Input() roundStarter: Fighter = "PLAYER";
  @Output() toogleInitiative = new EventEmitter<void>();

  private soundService = inject(SoundService);
  
  playerIniciative = true;
  playerStarts = false;
  imageAnimationState = "in";

  ngOnInit(): void {
    // Reproduz som de entrada (pickup)
    this.soundService.playPickup();
    
    // Seta se o player incia o round
    this.playerIniciative = this.roundStarter == "PLAYER";

    // Fechar automaticamente após 2 segundos (tempo para apreciar a animação)
    setTimeout(() => {
      // Reproduz som de saída (pickup)
      this.soundService.playPickup();
      
      // Aplicar animação de saída
      this.imageAnimationState = "out";

      // Aguardar a animação de saída terminar antes de emitir o evento
      setTimeout(() => {
        this.toogleInitiative.emit();
      }, 150); // Tempo da animação de saída
    }, 800);
  }
}
