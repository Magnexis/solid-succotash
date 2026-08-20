import assert from 'node:assert/strict'
import { mkdtemp, rm } from 'node:fs/promises'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import test from 'node:test'
import { CommunitySightingStore, validateCommunitySighting } from './communitySightings.js'

test('community sightings can be created and listed by distance', async () => {
  const directory = await mkdtemp(join(tmpdir(), 'catwoman-'))
  const store = new CommunitySightingStore(join(directory, 'sightings.json'))
  await store.create({ type: 'sighting', status: 'spotted', description: 'Gray cat near hedge', locationLabel: 'Maple Street', latitude: 40.005, longitude: -75 })
  await store.create({ type: 'update', status: 'safe', description: 'Far away report', locationLabel: 'Elsewhere', latitude: 42, longitude: -75 })
  const reports = await store.list({ latitude: 40, longitude: -75, radiusMiles: 5 })
  assert.equal(reports.length, 1)
  assert.equal(reports[0].locationLabel, 'Maple Street')
  await rm(directory, { recursive: true })
})

test('community sighting validation rejects incomplete posts', () => {
  assert.equal(validateCommunitySighting({ type: 'sighting', status: 'spotted', latitude: 40, longitude: -75 }), null)
})

test('community sighting validation preserves verification details', () => {
  const report = validateCommunitySighting({ type: 'sighting', status: 'moving', description: 'Orange cat crossed the yard', locationLabel: 'Oak Street', latitude: 40, longitude: -75, direction: 'Toward the park', confidence: 'high', approached: true, injured: false })
  assert.equal(report?.direction, 'Toward the park')
  assert.equal(report?.confidence, 'high')
  assert.equal(report?.approached, true)
})

test('community sighting history preserves all posts and returns filtered summary', async () => {
  const directory = await mkdtemp(join(tmpdir(), 'catwoman-history-'))
  const store = new CommunitySightingStore(join(directory, 'sightings.json'))
  await store.create({ type: 'sighting', status: 'moving', description: 'Orange cat near park', locationLabel: 'Oak Street', latitude: 40, longitude: -75 })
  await store.create({ type: 'update', status: 'safe', description: 'Cat returned home', locationLabel: 'Maple Street', latitude: 40, longitude: -75 })
  const history = await store.history({ status: 'safe' })
  assert.equal(history.summary.total, 2)
  assert.equal(history.summary.safe, 1)
  assert.equal(history.reports.length, 1)
  await rm(directory, { recursive: true })
})

test('community sightings preserve concurrent posts without dropping reports', async () => {
  const directory = await mkdtemp(join(tmpdir(), 'catwoman-concurrent-'))
  const store = new CommunitySightingStore(join(directory, 'sightings.json'))
  const count = 32

  await Promise.all(
    Array.from({ length: count }, (_, index) =>
      store.create({
        type: 'sighting',
        status: 'spotted',
        description: `Concurrent report ${index}`,
        locationLabel: `Location ${index}`,
        latitude: 40,
        longitude: -75
      })
    )
  )

  const reports = await store.list()
  assert.equal(reports.length, count)
  assert.equal(new Set(reports.map((report) => report.id)).size, count)
  await rm(directory, { recursive: true })
})
