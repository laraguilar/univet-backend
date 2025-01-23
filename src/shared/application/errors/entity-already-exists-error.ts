export class EntityAlreadyExistsError extends Error {
  constructor(public message: string) {
    super(message)
    this.name = 'EntityAlreadyExists'
  }
}
