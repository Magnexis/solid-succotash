import { mkdir, readFile, writeFile } from 'node:fs/promises'
import { randomUUID } from 'node:crypto'
import { dirname } from 'node:path'
import { distanceMiles } from './sightings.js'

export type CommunitySighting = {
  id: string
  type: 'sighting' | 'update'
  status: 'spotted' | 'moving' | 'hiding' | 'safe' | 'unknown'
  description: string
  locationLabel: string
  latitude: number
  longitude: number
  reportedAt: string
  reporterName?: string
  contact?: string
  imageUrl?: string
  direction?: string
  confidence?: 'low' | 'medium' | 'high'
  approached?: boolean
  injured?: boolean
  distanceMiles?: number
}

export type CommunitySightingInput = Omit<CommunitySighting, 'id' | 'reportedAt' | 'distanceMiles'>

export class CommunitySightingStore {
  private writeQueue: Promise<void> = Promise.resolve()

  constructor(private readonly filePath = process.env.CATWOMAN_SIGHTINGS_FILE ?? 'data/community-sightings.json') {}

  async list(search?: { latitude?: number; longitude?: number; radiusMiles?: number }) {
    const reports = await this.read()
    return reports
      .map((report) => search?.latitude !== undefined && search.longitude !== undefined
        ? { ...report, distanceMiles: distanceMiles(search.latitude, search.longitude, report.latitude, report.longitude) }
        : report)
      .filter((report) => search?.radiusMiles === undefined || report.distanceMiles === undefined || report.distanceMiles <= search.radiusMiles)
      .sort((left, right) => Date.parse(right.reportedAt) - Date.parse(left.reportedAt))
  }

  async create(input: CommunitySightingInput) {
    const operation = this.writeQueue.then(async () => {
      const reports = await this.read()
      const report: CommunitySighting = { ...input, id: randomUUID(), reportedAt: new Date().toISOString() }
      reports.push(report)
      await mkdir(dirname(this.filePath), { recursive: true })
      await writeFile(this.filePath, JSON.stringify(reports, null, 2))
      return report
    })

    // Keep subsequent writes serialized even if a previous write fails.
    this.writeQueue = operation.then(() => undefined, () => undefined)
    return operation
  }

  async history(filters?: { type?: string; status?: string; query?: string }) {
    const reports = await this.list()
    const filtered = reports.filter((report) =>
      (!filters?.type || filters.type === 'all' || report.type === filters.type) &&
      (!filters?.status || filters.status === 'all' || report.status === filters.status) &&
      (!filters?.query || `${report.locationLabel} ${report.description} ${report.direction ?? ''}`.toLowerCase().includes(filters.query.toLowerCase()))
    )
    return {
      reports: filtered,
      summary: {
        total: reports.length,
        sightings: reports.filter((report) => report.type === 'sighting').length,
        updates: reports.filter((report) => report.type === 'update').length,
        safe: reports.filter((report) => report.status === 'safe').length,
        injured: reports.filter((report) => report.injured).length
      }
    }
  }

  private async read(): Promise<CommunitySighting[]> {
    try {
      return JSON.parse(await readFile(this.filePath, 'utf8')) as CommunitySighting[]
    } catch (error) {
      if ((error as NodeJS.ErrnoException).code === 'ENOENT') return []
      throw error
    }
  }
}

export function validateCommunitySighting(value: Partial<CommunitySightingInput>) {
  const latitude = Number(value.latitude)
  const longitude = Number(value.longitude)
  if (!['sighting', 'update'].includes(value.type ?? '') || !['spotted', 'moving', 'hiding', 'safe', 'unknown'].includes(value.status ?? '') || !value.description?.trim() || !value.locationLabel?.trim() || !Number.isFinite(latitude) || latitude < -90 || latitude > 90 || !Number.isFinite(longitude) || longitude < -180 || longitude > 180) {
    return null
  }
  return {
    type: value.type!,
    status: value.status!,
    description: value.description.trim().slice(0, 800),
    locationLabel: value.locationLabel.trim().slice(0, 160),
    latitude,
    longitude,
    reporterName: value.reporterName?.trim().slice(0, 80),
    contact: value.contact?.trim().slice(0, 160),
    imageUrl: value.imageUrl?.trim().slice(0, 500)
    ,direction: value.direction?.trim().slice(0, 120)
    ,confidence: value.confidence && ['low', 'medium', 'high'].includes(value.confidence) ? value.confidence : undefined
    ,approached: Boolean(value.approached)
    ,injured: Boolean(value.injured)
  } satisfies CommunitySightingInput
}
