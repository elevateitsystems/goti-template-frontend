import { PlayerAnalytics } from './components/PlayerAnalytics'
import { redirect } from 'next/navigation'
import { Suspense } from 'react'

type Props = {
  searchParams?: {
    season?: string
    sport?: string
    playerId?: string
  }
}

export default async function PlayerAnalyticsPage({ searchParams }: Props) {
  const baseUrl = process.env.NEXT_PUBLIC_BACKEND_URL
  const sport = searchParams?.sport || 'nba'

  // Fetch active players first to determine default if needed
  const allActivePlayer = await fetch(`${baseUrl}/players/active-players?sports=${sport}`)
  const allActivePlayerJson = await allActivePlayer.json()
  const activePlayersList = allActivePlayerJson.data || []

  const defaultPlayerId = activePlayersList.length > 0 ? activePlayersList[0].PlayerID.toString() : ''
  const playerId = searchParams?.playerId || defaultPlayerId
  const season = searchParams?.season || '2026'

  // If missing required params, redirect to apply defaults to URL
  if (!searchParams?.playerId || !searchParams?.season || !searchParams?.sport) {
    const newParams = new URLSearchParams()
    newParams.set('season', season)
    newParams.set('sport', sport)
    if (playerId) newParams.set('playerId', playerId)
    redirect(`/player-analytics?${newParams.toString()}`)
  }

  const params = new URLSearchParams()
  if (playerId) params.set('playerId', playerId);
  if (season) params.set('season', season); else params.set('season', '2026')
  if (sport) params.set('sport', sport); else params.set('sport', 'nba')

  const GAME_LOG_URL = `${baseUrl}/players/game-logs?${params.toString()}`
  const SEASON_STATS_URL = `${baseUrl}/players/season-stats-by-player?${params.toString()}`

  const [playerLog, seasonStats] = await Promise.all([
    fetch(GAME_LOG_URL),
    fetch(SEASON_STATS_URL)
  ])

  const playerLogJson = await playerLog.json()
  const seasonStatsJson = await seasonStats.json()

  return (
    <Suspense fallback={<div className="p-8">Loading analytics...</div>}>
      <PlayerAnalytics
        playerLog={playerLogJson.data || []}
        seasonStats={seasonStatsJson.data || {}}
        allActivePlayer={activePlayersList}
      />
    </Suspense>
  )
}

