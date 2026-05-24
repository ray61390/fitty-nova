import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import api from '../services/api'
import Navbar from '../components/Navbar'

export default function Perfil() {
    const { user, logout } = useAuth()
    const navigate = useNavigate()
    const [seccion, setSeccion] = useState('pedidos')
    const [pedidos, setPedidos] = useState([])
    const [deseos, setDeseos] = useState([])
    const [devoluciones, setDevoluciones] = useState([])
    const [resenas, setResenas] = useState([])
    const [loading, setLoading] = useState(true)
    const [formDevolucion, setFormDevolucion] = useState({ pedido_id: '', motivo: '' })
    const [mensajeDevolucion, setMensajeDevolucion] = useState('')
    const [confirmarEliminar, setConfirmarEliminar] = useState(false)
    const [eliminando, setEliminando] = useState(false)

    useEffect(() => {
        if (!user) { navigate('/login'); return }
        Promise.all([
            api.get('/pedidos'),
            api.get('/lista-deseos'),
            api.get('/devoluciones'),
            api.get('/resenas/cliente'),
        ]).then(([pedidosRes, deseosRes, devolucionesRes, resenasRes]) => {
            setPedidos(pedidosRes.data)
            setDeseos(deseosRes.data)
            setDevoluciones(devolucionesRes.data)
            setResenas(resenasRes.data)
            setLoading(false)
        }).catch(() => setLoading(false))
    }, [])

    const enviarDevolucion = async (e) => {
        e.preventDefault()
        try {
            await api.post('/devoluciones', formDevolucion)
            setMensajeDevolucion('✓ Solicitud de devolución enviada correctamente')
            setFormDevolucion({ pedido_id: '', motivo: '' })
            const res = await api.get('/devoluciones')
            setDevoluciones(res.data)
        } catch {
            setMensajeDevolucion('✗ Error al enviar la devolución.')
        }
    }

    const eliminarCuenta = async () => {
        setEliminando(true)
        try {
            await api.delete('/auth/cuenta')
            logout()
            navigate('/')
        } catch {
            setEliminando(false)
            setConfirmarEliminar(false)
        }
    }

    const menuItems = [
        { id: 'pedidos', label: 'Pedidos', icon: '📦' },
        { id: 'deseos', label: 'Deseos', icon: '♡' },
        { id: 'resenas', label: 'Reseñas', icon: '★' },
        { id: 'devoluciones', label: 'Devoluciones', icon: '↩' },
    ]

    const inputStyle = {
        width: '100%', background: 'rgba(99,179,237,0.04)',
        border: '1px solid rgba(99,179,237,0.15)',
        color: '#fff', padding: '12px 16px', fontSize: '13px',
        outline: 'none', borderRadius: '4px', boxSizing: 'border-box',
        marginBottom: '16px',
    }

    const estadoColor = (estado) => {
        const colores = {
            pendiente: '#f6ad55', confirmado: '#63b3ed',
            enviado: '#b794f4', entregado: '#68d391',
            cancelado: '#fc8181', devuelto: '#fc8181',
        }
        return colores[estado] || '#63b3ed'
    }

    return (
        <div style={{ minHeight: '100vh', background: '#020818', color: '#fff' }}>
            <style>{`
                @media (max-width: 768px) {
                    .perfil-padding { padding: 100px 16px 60px !important; }
                    .perfil-header { flex-wrap: wrap; gap: 12px !important; }
                    .perfil-nombre { font-size: 26px !important; letter-spacing: 2px !important; }
                    .perfil-salir { margin-left: 0 !important; width: 100% !important; }
                    .perfil-tabs { overflow-x: auto; flex-wrap: nowrap !important; }
                    .perfil-tabs::-webkit-scrollbar { display: none; }
                    .perfil-tab { padding: 12px 14px !important; font-size: 10px !important; white-space: nowrap; flex-shrink: 0; }
                    .deseos-grid { grid-template-columns: repeat(2, 1fr) !important; gap: 12px !important; }
                    .devoluciones-grid { grid-template-columns: 1fr !important; gap: 24px !important; }
                    .pedido-header { flex-direction: column !important; align-items: flex-start !important; gap: 8px !important; }
                }
                @media (max-width: 400px) {
                    .deseos-grid { grid-template-columns: 1fr !important; }
                }
            `}</style>
            <Navbar />

            {/* Modal confirmar eliminar */}
            {confirmarEliminar && (
                <div style={{
                    position: 'fixed', inset: 0, zIndex: 2000,
                    background: 'rgba(0,0,0,0.8)', backdropFilter: 'blur(4px)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px',
                }}>
                    <div style={{
                        background: '#0a1628', border: '1px solid rgba(252,129,129,0.3)',
                        borderRadius: '8px', padding: '40px', maxWidth: '440px', width: '100%', textAlign: 'center',
                    }}>
                        <p style={{ fontSize: '40px', marginBottom: '16px' }}>⚠️</p>
                        <h3 style={{ fontFamily: "'Bebas Neue'", fontSize: '28px', letterSpacing: '3px', color: '#fc8181', marginBottom: '16px' }}>
                            ELIMINAR CUENTA
                        </h3>
                        <p style={{ color: 'rgba(255,255,255,0.6)', fontSize: '14px', lineHeight: '1.6', marginBottom: '32px' }}>
                            Esta acción es irreversible. Se eliminarán todos tus datos, pedidos, reseñas y lista de deseos permanentemente.
                        </p>
                        <div style={{ display: 'flex', gap: '12px' }}>
                            <button onClick={() => setConfirmarEliminar(false)} style={{
                                flex: 1, background: 'transparent',
                                border: '1px solid rgba(255,255,255,0.2)',
                                color: 'rgba(255,255,255,0.5)', padding: '12px',
                                fontSize: '12px', letterSpacing: '2px', textTransform: 'uppercase',
                                cursor: 'pointer', borderRadius: '4px',
                            }}>Cancelar</button>
                            <button onClick={eliminarCuenta} disabled={eliminando} style={{
                                flex: 1, background: 'rgba(252,129,129,0.1)',
                                border: '1px solid rgba(252,129,129,0.4)',
                                color: '#fc8181', padding: '12px',
                                fontSize: '12px', letterSpacing: '2px', textTransform: 'uppercase',
                                cursor: eliminando ? 'not-allowed' : 'pointer', borderRadius: '4px',
                            }}>
                                {eliminando ? 'Eliminando...' : 'Sí, eliminar'}
                            </button>
                        </div>
                    </div>
                </div>
            )}

            <div className="perfil-padding" style={{ maxWidth: '1100px', margin: '0 auto', padding: '120px 40px 80px' }}>

                {/* Header */}
                <div className="perfil-header" style={{ display: 'flex', alignItems: 'center', gap: '20px', marginBottom: '48px' }}>
                    <div style={{
                        width: '56px', height: '56px', borderRadius: '50%', flexShrink: 0,
                        background: 'linear-gradient(135deg, #63b3ed, #3182ce)',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        fontSize: '22px', fontWeight: '700',
                    }}>
                        {user?.nombre?.[0]?.toUpperCase()}
                    </div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                        <p style={{ color: '#63b3ed', fontSize: '11px', letterSpacing: '3px', textTransform: 'uppercase', marginBottom: '4px' }}>Mi cuenta</p>
                        <h1 className="perfil-nombre" style={{ fontFamily: "'Bebas Neue'", fontSize: '36px', letterSpacing: '4px', margin: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{user?.nombre} {user?.apellidos}</h1>
                        <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: '13px', margin: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{user?.email}</p>
                    </div>
                    <div style={{ display: 'flex', gap: '8px', flexShrink: 0 }}>
                        <button className="perfil-salir" onClick={() => { logout(); navigate('/') }} style={{
                            marginLeft: 'auto', background: 'transparent',
                            border: '1px solid rgba(255,255,255,0.2)',
                            color: 'rgba(255,255,255,0.4)', padding: '8px 20px',
                            fontSize: '11px', letterSpacing: '2px',
                            textTransform: 'uppercase', cursor: 'pointer', borderRadius: '4px',
                        }}>Salir</button>
                        <button onClick={() => setConfirmarEliminar(true)} style={{
                            background: 'transparent',
                            border: '1px solid rgba(252,129,129,0.3)',
                            color: 'rgba(252,129,129,0.6)', padding: '8px 16px',
                            fontSize: '11px', letterSpacing: '2px',
                            textTransform: 'uppercase', cursor: 'pointer', borderRadius: '4px',
                        }}>Eliminar cuenta</button>
                    </div>
                </div>

                {/* Tabs */}
                <div className="perfil-tabs" style={{ display: 'flex', marginBottom: '40px', borderBottom: '1px solid rgba(99,179,237,0.1)', flexWrap: 'wrap', overflowX: 'auto' }}>
                    {menuItems.map(item => (
                        <button className="perfil-tab" key={item.id} onClick={() => setSeccion(item.id)} style={{
                            background: 'transparent', border: 'none',
                            borderBottom: seccion === item.id ? '2px solid #63b3ed' : '2px solid transparent',
                            color: seccion === item.id ? '#fff' : 'rgba(255,255,255,0.4)',
                            padding: '12px 24px', fontSize: '12px',
                            letterSpacing: '2px', textTransform: 'uppercase',
                            cursor: 'pointer', transition: 'all 0.2s',
                        }}>
                            {item.icon} {item.label}
                        </button>
                    ))}
                </div>

                {loading ? (
                    <p style={{ color: '#63b3ed', letterSpacing: '4px', fontSize: '12px' }}>CARGANDO...</p>
                ) : (
                    <>
                        {/* Pedidos */}
                        {seccion === 'pedidos' && (
                            <div>
                                {pedidos.length === 0 ? (
                                    <div style={{ textAlign: 'center', padding: '60px 0' }}>
                                        <p style={{ fontSize: '48px', marginBottom: '16px' }}>📦</p>
                                        <p style={{ color: 'rgba(255,255,255,0.4)' }}>No tienes pedidos todavía</p>
                                        <button onClick={() => navigate('/')} style={{
                                            marginTop: '24px', background: 'linear-gradient(135deg, #1a3a5c, #0d2137)',
                                            color: '#63b3ed', border: '1px solid rgba(99,179,237,0.3)',
                                            padding: '12px 32px', fontSize: '11px', letterSpacing: '3px',
                                            textTransform: 'uppercase', cursor: 'pointer', borderRadius: '4px',
                                        }}>Ver productos</button>
                                    </div>
                                ) : (
                                    <div style={{ display: 'grid', gap: '16px' }}>
                                        {pedidos.map(pedido => (
                                            <div key={pedido.id} style={{
                                                background: 'rgba(10,22,40,0.8)',
                                                border: '1px solid rgba(99,179,237,0.12)',
                                                borderRadius: '8px', padding: '20px',
                                            }}>
                                                <div className="pedido-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '16px' }}>
                                                    <div>
                                                        <p style={{ color: '#63b3ed', fontSize: '11px', letterSpacing: '2px', textTransform: 'uppercase', marginBottom: '4px' }}>
                                                            Pedido #{pedido.id}
                                                        </p>
                                                        <p style={{ fontSize: '13px', color: 'rgba(255,255,255,0.5)', margin: 0 }}>
                                                            {new Date(pedido.created_at).toLocaleDateString('es-ES')}
                                                        </p>
                                                    </div>
                                                    <div style={{ textAlign: 'right' }}>
                                                        <p style={{ fontSize: '18px', fontWeight: '700', color: '#63b3ed', marginBottom: '6px' }}>
                                                            {parseFloat(pedido.total).toFixed(2)} €
                                                        </p>
                                                        <span style={{
                                                            background: `${estadoColor(pedido.estado)}15`,
                                                            border: `1px solid ${estadoColor(pedido.estado)}40`,
                                                            color: estadoColor(pedido.estado),
                                                            padding: '4px 10px', borderRadius: '4px',
                                                            fontSize: '10px', letterSpacing: '2px', textTransform: 'uppercase',
                                                        }}>
                                                            {pedido.estado}
                                                        </span>
                                                    </div>
                                                </div>
                                                {pedido.lineas?.length > 0 && (
                                                    <div style={{ borderTop: '1px solid rgba(99,179,237,0.08)', paddingTop: '16px', display: 'grid', gap: '12px' }}>
                                                        {pedido.lineas.map(linea => (
                                                            <div key={linea.id}
                                                                onClick={() => linea.variante?.producto?.id && navigate(`/producto/${linea.variante.producto.id}`)}
                                                                style={{ display: 'flex', gap: '12px', alignItems: 'center', cursor: 'pointer' }}
                                                            >
                                                                <div style={{ width: '44px', height: '44px', background: '#0a1628', borderRadius: '4px', overflow: 'hidden', flexShrink: 0 }}>
                                                                    {linea.variante?.producto?.imagenes?.[0] ? (
                                                                        <img src={linea.variante.producto.imagenes[0].url}
                                                                            alt={linea.variante.producto.nombre}
                                                                            style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                                                    ) : (
                                                                        <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'rgba(255,255,255,0.2)', fontSize: '16px' }}>👗</div>
                                                                    )}
                                                                </div>
                                                                <div style={{ flex: 1, minWidth: 0 }}>
                                                                    <p style={{ fontSize: '12px', margin: '0 0 2px', fontWeight: '500', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                                                                        {linea.variante?.producto?.nombre || 'Producto'}
                                                                    </p>
                                                                    <p style={{ fontSize: '11px', color: 'rgba(255,255,255,0.4)', margin: 0 }}>
                                                                        Talla: {linea.variante?.talla} · {linea.cantidad} ud{linea.cantidad > 1 ? 's' : ''}
                                                                    </p>
                                                                </div>
                                                                <p style={{ color: '#63b3ed', fontSize: '12px', fontWeight: '600', margin: 0, flexShrink: 0 }}>
                                                                    {parseFloat(linea.precio_unit * linea.cantidad).toFixed(2)} €
                                                                </p>
                                                            </div>
                                                        ))}
                                                    </div>
                                                )}
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        )}

                        {/* Lista de deseos */}
                        {seccion === 'deseos' && (
                            <div>
                                {deseos.length === 0 ? (
                                    <div style={{ textAlign: 'center', padding: '60px 0' }}>
                                        <p style={{ fontSize: '48px', marginBottom: '16px' }}>♡</p>
                                        <p style={{ color: 'rgba(255,255,255,0.4)' }}>Tu lista de deseos está vacía</p>
                                        <button onClick={() => navigate('/')} style={{
                                            marginTop: '24px', background: 'linear-gradient(135deg, #1a3a5c, #0d2137)',
                                            color: '#63b3ed', border: '1px solid rgba(99,179,237,0.3)',
                                            padding: '12px 32px', fontSize: '11px', letterSpacing: '3px',
                                            textTransform: 'uppercase', cursor: 'pointer', borderRadius: '4px',
                                        }}>Ver productos</button>
                                    </div>
                                ) : (
                                    <div className="deseos-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '20px' }}>
                                        {deseos.map(item => (
                                            <div key={item.producto_id}
                                                onClick={() => navigate(`/producto/${item.producto_id}`)}
                                                style={{
                                                    background: 'rgba(10,22,40,0.8)',
                                                    border: '1px solid rgba(99,179,237,0.12)',
                                                    borderRadius: '8px', overflow: 'hidden',
                                                    cursor: 'pointer', transition: 'all 0.3s',
                                                }}
                                                onMouseEnter={e => e.currentTarget.style.borderColor = 'rgba(99,179,237,0.4)'}
                                                onMouseLeave={e => e.currentTarget.style.borderColor = 'rgba(99,179,237,0.12)'}
                                            >
                                                <div style={{ aspectRatio: '1', background: '#0a1628', overflow: 'hidden' }}>
                                                    {item.producto?.imagenes?.[0] ? (
                                                        <img src={item.producto.imagenes[0].url} alt={item.producto.nombre}
                                                            style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                                    ) : (
                                                        <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'rgba(255,255,255,0.2)', fontSize: '11px' }}>SIN IMAGEN</div>
                                                    )}
                                                </div>
                                                <div style={{ padding: '12px' }}>
                                                    <p style={{ fontSize: '12px', marginBottom: '6px', fontWeight: '500', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{item.producto?.nombre}</p>
                                                    <p style={{ color: '#63b3ed', fontSize: '13px', fontWeight: '600' }}>
                                                        {parseFloat(item.producto?.precio_base || 0).toFixed(2)} €
                                                    </p>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        )}

                        {/* Mis Reseñas */}
                        {seccion === 'resenas' && (
                            <div>
                                {resenas.length === 0 ? (
                                    <div style={{ textAlign: 'center', padding: '60px 0' }}>
                                        <p style={{ fontSize: '48px', marginBottom: '16px' }}>★</p>
                                        <p style={{ color: 'rgba(255,255,255,0.4)' }}>No has escrito ninguna reseña todavía</p>
                                        <button onClick={() => navigate('/')} style={{
                                            marginTop: '24px', background: 'linear-gradient(135deg, #1a3a5c, #0d2137)',
                                            color: '#63b3ed', border: '1px solid rgba(99,179,237,0.3)',
                                            padding: '12px 32px', fontSize: '11px', letterSpacing: '3px',
                                            textTransform: 'uppercase', cursor: 'pointer', borderRadius: '4px',
                                        }}>Ver productos</button>
                                    </div>
                                ) : (
                                    <div style={{ display: 'grid', gap: '16px' }}>
                                        {resenas.map(r => (
                                            <div key={r.id} style={{
                                                background: 'rgba(10,22,40,0.8)',
                                                border: '1px solid rgba(99,179,237,0.12)',
                                                borderRadius: '8px', padding: '20px',
                                            }}>
                                                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '12px', gap: '12px', flexWrap: 'wrap' }}>
                                                    <div>
                                                        <p style={{ color: '#63b3ed', fontSize: '12px', letterSpacing: '2px', textTransform: 'uppercase', margin: '0 0 6px', cursor: 'pointer' }}
                                                            onClick={() => navigate(`/producto/${r.producto_id}`)}>
                                                            {r.producto?.nombre}
                                                        </p>
                                                        <div style={{ display: 'flex', gap: '2px' }}>
                                                            {Array(5).fill(0).map((_, i) => (
                                                                <span key={i} style={{ color: i < r.puntuacion ? '#f6ad55' : 'rgba(255,255,255,0.2)' }}>★</span>
                                                            ))}
                                                        </div>
                                                    </div>
                                                    <span style={{
                                                        background: r.aprobada ? 'rgba(104,211,145,0.1)' : 'rgba(246,173,85,0.1)',
                                                        border: `1px solid ${r.aprobada ? 'rgba(104,211,145,0.3)' : 'rgba(246,173,85,0.3)'}`,
                                                        color: r.aprobada ? '#68d391' : '#f6ad55',
                                                        padding: '4px 10px', borderRadius: '4px',
                                                        fontSize: '10px', letterSpacing: '2px', textTransform: 'uppercase',
                                                        height: 'fit-content',
                                                    }}>
                                                        {r.aprobada ? 'Publicada' : 'Pendiente'}
                                                    </span>
                                                </div>
                                                {r.titulo && <p style={{ fontWeight: '600', marginBottom: '8px', fontSize: '13px' }}>{r.titulo}</p>}
                                                <p style={{ color: 'rgba(255,255,255,0.6)', fontSize: '13px', lineHeight: '1.6' }}>{r.comentario}</p>
                                                <p style={{ color: 'rgba(255,255,255,0.3)', fontSize: '11px', marginTop: '12px' }}>
                                                    {new Date(r.created_at).toLocaleDateString('es-ES')}
                                                </p>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        )}

                        {/* Devoluciones */}
                        {seccion === 'devoluciones' && (
                            <div>
                                <div className="devoluciones-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '40px' }}>
                                    <div>
                                        <h3 style={{ fontFamily: "'Bebas Neue'", fontSize: '24px', letterSpacing: '3px', marginBottom: '24px', color: '#63b3ed' }}>
                                            SOLICITAR DEVOLUCIÓN
                                        </h3>
                                        <div style={{ background: 'rgba(10,22,40,0.8)', border: '1px solid rgba(99,179,237,0.12)', borderRadius: '8px', padding: '24px' }}>
                                            <form onSubmit={enviarDevolucion}>
                                                <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: '11px', letterSpacing: '2px', textTransform: 'uppercase', marginBottom: '8px' }}>Pedido</p>
                                                <select value={formDevolucion.pedido_id}
                                                    onChange={e => setFormDevolucion({ ...formDevolucion, pedido_id: e.target.value })}
                                                    style={{ ...inputStyle, background: '#020818' }} required>
                                                    <option value="">Selecciona un pedido</option>
                                                    {pedidos.map(p => (
                                                        <option key={p.id} value={p.id}>
                                                            Pedido #{p.id} — {parseFloat(p.total).toFixed(2)} € ({p.estado})
                                                        </option>
                                                    ))}
                                                </select>
                                                <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: '11px', letterSpacing: '2px', textTransform: 'uppercase', marginBottom: '8px' }}>Motivo</p>
                                                <textarea placeholder="Explica el motivo de la devolución..."
                                                    value={formDevolucion.motivo}
                                                    onChange={e => setFormDevolucion({ ...formDevolucion, motivo: e.target.value })}
                                                    rows={4} style={{ ...inputStyle, resize: 'vertical' }} required />
                                                {mensajeDevolucion && (
                                                    <p style={{ color: mensajeDevolucion.includes('✓') ? '#68d391' : '#fc8181', fontSize: '13px', marginBottom: '16px' }}>
                                                        {mensajeDevolucion}
                                                    </p>
                                                )}
                                                <button type="submit" style={{
                                                    background: 'linear-gradient(135deg, #1a3a5c, #0d2137)',
                                                    color: '#63b3ed', border: '1px solid rgba(99,179,237,0.3)',
                                                    padding: '12px 32px', fontSize: '12px',
                                                    letterSpacing: '3px', textTransform: 'uppercase',
                                                    cursor: 'pointer', borderRadius: '4px', width: '100%',
                                                }}>Enviar Solicitud</button>
                                            </form>
                                        </div>
                                    </div>
                                    <div>
                                        <h3 style={{ fontFamily: "'Bebas Neue'", fontSize: '24px', letterSpacing: '3px', marginBottom: '24px', color: '#63b3ed' }}>
                                            MIS DEVOLUCIONES
                                        </h3>
                                        {devoluciones.length === 0 ? (
                                            <div style={{ background: 'rgba(10,22,40,0.8)', border: '1px solid rgba(99,179,237,0.12)', borderRadius: '8px', padding: '40px', textAlign: 'center' }}>
                                                <p style={{ fontSize: '32px', marginBottom: '12px' }}>↩</p>
                                                <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: '13px' }}>No tienes devoluciones</p>
                                            </div>
                                        ) : (
                                            <div style={{ display: 'grid', gap: '12px' }}>
                                                {devoluciones.map(d => (
                                                    <div key={d.id} style={{ background: 'rgba(10,22,40,0.8)', border: '1px solid rgba(99,179,237,0.12)', borderRadius: '8px', padding: '20px' }}>
                                                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                                                            <p style={{ color: '#63b3ed', fontSize: '11px', letterSpacing: '2px', textTransform: 'uppercase' }}>
                                                                Pedido #{d.pedido_id}
                                                            </p>
                                                            <span style={{
                                                                background: d.estado === 'aprobada' ? 'rgba(104,211,145,0.1)' : d.estado === 'rechazada' ? 'rgba(252,129,129,0.1)' : 'rgba(99,179,237,0.1)',
                                                                border: `1px solid ${d.estado === 'aprobada' ? 'rgba(104,211,145,0.3)' : d.estado === 'rechazada' ? 'rgba(252,129,129,0.3)' : 'rgba(99,179,237,0.3)'}`,
                                                                color: d.estado === 'aprobada' ? '#68d391' : d.estado === 'rechazada' ? '#fc8181' : '#63b3ed',
                                                                padding: '3px 10px', borderRadius: '4px',
                                                                fontSize: '10px', letterSpacing: '2px', textTransform: 'uppercase',
                                                            }}>{d.estado}</span>
                                                        </div>
                                                        <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: '13px' }}>{d.motivo}</p>
                                                        {d.importe && (
                                                            <p style={{ color: '#68d391', fontSize: '14px', fontWeight: '600', marginTop: '8px' }}>
                                                                Importe: {parseFloat(d.importe).toFixed(2)} €
                                                            </p>
                                                        )}
                                                    </div>
                                                ))}
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        )}
                    </>
                )}
            </div>
        </div>
    )
}