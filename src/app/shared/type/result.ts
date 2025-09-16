export interface ResultResponse {
  dices: number[];
  totalDice: number;
  result: Result;
}

export type ResultAttackResponse = {
  damage: number;
} & ResultResponse;

export type ResultDefenseResponse = {
  damageResistance?: number;
} & ResultResponse;

export type Result =
  | "CRITICAL_FAILURE"
  | "CRITICAL_SUCCESS"
  | "SUCCESS"
  | "FAILURE";
