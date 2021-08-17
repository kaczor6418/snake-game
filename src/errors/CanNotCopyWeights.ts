export class CanNotCopyWeights extends Error {
  constructor() {
    super('Can not copy weights if the source model is not defined');
    this.name = CanNotCopyWeights.name;
  }
}
