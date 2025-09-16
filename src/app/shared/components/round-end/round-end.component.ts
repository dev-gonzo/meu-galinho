import { CommonModule } from "@angular/common";
import { Component, ElementRef, EventEmitter, inject, Input, OnInit, Output } from "@angular/core";

@Component({
  selector: "app-round-end",
  standalone: true,
  imports: [CommonModule],
  templateUrl: "./round-end.component.html",
  styleUrls: ["./round-end.component.scss"],
})
export class RoundEndComponent implements OnInit {
  @Input() playerWon = false;
  @Output() roundEndFinished = new EventEmitter<void>();
  
  private readonly elementRef = inject(ElementRef);

  ngOnInit(): void {
    // Aplicar animação de entrada
    this.elementRef.nativeElement.classList.add('zoom-in');
    
    // Fechar automaticamente após 2 segundos (mais tempo para ver o resultado)
    setTimeout(() => {
      // Aplicar animação de zoom out
      this.elementRef.nativeElement.classList.add('zoom-out');
      
      // Aguardar a animação terminar antes de emitir o evento
      setTimeout(() => {
        this.roundEndFinished.emit();
      }, 300);
    }, 2000);
  }
}