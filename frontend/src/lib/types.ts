export type { SearchForm, SearchPlan, SearchZone } from '@wheredidmycatgo/prediction-engine'
import type { SearchForm } from '@wheredidmycatgo/prediction-engine'

export const emptyForm: SearchForm = {
  name: '',
  age: 'adult',
  sex: '',
  fixed: '',
  medicalNeeds: [],
  lifestyle: 'indoor',
  escapeHistory: '',
  personality: [],
  area: 'suburban',
  homeType: '',
  features: [],
  hazards: [],
  weather: 'clear',
  escape: 'door',
  event: [],
  when: '',
  searchActions: [],
  location: ''
}

export const toggle = (values: string[], value: string) =>
  values.includes(value) ? values.filter((item) => item !== value) : [...values, value]
