export class VariableDoesntExistsError extends Error {
  constructor(variableName: string) {
    super(`Variable: ${variableName}, doesn't exists in current scope or is equal to null or undefined`);
    this.name = VariableDoesntExistsError.name;
  }
}
