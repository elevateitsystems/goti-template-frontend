import { redirect } from 'next/navigation'
import { PlayerDetailView } from '../components/PlayerDetailView'
import { Suspense } from 'react'
import { nbaPlayers } from '@/data/nba/players'
import { moneyline } from '@/server/moneyline'

type Props = {
    params: Promise<{ id: string }>
    searchParams: Promise<{
        season?: string
        sport?: string
    }>
}

export default async function PlayerDetailsPage({ params, searchParams }: Props) {
    const [{ id: playerId }, query] = await Promise.all([params, searchParams])
    const sport = query.sport || 'nba'
    const season = query.season || '2026'

    // 1. Fetch data for this specific player
    const playerLog = await moneyline(`/players/${playerId}/stats`, { season, sport }).catch((error) => {
        console.error('Failed to load player logs', error)
        return []
    })
    const playersList = sport.toLowerCase().includes('nba') ? nbaPlayers : []

    const selectedPlayer = playersList.find((player) => player.PlayerID.toString() === playerId)
    if (!selectedPlayer) {
        redirect('/player-analytics')
    }

    return (
        <Suspense fallback={<div className="p-8">Loading player details...</div>}>
            <PlayerDetailView
                player={selectedPlayer}
                playerLog={Array.isArray(playerLog) ? playerLog : []}
                season={season}
            />
        </Suspense>
    )
}
