import React, { useEffect, useState } from 'react'
import { useAuth } from '../context/AuthContext'
import { useNavigate } from 'react-router-dom'
import api from '../services/api'

export default function Vendedor() {
    const { user, logout } = useAuth()
    const navigate = useNavigate()
    const [stats, setStats] = useState(null)
    const [productos, setProductos] = useState([])
    const [seccion, setSeccion] = useState('dashboard')
    const [categorias, setCategorias] = useState([])
    const [mensaje, setMensaje] = useState('')
    const [loading, setLoading] = useState(false)
    const [imagen, setImagen] = useState(null)
    const [previstaImagen, setPrevistaImagen] = useState(null)
    const [subiendoImagen, setSubiendoImagen] = useState(false)
    const [tallas, setTallas] = useState([])
    const [tallaInput, setTallaInput] = useState({ talla: '', stock: 10 })
    const [resenas, setResenas] = useState([])
    const [pedidosVendedor, setPedidosVendedor] = useState([])
    const [seccionTallas, setSeccionTallas] = useState(null)
    const [variantesProducto, setVariantesProducto] = useState([])
    const [nuevaTalla, setNuevaTalla] = useState({ talla: '', stock: 10 })
    const [mensajeTallas, setMensajeTallas] = useState('')
    const [descuentos, setDescuentos] = useState([])
    const [formDescuento, setFormDescuento] = useState({ nombre: '', tipo: 'porcentaje', valor: '', codigo: '' })
    const [mensajeDescuento, setMensajeDescuento] = useState('')
    const [sidebarOpen, setSidebarOpen] = useState(false)
    const [form, setForm] = useState({ nombre: '', descripcion: '', precio_base: '', categoria_id: '', genero: 'unisex' })
    const [editando, setEditando] = useState(null)

    useEffect(() => {
        api.get('/estadisticas/vendedor').then(res => setStats(res.data))
        api.get('/categorias').then(res => setCategorias(res.data))
        cargarProductos()
    }, [])

    const cargarProductos = () => {
        setLoading(true)
        api.get('/productos?vendedor=true').then(res => { setProductos(res.data.data || []); setLoading(false) })
    }
    const cargarResenas = () => api.get('/resenas/vendedor').then(res => setResenas(res.data)).catch(() => setResenas([]))
    const cargarPedidos = () => api.get('/pedidos/vendedor').then(res => setPedidosVendedor(res.data)).catch(() => setPedidosVendedor([]))
    const cargarDescuentos = () => api.get('/descuentos').then(res => setDescuentos(res.data)).catch(() => setDescuentos([]))
    const cargarVariantes = (productoId) => api.get(`/variantes/${productoId}`).then(res => setVariantesProducto(res.data))

    const abrirTallas = (producto) => { setSeccionTallas(producto); cargarVariantes(producto.id); setMensajeTallas(''); handleMenu('tallas') }
    const añadirVariante = async () => {
        if (!nuevaTalla.talla) return
        try {
            await api.post('/variantes', { producto_id: seccionTallas.id, talla: nuevaTalla.talla, stock: nuevaTalla.stock })
            setNuevaTalla({ talla: '', stock: 10 }); cargarVariantes(seccionTallas.id); setMensajeTallas('✓ Talla añadida')
        } catch { setMensajeTallas('✗ Error al añadir talla') }
    }
    const actualizarStock = async (varianteId, stock) => { await api.put(`/variantes/${varianteId}`, { stock: parseInt(stock) }); cargarVariantes(seccionTallas.id) }
    const eliminarVariante = async (varianteId) => { await api.delete(`/variantes/${varianteId}`); cargarVariantes(seccionTallas.id) }
    const añadirTalla = () => { if (!tallaInput.talla) return; setTallas(prev => [...prev, { ...tallaInput, id: Date.now() }]); setTallaInput({ talla: '', stock: 10 }) }
    const quitarTalla = (id) => setTallas(prev => prev.filter(t => t.id !== id))
    const crearDescuento = async (e) => {
        e.preventDefault()
        try { await api.post('/descuentos', formDescuento); setMensajeDescuento('✓ Descuento creado correctamente'); setFormDescuento({ nombre: '', tipo: 'porcentaje', valor: '', codigo: '' }); cargarDescuentos() }
        catch { setMensajeDescuento('✗ Error al crear el descuento. El código ya existe.') }
    }
    const generarCodigo = () => setFormDescuento({ ...formDescuento, codigo: 'DESC-' + Math.random().toString(36).substring(2, 8).toUpperCase() })
    const handleSubmit = async (e) => {
        e.preventDefault()
        try {
            let productoId = editando
            if (editando) { await api.put(`/productos/${editando}`, form) }
            else { const res = await api.post('/productos', form); productoId = res.data.id }
            if (imagen && productoId) {
                setSubiendoImagen(true)
                const formData = new FormData(); formData.append('imagen', imagen)
                await fetch(`/api/imagenes?producto_id=${String(productoId)}`, { method: 'POST', headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }, body: formData })
                setSubiendoImagen(false)
            }
            if (tallas.length > 0 && productoId) { for (const t of tallas) { await api.post('/variantes', { producto_id: productoId, talla: t.talla, stock: t.stock, color: 'Único' }) } }
            setMensaje(editando ? '✓ Producto actualizado correctamente' : '✓ Producto publicado correctamente')
            setEditando(null); setImagen(null); setPrevistaImagen(null); setTallas([])
            setForm({ nombre: '', descripcion: '', precio_base: '', categoria_id: '', genero: 'unisex' })
            cargarProductos(); handleMenu('productos')
        } catch { setMensaje('✗ Error al guardar el producto'); setSubiendoImagen(false) }
    }
    const handleEditar = (producto) => {
        setForm({ nombre: producto.nombre, descripcion: producto.descripcion || '', precio_base: producto.precio_base, categoria_id: producto.categoria_id, genero: producto.genero })
        setEditando(producto.id); setImagen(null); setTallas([]); setPrevistaImagen(producto.imagenes?.[0]?.url || null); handleMenu('nuevo')
    }
    const handleEliminar = async (id) => {
        if (!confirm('¿Estás seguro?')) return
        try { await api.delete(`/productos/${id}`); setMensaje('✓ Producto eliminado'); cargarProductos() }
        catch { setMensaje('✗ Error al eliminar') }
    }
    const handleLogout = () => { logout(); navigate('/') }
    const handleMenu = (id) => {
        setSeccion(id); setSidebarOpen(false)
        if (id === 'resenas') cargarResenas()
        if (id === 'pedidos') cargarPedidos()
        if (id === 'descuentos') cargarDescuentos()
        if (id !== 'nuevo') { setEditando(null); setImagen(null); setPrevistaImagen(null); setTallas([]); setForm({ nombre: '', descripcion: '', precio_base: '', categoria_id: '', genero: 'unisex' }) }
    }

    const menuItems = [
        { id: 'dashboard', label: 'Dashboard', icon: '▣' },
        { id: 'productos', label: 'Mis Productos', icon: '◆' },
        { id: 'nuevo', label: editando ? 'Editar' : 'Nuevo Producto', icon: '◈' },
        { id: 'tallas', label: 'Tallas', icon: '📐' },
        { id: 'descuentos', label: 'Descuentos', icon: '🏷️' },
        { id: 'resenas', label: 'Reseñas', icon: '★' },
        { id: 'pedidos', label: 'Pedidos', icon: '📦' },
    ]

    const inputStyle = { width: '100%', background: 'rgba(99,179,237,0.04)', border: '1px solid rgba(99,179,237,0.15)', color: '#fff', padding: '12px 16px', fontSize: '13px', outline: 'none', borderRadius: '4px', boxSizing: 'border-box', marginBottom: '16px' }

    return (
        <div style={{ display: 'flex', minHeight: '100vh', background: '#020818', color: '#fff', fontFamily: "'Inter', sans-serif" }}>
            <style>{`
                @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600&family=Bebas+Neue&display=swap');
                .menu-btn:hover { background: rgba(104,211,145,0.08) !important; color: #fff !important; }
                * { box-sizing: border-box; }
                ::-webkit-scrollbar { width: 4px; }
                ::-webkit-scrollbar-thumb { background: rgba(104,211,145,0.3); border-radius: 2px; }
                @media (max-width: 768px) {
                    .v-sidebar { transform: translateX(-100%); transition: transform 0.3s ease; }
                    .v-sidebar.open { transform: translateX(0); }
                    .v-main { margin-left: 0 !important; padding: 80px 16px 40px !important; }
                    .v-topbar { display: flex !important; }
                    .v-overlay { display: block !important; }
                    .v-stats-grid { grid-template-columns: repeat(2, 1fr) !important; gap: 12px !important; }
                    .v-titulo { font-size: 32px !important; }
                    .v-producto-row { flex-wrap: wrap !important; gap: 10px !important; }
                    .v-producto-btns { display: flex !important; gap: 6px !important; width: 100% !important; }
                    .v-producto-btn { flex: 1 !important; }
                    .v-descuentos-grid { grid-template-columns: 1fr !important; gap: 24px !important; }
                    .v-mas-vendido { flex-direction: column !important; gap: 12px !important; }
                    .v-tallas-form { flex-direction: column !important; }
                    .v-pedido-row { flex-direction: column !important; align-items: flex-start !important; gap: 8px !important; }
                }
            `}</style>

            {/* Overlay */}
            <div className="v-overlay" onClick={() => setSidebarOpen(false)} style={{
                display: 'none', position: 'fixed', inset: 0,
                background: 'rgba(0,0,0,0.6)', zIndex: 99,
                opacity: sidebarOpen ? 1 : 0, pointerEvents: sidebarOpen ? 'all' : 'none', transition: 'opacity 0.3s',
            }} />

            {/* Sidebar */}
            <div className={`v-sidebar${sidebarOpen ? ' open' : ''}`} style={{
                width: '260px', background: 'linear-gradient(180deg, #0a1628 0%, #050d1a 100%)',
                borderRight: '1px solid rgba(104,211,145,0.1)',
                display: 'flex', flexDirection: 'column',
                padding: '32px 0', position: 'fixed', height: '100vh', zIndex: 100, overflowY: 'auto',
            }}>
                <div style={{ padding: '0 28px', marginBottom: '48px' }}>
                    <img src="/logo.png" alt="Fitt-y-Nova" style={{ height: '42px', marginBottom: '12px' }} />
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', background: 'rgba(104,211,145,0.08)', border: '1px solid rgba(104,211,145,0.15)', padding: '6px 12px', borderRadius: '4px' }}>
                        <div style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#68d391', boxShadow: '0 0 6px #68d391' }} />
                        <span style={{ color: '#68d391', fontSize: '10px', letterSpacing: '3px', textTransform: 'uppercase' }}>Vendedor</span>
                    </div>
                </div>
                <nav style={{ flex: 1 }}>
                    {menuItems.map(item => (
                        <button key={item.id} className="menu-btn" onClick={() => handleMenu(item.id)} style={{
                            width: '100%', display: 'flex', alignItems: 'center', gap: '14px', padding: '13px 28px',
                            background: seccion === item.id ? 'rgba(104,211,145,0.08)' : 'transparent', border: 'none',
                            borderLeft: seccion === item.id ? '2px solid #68d391' : '2px solid transparent',
                            color: seccion === item.id ? '#fff' : 'rgba(255,255,255,0.4)',
                            fontSize: '13px', letterSpacing: '1px', cursor: 'pointer', textAlign: 'left', transition: 'all 0.2s',
                        }}>
                            <span style={{ color: seccion === item.id ? '#68d391' : 'rgba(255,255,255,0.3)', fontSize: '16px' }}>{item.icon}</span>
                            <span>{item.label}</span>
                            {seccion === item.id && <div style={{ marginLeft: 'auto', width: '4px', height: '4px', borderRadius: '50%', background: '#68d391', boxShadow: '0 0 6px #68d391' }} />}
                        </button>
                    ))}
                </nav>
                <div style={{ padding: '24px 28px', borderTop: '1px solid rgba(104,211,145,0.1)' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
                        <div style={{ width: '36px', height: '36px', borderRadius: '50%', background: 'linear-gradient(135deg, #68d391, #38a169)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '14px', fontWeight: '600' }}>
                            {user?.nombre?.[0]?.toUpperCase()}
                        </div>
                        <div>
                            <p style={{ fontSize: '13px', fontWeight: '500', margin: 0 }}>{user?.nombre}</p>
                            <p style={{ fontSize: '11px', color: '#68d391', margin: 0, letterSpacing: '1px' }}>Vendedor</p>
                        </div>
                    </div>
                    <button onClick={handleLogout} style={{ width: '100%', background: 'transparent', border: '1px solid rgba(104,211,145,0.2)', color: 'rgba(255,255,255,0.4)', padding: '8px', fontSize: '11px', letterSpacing: '2px', textTransform: 'uppercase', cursor: 'pointer' }}
                        onMouseEnter={e => { e.currentTarget.style.borderColor = '#68d391'; e.currentTarget.style.color = '#68d391' }}
                        onMouseLeave={e => { e.currentTarget.style.borderColor = 'rgba(104,211,145,0.2)'; e.currentTarget.style.color = 'rgba(255,255,255,0.4)' }}>
                        Cerrar Sesión
                    </button>
                </div>
            </div>

            {/* Topbar móvil */}
            <div className="v-topbar" style={{
                display: 'none', position: 'fixed', top: 0, left: 0, right: 0, zIndex: 98,
                background: 'rgba(2,8,24,0.95)', backdropFilter: 'blur(10px)',
                borderBottom: '1px solid rgba(104,211,145,0.1)',
                padding: '12px 16px', alignItems: 'center', justifyContent: 'space-between',
            }}>
                <img src="/logo.png" alt="Fitt-y-Nova" style={{ height: '36px' }} />
                <button onClick={() => setSidebarOpen(!sidebarOpen)} style={{
                    background: 'transparent', border: '1px solid rgba(104,211,145,0.3)',
                    color: '#68d391', padding: '8px 12px', fontSize: '18px', cursor: 'pointer', borderRadius: '4px',
                }}>☰</button>
            </div>

            {/* Main */}
            <div className="v-main" style={{ marginLeft: '260px', flex: 1, padding: '48px', overflowY: 'auto' }}>

                {/* Dashboard */}
                {seccion === 'dashboard' && (
                    <div>
                        <p style={{ color: '#68d391', fontSize: '11px', letterSpacing: '4px', textTransform: 'uppercase', marginBottom: '8px' }}>Panel de Control</p>
                        <h1 className="v-titulo" style={{ fontFamily: "'Bebas Neue'", fontSize: '48px', letterSpacing: '6px', margin: '0 0 40px', background: 'linear-gradient(135deg, #fff 0%, #68d391 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
                            MIS ESTADÍSTICAS
                        </h1>
                        {stats ? (
                            <>
                                <div className="v-stats-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '20px', marginBottom: '24px' }}>
                                    {[
                                        { label: 'Total Ventas', value: stats.total_ventas, icon: '🛒', color: '#63b3ed' },
                                        { label: 'Ingresos', value: `${parseFloat(stats.ingresos_totales || 0).toFixed(2)} €`, icon: '💰', color: '#68d391' },
                                        { label: 'Productos', value: stats.total_productos, icon: '👗', color: '#f6ad55' },
                                    ].map(stat => (
                                        <div key={stat.label} style={{ background: 'linear-gradient(135deg, rgba(10,22,40,0.8) 0%, rgba(5,13,26,0.8) 100%)', border: '1px solid rgba(104,211,145,0.12)', padding: '28px 20px', borderRadius: '8px', position: 'relative', overflow: 'hidden' }}>
                                            <div style={{ position: 'absolute', top: 0, right: 0, width: '80px', height: '80px', background: `radial-gradient(circle, ${stat.color}12 0%, transparent 70%)` }} />
                                            <div style={{ fontSize: '24px', marginBottom: '12px' }}>{stat.icon}</div>
                                            <div style={{ fontSize: '36px', fontWeight: '700', marginBottom: '8px', color: stat.color }}>{stat.value}</div>
                                            <div style={{ color: 'rgba(255,255,255,0.4)', fontSize: '11px', letterSpacing: '2px', textTransform: 'uppercase' }}>{stat.label}</div>
                                        </div>
                                    ))}
                                </div>
                                {stats.producto_mas_vendido && (
                                    <div className="v-mas-vendido" style={{ background: 'linear-gradient(135deg, rgba(104,211,145,0.08) 0%, rgba(56,161,105,0.04) 100%)', border: '1px solid rgba(104,211,145,0.2)', padding: '24px 28px', borderRadius: '8px', marginBottom: '24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                                        <div>
                                            <p style={{ color: '#68d391', fontSize: '11px', letterSpacing: '3px', textTransform: 'uppercase', marginBottom: '8px' }}>Producto mas vendido</p>
                                            <p style={{ fontSize: '20px', fontWeight: '700', margin: 0 }}>{stats.producto_mas_vendido.nombre}</p>
                                        </div>
                                        <div style={{ textAlign: 'right' }}>
                                            <p style={{ fontSize: '32px', fontWeight: '700', color: '#68d391', margin: 0 }}>{stats.producto_mas_vendido.total_vendido}</p>
                                            <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: '12px', letterSpacing: '2px' }}>UNIDADES</p>
                                        </div>
                                    </div>
                                )}
                                {stats.rendimiento?.length > 0 && (
                                    <div style={{ background: 'rgba(10,22,40,0.8)', border: '1px solid rgba(104,211,145,0.12)', padding: '24px', borderRadius: '8px' }}>
                                        <p style={{ color: '#68d391', fontSize: '11px', letterSpacing: '3px', textTransform: 'uppercase', marginBottom: '20px' }}>Rendimiento por producto</p>
                                        <div style={{ display: 'grid', gap: '12px' }}>
                                            {stats.rendimiento.map((r, i) => (
                                                <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '12px', background: 'rgba(104,211,145,0.04)', border: '1px solid rgba(104,211,145,0.08)', padding: '12px 16px', borderRadius: '4px' }}>
                                                    <span style={{ color: '#68d391', fontSize: '14px', fontWeight: '700', minWidth: '24px' }}>#{i + 1}</span>
                                                    <span style={{ flex: 1, fontSize: '13px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{r.nombre}</span>
                                                    <span style={{ color: 'rgba(255,255,255,0.4)', fontSize: '12px', flexShrink: 0 }}>{r.unidades} uds</span>
                                                    <span style={{ color: '#68d391', fontSize: '13px', fontWeight: '600', flexShrink: 0 }}>{r.ingresos} €</span>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </>
                        ) : <p style={{ color: '#68d391', letterSpacing: '4px', fontSize: '12px' }}>CARGANDO...</p>}
                    </div>
                )}

                {/* Mis productos */}
                {seccion === 'productos' && (
                    <div>
                        <p style={{ color: '#68d391', fontSize: '11px', letterSpacing: '4px', textTransform: 'uppercase', marginBottom: '8px' }}>Catálogo</p>
                        <h1 className="v-titulo" style={{ fontFamily: "'Bebas Neue'", fontSize: '48px', letterSpacing: '6px', margin: '0 0 32px', background: 'linear-gradient(135deg, #fff 0%, #68d391 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
                            MIS PRODUCTOS
                        </h1>
                        {mensaje && <div style={{ background: mensaje.includes('✓') ? 'rgba(104,211,145,0.1)' : 'rgba(252,129,129,0.1)', border: `1px solid ${mensaje.includes('✓') ? 'rgba(104,211,145,0.3)' : 'rgba(252,129,129,0.3)'}`, padding: '12px 16px', borderRadius: '4px', marginBottom: '24px', color: mensaje.includes('✓') ? '#68d391' : '#fc8181', fontSize: '13px' }}>{mensaje}</div>}
                        {loading ? <p style={{ color: '#68d391', letterSpacing: '4px' }}>CARGANDO...</p> : (
                            <div style={{ display: 'grid', gap: '12px' }}>
                                {productos.map(p => (
                                    <div key={p.id} className="v-producto-row" style={{ background: 'rgba(10,22,40,0.8)', border: '1px solid rgba(104,211,145,0.12)', borderRadius: '8px', padding: '14px 16px', display: 'flex', alignItems: 'center', gap: '12px' }}>
                                        <div style={{ width: '52px', height: '52px', background: '#0a1628', borderRadius: '4px', overflow: 'hidden', flexShrink: 0 }}>
                                            {p.imagenes?.[0] && <img src={p.imagenes[0].url} alt={p.nombre} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />}
                                        </div>
                                        <div style={{ flex: 1, minWidth: 0 }}>
                                            <p style={{ fontSize: '13px', fontWeight: '500', margin: '0 0 2px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{p.nombre}</p>
                                            <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: '11px', margin: 0 }}>{p.categoria?.nombre} · {parseFloat(p.precio_base).toFixed(2)} €</p>
                                        </div>
                                        <span style={{ background: p.activo ? 'rgba(104,211,145,0.1)' : 'rgba(252,129,129,0.1)', border: `1px solid ${p.activo ? 'rgba(104,211,145,0.3)' : 'rgba(252,129,129,0.3)'}`, color: p.activo ? '#68d391' : '#fc8181', padding: '4px 8px', borderRadius: '4px', fontSize: '10px', letterSpacing: '1px', textTransform: 'uppercase', flexShrink: 0 }}>
                                            {p.activo ? 'Activo' : 'Inactivo'}
                                        </span>
                                        <div className="v-producto-btns" style={{ display: 'flex', gap: '6px' }}>
                                            <button className="v-producto-btn" onClick={() => abrirTallas(p)} style={{ background: 'rgba(246,173,85,0.08)', border: '1px solid rgba(246,173,85,0.2)', color: '#f6ad55', padding: '6px 12px', borderRadius: '4px', fontSize: '11px', cursor: 'pointer' }}>Tallas</button>
                                            <button className="v-producto-btn" onClick={() => handleEditar(p)} style={{ background: 'rgba(99,179,237,0.08)', border: '1px solid rgba(99,179,237,0.2)', color: '#63b3ed', padding: '6px 12px', borderRadius: '4px', fontSize: '11px', cursor: 'pointer' }}>Editar</button>
                                            <button className="v-producto-btn" onClick={() => handleEliminar(p.id)} style={{ background: 'rgba(252,129,129,0.08)', border: '1px solid rgba(252,129,129,0.2)', color: '#fc8181', padding: '6px 12px', borderRadius: '4px', fontSize: '11px', cursor: 'pointer' }}>Eliminar</button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                )}

                {/* Nuevo / Editar producto */}
                {seccion === 'nuevo' && (
                    <div style={{ maxWidth: '600px' }}>
                        <p style={{ color: '#68d391', fontSize: '11px', letterSpacing: '4px', textTransform: 'uppercase', marginBottom: '8px' }}>Catálogo</p>
                        <h1 className="v-titulo" style={{ fontFamily: "'Bebas Neue'", fontSize: '48px', letterSpacing: '6px', margin: '0 0 32px', background: 'linear-gradient(135deg, #fff 0%, #68d391 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
                            {editando ? 'EDITAR PRODUCTO' : 'NUEVO PRODUCTO'}
                        </h1>
                        {mensaje && <div style={{ background: mensaje.includes('✓') ? 'rgba(104,211,145,0.1)' : 'rgba(252,129,129,0.1)', border: `1px solid ${mensaje.includes('✓') ? 'rgba(104,211,145,0.3)' : 'rgba(252,129,129,0.3)'}`, padding: '12px 16px', borderRadius: '4px', marginBottom: '24px', color: mensaje.includes('✓') ? '#68d391' : '#fc8181', fontSize: '13px' }}>{mensaje}</div>}
                        <form onSubmit={handleSubmit}>
                            <input type="text" placeholder="Nombre del producto" value={form.nombre} onChange={e => setForm({ ...form, nombre: e.target.value })} style={inputStyle} required />
                            <textarea placeholder="Descripción" value={form.descripcion} onChange={e => setForm({ ...form, descripcion: e.target.value })} style={{ ...inputStyle, height: '100px', resize: 'vertical' }} />
                            <input type="number" step="0.01" placeholder="Precio (€)" value={form.precio_base} onChange={e => setForm({ ...form, precio_base: e.target.value })} style={inputStyle} required />
                            <select value={form.categoria_id} onChange={e => setForm({ ...form, categoria_id: e.target.value })} style={{ ...inputStyle, background: '#020818' }} required>
                                <option value="">Selecciona categoría</option>
                                {categorias.map(c => <option key={c.id} value={c.id}>{c.nombre}</option>)}
                            </select>
                            <select value={form.genero} onChange={e => setForm({ ...form, genero: e.target.value })} style={{ ...inputStyle, background: '#020818' }}>
                                <option value="unisex">Unisex</option>
                                <option value="mujer">Mujer</option>
                                <option value="hombre">Hombre</option>
                            </select>
                            <div style={{ marginBottom: '24px' }}>
                                <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: '11px', letterSpacing: '2px', textTransform: 'uppercase', marginBottom: '8px' }}>Imagen del producto</p>
                                <label style={{ display: 'block', border: '2px dashed rgba(104,211,145,0.2)', borderRadius: '8px', padding: '24px', textAlign: 'center', cursor: 'pointer' }}
                                    onMouseEnter={e => e.currentTarget.style.borderColor = 'rgba(104,211,145,0.5)'}
                                    onMouseLeave={e => e.currentTarget.style.borderColor = 'rgba(104,211,145,0.2)'}>
                                    <input type="file" accept="image/*" style={{ display: 'none' }} onChange={e => { const file = e.target.files[0]; if (file) { setImagen(file); setPrevistaImagen(URL.createObjectURL(file)) } }} />
                                    {previstaImagen ? <img src={previstaImagen} alt="preview" style={{ maxHeight: '200px', borderRadius: '4px', objectFit: 'cover' }} /> : (
                                        <div><p style={{ color: '#68d391', fontSize: '32px', marginBottom: '8px' }}>+</p><p style={{ color: 'rgba(255,255,255,0.4)', fontSize: '13px' }}>Haz clic para subir una imagen</p></div>
                                    )}
                                </label>
                            </div>
                            <div style={{ marginBottom: '24px' }}>
                                <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: '11px', letterSpacing: '2px', textTransform: 'uppercase', marginBottom: '12px' }}>Tallas y Stock</p>
                                <div style={{ display: 'flex', gap: '8px', marginBottom: '12px' }}>
                                    <select value={tallaInput.talla} onChange={e => setTallaInput({ ...tallaInput, talla: e.target.value })} style={{ ...inputStyle, marginBottom: 0, flex: 1, background: '#020818' }}>
                                        <option value="">Talla</option>
                                        {['XS', 'S', 'M', 'L', 'XL', 'XXL', '32', '34', '36', '38', '40', '42', '37', '39', '41', '43', 'Única'].map(t => <option key={t} value={t}>{t}</option>)}
                                    </select>
                                    <input type="number" placeholder="Stock" value={tallaInput.stock} onChange={e => setTallaInput({ ...tallaInput, stock: parseInt(e.target.value) })} style={{ ...inputStyle, marginBottom: 0, width: '80px' }} />
                                    <button type="button" onClick={añadirTalla} style={{ background: 'rgba(104,211,145,0.1)', border: '1px solid rgba(104,211,145,0.3)', color: '#68d391', padding: '0 16px', borderRadius: '4px', cursor: 'pointer', fontSize: '20px' }}>+</button>
                                </div>
                                <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                                    {tallas.map(t => (
                                        <div key={t.id} style={{ background: 'rgba(104,211,145,0.08)', border: '1px solid rgba(104,211,145,0.2)', padding: '6px 12px', borderRadius: '4px', display: 'flex', alignItems: 'center', gap: '8px', color: '#68d391', fontSize: '13px' }}>
                                            <span>{t.talla} — {t.stock} uds</span>
                                            <button type="button" onClick={() => quitarTalla(t.id)} style={{ background: 'none', border: 'none', color: '#fc8181', cursor: 'pointer', fontSize: '16px', lineHeight: 1 }}>×</button>
                                        </div>
                                    ))}
                                </div>
                            </div>
                            <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
                                <button type="submit" disabled={subiendoImagen} style={{ background: 'linear-gradient(135deg, #68d391, #38a169)', color: '#000', border: 'none', padding: '14px 32px', fontSize: '12px', letterSpacing: '3px', textTransform: 'uppercase', cursor: subiendoImagen ? 'not-allowed' : 'pointer', borderRadius: '4px', fontWeight: '600' }}>
                                    {subiendoImagen ? 'Subiendo...' : editando ? 'Guardar Cambios' : 'Publicar Producto'}
                                </button>
                                {editando && <button type="button" onClick={() => { setEditando(null); setImagen(null); setPrevistaImagen(null); setTallas([]); setForm({ nombre: '', descripcion: '', precio_base: '', categoria_id: '', genero: 'unisex' }); handleMenu('productos') }} style={{ background: 'transparent', border: '1px solid rgba(255,255,255,0.2)', color: 'rgba(255,255,255,0.4)', padding: '14px 24px', fontSize: '12px', letterSpacing: '2px', textTransform: 'uppercase', cursor: 'pointer', borderRadius: '4px' }}>Cancelar</button>}
                            </div>
                        </form>
                    </div>
                )}

                {/* Gestión de tallas */}
                {seccion === 'tallas' && (
                    <div style={{ maxWidth: '700px' }}>
                        <p style={{ color: '#68d391', fontSize: '11px', letterSpacing: '4px', textTransform: 'uppercase', marginBottom: '8px' }}>Inventario</p>
                        <h1 className="v-titulo" style={{ fontFamily: "'Bebas Neue'", fontSize: '48px', letterSpacing: '6px', margin: '0 0 8px', background: 'linear-gradient(135deg, #fff 0%, #68d391 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>GESTIÓN DE TALLAS</h1>
                        {seccionTallas && <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: '13px', marginBottom: '24px' }}>Producto: <span style={{ color: '#68d391' }}>{seccionTallas.nombre}</span></p>}
                        {mensajeTallas && <div style={{ background: mensajeTallas.includes('✓') ? 'rgba(104,211,145,0.1)' : 'rgba(252,129,129,0.1)', border: `1px solid ${mensajeTallas.includes('✓') ? 'rgba(104,211,145,0.3)' : 'rgba(252,129,129,0.3)'}`, padding: '12px 16px', borderRadius: '4px', marginBottom: '20px', color: mensajeTallas.includes('✓') ? '#68d391' : '#fc8181', fontSize: '13px' }}>{mensajeTallas}</div>}
                        <div style={{ background: 'rgba(10,22,40,0.8)', border: '1px solid rgba(104,211,145,0.12)', borderRadius: '8px', padding: '24px', marginBottom: '20px' }}>
                            <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: '11px', letterSpacing: '3px', textTransform: 'uppercase', marginBottom: '16px' }}>Tallas actuales</p>
                            {variantesProducto.length === 0 ? <p style={{ color: 'rgba(255,255,255,0.3)', fontSize: '13px' }}>No hay tallas para este producto</p> : (
                                <div style={{ display: 'grid', gap: '12px' }}>
                                    {variantesProducto.map(v => (
                                        <div key={v.id} style={{ display: 'flex', alignItems: 'center', gap: '12px', background: 'rgba(99,179,237,0.04)', border: '1px solid rgba(99,179,237,0.1)', padding: '12px 16px', borderRadius: '4px', flexWrap: 'wrap' }}>
                                            <span style={{ color: '#68d391', fontSize: '14px', fontWeight: '600', minWidth: '60px' }}>{v.talla}</span>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flex: 1 }}>
                                                <span style={{ color: 'rgba(255,255,255,0.4)', fontSize: '12px' }}>Stock:</span>
                                                <input type="number" defaultValue={v.stock} min="0" onBlur={e => actualizarStock(v.id, e.target.value)} style={{ width: '80px', background: 'rgba(99,179,237,0.04)', border: '1px solid rgba(99,179,237,0.15)', color: '#fff', padding: '6px 10px', fontSize: '13px', outline: 'none', borderRadius: '4px' }} />
                                                <span style={{ color: 'rgba(255,255,255,0.3)', fontSize: '12px' }}>uds</span>
                                            </div>
                                            <button onClick={() => eliminarVariante(v.id)} style={{ background: 'rgba(252,129,129,0.08)', border: '1px solid rgba(252,129,129,0.2)', color: '#fc8181', padding: '6px 12px', borderRadius: '4px', fontSize: '11px', cursor: 'pointer' }}>Eliminar</button>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                        <div style={{ background: 'rgba(10,22,40,0.8)', border: '1px solid rgba(104,211,145,0.12)', borderRadius: '8px', padding: '24px' }}>
                            <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: '11px', letterSpacing: '3px', textTransform: 'uppercase', marginBottom: '16px' }}>Añadir talla</p>
                            <div className="v-tallas-form" style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                                <select value={nuevaTalla.talla} onChange={e => setNuevaTalla({ ...nuevaTalla, talla: e.target.value })} style={{ flex: 1, background: '#020818', border: '1px solid rgba(99,179,237,0.15)', color: '#fff', padding: '12px 16px', fontSize: '13px', outline: 'none', borderRadius: '4px' }}>
                                    <option value="">Selecciona talla</option>
                                    {['XS', 'S', 'M', 'L', 'XL', 'XXL', '32', '34', '36', '38', '40', '42', '37', '39', '41', '43', 'Única'].map(t => <option key={t} value={t}>{t}</option>)}
                                </select>
                                <input type="number" placeholder="Stock" value={nuevaTalla.stock} onChange={e => setNuevaTalla({ ...nuevaTalla, stock: parseInt(e.target.value) })} style={{ width: '100px', background: 'transparent', border: '1px solid rgba(99,179,237,0.15)', color: '#fff', padding: '12px 16px', fontSize: '13px', outline: 'none', borderRadius: '4px' }} />
                                <button onClick={añadirVariante} style={{ background: 'linear-gradient(135deg, #68d391, #38a169)', color: '#000', border: 'none', padding: '12px 24px', fontSize: '12px', letterSpacing: '2px', textTransform: 'uppercase', cursor: 'pointer', borderRadius: '4px', fontWeight: '600' }}>Añadir</button>
                            </div>
                        </div>
                        <button onClick={() => handleMenu('productos')} style={{ marginTop: '24px', background: 'transparent', border: '1px solid rgba(255,255,255,0.1)', color: 'rgba(255,255,255,0.4)', padding: '10px 24px', fontSize: '11px', letterSpacing: '2px', textTransform: 'uppercase', cursor: 'pointer', borderRadius: '4px' }}>← Volver a productos</button>
                    </div>
                )}

                {/* Descuentos */}
                {seccion === 'descuentos' && (
                    <div>
                        <p style={{ color: '#68d391', fontSize: '11px', letterSpacing: '4px', textTransform: 'uppercase', marginBottom: '8px' }}>Promociones</p>
                        <h1 className="v-titulo" style={{ fontFamily: "'Bebas Neue'", fontSize: '48px', letterSpacing: '6px', margin: '0 0 32px', background: 'linear-gradient(135deg, #fff 0%, #68d391 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>DESCUENTOS</h1>
                        <div className="v-descuentos-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '40px' }}>
                            <div>
                                <h3 style={{ fontFamily: "'Bebas Neue'", fontSize: '24px', letterSpacing: '3px', marginBottom: '24px', color: '#68d391' }}>CREAR DESCUENTO</h3>
                                <div style={{ background: 'rgba(10,22,40,0.8)', border: '1px solid rgba(104,211,145,0.12)', borderRadius: '8px', padding: '24px' }}>
                                    {mensajeDescuento && <div style={{ background: mensajeDescuento.includes('✓') ? 'rgba(104,211,145,0.1)' : 'rgba(252,129,129,0.1)', border: `1px solid ${mensajeDescuento.includes('✓') ? 'rgba(104,211,145,0.3)' : 'rgba(252,129,129,0.3)'}`, padding: '12px 16px', borderRadius: '4px', marginBottom: '20px', color: mensajeDescuento.includes('✓') ? '#68d391' : '#fc8181', fontSize: '13px' }}>{mensajeDescuento}</div>}
                                    <form onSubmit={crearDescuento}>
                                        <input type="text" placeholder="Nombre del descuento" value={formDescuento.nombre} onChange={e => setFormDescuento({ ...formDescuento, nombre: e.target.value })} style={inputStyle} required />
                                        <select value={formDescuento.tipo} onChange={e => setFormDescuento({ ...formDescuento, tipo: e.target.value })} style={{ ...inputStyle, background: '#020818' }}>
                                            <option value="porcentaje">Porcentaje (%)</option>
                                            <option value="fijo">Fijo (€)</option>
                                        </select>
                                        <input type="number" step="0.01" placeholder={formDescuento.tipo === 'porcentaje' ? 'Valor (%)' : 'Valor (€)'} value={formDescuento.valor} onChange={e => setFormDescuento({ ...formDescuento, valor: e.target.value })} style={inputStyle} required />
                                        <div style={{ display: 'flex', gap: '8px', marginBottom: '16px' }}>
                                            <input type="text" placeholder="Código del cupón" value={formDescuento.codigo} onChange={e => setFormDescuento({ ...formDescuento, codigo: e.target.value.toUpperCase() })} style={{ ...inputStyle, marginBottom: 0, flex: 1 }} />
                                            <button type="button" onClick={generarCodigo} style={{ background: 'rgba(104,211,145,0.1)', border: '1px solid rgba(104,211,145,0.3)', color: '#68d391', padding: '0 16px', borderRadius: '4px', cursor: 'pointer', fontSize: '12px', whiteSpace: 'nowrap' }}>Auto</button>
                                        </div>
                                        <button type="submit" style={{ background: 'linear-gradient(135deg, #68d391, #38a169)', color: '#000', border: 'none', padding: '14px 40px', fontSize: '12px', letterSpacing: '3px', textTransform: 'uppercase', cursor: 'pointer', borderRadius: '4px', fontWeight: '600', width: '100%' }}>Crear Descuento</button>
                                    </form>
                                </div>
                            </div>
                            <div>
                                <h3 style={{ fontFamily: "'Bebas Neue'", fontSize: '24px', letterSpacing: '3px', marginBottom: '24px', color: '#68d391' }}>MIS DESCUENTOS</h3>
                                {descuentos.length === 0 ? (
                                    <div style={{ background: 'rgba(10,22,40,0.8)', border: '1px solid rgba(104,211,145,0.12)', borderRadius: '8px', padding: '40px', textAlign: 'center' }}>
                                        <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: '13px' }}>No hay descuentos creados</p>
                                    </div>
                                ) : (
                                    <div style={{ display: 'grid', gap: '12px' }}>
                                        {descuentos.map(d => (
                                            <div key={d.id} style={{ background: 'rgba(10,22,40,0.8)', border: '1px solid rgba(104,211,145,0.12)', borderRadius: '8px', padding: '20px' }}>
                                                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px', gap: '8px' }}>
                                                    <p style={{ fontSize: '13px', fontWeight: '500', margin: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{d.nombre}</p>
                                                    <span style={{ background: d.activo ? 'rgba(104,211,145,0.1)' : 'rgba(252,129,129,0.1)', border: `1px solid ${d.activo ? 'rgba(104,211,145,0.3)' : 'rgba(252,129,129,0.3)'}`, color: d.activo ? '#68d391' : '#fc8181', padding: '3px 8px', borderRadius: '4px', fontSize: '10px', letterSpacing: '1px', textTransform: 'uppercase', flexShrink: 0 }}>{d.activo ? 'Activo' : 'Inactivo'}</span>
                                                </div>
                                                <div style={{ display: 'flex', gap: '12px', alignItems: 'center', flexWrap: 'wrap' }}>
                                                    <span style={{ color: '#68d391', fontSize: '16px', fontWeight: '700' }}>{d.valor}{d.tipo === 'porcentaje' ? '%' : '€'} OFF</span>
                                                    {d.codigo && <span style={{ background: 'rgba(99,179,237,0.08)', border: '1px solid rgba(99,179,237,0.2)', color: '#63b3ed', padding: '4px 10px', borderRadius: '4px', fontSize: '11px', fontFamily: 'monospace', letterSpacing: '2px' }}>{d.codigo}</span>}
                                                    <span style={{ color: 'rgba(255,255,255,0.3)', fontSize: '12px', marginLeft: 'auto' }}>{d.usos_actuales || 0} usos</span>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                )}

                {/* Reseñas */}
                {seccion === 'resenas' && (
                    <div>
                        <p style={{ color: '#68d391', fontSize: '11px', letterSpacing: '4px', textTransform: 'uppercase', marginBottom: '8px' }}>Buzón</p>
                        <h1 className="v-titulo" style={{ fontFamily: "'Bebas Neue'", fontSize: '48px', letterSpacing: '6px', margin: '0 0 32px', background: 'linear-gradient(135deg, #fff 0%, #68d391 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>RESEÑAS</h1>
                        {resenas.length === 0 ? (
                            <div style={{ background: 'rgba(10,22,40,0.8)', border: '1px solid rgba(104,211,145,0.12)', borderRadius: '8px', padding: '40px', textAlign: 'center' }}>
                                <p style={{ color: 'rgba(255,255,255,0.4)' }}>No hay reseñas todavía</p>
                            </div>
                        ) : (
                            <div style={{ display: 'grid', gap: '16px' }}>
                                {resenas.map(r => (
                                    <div key={r.id} style={{ background: 'rgba(10,22,40,0.8)', border: '1px solid rgba(104,211,145,0.12)', borderRadius: '8px', padding: '20px' }}>
                                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '12px', gap: '12px', flexWrap: 'wrap' }}>
                                            <div>
                                                <p style={{ color: '#68d391', fontSize: '12px', letterSpacing: '2px', textTransform: 'uppercase', margin: '0 0 4px' }}>{r.producto?.nombre}</p>
                                                <div style={{ display: 'flex', gap: '2px' }}>{Array(5).fill(0).map((_, i) => <span key={i} style={{ color: i < r.puntuacion ? '#f6ad55' : 'rgba(255,255,255,0.2)' }}>★</span>)}</div>
                                            </div>
                                            <span style={{ background: r.aprobada ? 'rgba(104,211,145,0.1)' : 'rgba(246,173,85,0.1)', border: `1px solid ${r.aprobada ? 'rgba(104,211,145,0.3)' : 'rgba(246,173,85,0.3)'}`, color: r.aprobada ? '#68d391' : '#f6ad55', padding: '4px 10px', borderRadius: '4px', fontSize: '10px', letterSpacing: '2px', textTransform: 'uppercase', height: 'fit-content' }}>{r.aprobada ? 'Publicada' : 'Pendiente'}</span>
                                        </div>
                                        {r.titulo && <p style={{ fontWeight: '600', marginBottom: '8px' }}>{r.titulo}</p>}
                                        <p style={{ color: 'rgba(255,255,255,0.6)', fontSize: '13px' }}>{r.comentario}</p>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                )}

                {/* Pedidos */}
                {seccion === 'pedidos' && (
                    <div>
                        <p style={{ color: '#68d391', fontSize: '11px', letterSpacing: '4px', textTransform: 'uppercase', marginBottom: '8px' }}>Ventas</p>
                        <h1 className="v-titulo" style={{ fontFamily: "'Bebas Neue'", fontSize: '48px', letterSpacing: '6px', margin: '0 0 32px', background: 'linear-gradient(135deg, #fff 0%, #68d391 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>MIS PEDIDOS</h1>
                        {pedidosVendedor.length === 0 ? (
                            <div style={{ background: 'rgba(10,22,40,0.8)', border: '1px solid rgba(104,211,145,0.12)', borderRadius: '8px', padding: '40px', textAlign: 'center' }}>
                                <p style={{ color: 'rgba(255,255,255,0.4)' }}>No hay pedidos todavía</p>
                            </div>
                        ) : (
                            <div style={{ display: 'grid', gap: '12px' }}>
                                {pedidosVendedor.map(pedido => (
                                    <div key={pedido.id} className="v-pedido-row" style={{ background: 'rgba(10,22,40,0.8)', border: '1px solid rgba(104,211,145,0.12)', borderRadius: '8px', padding: '20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                        <div>
                                            <p style={{ color: '#68d391', fontSize: '11px', letterSpacing: '2px', textTransform: 'uppercase', margin: '0 0 4px' }}>Pedido #{pedido.id}</p>
                                            <p style={{ fontSize: '13px', color: 'rgba(255,255,255,0.5)', margin: '0 0 4px' }}>{new Date(pedido.created_at).toLocaleDateString('es-ES')}</p>
                                            <p style={{ fontSize: '13px', color: 'rgba(255,255,255,0.5)', margin: 0 }}>Cliente: {pedido.cliente?.nombre}</p>
                                        </div>
                                        <div style={{ textAlign: 'right' }}>
                                            <p style={{ fontSize: '18px', fontWeight: '700', color: '#68d391', margin: '0 0 8px' }}>{parseFloat(pedido.total).toFixed(2)} €</p>
                                            <span style={{ background: 'rgba(104,211,145,0.1)', border: '1px solid rgba(104,211,145,0.3)', color: '#68d391', padding: '4px 10px', borderRadius: '4px', fontSize: '11px', letterSpacing: '2px', textTransform: 'uppercase' }}>{pedido.estado}</span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    )
}