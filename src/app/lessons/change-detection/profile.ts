// A shared interface keeps both child inputs identical so only change-detection strategy differs.
export interface Profile {
  readonly name: string;
  readonly level: number;
}
