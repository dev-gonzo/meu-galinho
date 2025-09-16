import { Fighter } from "./fighter";

export interface GameState {
  currentRound: number;
  currentTurn: number;
  gameActive: boolean;
  sceneReady: boolean;
  playerRoundVictory: number;
  enemyRoundVictory: number;
  roundStarter: Fighter;
  totalRounds: number; // 3 ou 5 rounds, padrão 3
  fightFinished: boolean; // indica se a luta terminou
}

export interface InitiativeResult {
  playerRoll: number;
  enemyRoll: number;
  winner: "player" | "enemy";
  playerDiceValues?: number[];
  enemyDiceValues?: number[];
}

export interface CustomGameScene extends Phaser.Scene {
  updateRound?(round: number, currentTurn: number): void;
  updateTurn?(turn: number, currentRound: number): void;
}
