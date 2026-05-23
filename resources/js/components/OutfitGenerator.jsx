import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import api from '../services/api'

export default function OutfitGenerator() {
    const navigate = useNavigate()
    const [productos, setProductos] = useState([])
    const [outfit, setOutfit] = useState(null)
    const [generando, setGenerando] = useState(false)

    useEffect(() => {
        api.get('/productos?page=1').then(res => setProductos(res.data.data || []))
    }, [])

    const generarOutfit = () => {
        if (productos.length < 3) return
        setGenerando(true)
        setTimeout(() => {
            const tops = productos.filter(p => [5, 1].includes(p.categoria_id))
            const bottoms = productos.filter(p => [2, 6, 7].includes(p.categoria_id))
            const accesorios = productos.filter(p => [3, 4, 8, 11, 12].includes(p.categoria_id))
            const getRandom = arr => arr[Math.floor(Math.random() * arr.length)]
            setOutfit({
                top: getRandom(tops.length > 0 ? tops : productos),
                bottom: getRandom(bottoms.length > 0 ? bottoms : productos),
                accesorio: getRandom(accesorios.length > 0 ? accesorios : productos),
            })
            setGenerando(false)
        }, 800)
    }

    return (
        <section style={{ background: '#030f20', padding: '100px 40px', borderTop: '1px solid rgba(99,179,237,0.08)' }}>
            <style>{`
                @media (max-width: 768px) {
                    .outfit-padding { padding: 60px 16px !important; }
                    .outfit-titulo { font-size: 32px !important; letter-spacing: 4px !important; }
                    .outfit-grid { grid-template-columns: 1fr !important; gap: 16px !important; }
                    .outfit-btn { width: 100% !important; max-width: 320px !important; padding: 14px 20px !important; font-size: 12px !important; letter-spacing: 2px !important; }
                }
                @media (max-width: 480px) {
                    .outfit-titulo { font-size: 26px !important; letter-spacing: 3px !important; }
                }
            `}</style>

            <div className="outfit-padding" style={{ maxWidth: '1200px', margin: '0 auto', padding: '0' }}>
                <div style={{ textAlign: 'center', marginBottom: '60px' }}>
                    <p style={{ color: '#63b3ed', fontSize: '11px', letterSpacing: '4px', textTransform: 'uppercase', marginBottom: '8px' }}>
                        Estilo personalizado
                    </p>
                    <h2 className="outfit-titulo" style={{
                        fontFamily: "'Bebas Neue'", fontSize: '48px', letterSpacing: '6px',
                        margin: '0 0 16px', background: 'linear-gradient(135deg, #fff 0%, #63b3ed 100%)',
                        WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
                    }}>
                        GENERADOR DE OUTFITS
                    </h2>
                    <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: '14px', marginBottom: '40px' }}>
                        Deja que la IA combine prendas por ti
                    </p>
                    <button className="outfit-btn" onClick={generarOutfit} disabled={generando} style={{
                        background: generando ? 'rgba(99,179,237,0.1)' : 'linear-gradient(135deg, #1a3a5c, #0d2137)',
                        color: generando ? 'rgba(255,255,255,0.3)' : '#63b3ed',
                        border: '1px solid rgba(99,179,237,0.3)',
                        padding: '16px 48px', fontSize: '13px',
                        letterSpacing: '4px', textTransform: 'uppercase',
                        cursor: generando ? 'not-allowed' : 'pointer',
                        borderRadius: '4px', fontWeight: '600', transition: 'all 0.3s',
                    }}>
                        {generando ? 'Generando...' : 'Generar Outfit'}
                    </button>
                </div>

                {outfit && (
                    <div>
                        <p style={{ color: 'rgba(255,255,255,0.3)', fontSize: '11px', letterSpacing: '3px', textTransform: 'uppercase', textAlign: 'center', marginBottom: '32px' }}>
                            Tu outfit de hoy
                        </p>
                        <div className="outfit-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '24px' }}>
                            {[
                                { label: 'Top', producto: outfit.top },
                                { label: 'Bottom', producto: outfit.bottom },
                                { label: 'Accesorio', producto: outfit.accesorio },
                            ].map(({ label, producto }) => producto && (
                                <div key={label} onClick={() => navigate(`/producto/${producto.id}`)} style={{
                                    background: 'rgba(10,22,40,0.8)',
                                    border: '1px solid rgba(99,179,237,0.12)',
                                    borderRadius: '8px', overflow: 'hidden',
                                    cursor: 'pointer', transition: 'all 0.3s',
                                }}
                                onMouseEnter={e => e.currentTarget.style.borderColor = 'rgba(99,179,237,0.4)'}
                                onMouseLeave={e => e.currentTarget.style.borderColor = 'rgba(99,179,237,0.12)'}
                                >
                                    <div style={{ aspectRatio: '3/4', overflow: 'hidden', background: '#0a1628', position: 'relative' }}>
                                        {producto.imagenes?.[0] ? (
                                            <img src={producto.imagenes[0].url} alt={producto.nombre}
                                                style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                        ) : (
                                            <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'rgba(255,255,255,0.2)', fontSize: '12px', letterSpacing: '2px' }}>
                                                SIN IMAGEN
                                            </div>
                                        )}
                                        <div style={{
                                            position: 'absolute', top: '12px', left: '12px',
                                            background: 'rgba(99,179,237,0.15)', border: '1px solid rgba(99,179,237,0.3)',
                                            padding: '4px 10px', borderRadius: '4px',
                                            color: '#63b3ed', fontSize: '10px', letterSpacing: '2px',
                                        }}>
                                            {label}
                                        </div>
                                    </div>
                                    <div style={{ padding: '16px' }}>
                                        <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: '10px', letterSpacing: '2px', textTransform: 'uppercase', marginBottom: '6px' }}>
                                            {producto.categoria?.nombre}
                                        </p>
                                        <p style={{ fontSize: '13px', marginBottom: '8px', fontWeight: '500', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                                            {producto.nombre}
                                        </p>
                                        <p style={{ color: '#63b3ed', fontSize: '15px', fontWeight: '600' }}>
                                            {parseFloat(producto.precio_base).toFixed(2)} €
                                        </p>
                                    </div>
                                </div>
                            ))}
                        </div>
                        <div style={{ textAlign: 'center', marginTop: '32px' }}>
                            <p style={{ color: 'rgba(255,255,255,0.3)', fontSize: '12px', letterSpacing: '1px', marginBottom: '16px' }}>
                                Total del outfit: <span style={{ color: '#63b3ed', fontWeight: '600' }}>
                                    {(
                                        parseFloat(outfit.top?.precio_base || 0) +
                                        parseFloat(outfit.bottom?.precio_base || 0) +
                                        parseFloat(outfit.accesorio?.precio_base || 0)
                                    ).toFixed(2)} €
                                </span>
                            </p>
                        </div>
                    </div>
                )}
            </div>
        </section>
    )
}