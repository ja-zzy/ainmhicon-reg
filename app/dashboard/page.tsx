"use client"
import { useAuth } from '../context/authContext'
import { DashboardView } from './view'

export default function Dashboard() {
    const authProps = useAuth()
    return <DashboardView {...authProps} regStartTime={Number(process.env.NEXT_PUBLIC_REG_START_TIME)} regEndTime={Number(process.env.NEXT_PUBLIC_REG_END_TIME)} />
}
