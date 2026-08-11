import { PlayerAnalytics } from './components/PlayerAnalytics'
import { redirect } from 'next/navigation'
import { Suspense } from 'react'
import { nbaPlayers } from '@/data/nba/players'
import { moneyline } from '@/server/moneyline'

type Props = {
  searchParams?: {
    season?: string
    sport?: string
    playerId?: string
  }
}

export default async function PlayerAnalyticsPage({ searchParams }: Props) {
  const sport = searchParams?.sport || 'nba'

  const activePlayersList = sport.toLowerCase().includes('nba') ? nbaPlayers : []

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

  const playerLog = playerId
    ? await moneyline(`/players/${playerId}/stats`, { season, sport }).catch((error) => {
        console.error('Failed to load player logs', error)
        return []
      })
    : []
  const seasonStats = activePlayersList.find((player) => String(player.PlayerID) === playerId) || {}

  return (
    <Suspense fallback={<div className="p-8">Loading analytics...</div>}>
      <PlayerAnalytics
        playerLog={Array.isArray(playerLog) ? playerLog : []}
        seasonStats={seasonStats}
        allActivePlayer={activePlayersList}
      />
    </Suspense>
  )
}
