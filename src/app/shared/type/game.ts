import { Fighter } from "./fighter";

export interface GameState {
  currentRound: number;
  currentTurn: number;
  gameActive: boolean;
  sceneReady: boolean;
  playerRoundVictory: number;
  opponentRoundVictory: number;
  totalRounds: number;
  fightFinished: boolean;
  roundStarter: Fighter;
}

export interface InitiativeResult {
  playerRoll: number;
  opponentRoll: number;
  winner: "player" | "opponent";
  playerDiceValues?: number[];
  opponentDiceValues?: number[];
}

export interface CustomGameScene extends Phaser.Scene {
  updateRound?(round: number, currentTurn: number): void;
  updateTurn?(turn: number, currentRound: number): void;
}
