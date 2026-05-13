import { CorrelationMatrix } from '@/components/analytics/CorrelationMatrix'
import { nbaCorrelations } from '@/data/nba'
import { GitBranch } from 'lucide-react'

export default function CorrelationEnginePage() {
  return (
    <div className="p-4 md:p-6 space-y-5 max-w-[1440px] mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="font-display text-2xl md:text-3xl font-semibold flex items-center gap-2" style={{ color: 'var(--text-primary)' }}>
            <GitBranch className="h-7 w-7" style={{ color: 'var(--intel-blue)' }} />
            Player Correlation Engine
          </h1>
          <p className="text-sm font-body mt-1" style={{ color: 'var(--text-muted)' }}>
            Measure correlations between players to optimize parlays. Example: If Player A hits over, probability Player B hits.
          </p>
        </div>
      </div>
      
      <div className="max-w-4xl">
        <CorrelationMatrix correlations={nbaCorrelations} />
      </div>
    </div>
  )
}
