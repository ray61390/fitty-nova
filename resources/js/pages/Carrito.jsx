import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useCart } from '../context/CartContext'
import { useAuth } from '../context/AuthContext'
import Navbar from '../components/Navbar'
import api from '../services/api'

export default function Carrito() {
    const { carrito, quitar, actualizar, vaciar, total } = useCart()
    const { user } = useAuth()
    const navigate = useNavigate()
    const [pedidoOk, setPedidoOk] = useState(false)
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState('')
    const [cupon, setCupon] = useState('')
    const [descuento, setDescuento] = useState(null)
    const [errorCupon, setErrorCupon] = useState('')
    const [aplicandoCupon, setAplicandoCupon] = useState(false)

    const totalConDescuento = descuento
        ? descuento.tipo === 'porcentaje'
            ? total - (total * descuento.valor / 100)
            : total - descuento.valor
        : total

    const aplicarCupon = async () => {
        if (!cupon) return
        setAplicandoCupon(true)
        setErrorCupon('')
        try {
            const res = await api.post('/descuentos/verificar', { codigo: cupon })
            setDescuento(res.data)
        } catch {
            setErrorCupon('Cupón no válido o expirado')
            setDescuento(null)
        } finally {
            setAplicandoCupon(false)
        }
    }

    const handlePedido = async () => {
        if (!user) { navigate('/login'); return }
        if (carrito.length === 0) return
        setLoading(true)
        setError('')
        try {
            const lineas = carrito.map(item => {
                const varianteId = item.variante?.id || item.producto.variantes?.[0]?.id || null
                return { variante_id: varianteId, cantidad: item.cantidad }
            }).filter(l => l.variante_id)

            if (lineas.length === 0) {
                setError('Los productos no tienen tallas disponibles.')
                setLoading(false)
                return
            }

            await api.post('/pedidos', { lineas, descuento_id: descuento?.id || null })
            vaciar()
            setPedidoOk(true)
        } catch {
            setError('Error al procesar el pedido. Inténtalo de nuevo.')
        } finally {
            setLoading(false)
        }
    }

    return (
        <div style={{ minHeight: '100vh', background: '#020818', color: '#fff' }}>
            <style>{`
                @media (max-width: 768px) {
                    .carrito-padding { padding: 100px 16px 60px !important; }
                    .carrito-grid { grid-template-columns: 1fr !important; gap: 24px !important; }
                    .carrito-titulo { font-size: 36px !important; }
                    .carrito-item { padding: 16px !important; }
                    .carrito-img { width: 64px !important; height: 80px !important; }
                    .resumen-sticky { position: static !important; }
                }
            `}</style>
            <Navbar />
            <div className="carrito-padding" style={{ maxWidth: '900px', margin: '0 auto', padding: '120px 40px 80px' }}>
                <p style={{ color: '#63b3ed', fontSize: '11px', letterSpacing: '4px', textTransform: 'uppercase', marginBottom: '8px' }}>
                    Tu selección
                </p>
                <h1 className="carrito-titulo" style={{ fontFamily: "'Bebas Neue'", fontSize: '48px', letterSpacing: '6px', margin: '0 0 48px', background: 'linear-gradient(135deg, #fff 0%, #63b3ed 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
                    CARRITO
                </h1>

                {pedidoOk ? (
                    <div style={{ textAlign: 'center', padding: '80px 0' }}>
                        <p style={{ fontSize: '48px', marginBottom: '16px' }}>✓</p>
                        <h2 style={{ fontFamily: "'Bebas Neue'", fontSize: '36px', letterSpacing: '4px', color: '#68d391', marginBottom: '16px' }}>
                            PEDIDO REALIZADO
                        </h2>
                        <p style={{ color: 'rgba(255,255,255,0.5)', marginBottom: '32px' }}>
                            Gracias por tu compra. Te avisaremos cuando tu pedido esté en camino.
                        </p>
                        <button onClick={() => navigate('/')} style={{
                            background: 'linear-gradient(135deg, #1a3a5c, #0d2137)',
                            color: '#63b3ed', border: '1px solid rgba(99,179,237,0.3)',
                            padding: '14px 40px', fontSize: '12px',
                            letterSpacing: '3px', textTransform: 'uppercase',
                            cursor: 'pointer', borderRadius: '4px',
                        }}>Seguir comprando</button>
                    </div>

                ) : carrito.length === 0 ? (
                    <div style={{ textAlign: 'center', padding: '80px 0' }}>
                        <p style={{ fontSize: '48px', marginBottom: '16px' }}>🛒</p>
                        <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: '14px', marginBottom: '32px' }}>
                            Tu carrito está vacío
                        </p>
                        <button onClick={() => navigate('/')} style={{
                            background: 'linear-gradient(135deg, #1a3a5c, #0d2137)',
                            color: '#63b3ed', border: '1px solid rgba(99,179,237,0.3)',
                            padding: '14px 40px', fontSize: '12px',
                            letterSpacing: '3px', textTransform: 'uppercase',
                            cursor: 'pointer', borderRadius: '4px',
                        }}>Ver productos</button>
                    </div>

                ) : (
                    <div className="carrito-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 320px', gap: '40px' }}>

                        {/* Productos */}
                        <div>
                            {carrito.map((item, i) => (
                                <div key={i} className="carrito-item" style={{
                                    display: 'flex', gap: '16px',
                                    background: 'rgba(10,22,40,0.8)',
                                    border: '1px solid rgba(99,179,237,0.12)',
                                    borderRadius: '8px', padding: '20px', marginBottom: '16px',
                                }}>
                                    <div className="carrito-img" style={{ width: '80px', height: '100px', background: '#0a1628', borderRadius: '4px', overflow: 'hidden', flexShrink: 0 }}>
                                        {item.producto.imagenes?.[0] && (
                                            <img src={item.producto.imagenes[0].url} alt={item.producto.nombre}
                                                style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                        )}
                                    </div>
                                    <div style={{ flex: 1, minWidth: 0 }}>
                                        <p style={{ fontSize: '13px', fontWeight: '500', marginBottom: '4px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{item.producto.nombre}</p>
                                        {item.variante ? (
                                            <p style={{ color: '#63b3ed', fontSize: '12px', marginBottom: '8px' }}>
                                                Talla: {item.variante.talla} {item.variante.color && `· ${item.variante.color}`}
                                            </p>
                                        ) : item.producto.variantes?.[0] ? (
                                            <p style={{ color: 'rgba(99,179,237,0.6)', fontSize: '12px', marginBottom: '8px' }}>
                                                Talla: {item.producto.variantes[0].talla}
                                            </p>
                                        ) : null}
                                        <p style={{ color: '#63b3ed', fontSize: '13px', fontWeight: '600', marginBottom: '10px' }}>
                                            {(parseFloat(item.producto.precio_base) * item.cantidad).toFixed(2)} €
                                        </p>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
                                            <button onClick={() => actualizar(item.producto.id, item.variante?.id, item.cantidad - 1)}
                                                style={{ background: 'rgba(99,179,237,0.1)', border: '1px solid rgba(99,179,237,0.2)', color: '#fff', width: '28px', height: '28px', cursor: 'pointer', borderRadius: '4px', fontSize: '16px' }}>
                                                -
                                            </button>
                                            <span style={{ fontSize: '14px', minWidth: '20px', textAlign: 'center' }}>{item.cantidad}</span>
                                            <button onClick={() => actualizar(item.producto.id, item.variante?.id, item.cantidad + 1)}
                                                style={{ background: 'rgba(99,179,237,0.1)', border: '1px solid rgba(99,179,237,0.2)', color: '#fff', width: '28px', height: '28px', cursor: 'pointer', borderRadius: '4px', fontSize: '16px' }}>
                                                +
                                            </button>
                                            <button onClick={() => quitar(item.producto.id, item.variante?.id)}
                                                style={{ background: 'transparent', border: 'none', color: 'rgba(255,255,255,0.3)', cursor: 'pointer', fontSize: '11px', letterSpacing: '1px', marginLeft: 'auto' }}>
                                                Eliminar
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Resumen */}
                        <div>
                            <div className="resumen-sticky" style={{
                                background: 'rgba(10,22,40,0.8)',
                                border: '1px solid rgba(99,179,237,0.12)',
                                borderRadius: '8px', padding: '28px',
                                position: 'sticky', top: '100px',
                            }}>
                                <p style={{ color: '#63b3ed', fontSize: '11px', letterSpacing: '3px', textTransform: 'uppercase', marginBottom: '24px' }}>
                                    Resumen
                                </p>

                                {/* Cupón */}
                                <div style={{ marginBottom: '20px' }}>
                                    <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: '11px', letterSpacing: '2px', textTransform: 'uppercase', marginBottom: '8px' }}>
                                        Cupón de descuento
                                    </p>
                                    <div style={{ display: 'flex', gap: '8px' }}>
                                        <input type="text" placeholder="FITTY-XXXX" value={cupon}
                                            onChange={e => setCupon(e.target.value.toUpperCase())}
                                            style={{
                                                flex: 1, background: 'rgba(99,179,237,0.04)',
                                                border: '1px solid rgba(99,179,237,0.15)',
                                                color: '#fff', padding: '8px 12px',
                                                fontSize: '12px', outline: 'none', borderRadius: '4px',
                                                letterSpacing: '2px',
                                            }}
                                        />
                                        <button onClick={aplicarCupon} disabled={aplicandoCupon} style={{
                                            background: 'rgba(99,179,237,0.1)',
                                            border: '1px solid rgba(99,179,237,0.3)',
                                            color: '#63b3ed', padding: '8px 12px',
                                            fontSize: '11px', cursor: 'pointer',
                                            borderRadius: '4px', letterSpacing: '1px',
                                        }}>
                                            {aplicandoCupon ? '...' : 'Aplicar'}
                                        </button>
                                    </div>
                                    {errorCupon && <p style={{ color: '#fc8181', fontSize: '11px', marginTop: '6px' }}>{errorCupon}</p>}
                                    {descuento && (
                                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: '8px', background: 'rgba(104,211,145,0.08)', border: '1px solid rgba(104,211,145,0.2)', padding: '8px 12px', borderRadius: '4px' }}>
                                            <span style={{ color: '#68d391', fontSize: '12px' }}>
                                                ✓ {descuento.nombre} (-{descuento.valor}{descuento.tipo === 'porcentaje' ? '%' : '€'})
                                            </span>
                                            <button onClick={() => { setDescuento(null); setCupon('') }} style={{ background: 'none', border: 'none', color: '#fc8181', cursor: 'pointer', fontSize: '16px' }}>×</button>
                                        </div>
                                    )}
                                </div>

                                <div style={{ borderTop: '1px solid rgba(99,179,237,0.1)', paddingTop: '16px', marginBottom: '24px' }}>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                                        <span style={{ color: 'rgba(255,255,255,0.5)', fontSize: '13px' }}>Subtotal</span>
                                        <span style={{ fontSize: '13px' }}>{total.toFixed(2)} €</span>
                                    </div>
                                    {descuento && (
                                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                                            <span style={{ color: '#68d391', fontSize: '13px' }}>Descuento</span>
                                            <span style={{ color: '#68d391', fontSize: '13px' }}>
                                                -{descuento.tipo === 'porcentaje'
                                                    ? (total * descuento.valor / 100).toFixed(2)
                                                    : descuento.valor} €
                                            </span>
                                        </div>
                                    )}
                                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                                        <span style={{ color: 'rgba(255,255,255,0.5)', fontSize: '13px' }}>Envío</span>
                                        <span style={{ color: '#68d391', fontSize: '13px' }}>Gratis</span>
                                    </div>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '16px', paddingTop: '16px', borderTop: '1px solid rgba(99,179,237,0.1)' }}>
                                        <span style={{ fontSize: '14px', fontWeight: '600' }}>Total</span>
                                        <span style={{ fontSize: '18px', fontWeight: '700', color: '#63b3ed' }}>
                                            {totalConDescuento.toFixed(2)} €
                                        </span>
                                    </div>
                                </div>

                                {error && <p style={{ color: '#fc8181', fontSize: '12px', marginBottom: '16px' }}>{error}</p>}

                                <button onClick={handlePedido} disabled={loading} style={{
                                    width: '100%',
                                    background: 'linear-gradient(135deg, #1a3a5c, #0d2137)',
                                    color: '#63b3ed', border: '1px solid rgba(99,179,237,0.3)',
                                    padding: '14px', fontSize: '12px',
                                    letterSpacing: '3px', textTransform: 'uppercase',
                                    cursor: loading ? 'not-allowed' : 'pointer',
                                    borderRadius: '4px', marginBottom: '12px',
                                }}>
                                    {loading ? 'Procesando...' : 'Finalizar Pedido'}
                                </button>
                                <button onClick={() => navigate('/')} style={{
                                    width: '100%', background: 'transparent',
                                    border: '1px solid rgba(255,255,255,0.1)',
                                    color: 'rgba(255,255,255,0.4)', padding: '12px',
                                    fontSize: '11px', letterSpacing: '2px',
                                    textTransform: 'uppercase', cursor: 'pointer', borderRadius: '4px',
                                }}>
                                    Seguir comprando
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    )
}