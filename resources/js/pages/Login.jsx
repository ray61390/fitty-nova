import React, { useState, useEffect } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

export default function Login() {
    const [modo, setModo] = useState('login')
    const [rol, setRol] = useState(null)
    const [form, setForm] = useState({ nombre: '', apellidos: '', email: '', password: '' })
    const [error, setError] = useState('')
    const [loading, setLoading] = useState(false)
    const { login, register } = useAuth()
    const navigate = useNavigate()
    const [searchParams] = useSearchParams()

    useEffect(() => {
        if (searchParams.get('modo') === 'registro') setModo('registro')
    }, [])

    const handleSubmit = async (e) => {
        e.preventDefault()
        setLoading(true)
        setError('')
        try {
            let usuario
            if (modo === 'login') {
                usuario = await login(form.email, form.password)
            } else {
                usuario = await register({ ...form, rol })
            }
            if (usuario.rol_id === 1) navigate('/admin')
            else if (usuario.rol_id === 2) navigate('/vendedor')
            else navigate('/')
        } catch (err) {
            setError('Credenciales incorrectas o error en el servidor')
        } finally {
            setLoading(false)
        }
    }

    const inputStyle = {
        width: '100%',
        background: 'transparent',
        border: '1px solid rgba(255,255,255,0.2)',
        color: '#fff',
        padding: '14px 16px',
        fontSize: '13px',
        letterSpacing: '1px',
        outline: 'none',
        boxSizing: 'border-box',
        marginBottom: '20px',
    }

    return (
        <div style={{
            minHeight: '100vh',
            background: '#050a1a',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '20px 16px',
        }}>
            <style>{`
                @media (max-width: 768px) {
                    .login-box {
                        padding: 32px 20px !important;
                    }
                    .login-rol-grid {
                        flex-direction: column !important;
                    }
                    .login-rol-btn {
                        padding: 16px !important;
                    }
                }
            `}</style>

            <div className="login-box" style={{
                width: '100%',
                maxWidth: '440px',
                padding: '48px 40px',
                border: '1px solid rgba(255,255,255,0.1)',
            }}>
                <div style={{ textAlign: 'center', marginBottom: '40px' }}>
                    <img src="/logo.png" alt="Fitt-y-Nova" style={{ height: '60px' }} />
                </div>

                {/* Tabs */}
                <div style={{ display: 'flex', marginBottom: '32px', borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
                    {['login', 'registro'].map(tab => (
                        <button key={tab} onClick={() => { setModo(tab); setRol(null) }} style={{
                            flex: 1, background: 'transparent', border: 'none',
                            borderBottom: modo === tab ? '1px solid #fff' : 'none',
                            color: modo === tab ? '#fff' : 'rgba(255,255,255,0.4)',
                            padding: '12px', fontSize: '12px',
                            letterSpacing: '3px', textTransform: 'uppercase', cursor: 'pointer',
                        }}>
                            {tab === 'login' ? 'Iniciar Sesión' : 'Registrarse'}
                        </button>
                    ))}
                </div>

                {/* LOGIN */}
                {modo === 'login' && (
                    <form onSubmit={handleSubmit}>
                        <input type="email" placeholder="Email" value={form.email}
                            onChange={e => setForm({ ...form, email: e.target.value })}
                            style={inputStyle} />
                        <input type="password" placeholder="Contraseña" value={form.password}
                            onChange={e => setForm({ ...form, password: e.target.value })}
                            style={inputStyle} />
                        {error && <p style={{ color: '#ff4444', fontSize: '12px', marginBottom: '16px', textAlign: 'center' }}>{error}</p>}
                        <button type="submit" disabled={loading} style={{
                            width: '100%', background: '#fff', color: '#000',
                            border: 'none', padding: '14px', fontSize: '12px',
                            letterSpacing: '3px', textTransform: 'uppercase', cursor: 'pointer',
                        }}>
                            {loading ? 'Cargando...' : 'Entrar'}
                        </button>
                        <p style={{ textAlign: 'center', marginTop: '16px' }}>
                            <a href="/forgot-password" style={{ color: 'rgba(255,255,255,0.4)', fontSize: '12px', textDecoration: 'none' }}>
                                ¿Olvidaste tu contraseña?
                            </a>
                        </p>
                    </form>
                )}

                {/* REGISTRO - Paso 1: elegir rol */}
                {modo === 'registro' && !rol && (
                    <div>
                        <p style={{ color: 'rgba(255,255,255,0.6)', fontSize: '13px', textAlign: 'center', marginBottom: '28px', letterSpacing: '1px' }}>
                            ¿Cómo quieres unirte a Fitt-y-Nova?
                        </p>
                        <div className="login-rol-grid" style={{ display: 'flex', gap: '16px' }}>
                            <button className="login-rol-btn" onClick={() => setRol('cliente')} style={{
                                flex: 1, background: 'transparent',
                                border: '1px solid rgba(255,255,255,0.3)',
                                color: '#fff', padding: '24px 16px',
                                cursor: 'pointer', textAlign: 'center', transition: 'all 0.3s',
                            }}
                            onMouseEnter={e => e.currentTarget.style.border = '1px solid #fff'}
                            onMouseLeave={e => e.currentTarget.style.border = '1px solid rgba(255,255,255,0.3)'}
                            >
                                <div style={{ fontSize: '28px', marginBottom: '10px' }}>🛍️</div>
                                <div style={{ fontSize: '12px', letterSpacing: '3px', textTransform: 'uppercase' }}>Cliente</div>
                                <div style={{ fontSize: '11px', color: 'rgba(255,255,255,0.4)', marginTop: '6px' }}>Comprar y explorar</div>
                            </button>
                            <button className="login-rol-btn" onClick={() => setRol('vendedor')} style={{
                                flex: 1, background: 'transparent',
                                border: '1px solid rgba(255,255,255,0.3)',
                                color: '#fff', padding: '24px 16px',
                                cursor: 'pointer', textAlign: 'center', transition: 'all 0.3s',
                            }}
                            onMouseEnter={e => e.currentTarget.style.border = '1px solid #fff'}
                            onMouseLeave={e => e.currentTarget.style.border = '1px solid rgba(255,255,255,0.3)'}
                            >
                                <div style={{ fontSize: '28px', marginBottom: '10px' }}>🏪</div>
                                <div style={{ fontSize: '12px', letterSpacing: '3px', textTransform: 'uppercase' }}>Vendedor</div>
                                <div style={{ fontSize: '11px', color: 'rgba(255,255,255,0.4)', marginTop: '6px' }}>Vender productos</div>
                            </button>
                        </div>
                    </div>
                )}

                {/* REGISTRO - Paso 2: formulario */}
                {modo === 'registro' && rol && (
                    <form onSubmit={handleSubmit}>
                        <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: '11px', letterSpacing: '2px', textTransform: 'uppercase', marginBottom: '20px', textAlign: 'center' }}>
                            Registro como {rol} <button onClick={() => setRol(null)} style={{ background: 'none', border: 'none', color: 'rgba(255,255,255,0.3)', cursor: 'pointer', fontSize: '11px' }}>← cambiar</button>
                        </p>
                        <input type="text" placeholder="Nombre" value={form.nombre}
                            onChange={e => setForm({ ...form, nombre: e.target.value })}
                            style={inputStyle} />
                        <input type="text" placeholder="Apellidos" value={form.apellidos}
                            onChange={e => setForm({ ...form, apellidos: e.target.value })}
                            style={inputStyle} />
                        <input type="email" placeholder="Email" value={form.email}
                            onChange={e => setForm({ ...form, email: e.target.value })}
                            style={inputStyle} />
                        <input type="password" placeholder="Contraseña" value={form.password}
                            onChange={e => setForm({ ...form, password: e.target.value })}
                            style={inputStyle} />
                        {error && <p style={{ color: '#ff4444', fontSize: '12px', marginBottom: '16px', textAlign: 'center' }}>{error}</p>}
                        <button type="submit" disabled={loading} style={{
                            width: '100%', background: '#fff', color: '#000',
                            border: 'none', padding: '14px', fontSize: '12px',
                            letterSpacing: '3px', textTransform: 'uppercase', cursor: 'pointer',
                        }}>
                            {loading ? 'Cargando...' : 'Crear cuenta'}
                        </button>
                    </form>
                )}

                <p style={{ textAlign: 'center', marginTop: '24px' }}>
                    <a href="/" style={{ color: 'rgba(255,255,255,0.4)', fontSize: '12px', textDecoration: 'none' }}>
                        ← Volver a la tienda
                    </a>
                </p>
            </div>
        </div>
    )
}