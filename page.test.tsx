'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'

export default function Home() {
  const [status, setStatus] = useState('Conectando...')
  const [profiles, setProfiles] = useState(0)
  const [defects, setDefects] = useState(0)

  const supabase = createClient()

  useEffect(() => {
    loadData()
  }, [])

  async function loadData() {
    const { count: profileCount, error: profileError } = await supabase
      .from('profiles')
      .select('*', { count: 'exact', head: true })

    const { count: defectCount, error: defectError } = await supabase
      .from('defects')
      .select('*', { count: 'exact', head: true })

    if (profileError || defectError) {
      console.error(profileError || defectError)
      setStatus('Error conectando con Supabase ❌')
      return
    }

    setProfiles(profileCount ?? 0)
    setDefects(defectCount ?? 0)
    setStatus('Conexión con Supabase funcionando ✅')
  }

  async function createTestDefect() {
    const { error } = await supabase
      .from('defects')
      .insert({
        ccid: 'TEST-001',
        kycid: 'KYC-TEST-001',
        case_type: 'individual',
        analyst_id: 'da1e9555-1e99-4792-a470-e62e1220db2c',
        analyst_context: 'Defecto creado desde el frontend para prueba.',
      })

    if (error) {
      console.error('ERROR COMPLETO:', JSON.stringify(error, null, 2))
      alert(`Error completo:\n${JSON.stringify(error, null, 2)}`)
      return
    }

    alert('Defecto guardado en Supabase ✅')
    loadData()
  }

  return (
    <main
      style={{
        minHeight: '100vh',
        background: '#0a0a0a',
        color: 'white',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '20px',
        fontFamily: 'Arial, sans-serif',
      }}
    >
      <h1>KYC Defect Hub</h1>

      <p>{status}</p>

      <p>
        Profiles en Supabase: <strong>{profiles}</strong>
      </p>

      <p>
        Defects en Supabase: <strong>{defects}</strong>
      </p>

      <button
        onClick={createTestDefect}
        style={{
          padding: '12px 20px',
          borderRadius: '8px',
          border: 'none',
          cursor: 'pointer',
          fontWeight: 'bold',
        }}
      >
        Crear defecto de prueba
      </button>
    </main>
  )
}
