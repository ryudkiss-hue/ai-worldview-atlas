import { describe, it, expect } from 'vitest'
import { render } from '@testing-library/react'
import { RadarChart, labelLines } from './RadarChart'
import type { AxisVector } from '../lib/scoring'

const sample: AxisVector = {
  teleological: 5, risk: -3, socioEconomic: 2, ontological: 0,
  legalMoral: -1, evolutionary: 4, relational: -2, geopolitical: 1,
}

const comparisonSample: AxisVector = {
  teleological: -5, risk: 3, socioEconomic: -2, ontological: 0,
  legalMoral: 1, evolutionary: -4, relational: 2, geopolitical: -1,
}

describe('RadarChart', () => {
  it('renders an svg chart without crashing', () => {
    const { container } = render(<RadarChart combined={sample} />)
    expect(container.querySelector('svg')).not.toBeNull()
  })

  it('renders exactly one radar series when no comparison profile is supplied', () => {
    const { container } = render(<RadarChart combined={sample} />)
    expect(container.querySelectorAll('.recharts-radar')).toHaveLength(1)
  })

  it('renders two distinct radar series when a comparison profile is supplied', () => {
    const { container } = render(
      <RadarChart combined={sample} comparisonProfile={{ name: 'Extinction-Risk Advocate', coords: comparisonSample }} />,
    )
    expect(container.querySelectorAll('.recharts-radar')).toHaveLength(2)
  })

  it('names both series in a legend', () => {
    const { getByText } = render(
      <RadarChart combined={sample} comparisonProfile={{ name: 'Extinction-Risk Advocate', coords: comparisonSample }} />,
    )
    expect(getByText('You')).toBeInTheDocument()
    expect(getByText('Extinction-Risk Advocate')).toBeInTheDocument()
  })

  it('splits long axis names into two balanced lines for narrow screens', () => {
    expect(labelLines('Relationships')).toEqual(['Relationships'])
    expect(labelLines('Machine Experience')).toEqual(['Machine', 'Experience'])
    expect(labelLines('Openness & Control')).toEqual(['Openness &', 'Control'])
    expect(labelLines('Moral Standing')).toEqual(['Moral', 'Standing'])
  })
})
