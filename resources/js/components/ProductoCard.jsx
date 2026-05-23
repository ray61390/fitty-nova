import React from 'react'
import { useNavigate } from 'react-router-dom'

export default function ProductoCard({ producto }) {
    const navigate = useNavigate()

    return (
        <div
            onClick={() => navigate(`/producto/${producto.id}`)}
            style={{
                background: '#111',
                border: '1px solid rgba(255,255,255,0.08)',
                overflow: 'hidden',
                cursor: 'pointer',
                transition: 'all 0.3s',
                position: 'relative',
            }}
            onMouseEnter={e => {
                e.currentTarget.style.border = '1px solid rgba(255,255,255,0.3)'
                e.currentTarget.style.transform = 'translateY(-4px)'
            }}
            onMouseLeave={e => {
                e.currentTarget.style.border = '1px solid rgba(255,255,255,0.08)'
                e.currentTarget.style.transform = 'translateY(0)'
            }}
        >
            {/* Imagen */}
            <div style={{
                width: '100%',
                aspectRatio: '3/4',
                background: '#1a1a1a',
                overflow: 'hidden',
                position: 'relative',
            }}>
                {producto.imagenes && producto.imagenes.length > 0 ? (
                    <img
                        src={producto.imagenes[0].url}
                        alt={producto.nombre}
                        style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                    />
                ) : (
                    <div style={{
                        width: '100%', height: '100%',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        color: 'rgba(255,255,255,0.2)', fontSize: '12px', letterSpacing: '2px',
                    }}>
                        SIN IMAGEN
                    </div>
                )}

                {producto.destacado === 1 && (
                    <div style={{
                        position: 'absolute', top: '12px', left: '12px',
                        background: '#fff', color: '#000',
                        fontSize: '10px', letterSpacing: '2px', padding: '4px 10px',
                    }}>
                        DESTACADO
                    </div>
                )}
            </div>

            {/* Info */}
            <div style={{ padding: '16px' }}>
                <p style={{
                    color: 'rgba(255,255,255,0.4)', fontSize: '10px',
                    letterSpacing: '2px', textTransform: 'uppercase', marginBottom: '6px',
                }}>
                    {producto.categoria?.nombre}
                </p>
                <h3 style={{
                    color: '#fff', fontSize: '14px',
                    letterSpacing: '1px', marginBottom: '10px', fontWeight: '400',
                }}>
                    {producto.nombre}
                </h3>
                <p style={{ color: '#fff', fontSize: '16px', fontWeight: '600', letterSpacing: '1px' }}>
                    {parseFloat(producto.precio_base).toFixed(2)} €
                </p>
            </div>
        </div>
    )
}