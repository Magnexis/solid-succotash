import { useState } from 'react'
import { ArrowLeft, ArrowRight, Cat } from 'lucide-react'
import { Link, useNavigate } from 'react-router-dom'
import { ChoiceGroup } from '../components/ChoiceGroup'
import { getPrediction } from '../lib/prediction'
import { saveSearch } from '../lib/storage'
import { emptyForm, toggle, type SearchForm } from '../lib/types'

const lifestyleValue = (value: string) => value === 'Indoor only' ? 'indoor' : value === 'Indoor / outdoor' ? 'both' : 'outdoor'

export function WizardPage() {
  const [step, setStep] = useState(1)
  const [form, setForm] = useState<SearchForm>(emptyForm)
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()
  const update = <K extends keyof SearchForm>(key: K, value: SearchForm[K]) => setForm({ ...form, [key]: value })

  async function continueWizard() {
    if (step < 5) return setStep(step + 1)
    setLoading(true)
    const plan = await getPrediction(form)
    saveSearch({ form, plan })
    navigate('/dashboard')
  }

  return (
    <main className="page-shell max-w-5xl py-10">
      <Link to="/" className="inline-flex items-center gap-2 text-sm font-bold text-moss"><ArrowLeft size={15} /> Back home</Link>
      <div className="mt-6 flex gap-2">{[1, 2, 3, 4, 5].map((item) => <div key={item} className={`h-1.5 flex-1 rounded-full ${item <= step ? 'bg-moss' : 'bg-line'}`} />)}</div>
      <div className="mt-9 grid gap-8 md:grid-cols-[1fr_240px]">
        <section>
          <p className="eyebrow">Step {step} of 5</p>
          {step === 1 && <>
            <h1 className="section-title mt-2">Tell us about your cat.</h1>
            <p className="helper">Personality and lifestyle shape the first search radius.</p>
            <TextField label="What is your cat's name?" placeholder="e.g. Juniper" value={form.name} onChange={(value) => update('name', value)} />
            <ChoiceGroup title="Age group" options={['Kitten', 'Adult', 'Senior']} value={form.age} normalize={(value) => value.toLowerCase()} onChange={(value) => update('age', value.toLowerCase())} />
            <ChoiceGroup title="Sex" options={['Female', 'Male', 'Unknown']} value={form.sex} onChange={(value) => update('sex', value)} />
            <ChoiceGroup title="Spayed or neutered?" options={['Yes', 'No', 'Unknown']} value={form.fixed} onChange={(value) => update('fixed', value)} />
            <ChoiceGroup title="Lifestyle" options={['Indoor only', 'Indoor / outdoor', 'Mostly outdoor']} value={form.lifestyle} normalize={lifestyleValue} onChange={(value) => update('lifestyle', lifestyleValue(value))} />
            <ChoiceGroup title="Previous escape experience" options={['Never escaped', 'Previous escapes', 'Unknown']} value={form.escapeHistory} onChange={(value) => update('escapeHistory', value)} />
          </>}
          {step === 2 && <>
            <h1 className="section-title mt-2">How do they usually behave?</h1>
            <p className="helper">Temperament changes whether the first search should prioritize deep cover, routine routes, or accessible neighbor spaces.</p>
            <ChoiceGroup title="Personality and habits (choose any)" options={['Shy', 'Social', 'Food motivated', 'Explorer', 'Climber', 'Hides when stressed', 'Responds to owner', 'Avoids strangers']} value={form.personality} onChange={(value) => update('personality', toggle(form.personality, value))} />
            <ChoiceGroup title="Medical or mobility needs (choose any)" options={['Daily medication', 'Mobility limitations', 'Vision or hearing loss', 'None known']} value={form.medicalNeeds} onChange={(value) => update('medicalNeeds', toggle(form.medicalNeeds, value))} />
          </>}
          {step === 3 && <>
            <h1 className="section-title mt-2">What is the area like?</h1>
            <p className="helper">Nearby cover and local hazards help rank the places worth checking first.</p>
            <ChoiceGroup title="Neighborhood type" options={['Urban', 'Suburban', 'Rural']} value={form.area} normalize={(value) => value.toLowerCase()} onChange={(value) => update('area', value.toLowerCase())} />
            <ChoiceGroup title="Home type" options={['Detached house', 'Townhouse', 'Apartment building', 'Farm or rural property']} value={form.homeType} onChange={(value) => update('homeType', value)} />
            <ChoiceGroup title="Nearby hiding places (choose any)" options={['Bushes or hedges', 'Porches', 'Sheds', 'Garages', 'Parked vehicles', 'Apartments', 'Stairs or balconies', 'Storm drains', 'Woods', 'Fields', 'Barns or workshops', 'Creeks or drainage', 'Construction site', 'Dumpsters or alleys']} value={form.features} onChange={(value) => update('features', toggle(form.features, value))} />
            <ChoiceGroup title="Nearby hazards (choose any)" options={['Busy roads', 'Active construction', 'Loose dogs', 'Standing water', 'None known']} value={form.hazards} onChange={(value) => update('hazards', toggle(form.hazards, value))} />
            <ChoiceGroup title="Weather right now" options={['Clear', 'Rain', 'Wind', 'Heat', 'Snow']} value={form.weather} normalize={(value) => value.toLowerCase()} onChange={(value) => update('weather', value.toLowerCase())} />
          </>}
          {step === 4 && <>
            <h1 className="section-title mt-2">What happened?</h1>
            <p className="helper">Escape circumstances help refine your initial search radius.</p>
            <ChoiceGroup title="How did they get out?" options={['Door escape', 'Window escape', 'Carrier escape', 'Away from home', 'Unknown']} value={form.escape} onChange={(value) => update('escape', value)} />
            <ChoiceGroup title="Anything unusual? (choose any)" options={['Chased', 'Fireworks', 'Loud noise', 'Construction', 'Visitors', 'Vehicle activity', 'House move', 'Recent vet visit']} value={form.event} onChange={(value) => update('event', toggle(form.event, value))} />
            <ChoiceGroup title="How long have they been missing?" options={['Under 1 hour', '1-12 hours', '12-24 hours', '1-3 days', 'Over 3 days']} value={form.when} onChange={(value) => update('when', value)} />
            <TextField label="Last known location" placeholder="e.g. Back porch, 18 Maple Street" value={form.location} onChange={(value) => update('location', value)} />
          </>}
          {step === 5 && <>
            <h1 className="section-title mt-2">What have you checked already?</h1>
            <p className="helper">Your plan will acknowledge completed actions and help you decide where to focus next. Close spaces still deserve a careful re-check.</p>
            <ChoiceGroup title="Completed search actions (choose any)" options={['Searched home thoroughly', 'Checked immediate yard', 'Asked nearest neighbors', 'Checked garages or sheds', 'Searched after dark', 'Posted online', 'Contacted shelters', 'Set up camera or trap']} value={form.searchActions} onChange={(value) => update('searchActions', toggle(form.searchActions, value))} />
          </>}
          <div className="mt-9 flex justify-between">
            {step > 1 ? <button className="btn-soft" onClick={() => setStep(step - 1)}>Back</button> : <span />}
            <button className="btn-primary" disabled={loading} onClick={continueWizard}>{loading ? 'Building plan...' : step === 5 ? 'Build my plan' : 'Continue'} <ArrowRight size={16} /></button>
          </div>
        </section>
        <aside className="card h-fit p-5"><Cat className="text-peach" /><p className="mt-4 text-sm font-bold">A little reassurance</p><p className="mt-2 text-xs leading-5 text-ink/60">Cats often hide silently, even when they hear you. A close, methodical search is a strong first move.</p></aside>
      </div>
    </main>
  )
}

function TextField({ label, placeholder, value, onChange }: { label: string; placeholder: string; value: string; onChange: (value: string) => void }) {
  return <label className="mt-7 block text-sm font-bold">{label}<input value={value} onChange={(event) => onChange(event.target.value)} placeholder={placeholder} className="input" /></label>
}
