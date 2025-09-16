import { Result, ResultResponse } from "../type/result";
import { DiceHelper } from "./dice.helper";

/**
 * Helper para executar teste de acerto
 */
export class RollDicePlayerHelper {
  static roll(
    skill: number,
    critical_failure = 17,
    criticalDice = 4
  ): ResultResponse {
    const dices = DiceHelper.rollMultipleD6(3);
    const totalDice = dices.reduce((sum, roll) => sum + roll, 0);

    let result: Result;

    switch (true) {
      case totalDice >= critical_failure:
        result = "CRITICAL_FAILURE";
        break;

      case totalDice <= criticalDice:
        result = "CRITICAL_SUCCESS";
        break;

      case totalDice <= skill:
        result = "SUCCESS";
        break;

      default:
        result = "FAILURE";
    }

    return {
      dices,
      totalDice,
      result,
    };
  }
}
