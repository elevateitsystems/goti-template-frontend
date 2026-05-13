import { PlayerDetail } from './components/PlayerDetail'

export default function Page({ params }: { params: { id: string } }) {
  return (
    <PlayerDetail playerId={Number(params.id)} />
  )
}
