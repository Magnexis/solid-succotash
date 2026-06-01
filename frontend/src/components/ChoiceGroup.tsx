import { Check } from 'lucide-react'

type Props = {
  title: string
  options: string[]
  value: string | string[]
  onChange: (value: string) => void
  normalize?: (value: string) => string
}

export function ChoiceGroup({ title, options, value, onChange, normalize = (item) => item }: Props) {
  const active = (option: string) =>
    Array.isArray(value) ? value.includes(option) : value === normalize(option)

  return (
    <fieldset className="mt-7">
      <legend className="mb-3 text-sm font-bold">{title}</legend>
      <div className="grid gap-2 sm:grid-cols-3">
        {options.map((option) => (
          <button
            type="button"
            key={option}
            onClick={() => onChange(option)}
            className={`choice ${active(option) ? 'choice-on' : ''}`}
            aria-pressed={active(option)}
          >
            <span className="flex items-center justify-between gap-2">
              {option}
              {active(option) && <Check size={15} />}
            </span>
          </button>
        ))}
      </div>
    </fieldset>
  )
}
