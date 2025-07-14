import { Bubble } from '@/components/business/bubble'
import { CardManager } from '@/utils/CardManager'

export function useCardManager() {
  const cardManager = new CardManager()

  cardManager.register('text', Bubble)

  return {
    cardManager,
  }
}
