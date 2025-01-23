export abstract class Entity<Props = any> {
  public readonly _id: number | null
  public readonly props: Props

  constructor(props: Props, id?: number) {
    this.props = props
    this._id = id ?? null
  }

  get id() {
    return this._id
  }

  toJSON(): Required<{ id: number | null } & Props> {
    return {
      id: this._id,
      ...this.props,
    } as Required<{ id: number | null } & Props>
  }
}
