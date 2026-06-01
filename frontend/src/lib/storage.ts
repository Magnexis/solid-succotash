import type { SearchForm, SearchPlan } from './types'

const key = 'catPlan'
export type SavedSearch = { form: SearchForm; plan: SearchPlan }
export type ToolkitState = {
  completedTasks: string[]
  claimedZones: Record<string, string>
  notes: string[]
  contactName: string
  contactPhone: string
}
const toolkitKey = 'catRecoveryToolkit'
const defaultToolkit: ToolkitState = { completedTasks: [], claimedZones: {}, notes: [], contactName: '', contactPhone: '' }

export function saveSearch(search: SavedSearch) {
  localStorage.setItem(key, JSON.stringify(search))
}

export function loadSearch(): SavedSearch | null {
  const saved = localStorage.getItem(key)
  return saved ? JSON.parse(saved) as SavedSearch : null
}

export function loadToolkit(): ToolkitState {
  const saved = localStorage.getItem(toolkitKey)
  return saved ? { ...defaultToolkit, ...JSON.parse(saved) as ToolkitState } : defaultToolkit
}

export function saveToolkit(toolkit: ToolkitState) {
  localStorage.setItem(toolkitKey, JSON.stringify(toolkit))
}
