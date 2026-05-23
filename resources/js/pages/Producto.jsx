import React, { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { useCart } from '../context/CartContext'
import api from '../services/api'
import Navbar from '../components/Navbar'

export default function Producto() {
    const { id } = useParams()
    const { user } = useAuth()
    const { añadir } = useCart()
    const navigate = useNavigate()
    const [producto, setProducto] = useState(null)
    const [tallaSeleccionada, setTallaSeleccionada] = useState(null)
    const [mensaje, setMensaje] = useState('')
    const [resena, setResena] = useState({ puntuacion: 5, titulo: '', comentario: '' })
    const [enviandoResena, setEnviandoResena] = useState(false)
    const [mensajeResena, setMensajeResena] = useState('')

    useEffect(() => {
        api.get(`/productos/${id}`).then(res => setProducto(res.data))
    }, [id])

    const añadirDeseos = async () => {
        if (!user) { navigate('/login'); return }
        try {
            await api.post('/lista-deseos', { producto_id: id })
            setMensaje('✓ Añadido a tu lista de deseos')
        } catch {
            setMensaje('Ya está en tu lista de deseos')
        }
    }

    const añadirCarrito = () => {
        if (!user) { navigate('/login'); return }
        añadir(producto, tallaSeleccionada)
        setMensaje('✓ Añadido al carrito')
    }

    const enviarResena = async (e) => {
        e.preventDefault()
        if (!user) { navigate('/login'); return }
        setEnviandoResena(true)
        try {
            await api.post(`/productos/${id}/resenas`, resena)
            setMensajeResena('✓ Reseña enviada correctamente. Será revisada antes de publicarse.')
            setResena({ puntuacion: 5, titulo: '', comentario: '' })
        } catch {
            setMensajeResena('✗ Error al enviar la reseña. Ya escribiste una reseña para este producto.')
        } finally {
            setEnviandoResena(false)
        }
    }

    if (!producto) return (
        <div style={{ minHeight: '100vh', background: '#020818', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#63b3ed', letterSpacing: '4px' }}>
            CARGANDO...
        </div>
    )

    return (
        <div style={{ minHeight: '100vh', background: '#020818', color: '#fff' }}>
            <style>{`
                @media (max-width: 768px) {
                    .producto-padding { padding: 100px 16px 60px !important; }
                    .producto-grid { grid-template-columns: 1fr !important; gap: 32px !important; }
                    .producto-titulo { font-size: 36px !important; }
                    .producto-precio { font-size: 28px !important; }
                    .producto-imagen { aspect-ratio: 1/1 !important; max-height: 360px !important; }
                    .producto-acciones { flex-direction: column !important; }
                    .producto-carrito { width: 100% !important; }
                    .producto-deseos { width: 100% !important; padding: 14px !important; }
                }
            `}</style>
            <Navbar />
            <div className="producto-padding" style={{ maxWidth: '1200px', margin: '0 auto', padding: '120px 40px 80px' }}>

                <button onClick={() => navigate(-1)} style={{
                    background: 'transparent', border: 'none',
                    color: 'rgba(255,255,255,0.4)', fontSize: '12px',
                    letterSpacing: '2px', cursor: 'pointer', marginBottom: '40px',
                    textTransform: 'uppercase', padding: 0,
                }}>← Volver</button>

                <div className="producto-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '80px' }}>

                    {/* Imagen */}
                    <div className="producto-imagen" style={{
                        background: 'rgba(10,22,40,0.8)',
                        border: '1px solid rgba(99,179,237,0.12)',
                        borderRadius: '8px', overflow: 'hidden', aspectRatio: '3/4',
                    }}>
                        {producto.imagenes?.[0] ? (
                            <img src={producto.imagenes[0].url} alt={producto.nombre}
                                style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                        ) : (
                            <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'rgba(255,255,255,0.2)', letterSpacing: '4px', fontSize: '12px' }}>
                                SIN IMAGEN
                            </div>
                        )}
                    </div>

                    {/* Info */}
                    <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                        <p style={{ color: '#63b3ed', fontSize: '11px', letterSpacing: '3px', textTransform: 'uppercase', marginBottom: '12px' }}>
                            {producto.categoria?.nombre}
                        </p>
                        <h1 className="producto-titulo" style={{ fontFamily: "'Bebas Neue'", fontSize: '48px', letterSpacing: '4px', margin: '0 0 24px', lineHeight: 1 }}>
                            {producto.nombre}
                        </h1>
                        <p className="producto-precio" style={{ fontSize: '36px', fontWeight: '700', color: '#63b3ed', marginBottom: '32px' }}>
                            {parseFloat(producto.precio_base).toFixed(2)} €
                        </p>

                        {producto.descripcion && (
                            <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: '14px', lineHeight: '1.7', marginBottom: '32px' }}>
                                {producto.descripcion}
                            </p>
                        )}

                        {producto.variantes?.length > 0 && (
                            <div style={{ marginBottom: '32px' }}>
                                <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: '11px', letterSpacing: '3px', textTransform: 'uppercase', marginBottom: '12px' }}>
                                    Talla
                                </p>
                                <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                                    {producto.variantes.map(v => (
                                        <button key={v.id} onClick={() => setTallaSeleccionada(v)}
                                            disabled={v.stock === 0}
                                            style={{
                                                padding: '10px 16px',
                                                background: tallaSeleccionada?.id === v.id ? '#fff' : 'transparent',
                                                color: tallaSeleccionada?.id === v.id ? '#000' : v.stock === 0 ? 'rgba(255,255,255,0.2)' : '#fff',
                                                border: `1px solid ${tallaSeleccionada?.id === v.id ? '#fff' : v.stock === 0 ? 'rgba(255,255,255,0.1)' : 'rgba(255,255,255,0.3)'}`,
                                                fontSize: '13px', cursor: v.stock === 0 ? 'not-allowed' : 'pointer',
                                                letterSpacing: '1px',
                                            }}>
                                            {v.talla}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        )}

                        {mensaje && (
                            <p style={{ color: mensaje.includes('✓') ? '#68d391' : '#f6ad55', fontSize: '13px', marginBottom: '16px' }}>
                                {mensaje}
                            </p>
                        )}

                        <div className="producto-acciones" style={{ display: 'flex', gap: '12px' }}>
                            <button className="producto-carrito" onClick={añadirCarrito} style={{
                                flex: 1,
                                background: 'linear-gradient(135deg, #1a3a5c, #0d2137)',
                                color: '#63b3ed', border: '1px solid rgba(99,179,237,0.3)',
                                padding: '16px', fontSize: '12px',
                                letterSpacing: '3px', textTransform: 'uppercase',
                                cursor: 'pointer', borderRadius: '4px', fontWeight: '600',
                            }}>
                                Añadir al Carrito
                            </button>
                            <button className="producto-deseos" onClick={añadirDeseos} style={{
                                padding: '16px 20px', background: 'transparent',
                                border: '1px solid rgba(255,255,255,0.2)',
                                color: '#fff', fontSize: '18px', cursor: 'pointer', borderRadius: '4px',
                            }}>♡</button>
                        </div>
                    </div>
                </div>

                {/* Reseñas */}
                {producto.resenas?.filter(r => r.aprobada).length > 0 && (
                    <div style={{ marginTop: '80px' }}>
                        <h2 style={{ fontFamily: "'Bebas Neue'", fontSize: '32px', letterSpacing: '4px', marginBottom: '32px', color: '#63b3ed' }}>
                            RESEÑAS
                        </h2>
                        <div style={{ display: 'grid', gap: '16px' }}>
                            {producto.resenas.filter(r => r.aprobada).map(r => (
                                <div key={r.id} style={{
                                    background: 'rgba(10,22,40,0.8)',
                                    border: '1px solid rgba(99,179,237,0.12)',
                                    padding: '24px', borderRadius: '8px',
                                }}>
                                    <div style={{ display: 'flex', gap: '4px', marginBottom: '8px' }}>
                                        {Array(5).fill(0).map((_, i) => (
                                            <span key={i} style={{ color: i < r.puntuacion ? '#f6ad55' : 'rgba(255,255,255,0.2)' }}>★</span>
                                        ))}
                                    </div>
                                    {r.titulo && <p style={{ fontWeight: '600', marginBottom: '8px' }}>{r.titulo}</p>}
                                    <p style={{ color: 'rgba(255,255,255,0.6)', fontSize: '14px' }}>{r.comentario}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* Formulario reseña */}
                {user && (
                    <div style={{ marginTop: '48px' }}>
                        <h2 style={{ fontFamily: "'Bebas Neue'", fontSize: '32px', letterSpacing: '4px', marginBottom: '32px', color: '#63b3ed' }}>
                            ESCRIBIR RESEÑA
                        </h2>
                        <div style={{
                            background: 'rgba(10,22,40,0.8)',
                            border: '1px solid rgba(99,179,237,0.12)',
                            padding: '32px', borderRadius: '8px',
                        }}>
                            <form onSubmit={enviarResena}>
                                <div style={{ marginBottom: '24px' }}>
                                    <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: '11px', letterSpacing: '3px', textTransform: 'uppercase', marginBottom: '12px' }}>
                                        Puntuación
                                    </p>
                                    <div style={{ display: 'flex', gap: '8px' }}>
                                        {[1, 2, 3, 4, 5].map(n => (
                                            <button key={n} type="button" onClick={() => setResena({ ...resena, puntuacion: n })}
                                                style={{
                                                    background: 'transparent', border: 'none',
                                                    fontSize: '28px', cursor: 'pointer',
                                                    color: n <= resena.puntuacion ? '#f6ad55' : 'rgba(255,255,255,0.2)',
                                                }}>★</button>
                                        ))}
                                    </div>
                                </div>

                                <div style={{ marginBottom: '16px' }}>
                                    <input type="text" placeholder="Título de tu reseña"
                                        value={resena.titulo}
                                        onChange={e => setResena({ ...resena, titulo: e.target.value })}
                                        style={{
                                            width: '100%', background: 'rgba(99,179,237,0.04)',
                                            border: '1px solid rgba(99,179,237,0.15)',
                                            color: '#fff', padding: '12px 16px', fontSize: '13px',
                                            outline: 'none', borderRadius: '4px', boxSizing: 'border-box',
                                        }}
                                    />
                                </div>

                                <div style={{ marginBottom: '24px' }}>
                                    <textarea placeholder="Cuéntanos tu experiencia..."
                                        value={resena.comentario}
                                        onChange={e => setResena({ ...resena, comentario: e.target.value })}
                                        rows={4}
                                        style={{
                                            width: '100%', background: 'rgba(99,179,237,0.04)',
                                            border: '1px solid rgba(99,179,237,0.15)',
                                            color: '#fff', padding: '12px 16px', fontSize: '13px',
                                            outline: 'none', borderRadius: '4px', boxSizing: 'border-box', resize: 'vertical',
                                        }}
                                    />
                                </div>

                                {mensajeResena && (
                                    <p style={{ color: mensajeResena.includes('✓') ? '#68d391' : '#fc8181', fontSize: '13px', marginBottom: '16px' }}>
                                        {mensajeResena}
                                    </p>
                                )}

                                <button type="submit" disabled={enviandoResena} style={{
                                    background: 'linear-gradient(135deg, #1a3a5c, #0d2137)',
                                    color: '#63b3ed', border: '1px solid rgba(99,179,237,0.3)',
                                    padding: '12px 32px', fontSize: '12px',
                                    letterSpacing: '3px', textTransform: 'uppercase',
                                    cursor: enviandoResena ? 'not-allowed' : 'pointer', borderRadius: '4px',
                                    width: '100%',
                                }}>
                                    {enviandoResena ? 'Enviando...' : 'Enviar Reseña'}
                                </button>
                            </form>
                        </div>
                    </div>
                )}
            </div>
        </div>
    )
}