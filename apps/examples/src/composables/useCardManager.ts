import { Bubble } from '@chatui-vue3/components'
import { CardManager } from '@chatui-vue3/core'

export function useCardManager() {
  const cardManager = new CardManager()

  cardManager.register('text', Bubble)

  return {
    cardManager,
  }
}
