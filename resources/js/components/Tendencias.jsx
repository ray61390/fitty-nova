import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import api from '../services/api'

export default function Tendencias() {
    const [productos, setProductos] = useState([])
    const navigate = useNavigate()

    useEffect(() => {
        api.get('/tendencias').then(res => setProductos(res.data)).catch(() => {})
    }, [])

    if (productos.length === 0) return null

    return (
        <section style={{ background: '#030f20', padding: '100px 40px', borderTop: '1px solid rgba(99,179,237,0.08)' }}>
            <div style={{ maxWidth: '1400px', margin: '0 auto' }}>
                <div style={{ textAlign: 'center', marginBottom: '60px' }}>
                    <p style={{ color: '#63b3ed', fontSize: '11px', letterSpacing: '4px', textTransform: 'uppercase', marginBottom: '8px' }}>
                        Lo más popular
                    </p>
                    <h2 style={{ fontFamily: "'Bebas Neue'", fontSize: '48px', letterSpacing: '6px', margin: '0 0 16px', background: 'linear-gradient(135deg, #fff 0%, #63b3ed 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
                        TENDENCIAS
                    </h2>
                    <div style={{ width: '60px', height: '1px', background: 'rgba(99,179,237,0.4)', margin: '0 auto' }} />
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: '24px' }}>
                    {productos.map((producto, i) => (
                        <div key={producto.id}
                            onClick={() => navigate(`/producto/${producto.id}`)}
                            style={{
                                background: 'rgba(10,22,40,0.8)',
                                border: '1px solid rgba(99,179,237,0.12)',
                                borderRadius: '8px', overflow: 'hidden',
                                cursor: 'pointer', transition: 'all 0.3s',
                                position: 'relative',
                            }}
                            onMouseEnter={e => { e.currentTarget.style.borderColor = 'rgba(99,179,237,0.4)'; e.currentTarget.style.transform = 'translateY(-4px)' }}
                            onMouseLeave={e => { e.currentTarget.style.borderColor = 'rgba(99,179,237,0.12)'; e.currentTarget.style.transform = 'translateY(0)' }}
                        >
                            {i < 3 && (
                                <div style={{
                                    position: 'absolute', top: '12px', left: '12px', zIndex: 2,
                                    background: i === 0 ? 'linear-gradient(135deg, #f6ad55, #ed8936)' : i === 1 ? 'linear-gradient(135deg, #a0aec0, #718096)' : 'linear-gradient(135deg, #c05621, #9c4221)',
                                    color: '#000', padding: '4px 10px', borderRadius: '4px',
                                    fontSize: '11px', fontWeight: '700', letterSpacing: '1px',
                                }}>
                                    {i === 0 ? '🏆 #1' : i === 1 ? '🥈 #2' : '🥉 #3'}
                                </div>
                            )}
                            <div style={{ aspectRatio: '3/4', background: '#0a1628', overflow: 'hidden' }}>
                                {producto.imagenes?.[0] ? (
                                    <img src={producto.imagenes[0].url} alt={producto.nombre}
                                        style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                ) : (
                                    <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'rgba(255,255,255,0.2)', fontSize: '12px', letterSpacing: '2px' }}>
                                        SIN IMAGEN
                                    </div>
                                )}
                            </div>
                            <div style={{ padding: '16px' }}>
                                <p style={{ color: '#63b3ed', fontSize: '10px', letterSpacing: '2px', textTransform: 'uppercase', marginBottom: '6px' }}>
                                    {producto.categoria?.nombre}
                                </p>
                                <h3 style={{ color: '#fff', fontSize: '14px', letterSpacing: '1px', marginBottom: '10px', fontWeight: '400' }}>
                                    {producto.nombre}
                                </h3>
                                <p style={{ color: '#fff', fontSize: '16px', fontWeight: '600' }}>
                                    {parseFloat(producto.precio_base).toFixed(2)} €
                                </p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    )
}