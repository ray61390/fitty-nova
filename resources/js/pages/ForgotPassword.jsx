import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import api from '../services/api'

export default function ForgotPassword() {
    const [email, setEmail] = useState('')
    const [mensaje, setMensaje] = useState('')
    const [loading, setLoading] = useState(false)
    const navigate = useNavigate()

    const handleSubmit = async (e) => {
        e.preventDefault()
        setLoading(true)
        setMensaje('')
        try {
            await api.post('/forgot-password', { email })
            setMensaje('✓ Email enviado. Revisa tu bandeja de entrada.')
        } catch {
            setMensaje('✗ No existe ninguna cuenta con ese email.')
        } finally {
            setLoading(false)
        }
    }

    return (
        <div style={{
            minHeight: '100vh', background: '#020818',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}>
            <div style={{
                width: '100%', maxWidth: '440px',
                padding: '48px 40px',
                border: '1px solid rgba(99,179,237,0.15)',
                borderRadius: '8px',
                background: 'rgba(10,22,40,0.8)',
            }}>
                <div style={{ textAlign: 'center', marginBottom: '40px' }}>
                    <img src="/logo.png" alt="Fitt-y-Nova" style={{ height: '60px', marginBottom: '16px' }} />
                    <h2 style={{ fontFamily: "'Bebas Neue'", fontSize: '28px', letterSpacing: '4px', color: '#fff', margin: 0 }}>
                        RECUPERAR CONTRASEÑA
                    </h2>
                    <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: '13px', marginTop: '8px' }}>
                        Te enviaremos un enlace a tu email
                    </p>
                </div>

                <form onSubmit={handleSubmit}>
                    <input type="email" placeholder="Tu email" value={email}
                        onChange={e => setEmail(e.target.value)}
                        style={{
                            width: '100%', background: 'transparent',
                            border: '1px solid rgba(99,179,237,0.2)',
                            color: '#fff', padding: '14px 16px',
                            fontSize: '13px', outline: 'none',
                            borderRadius: '4px', boxSizing: 'border-box', marginBottom: '20px',
                        }} required />

                    {mensaje && (
                        <p style={{
                            color: mensaje.includes('✓') ? '#68d391' : '#fc8181',
                            fontSize: '13px', marginBottom: '16px', textAlign: 'center',
                        }}>{mensaje}</p>
                    )}

                    <button type="submit" disabled={loading} style={{
                        width: '100%', background: 'linear-gradient(135deg, #1a3a5c, #0d2137)',
                        color: '#63b3ed', border: '1px solid rgba(99,179,237,0.3)',
                        padding: '14px', fontSize: '12px',
                        letterSpacing: '3px', textTransform: 'uppercase',
                        cursor: loading ? 'not-allowed' : 'pointer', borderRadius: '4px',
                        marginBottom: '16px',
                    }}>
                        {loading ? 'Enviando...' : 'Enviar enlace'}
                    </button>

                    <button type="button" onClick={() => navigate('/login')} style={{
                        width: '100%', background: 'transparent', border: 'none',
                        color: 'rgba(255,255,255,0.4)', fontSize: '12px',
                        cursor: 'pointer', letterSpacing: '1px',
                    }}>
                        ← Volver al login
                    </button>
                </form>
            </div>
        </div>
    )
}