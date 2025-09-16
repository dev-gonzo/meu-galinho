import { CommonModule } from "@angular/common";
import { Component, Input, Output, EventEmitter, inject, OnInit, ElementRef } from "@angular/core";
import { CombatService } from "../../../features/game/services/combat-scene.service";

@Component({
  selector: "app-initiative",
  standalone: true,
  imports: [CommonModule],
  templateUrl: "./initiative.component.html",
  styleUrls: ["./initiative.component.scss"],
})
export class InitiativeComponent implements OnInit {
  @Input() roundNumber = 1;
  @Output() initiativeFinished = new EventEmitter<void>();
  
  private readonly combatService = inject(CombatService);
  private readonly elementRef = inject(ElementRef);
  playerStarts = false;

  ngOnInit(): void {
    // Aplicar animação de entrada
    this.elementRef.nativeElement.classList.add('zoom-in');
    
    // Verificar quem começa baseado na iniciativa
    this.playerStarts = this.combatService.playerStarts;
    
    // Fechar automaticamente após 1.2 segundos (deixando tempo para zoom out)
    setTimeout(() => {
      // Aplicar animação de zoom out
      this.elementRef.nativeElement.classList.add('zoom-out');
      
      // Aguardar a animação terminar antes de emitir o evento
      setTimeout(() => {
        this.initiativeFinished.emit();
      }, 300);
    }, 1200);
  }
}
