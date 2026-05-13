'use client'
import { useState } from 'react'
import { adminUsers, adminStats, revenueData } from '@/data/mockData'
import { Users, DollarSign, TrendingUp, BarChart3 } from 'lucide-react'
import { OverviewTabContent } from './OverviewTabContent'
import { UserManagementTabContent } from './UserManagementTabContent'
import { SubscriptionsTabContent } from './SubscriptionsTabContent'
import { PropSetterTabContent } from './PropSetterTabContent'

type Tab = 'overview' | 'users' | 'subscriptions' | 'prop-setter'

export function Admin() {
  const [tab, setTab] = useState<Tab>('overview')
  const [search, setSearch] = useState('')
  const [propLine, setPropLine] = useState('29.5')
  const [propPlayer, setPropPlayer] = useState('LeBron James')
  const [propStat, setPropStat] = useState('Points')

  const filteredUsers = adminUsers.filter(u =>
    u.name.toLowerCase().includes(search.toLowerCase()) ||
    u.email.toLowerCase().includes(search.toLowerCase())
  )

  const tabs: { key: Tab; label: string; icon: React.ReactNode }[] = [
    { key: 'overview', label: 'Overview', icon: <BarChart3 className="h-4 w-4" /> },
    { key: 'users', label: 'User Management', icon: <Users className="h-4 w-4" /> },
    { key: 'subscriptions', label: 'Subscriptions', icon: <DollarSign className="h-4 w-4" /> },
    { key: 'prop-setter', label: 'Prop of the Day', icon: <TrendingUp className="h-4 w-4" /> },
  ]

  return (
    <div className="p-4 md:p-6 space-y-5 max-w-[1440px] mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-2xl md:text-3xl font-semibold" style={{ color: 'var(--text-primary)' }}>Admin Dashboard</h1>
          <p className="text-sm font-body mt-0.5" style={{ color: 'var(--text-muted)' }}>Platform management & analytics</p>
        </div>
        <span className="badge px-3 py-1.5 text-xs" style={{ backgroundColor: 'var(--coral-light)', color: 'var(--coral)', border: '1px solid var(--coral)' }}>
          🔒 Admin Only
        </span>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 border-b" style={{ borderColor: 'var(--border)' }}>
        {tabs.map(t => (
          <button
            key={t.key}
            onClick={() => setTab(t.key)}
            className="flex items-center gap-2 px-4 py-2.5 text-sm font-body font-medium transition-all border-b-2 -mb-px"
            style={{
              borderBottomColor: tab === t.key ? 'var(--emerald)' : 'transparent',
              color: tab === t.key ? 'var(--emerald)' : 'var(--text-muted)',
            }}
          >
            {t.icon}
            <span className="hidden sm:inline">{t.label}</span>
          </button>
        ))}
      </div>

      {tab === 'overview' && <OverviewTabContent stats={adminStats} revenueData={revenueData} />}
      {tab === 'users' && <UserManagementTabContent search={search} setSearch={setSearch} users={filteredUsers} />}
      {tab === 'subscriptions' && <SubscriptionsTabContent />}
      {tab === 'prop-setter' && (
        <PropSetterTabContent
          propPlayer={propPlayer} setPropPlayer={setPropPlayer}
          propStat={propStat} setPropStat={setPropStat}
          propLine={propLine} setPropLine={setPropLine}
        />
      )}
    </div>
  )
}
