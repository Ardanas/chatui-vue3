export type ICardMap = Map<string, any>

export class CardManager {
  cardMap: ICardMap
  constructor() {
    this.cardMap = new Map()
  }

  register(name: string, component: any) {
    this.cardMap.set(name, component)
  }

  use(name: string) {
    if (!this.cardMap.has(name)) {
      return null
    }
    return this.cardMap.get(name)
  }

  unregister(name: string) {
    if (!this.cardMap.has(name)) {
      console.error(`组件 "${name}" 不存在`)
      return false
    }
    this.cardMap.delete(name)
    return true
  }

  getAllCards() {
    return this.cardMap.values()
  }
}
