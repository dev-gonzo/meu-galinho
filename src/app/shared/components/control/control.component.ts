import { Component, inject, OnInit } from "@angular/core";
import { Router } from "@angular/router";
import { CombatService } from '../../../features/game/services/combat-scene.service';


@Component({
  selector: "app-control",
  standalone: true,
  imports: [],
  templateUrl: "./control.component.html",
  styleUrls: ["./control.component.scss"],
})
export class ControlComponent implements OnInit {
  private readonly combatService = inject(CombatService);
  private readonly router = inject(Router);

  ngOnInit(): void {
    // Inicializar combate antes de listar golpes
    this.combatService.initializeCombat();
    
    // Listar golpes dos personagens
    this.combatService.listarGolpesPersonagens();
  }

  private listarGolpesPersonagens(): void {
    console.log('=== LISTA DE GOLPES DOS PERSONAGENS ===');
    
    const player = this.combatService.getPlayer();
    const enemy = this.combatService.getEnemy();
    
    if (player) {
      console.log('Golpes do Jogador:');
      const golpesPlayer = player.getGolpes();
      golpesPlayer.forEach((golpe, index) => {
        console.log(`${index + 1}. ${golpe.nome}`);
        console.log(`   - Velocidade: ${golpe.velocidade}`);
        console.log(`   - Dano: ${golpe.dano}`);
        console.log(`   - Atributo: ${golpe.atributo}`);
      });
    }
    
    if (enemy) {
      console.log('\nGolpes do Inimigo:');
      const golpesEnemy = enemy.getGolpes();
      golpesEnemy.forEach((golpe, index) => {
        console.log(`${index + 1}. ${golpe.nome}`);
        console.log(`   - Velocidade: ${golpe.velocidade}`);
        console.log(`   - Dano: ${golpe.dano}`);
        console.log(`   - Atributo: ${golpe.atributo}`);
      });
    }
    
    console.log('==========================================');
  }

  exitGame() {
    // Confirmar se o usuário realmente quer sair
    if (confirm('Tem certeza que deseja sair do jogo?')) {
      // Navegar para a página inicial ou fechar o jogo
      this.router.navigate(['/']);
    }
  }

  punch() {
    this.combatService.executePunchTurn();
  }
  
  defend() {
    this.combatService.executeDefendTurn();
  }
  
  special() {
    this.combatService.executeSpecialTurn();
  }
  
  usePotion() {
    this.combatService.executePotionTurn();
  }
  
  setRounds(rounds: 3 | 5) {
    this.combatService.setTotalRounds(rounds);
  }

}
