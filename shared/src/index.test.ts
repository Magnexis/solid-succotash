import assert from 'node:assert/strict'
import test from 'node:test'
import { createPrediction, type SearchForm } from './index.js'

const form = (overrides: Partial<SearchForm> = {}): SearchForm => ({
  name: 'Juniper', age: 'adult', sex: 'Female', fixed: 'Yes', medicalNeeds: [], lifestyle: 'indoor',
  escapeHistory: 'Never escaped', personality: [], area: 'suburban', homeType: 'Detached house',
  features: [], hazards: [], weather: 'clear', escape: 'Door escape', event: [], when: '',
  searchActions: [], location: 'Back porch',
  ...overrides
})

test('indoor-only cats start with a close evidence-informed radius', () => {
  assert.equal(createPrediction(form()).radius, 450)
})

test('feature-specific locations are only included when reported nearby', () => {
  const basic = createPrediction(form())
  assert.equal(basic.zones.some((zone) => zone.name.includes('porches')), false)
  const withPorch = createPrediction(form({ features: ['Porches'] }))
  assert.equal(withPorch.zones.some((zone) => zone.name.includes('porches')), true)
})

test('vegetation and parked vehicles are not assumed to exist', () => {
  const plan = createPrediction(form())
  assert.equal(plan.zones.some((zone) => zone.name.includes('vegetation')), false)
  assert.equal(plan.zones.some((zone) => zone.name.includes('vehicles')), false)
})

test('shy cats prioritize concealed close hiding spots', () => {
  const plan = createPrediction(form({ personality: ['Shy'], features: ['Porches', 'Garages'] }))
  assert.equal(plan.zones[0].name, 'Escape point and home perimeter')
  assert.ok(plan.zones.slice(0, 3).some((zone) => zone.name.includes('porches')))
})

test('curious cats promote accessible neighbor spaces', () => {
  const plan = createPrediction(form({ personality: ['Explorer'], features: ['Garages', 'Apartments'] }))
  assert.ok(plan.zones.slice(0, 5).some((zone) => zone.name.includes('Apartment')))
  assert.ok(plan.zones.slice(0, 5).some((zone) => zone.name.includes('Garages')))
})

test('outdoor access and a chased event expand the search radius', () => {
  assert.equal(createPrediction(form({ lifestyle: 'both', event: ['Chased'] })).radius, 1500)
})

test('previous outdoor experience raises familiar routes', () => {
  const plan = createPrediction(form({ lifestyle: 'both', escapeHistory: 'Previous escapes' }))
  assert.ok(plan.zones.slice(0, 5).some((zone) => zone.name.includes('Familiar route')))
})

test('rural structures are ranked when reported nearby', () => {
  const plan = createPrediction(form({ area: 'rural', homeType: 'Farm or rural property', features: ['Barns or workshops'] }))
  assert.ok(plan.zones.some((zone) => zone.name.includes('Barns')))
})

test('mobility limitations constrain the search radius', () => {
  const plan = createPrediction(form({ lifestyle: 'both', event: ['Chased'], medicalNeeds: ['Mobility limitations'] }))
  assert.equal(plan.radius, 750)
})
