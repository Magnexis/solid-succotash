import { createPrediction } from '@wheredidmycatgo/prediction-engine'
import type { SearchForm, SearchPlan } from './types'

export const predictLocally = createPrediction

export async function getPrediction(form: SearchForm): Promise<SearchPlan> {
  try {
    const response = await fetch('/api/predictions', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form)
    })
    if (!response.ok) throw new Error('Prediction API unavailable')
    return await response.json() as SearchPlan
  } catch {
    return predictLocally(form)
  }
}
