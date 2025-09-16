/**
 * Helper para simulação de dados
 */
export class DiceHelper {
  /**
   * Simula o lançamento de um dado de 6 lados (d6)
   * @returns Número aleatório entre 1 e 6
   */
  static rollD6(): number {
    return Math.floor(Math.random() * 6) + 1;
  }

  /**
   * Simula múltiplos lançamentos de d6
   * @param count Quantidade de dados a serem lançados
   * @returns Array com os resultados de cada dado
   */
  static rollMultipleD6(count: number): number[] {
    const results: number[] = [];
    for (let i = 0; i < count; i++) {
      results.push(this.rollD6());
    }
    return results;
  }

  /**
   * Simula lançamento de d6 e retorna a soma
   * @param count Quantidade de dados a serem lançados
   * @returns Soma dos resultados
   */
  static rollD6Sum(count: number): number {
    return this.rollMultipleD6(count).reduce((sum, roll) => sum + roll, 0);
  }

  /**
   * Simula lançamento de d6 com modificador
   * @param modifier Modificador a ser adicionado ao resultado
   * @returns Resultado do dado + modificador
   */
  static rollD6WithModifier(modifier = 0): number {
    return this.rollD6() + modifier;
  }
}