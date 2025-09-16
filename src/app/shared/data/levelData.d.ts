type LevelData = {
  level: number;
  dice: number;
  modifier: number;
  damageMin?: number;
}[];

declare const levelData: LevelData;
export default levelData;