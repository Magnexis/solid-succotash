import assert from 'node:assert/strict'
import test from 'node:test'
import { distanceMiles, searchNearbySightings, type SightingSource } from './sightings.js'

const sources: SightingSource[] = [{ id: 'public-feed', name: 'Public feed', kind: 'json', urlTemplate: 'https://example.test/sightings?lat={latitude}&lon={longitude}' }]
const recent = new Date().toISOString()
const old = new Date(Date.now() - 40 * 24 * 60 * 60 * 1000).toISOString()

test('distance calculation returns a useful nearby distance', () => {
  assert.ok(distanceMiles(40, -75, 40.01, -75) > 0.6)
})

test('sighting search filters distance, age, and non-cat reports', async () => {
  const fetcher = async () => new Response(JSON.stringify([
    { id: 'nearby', title: 'Gray cat near porch', species: 'cat', latitude: 40.005, longitude: -75, reportedAt: recent },
    { id: 'far', title: 'Far away cat', species: 'cat', latitude: 41, longitude: -75, reportedAt: recent },
    { id: 'old', title: 'Old cat report', species: 'cat', latitude: 40.005, longitude: -75, reportedAt: old },
    { id: 'dog', title: 'Dog sighting', species: 'dog', latitude: 40.005, longitude: -75, reportedAt: recent }
  ]))
  const result = await searchNearbySightings({ latitude: 40, longitude: -75, radiusMiles: 5, sinceHours: 168 }, sources, fetcher as typeof fetch)
  assert.deepEqual(result.reports.map((report) => report.id), ['nearby'])
  assert.equal(result.reports[0].sourceName, 'Public feed')
})

test('sighting search reads public JSON-LD pages', async () => {
  const html = `<html><script type="application/ld+json">${JSON.stringify({ name: 'Black cat sighting', species: 'cat', geo: { latitude: 40.005, longitude: -75 }, datePosted: recent, url: 'https://example.test/report' })}</script></html>`
  const fetcher = async () => new Response(html)
  const result = await searchNearbySightings({ latitude: 40, longitude: -75, radiusMiles: 5, sinceHours: 168 }, [{ ...sources[0], kind: 'jsonld' }], fetcher as typeof fetch)
  assert.equal(result.reports[0].title, 'Black cat sighting')
  assert.equal(result.reports[0].reportUrl, 'https://example.test/report')
})
