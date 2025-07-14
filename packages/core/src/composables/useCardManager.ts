import { Bubble } from '@chatui-vue3/components'
import { CardManager } from '../utils'

export function useCardManager() {
  const cardManager = new CardManager()

  cardManager.register('text', Bubble)

  return {
    cardManager,
  }
}
