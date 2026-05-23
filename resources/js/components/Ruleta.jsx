import React, { useState, useEffect } from 'react'
import { useAuth } from '../context/AuthContext'
import { useNavigate } from 'react-router-dom'
import api from '../services/api'

export default function Ruleta() {
    const { user } = useAuth()
    const navigate = useNavigate()
    const [girando, setGirando] = useState(false)
    const [resultado, setResultado] = useState(null)
    const [rotacion, setRotacion] = useState(0)
    const [codigo, setCodigo] = useState(null)
    const [copiado, setCopiado] = useState(false)
    const [bloqueado, setBloqueado] = useState(false)
    const [mensajeBloqueado, setMensajeBloqueado] = useState('')
    const [verificando, setVerificando] = useState(false)

    const premios = [
        { label: '10% OFF', color: '#1a3a5c', textColor: '#63b3ed', valor: 10 },
        { label: '5% OFF', color: '#0d2137', textColor: '#90cdf4', valor: 5 },
        { label: '15% OFF', color: '#1e4976', textColor: '#63b3ed', valor: 15 },
        { label: 'NADA', color: '#050d1a', textColor: '#4a5568', valor: 0 },
        { label: '20% OFF', color: '#163354', textColor: '#90cdf4', valor: 20 },
        { label: '5% OFF', color: '#0d2137', textColor: '#90cdf4', valor: 5 },
        { label: '10% OFF', color: '#1a3a5c', textColor: '#63b3ed', valor: 10 },
        { label: 'NADA', color: '#050d1a', textColor: '#4a5568', valor: 0 },
    ]

    const angulo = 360 / premios.length

    useEffect(() => {
        if (user) {
            setVerificando(true)
            api.get('/ruleta/puede-girar').then(res => {
                if (!res.data.puede) {
                    setBloqueado(true)
                    setMensajeBloqueado(res.data.mensaje)
                }
                setVerificando(false)
            }).catch(() => setVerificando(false))
        }
    }, [user])

    const generarCodigo = () => 'FITTY-' + Math.random().toString(36).substring(2, 8).toUpperCase()

    const girar = async () => {
        if (!user) { navigate('/login'); return }
        if (girando || bloqueado) return
        setGirando(true)
        setResultado(null)
        setCodigo(null)
        const gradosSegmento = 360 / premios.length
        const indiceGanador = Math.floor(Math.random() * premios.length)
        const vueltasBase = 1800
        const offsetGanador = 360 - (indiceGanador * gradosSegmento + gradosSegmento / 2)
        const nuevaRotacion = vueltasBase + offsetGanador
        setRotacion(0)
        await new Promise(r => setTimeout(r, 50))
        setRotacion(nuevaRotacion)
        setTimeout(async () => {
            setGirando(false)
            const premio = premios[indiceGanador]
            setResultado(premio)
            if (premio.valor > 0) {
                const nuevoCodigo = generarCodigo()
                try {
                    await api.post('/descuentos', {
                        nombre: `Ruleta ${premio.label}`,
                        tipo: 'porcentaje',
                        valor: premio.valor,
                        codigo: nuevoCodigo,
                        usos_maximos: 1,
                    })
                    setCodigo(nuevoCodigo)
                } catch { setCodigo(nuevoCodigo) }
            }
            await api.post('/ruleta/registrar').catch(() => {})
            setBloqueado(true)
            setMensajeBloqueado('Ya usaste tu giro de este mes. Vuelve el mes que viene.')
        }, 4000)
    }

    const copiarCodigo = () => {
        navigator.clipboard.writeText(codigo)
        setCopiado(true)
        setTimeout(() => setCopiado(false), 2000)
    }

    return (
        <section style={{
            background: '#020818', padding: '100px 40px',
            textAlign: 'center', borderTop: '1px solid rgba(99,179,237,0.08)',
        }}>
            <style>{`
                @media (max-width: 768px) {
                    .ruleta-section-inner { padding: 60px 16px !important; }
                    .ruleta-titulo { font-size: 28px !important; letter-spacing: 3px !important; }
                    .ruleta-subtitulo { font-size: 13px !important; margin-bottom: 32px !important; }
                    .ruleta-svg-wrap { transform: scale(0.75); transform-origin: center top; margin-bottom: -20px !important; }
                    .ruleta-resultado { padding: 24px 16px !important; width: 90vw !important; max-width: 340px !important; }
                    .ruleta-resultado-titulo { font-size: 36px !important; }
                    .ruleta-codigo-wrap { flex-direction: column !important; align-items: stretch !important; }
                    .ruleta-codigo { font-size: 15px !important; letter-spacing: 2px !important; text-align: center; }
                    .ruleta-copiar { width: 100% !important; }
                    .ruleta-boton { width: 90vw !important; max-width: 320px !important; padding: 14px 20px !important; font-size: 11px !important; letter-spacing: 2px !important; }
                    .ruleta-bloqueado { width: 90vw !important; max-width: 340px !important; padding: 16px !important; }
                }
            `}</style>

            <div className="ruleta-section-inner" style={{ padding: '0' }}>
                <p style={{ color: '#63b3ed', fontSize: '11px', letterSpacing: '4px', textTransform: 'uppercase', marginBottom: '8px' }}>
                    Gira y gana
                </p>
                <h2 className="ruleta-titulo" style={{
                    fontFamily: "'Bebas Neue'", fontSize: '48px', letterSpacing: '6px',
                    margin: '0 0 16px', background: 'linear-gradient(135deg, #fff 0%, #63b3ed 100%)',
                    WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
                }}>
                    RULETA DE DESCUENTOS
                </h2>
                <p className="ruleta-subtitulo" style={{ color: 'rgba(255,255,255,0.4)', fontSize: '14px', marginBottom: '60px' }}>
                    Gira la ruleta una vez al mes y consigue un descuento exclusivo
                </p>

                {/* Bloqueado */}
                {bloqueado && !girando && (
                    <div className="ruleta-bloqueado" style={{
                        background: 'rgba(252,129,129,0.08)', border: '1px solid rgba(252,129,129,0.2)',
                        padding: '20px 40px', borderRadius: '8px',
                        display: 'inline-block', marginBottom: '32px',
                    }}>
                        <p style={{ color: '#fc8181', fontSize: '13px', letterSpacing: '2px', margin: 0 }}>
                            {mensajeBloqueado}
                        </p>
                    </div>
                )}

                {/* Ruleta SVG */}
                <div className="ruleta-svg-wrap" style={{ position: 'relative', display: 'inline-block', marginBottom: '48px' }}>
                    <div style={{
                        position: 'absolute', top: '-20px', left: '50%',
                        transform: 'translateX(-50%)',
                        width: 0, height: 0,
                        borderLeft: '12px solid transparent',
                        borderRight: '12px solid transparent',
                        borderTop: '24px solid #63b3ed',
                        zIndex: 10, filter: 'drop-shadow(0 0 8px #63b3ed)',
                    }} />
                    <svg width="320" height="320" style={{
                        transition: girando ? 'transform 4s cubic-bezier(0.17,0.67,0.12,0.99)' : 'none',
                        transform: `rotate(${rotacion}deg)`,
                        filter: bloqueado && !girando
                            ? 'drop-shadow(0 0 10px rgba(252,129,129,0.2)) grayscale(0.5)'
                            : 'drop-shadow(0 0 30px rgba(99,179,237,0.4))',
                        opacity: bloqueado && !girando ? 0.6 : 1,
                    }}>
                        {premios.map((premio, i) => {
                            const startAngle = (i * angulo - 90) * (Math.PI / 180)
                            const endAngle = ((i + 1) * angulo - 90) * (Math.PI / 180)
                            const x1 = 160 + 150 * Math.cos(startAngle)
                            const y1 = 160 + 150 * Math.sin(startAngle)
                            const x2 = 160 + 150 * Math.cos(endAngle)
                            const y2 = 160 + 150 * Math.sin(endAngle)
                            const midAngle = ((i + 0.5) * angulo - 90) * (Math.PI / 180)
                            const tx = 160 + 100 * Math.cos(midAngle)
                            const ty = 160 + 100 * Math.sin(midAngle)
                            return (
                                <g key={i}>
                                    <path d={`M160,160 L${x1},${y1} A150,150 0 0,1 ${x2},${y2} Z`}
                                        fill={premio.color} stroke="rgba(99,179,237,0.3)" strokeWidth="1.5" />
                                    <text x={tx} y={ty} textAnchor="middle" dominantBaseline="middle"
                                        fill={premio.textColor} fontSize="11" fontWeight="700"
                                        transform={`rotate(${(i + 0.5) * angulo}, ${tx}, ${ty})`}>
                                        {premio.label}
                                    </text>
                                </g>
                            )
                        })}
                        <circle cx="160" cy="160" r="22" fill="#020818" stroke="#63b3ed" strokeWidth="2" />
                        <circle cx="160" cy="160" r="8" fill="#63b3ed" />
                    </svg>
                </div>

                {/* Resultado */}
                {resultado && (
                    <div className="ruleta-resultado" style={{
                        background: resultado.valor > 0 ? 'rgba(99,179,237,0.08)' : 'rgba(10,22,40,0.8)',
                        border: `1px solid ${resultado.valor > 0 ? 'rgba(99,179,237,0.3)' : 'rgba(99,179,237,0.1)'}`,
                        padding: '32px 48px', borderRadius: '8px',
                        display: 'inline-block', marginBottom: '32px',
                    }}>
                        {resultado.valor > 0 ? (
                            <>
                                <p style={{ color: '#63b3ed', fontSize: '11px', letterSpacing: '3px', textTransform: 'uppercase', marginBottom: '8px' }}>
                                    Felicidades!
                                </p>
                                <p className="ruleta-resultado-titulo" style={{
                                    fontSize: '48px', fontWeight: '700', color: '#63b3ed',
                                    margin: '0 0 8px', fontFamily: "'Bebas Neue'", letterSpacing: '4px',
                                }}>
                                    {resultado.label}
                                </p>
                                <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: '13px', marginBottom: '20px' }}>
                                    Usa este código en tu próxima compra
                                </p>
                                {codigo && (
                                    <div className="ruleta-codigo-wrap" style={{ display: 'flex', alignItems: 'center', gap: '12px', justifyContent: 'center' }}>
                                        <div className="ruleta-codigo" style={{
                                            background: 'rgba(99,179,237,0.1)', border: '1px solid rgba(99,179,237,0.3)',
                                            padding: '12px 24px', borderRadius: '4px',
                                            fontFamily: 'monospace', fontSize: '18px',
                                            color: '#63b3ed', letterSpacing: '4px',
                                        }}>
                                            {codigo}
                                        </div>
                                        <button className="ruleta-copiar" onClick={copiarCodigo} style={{
                                            background: copiado ? 'rgba(104,211,145,0.1)' : 'rgba(99,179,237,0.1)',
                                            border: `1px solid ${copiado ? 'rgba(104,211,145,0.3)' : 'rgba(99,179,237,0.3)'}`,
                                            color: copiado ? '#68d391' : '#63b3ed',
                                            padding: '12px 20px', borderRadius: '4px',
                                            fontSize: '12px', cursor: 'pointer',
                                            letterSpacing: '2px', textTransform: 'uppercase',
                                        }}>
                                            {copiado ? 'Copiado' : 'Copiar'}
                                        </button>
                                    </div>
                                )}
                            </>
                        ) : (
                            <>
                                <p style={{ color: 'rgba(255,255,255,0.6)', fontSize: '24px', fontWeight: '700', margin: '0 0 8px', fontFamily: "'Bebas Neue'", letterSpacing: '4px' }}>
                                    Sin suerte esta vez
                                </p>
                                <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: '13px' }}>
                                    Vuelve el mes que viene
                                </p>
                            </>
                        )}
                    </div>
                )}

                {/* Botón */}
                <div>
                    <button className="ruleta-boton" onClick={girar}
                        disabled={girando || bloqueado || verificando}
                        style={{
                            background: (girando || bloqueado || verificando) ? 'rgba(99,179,237,0.1)' : 'linear-gradient(135deg, #1a3a5c, #0d2137)',
                            color: (girando || bloqueado || verificando) ? 'rgba(255,255,255,0.3)' : '#63b3ed',
                            border: '1px solid rgba(99,179,237,0.3)',
                            padding: '16px 48px', fontSize: '13px',
                            letterSpacing: '4px', textTransform: 'uppercase',
                            cursor: (girando || bloqueado || verificando) ? 'not-allowed' : 'pointer',
                            borderRadius: '4px', fontWeight: '600', transition: 'all 0.3s',
                        }}>
                        {verificando ? 'Verificando...' : girando ? 'Girando...' : bloqueado ? 'Ya giraste este mes' : 'Girar Ruleta!'}
                    </button>
                    {!user && (
                        <p style={{ color: 'rgba(255,255,255,0.3)', fontSize: '12px', marginTop: '12px', letterSpacing: '1px' }}>
                            Inicia sesión para participar
                        </p>
                    )}
                </div>
            </div>
        </section>
    )
}