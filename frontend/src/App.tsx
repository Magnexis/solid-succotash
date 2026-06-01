import { Route, Routes } from 'react-router-dom'
import { Layout } from './components/Layout'
import { DashboardPage } from './pages/DashboardPage'
import { DeveloperPortalPage } from './pages/DeveloperPortalPage'
import { HomePage } from './pages/HomePage'
import { InfoPage } from './pages/InfoPage'
import { SettingsPage } from './pages/SettingsPage'
import { SightingsPage } from './pages/SightingsPage'
import { SightingsHistoryPage } from './pages/SightingsHistoryPage'
import { PublicSearchPage } from './pages/PublicSearchPage'
import { FlyerPage } from './pages/FlyerPage'
import { WizardPage } from './pages/WizardPage'

export default function App() {
  return <Layout><Routes><Route path="/" element={<HomePage />} /><Route path="/start" element={<WizardPage />} /><Route path="/dashboard" element={<DashboardPage />} /><Route path="/sightings" element={<SightingsPage />} /><Route path="/sightings/history" element={<SightingsHistoryPage />} /><Route path="/public-search" element={<PublicSearchPage />} /><Route path="/flyer" element={<FlyerPage />} /><Route path="/settings" element={<SettingsPage />} /><Route path="/resources" element={<InfoPage type="resources" />} /><Route path="/how-it-works" element={<InfoPage type="approach" />} /><Route path="/developers" element={<DeveloperPortalPage />} /></Routes></Layout>
}
