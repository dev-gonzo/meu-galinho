import { CommonModule } from "@angular/common";
import { Component, Input, Output, EventEmitter, inject, OnInit, ElementRef } from "@angular/core";

@Component({
  selector: "app-fight-end",
  standalone: true,
  imports: [CommonModule],
  templateUrl: "./fight-end.html",
  styleUrl: "./fight-end.scss",
})
export class FightEndComponent implements OnInit {
  @Input() result: "victory" | "defeat" = "victory";
  @Output() fightEndFinished = new EventEmitter<void>();
  
  private readonly elementRef = inject(ElementRef);

  ngOnInit(): void {
    // Aplicar animação de entrada
    this.elementRef.nativeElement.classList.add('zoom-in');
    
    // Fechar automaticamente após 3 segundos (mais tempo para ver o resultado final)
    setTimeout(() => {
      // Aplicar animação de zoom out
      this.elementRef.nativeElement.classList.add('zoom-out');
      
      // Aguardar a animação terminar antes de emitir o evento
      setTimeout(() => {
        this.fightEndFinished.emit();
      }, 300);
    }, 3000);
  }
}
