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
  OnInit,
  Output,
} from "@angular/core";
import { CharacterHelper } from "../../helpers/character.helper";
import { SoundService } from "../../services/sound.service";

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
export class ChooseScamComponent implements OnInit {
  @Input() playerFighterCharacter: CharacterHelper | null = null;
  @Output() toogleChosseScam = new EventEmitter<void>();


  private readonly elementRef = inject(ElementRef);
  private readonly soundService = inject(SoundService);
  playerStarts = false;


  imageAnimationState = "in";

  ngOnInit(): void {
    // Reproduz som de entrada quando o componente é inicializado
    this.soundService.playEntrance();
  }

  closeChosseScam() {
    console.log("Close Chosse Scam");
    this.imageAnimationState = "out";
    
    // Reproduz som de saída
    this.soundService.playExit();
    
    // Aguardar a animação de saída terminar antes de emitir o evento
    setTimeout(() => {
      this.toogleChosseScam.emit();
    }, 250);
  }


}
