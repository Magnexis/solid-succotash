export type SightingSource = {
  id: string
  name: string
  urlTemplate: string
  kind: 'json' | 'jsonld'
}

export type SightingSearch = {
  latitude: number
  longitude: number
  radiusMiles: number
  sinceHours: number
}

export type SightingReport = {
  id: string
  sourceId: string
  sourceName: string
  sourceUrl: string
  title: string
  description: string
  reportedAt: string
  latitude: number
  longitude: number
  distanceMiles: number
  imageUrl?: string
  reportUrl?: string
}

type RawSighting = {
  id?: string
  title?: string
  name?: string
  description?: string
  reportedAt?: string
  datePosted?: string
  latitude?: number | string
  longitude?: number | string
  imageUrl?: string
  image?: string
  reportUrl?: string
  url?: string
  animalType?: string
  species?: string
  geo?: { latitude?: number | string; longitude?: number | string }
}

export function getConfiguredSources(value = process.env.CATWOMAN_SIGHTING_SOURCES): SightingSource[] {
  if (!value) return []
  try {
    const sources = JSON.parse(value) as SightingSource[]
    return sources.filter((source) =>
      source.id && source.name && source.urlTemplate && ['json', 'jsonld'].includes(source.kind)
    )
  } catch {
    throw new Error('CATWOMAN_SIGHTING_SOURCES must be a valid JSON array.')
  }
}

export async function searchNearbySightings(
  search: SightingSearch,
  sources = getConfiguredSources(),
  fetcher: typeof fetch = fetch
) {
  const results = await Promise.allSettled(sources.map(async (source) => {
    const sourceUrl = fillTemplate(source.urlTemplate, search)
    const response = await fetcher(sourceUrl, { headers: { 'User-Agent': 'CatWomanAPI/0.4 (+public-sightings-search)' } })
    if (!response.ok) throw new Error(`${source.name} returned ${response.status}`)
    const text = await response.text()
    const items = source.kind === 'json' ? readJsonItems(text) : readJsonLdItems(text)
    return items.map((item, index) => normalize(item, source, sourceUrl, index))
  }))

  const reports = addDistances(search, results
    .flatMap((result) => result.status === 'fulfilled' ? result.value : [])
    .filter((report): report is SightingReport => Boolean(report))
  )
    .filter((report) => report.distanceMiles <= search.radiusMiles)
    .filter((report) => Date.now() - Date.parse(report.reportedAt) <= search.sinceHours * 60 * 60 * 1000)
    .sort((left, right) => left.distanceMiles - right.distanceMiles)

  return {
    reports: deduplicate(reports),
    sources: sources.map(({ id, name, urlTemplate, kind }) => ({ id, name, urlTemplate, kind })),
    sourceErrors: results.flatMap((result, index) =>
      result.status === 'rejected' ? [{ sourceId: sources[index].id, message: result.reason instanceof Error ? result.reason.message : 'Source unavailable' }] : []
    )
  }
}

function fillTemplate(template: string, search: SightingSearch) {
  return template
    .replaceAll('{latitude}', String(search.latitude))
    .replaceAll('{longitude}', String(search.longitude))
    .replaceAll('{radiusMiles}', String(search.radiusMiles))
    .replaceAll('{sinceHours}', String(search.sinceHours))
}

function readJsonItems(text: string): RawSighting[] {
  const value = JSON.parse(text) as RawSighting[] | { sightings?: RawSighting[]; reports?: RawSighting[]; items?: RawSighting[] }
  if (Array.isArray(value)) return value
  return value.sightings ?? value.reports ?? value.items ?? []
}

function readJsonLdItems(html: string): RawSighting[] {
  const scripts = [...html.matchAll(/<script[^>]+type=["']application\/ld\+json["'][^>]*>([\s\S]*?)<\/script>/gi)]
  return scripts.flatMap((match) => {
    try {
      const value = JSON.parse(match[1]) as RawSighting | RawSighting[] | { '@graph'?: RawSighting[] }
      if (Array.isArray(value)) return value
      if ('@graph' in value && value['@graph']) return value['@graph']
      return [value as RawSighting]
    } catch {
      return []
    }
  })
}

function normalize(item: RawSighting, source: SightingSource, sourceUrl: string, index: number): SightingReport | null {
  const latitude = Number(item.latitude ?? item.geo?.latitude)
  const longitude = Number(item.longitude ?? item.geo?.longitude)
  const reportedAt = item.reportedAt ?? item.datePosted
  const species = (item.animalType ?? item.species ?? 'cat').toLowerCase()
  if (!Number.isFinite(latitude) || !Number.isFinite(longitude) || !reportedAt || species !== 'cat') return null
  return {
    id: item.id ?? `${source.id}-${index}-${latitude}-${longitude}`,
    sourceId: source.id,
    sourceName: source.name,
    sourceUrl,
    title: item.title ?? item.name ?? 'Reported cat sighting',
    description: item.description ?? '',
    reportedAt,
    latitude,
    longitude,
    distanceMiles: 0,
    imageUrl: item.imageUrl ?? item.image,
    reportUrl: item.reportUrl ?? item.url
  }
}

function deduplicate(reports: SightingReport[]) {
  const found = new Map<string, SightingReport>()
  reports.forEach((report) => {
    const key = `${report.title.toLowerCase()}|${report.latitude.toFixed(4)}|${report.longitude.toFixed(4)}|${report.reportedAt}`
    if (!found.has(key)) found.set(key, report)
  })
  return [...found.values()]
}

export function addDistances(search: SightingSearch, reports: SightingReport[]) {
  return reports.map((report) => ({ ...report, distanceMiles: distanceMiles(search.latitude, search.longitude, report.latitude, report.longitude) }))
}

export function distanceMiles(latitudeA: number, longitudeA: number, latitudeB: number, longitudeB: number) {
  const radians = (value: number) => value * Math.PI / 180
  const lat = radians(latitudeB - latitudeA)
  const lon = radians(longitudeB - longitudeA)
  const a = Math.sin(lat / 2) ** 2 + Math.cos(radians(latitudeA)) * Math.cos(radians(latitudeB)) * Math.sin(lon / 2) ** 2
  return 3958.8 * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
}
