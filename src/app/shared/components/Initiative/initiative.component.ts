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

@Component({
  selector: "app-initiative",
  standalone: true,
  imports: [CommonModule],
  templateUrl: "./initiative.component.html",
  styleUrls: ["./initiative.component.scss"],
})
export class InitiativeComponent implements OnInit {
  @Input() playerIniciative = true;
  @Output() initiativeFinished = new EventEmitter<void>();

  private readonly elementRef = inject(ElementRef);
  playerStarts = false;

  ngOnInit(): void {
    // Aplicar animação de entrada
    this.elementRef.nativeElement.classList.add("zoom-in");

    // Verificar quem começa baseado na iniciativa
    // this.playerStarts = this.combatService.playerStarts;

    // Fechar automaticamente após 1.2 segundos (deixando tempo para zoom out)
    // setTimeout(() => {
    //   // Aplicar animação de zoom out
    //   this.elementRef.nativeElement.classList.add('zoom-out');

    //   // Aguardar a animação terminar antes de emitir o evento
    //   setTimeout(() => {
    //     this.initiativeFinished.emit();
    //   }, 300);
    // }, 1200);
  }
}
