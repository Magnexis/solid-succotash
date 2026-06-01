export type SearchForm = {
  name: string
  age: string
  sex: string
  fixed: string
  medicalNeeds: string[]
  lifestyle: string
  escapeHistory: string
  personality: string[]
  area: string
  homeType: string
  features: string[]
  hazards: string[]
  weather: string
  escape: string
  event: string[]
  when: string
  searchActions: string[]
  location: string
}

export type SearchZone = {
  name: string
  why: string
  level: 'High' | 'Medium' | 'Lower'
  score: number
  done?: boolean
}

export type SearchPlan = {
  radius: number
  confidence: 'High' | 'Medium' | 'Low'
  score: number
  explanation: string[]
  zones: SearchZone[]
}

type Candidate = {
  name: string
  base: number
  why: string
  feature?: string
  areas?: string[]
  signals?: Partial<Record<'shy' | 'curious' | 'stress' | 'weather' | 'food' | 'vulnerable' | 'experienced' | 'mobility' | 'noise' | 'vertical', number>>
  escapes?: string[]
}

const candidates: Candidate[] = [
  { name: 'Escape point and home perimeter', base: 98, why: 'Check the exit point, foundation edges, and the first quiet cover around home.', signals: { shy: 10, stress: 8 } },
  { name: 'Inside the home and attached spaces', base: 90, why: 'Re-check closets, furniture, utility spaces, and any room opened around the disappearance.', escapes: ['Unknown'], signals: { shy: 8 } },
  { name: 'Neighboring yards and property edges', base: 80, why: 'Search the nearest yards slowly and ask neighbors to inspect concealed corners.', signals: { shy: 4, curious: 4 } },
  { name: 'Bushes, hedges, and dense vegetation', base: 88, why: 'Use a flashlight low to the ground; frightened cats often stay concealed and silent.', feature: 'Bushes or hedges', signals: { shy: 9, stress: 6, vulnerable: 4 } },
  { name: 'Under parked vehicles', base: 78, why: 'Inspect beneath vehicles and around wheel wells before anyone drives away.', feature: 'Parked vehicles', areas: ['urban', 'suburban'], signals: { shy: 5, weather: 5 } },
  { name: 'Under porches, decks, and crawlspaces', base: 92, why: 'Look into the deepest corners with a flashlight and ask before entering private property.', feature: 'Porches', signals: { shy: 10, stress: 6, weather: 6 } },
  { name: 'Neighbor sheds and outbuildings', base: 84, why: 'Ask neighbors to open and thoroughly inspect enclosed spaces before closing them again.', feature: 'Sheds', signals: { shy: 7, weather: 5 } },
  { name: 'Garages and basements', base: 82, why: 'Ask neighbors to check behind stored items, beneath furniture, and near warm hiding places.', feature: 'Garages', signals: { curious: 8, weather: 8 } },
  { name: 'Apartment halls, stairwells, and utility areas', base: 84, why: 'Check quiet shared spaces and ask building staff about rooms that may have been opened.', feature: 'Apartments', areas: ['urban', 'suburban'], signals: { curious: 9, weather: 6 } },
  { name: 'Storm drains and culvert entrances', base: 68, why: 'Inspect entrances visually and listen carefully; do not enter drains or flowing water.', feature: 'Storm drains', areas: ['urban', 'suburban'], signals: { stress: 5, weather: 3 } },
  { name: 'Tree line and brush edge', base: 72, why: 'Search the sheltered edge first rather than walking deep into the woods.', feature: 'Woods', areas: ['suburban', 'rural'], signals: { curious: 7, stress: 3 } },
  { name: 'Field edge and tall grass', base: 65, why: 'Walk the covered perimeter slowly and scan low with a flashlight.', feature: 'Fields', areas: ['suburban', 'rural'], signals: { curious: 6 } },
  { name: 'Fence lines and sheltered travel edges', base: 74, why: 'Follow low-risk edges where a cat can move while staying close to cover.', areas: ['urban', 'suburban'], signals: { curious: 5 } }
  ,{ name: 'Familiar route, feeding area, or usual outdoor perch', base: 74, why: 'Check known routine stops and the covered paths connecting them.', signals: { experienced: 16, food: 8 } }
  ,{ name: 'Under stairs, balconies, and raised structures', base: 76, why: 'Scan upper and lower edges carefully; these spaces offer cover without requiring much travel.', feature: 'Stairs or balconies', signals: { shy: 6, vertical: 8 } }
  ,{ name: 'Construction materials and work areas', base: 67, why: 'Ask the property owner to inspect beneath materials and equipment before anything is moved.', feature: 'Construction site', signals: { noise: 8, curious: 5 } }
  ,{ name: 'Dumpsters and service alleys', base: 63, why: 'Inspect the sheltered perimeter from a safe distance and search before collection times.', feature: 'Dumpsters or alleys', areas: ['urban', 'suburban'], signals: { food: 10, curious: 4 } }
  ,{ name: 'Barns, workshops, and farm structures', base: 82, why: 'Ask owners to inspect enclosed structures, stacked materials, and warm equipment areas.', feature: 'Barns or workshops', areas: ['rural'], signals: { curious: 8, weather: 6 } }
  ,{ name: 'Creek banks and drainage edges', base: 62, why: 'Search sheltered edges visually and avoid entering unsafe water or unstable ground.', feature: 'Creeks or drainage', areas: ['suburban', 'rural'], signals: { stress: 4 } }
]

export function createPrediction(form: SearchForm): SearchPlan {
  const shy = form.personality.includes('Shy') || form.personality.includes('Hides when stressed')
  const curious = form.personality.includes('Explorer') || form.personality.includes('Social')
  const stress = form.event.some((event) => ['Chased', 'Fireworks', 'Loud noise'].includes(event))
  const badWeather = ['rain', 'snow', 'heat', 'wind'].includes(form.weather)
  const food = form.personality.includes('Food motivated')
  const experienced = form.escapeHistory === 'Previous escapes' || form.lifestyle !== 'indoor'
  const mobilityConcern = form.medicalNeeds.includes('Mobility limitations') || form.medicalNeeds.includes('Vision or hearing loss')
  const noise = form.event.includes('Construction') || form.hazards.includes('Active construction')
  const vertical = form.personality.includes('Climber')

  const zones = candidates
    .filter((candidate) => !candidate.feature || form.features.includes(candidate.feature))
    .filter((candidate) => !candidate.areas || candidate.areas.includes(form.area))
    .filter((candidate) => !candidate.escapes || candidate.escapes.includes(form.escape))
    .map((candidate) => {
      let score = candidate.base
      if (shy) score += candidate.signals?.shy ?? 0
      if (curious) score += candidate.signals?.curious ?? 0
      if (stress) score += candidate.signals?.stress ?? 0
      if (badWeather) score += candidate.signals?.weather ?? 0
      if (food) score += candidate.signals?.food ?? 0
      if (form.age === 'kitten' || form.age === 'senior') score += candidate.signals?.vulnerable ?? 0
      if (experienced) score += candidate.signals?.experienced ?? 0
      if (mobilityConcern) score += candidate.signals?.mobility ?? 0
      if (noise) score += candidate.signals?.noise ?? 0
      if (vertical) score += candidate.signals?.vertical ?? 0
      return { ...candidate, score }
    })
    .sort((left, right) => right.score - left.score)
    .slice(0, 7)
    .map(({ name, why, score }, index) => ({
      name,
      why,
      score,
      level: index < 3 ? 'High' as const : index < 5 ? 'Medium' as const : 'Lower' as const
    }))

  const radius = getRadius(form, stress)
  const inputSignals = form.personality.length + form.features.length + form.event.length + form.hazards.length + form.medicalNeeds.length + form.searchActions.length + (form.location ? 1 : 0)
  const score = Math.min(94, 52 + inputSignals * 2)
  const confidence = score >= 78 ? 'High' : score >= 65 ? 'Medium' : 'Low'
  const explanation = [
    getRadiusExplanation(form.lifestyle, radius),
    shy ? 'A cautious or stress-hiding profile raises close, concealed spaces.' : 'The ranking balances nearby cover with likely travel paths.',
    curious ? 'Curious or social behavior raises accessible neighbor spaces and route edges.' : '',
    stress ? 'Because the escape involved a stressor, search silent hiding places before assuming a long-distance move.' : '',
    badWeather ? 'Current weather raises sheltered and enclosed locations.' : '',
    mobilityConcern ? 'Mobility or sensory needs keep the first search tightly focused on accessible close cover.' : '',
    experienced ? 'Prior outdoor experience raises familiar routes and routine stopping points.' : '',
    form.searchActions.length ? `${form.searchActions.length} completed search actions were reported; continue re-checking close cover while expanding methodically.` : '',
    form.when && form.when !== 'Under 1 hour' ? `Because the disappearance was ${form.when.toLowerCase()}, keep re-checking close cover while widening outreach.` : '',
    'Treat this as a prioritized search checklist, not a guarantee. Re-check close hiding places slowly and physically.'
  ].filter(Boolean)

  return { radius, confidence, score, explanation, zones }
}

function getRadius(form: SearchForm, stress: boolean) {
  let radius = form.lifestyle === 'indoor' ? 450 : form.lifestyle === 'both' ? 1000 : 1000
  if (form.personality.includes('Explorer') && form.lifestyle !== 'indoor') radius += 500
  if (form.area === 'rural' && form.lifestyle !== 'indoor') radius += 500
  if (form.event.includes('Chased')) radius += 500
  if (form.escapeHistory === 'Previous escapes' && form.lifestyle !== 'indoor') radius += 250
  if (form.medicalNeeds.includes('Mobility limitations')) radius = Math.min(radius, 750)
  if (stress && form.lifestyle === 'indoor') radius = Math.max(radius, 500)
  return Math.min(radius, 5280)
}

function getRadiusExplanation(lifestyle: string, radius: number) {
  if (lifestyle === 'indoor') return `Start with a close ${radius} ft physical search. Indoor-only cats are commonly recovered near their escape point.`
  return `Start with a ${radius} ft search and expand methodically. Cats with outdoor access are often recovered farther from home than indoor-only cats.`
}
