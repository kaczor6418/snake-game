export class ThisSituationShouldNeverHappenError extends Error {
  constructor(variableName: string) {
    super(variableName);
    this.message = `This situation should never happen because typeof **${variableName}** variable in this scope is **never**`;
    this.name = ThisSituationShouldNeverHappenError.name;
  }
}
