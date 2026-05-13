import { InjuryImpactPanel } from '@/components/injuries/InjuryImpactPanel'
import { nbaInjuries } from '@/data/nba'
import { AlertTriangle } from 'lucide-react'

export default function InjuryImpactPage() {
  return (
    <div className="p-4 md:p-6 space-y-5 max-w-[1440px] mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="font-display text-2xl md:text-3xl font-semibold flex items-center gap-2" style={{ color: 'var(--text-primary)' }}>
            <AlertTriangle className="h-7 w-7" style={{ color: 'var(--coral)' }} />
            Injury Impact Engine
          </h1>
          <p className="text-sm font-body mt-1" style={{ color: 'var(--text-muted)' }}>
            Adjust projections automatically when players are ruled out. Update usage rate, minutes projections, and stat projections. Trigger alerts when injuries create prop opportunities.
          </p>
        </div>
      </div>
      
      <div className="max-w-3xl">
        <InjuryImpactPanel injuries={nbaInjuries} />
      </div>
    </div>
  )
}
