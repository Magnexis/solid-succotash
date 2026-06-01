import cors from 'cors'
import express from 'express'
import { createPrediction, type SearchForm } from '@wheredidmycatgo/prediction-engine'
import { searchNearbySightings, type SightingSearch } from './sightings.js'
import { CommunitySightingStore, validateCommunitySighting } from './communitySightings.js'

const app = express()
const port = Number(process.env.PORT ?? 4000)
const communitySightings = new CommunitySightingStore()

app.use(cors({ origin: process.env.FRONTEND_URL ?? 'http://localhost:5173' }))
app.use(express.json({ limit: '1mb' }))

app.get('/api/health', (_request, response) => {
  response.json({ status: 'ok', service: 'CatWoman API', version: '0.3.0' })
})

app.post('/api/predictions', (request, response) => {
  const form = request.body as Partial<SearchForm>
  if (!form || !Array.isArray(form.personality) || !Array.isArray(form.features) || !Array.isArray(form.event) || !Array.isArray(form.medicalNeeds) || !Array.isArray(form.hazards) || !Array.isArray(form.searchActions)) {
    response.status(400).json({ message: 'Please provide a complete search questionnaire.' })
    return
  }
  response.json(createPrediction(form as SearchForm))
})

app.post('/api/sightings/search', async (request, response) => {
  const search = request.body as Partial<SightingSearch>
  const latitude = Number(search.latitude)
  const longitude = Number(search.longitude)
  const radiusMiles = Number(search.radiusMiles ?? 5)
  const sinceHours = Number(search.sinceHours ?? 168)
  if (!Number.isFinite(latitude) || latitude < -90 || latitude > 90 || !Number.isFinite(longitude) || longitude < -180 || longitude > 180 || !Number.isFinite(radiusMiles) || radiusMiles <= 0 || radiusMiles > 25 || !Number.isFinite(sinceHours) || sinceHours <= 0 || sinceHours > 720) {
    response.status(400).json({ message: 'Provide valid latitude, longitude, radiusMiles (0-25), and sinceHours (0-720).' })
    return
  }
  try {
    const result = await searchNearbySightings({ latitude, longitude, radiusMiles, sinceHours })
    response.json({
      query: { latitude, longitude, radiusMiles, sinceHours },
      ...result,
      notice: result.sources.length ? 'Reports are aggregated from configured public sources. Verify details with the attributed source.' : 'No public sighting sources are configured. Add CATWOMAN_SIGHTING_SOURCES to enable aggregation.'
    })
  } catch (error) {
    response.status(500).json({ message: error instanceof Error ? error.message : 'Unable to search sighting sources.' })
  }
})

app.get('/api/community-sightings', async (request, response) => {
  const latitude = request.query.latitude === undefined ? undefined : Number(request.query.latitude)
  const longitude = request.query.longitude === undefined ? undefined : Number(request.query.longitude)
  const radiusMiles = request.query.radiusMiles === undefined ? undefined : Number(request.query.radiusMiles)
  if ((latitude !== undefined && !Number.isFinite(latitude)) || (longitude !== undefined && !Number.isFinite(longitude)) || (radiusMiles !== undefined && (!Number.isFinite(radiusMiles) || radiusMiles <= 0 || radiusMiles > 25))) {
    response.status(400).json({ message: 'Provide valid optional latitude, longitude, and radiusMiles values.' })
    return
  }
  response.json({ reports: await communitySightings.list({ latitude, longitude, radiusMiles }) })
})

app.get('/api/community-sightings/history', async (request, response) => {
  response.json(await communitySightings.history({
    type: String(request.query.type ?? 'all'),
    status: String(request.query.status ?? 'all'),
    query: String(request.query.query ?? '').slice(0, 120)
  }))
})

app.post('/api/community-sightings', async (request, response) => {
  const report = validateCommunitySighting(request.body)
  if (!report) {
    response.status(400).json({ message: 'Provide a report type, status, description, location label, latitude, and longitude.' })
    return
  }
  response.status(201).json(await communitySightings.create(report))
})

app.use((_request, response) => {
  response.status(404).json({ message: 'Route not found.' })
})

app.listen(port, () => {
  console.log(`wheredoesmycatgo API listening on http://localhost:${port}`)
})
