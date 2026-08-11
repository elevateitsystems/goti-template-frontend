import { redirect } from 'next/navigation'
import { PlayerDetailView } from '../components/PlayerDetailView'
import { Suspense } from 'react'
import { nbaPlayers } from '@/data/nba/players'
import { moneyline } from '@/server/moneyline'

type Props = {
    params: { id: string }
    searchParams?: {
        season?: string
        sport?: string
    }
}

export default async function PlayerDetailsPage({ params, searchParams }: Props) {
    const sport = searchParams?.sport || 'nba'
    const season = searchParams?.season || '2026'
    const playerId = params.id

    // 1. Fetch data for this specific player
    const playerLog = await moneyline(`/players/${playerId}/stats`, { season, sport }).catch((error) => {
        console.error('Failed to load player logs', error)
        return []
    })
    const playersList = sport.toLowerCase().includes('nba') ? nbaPlayers : []

    const selectedPlayer = playersList?.find((p: any) => p.PlayerID.toString() === playerId)
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
