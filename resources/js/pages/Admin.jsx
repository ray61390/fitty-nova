import React, { useEffect, useState } from 'react'
import { useAuth } from '../context/AuthContext'
import { useNavigate } from 'react-router-dom'
import api from '../services/api'

export default function Admin() {
    const { user, logout } = useAuth()
    const navigate = useNavigate()
    const [stats, setStats] = useState(null)
    const [seccion, setSeccion] = useState('dashboard')
    const [usuarios, setUsuarios] = useState([])
    const [productos, setProductos] = useState([])
    const [pedidos, setPedidos] = useState([])
    const [loading, setLoading] = useState(false)
    const [sidebarOpen, setSidebarOpen] = useState(false)

    useEffect(() => {
        api.get('/estadisticas/admin').then(res => setStats(res.data))
    }, [])

    useEffect(() => {
        if (seccion === 'usuarios') cargarUsuarios()
        if (seccion === 'productos') cargarProductos()
        if (seccion === 'pedidos') cargarPedidos()
    }, [seccion])

    const cargarUsuarios = () => {
        setLoading(true)
        api.get('/admin/usuarios').then(res => { setUsuarios(res.data); setLoading(false) })
    }
    const cargarProductos = () => {
        setLoading(true)
        api.get('/productos?page=1').then(res => { setProductos(res.data.data || []); setLoading(false) })
    }
    const cargarPedidos = () => {
        setLoading(true)
        api.get('/admin/pedidos').then(res => { setPedidos(res.data); setLoading(false) })
    }
    const cambiarEstadoPedido = async (pedidoId, estado) => {
        await api.put(`/admin/pedidos/${pedidoId}`, { estado })
        cargarPedidos()
    }
    const toggleProducto = async (producto) => {
        await api.put(`/productos/${producto.id}`, { activo: producto.activo ? 0 : 1 })
        cargarProductos()
    }
    const handleLogout = () => { logout(); navigate('/') }
    const handleMenu = (id) => { setSeccion(id); setSidebarOpen(false) }

    const menuItems = [
        { id: 'dashboard', label: 'Dashboard', icon: '▣' },
        { id: 'usuarios', label: 'Usuarios', icon: '◈' },
        { id: 'productos', label: 'Productos', icon: '◆' },
        { id: 'pedidos', label: 'Pedidos', icon: '◉' },
    ]

    const estadoColors = {
        pendiente: '#f6ad55', confirmado: '#63b3ed',
        enviado: '#b794f4', entregado: '#68d391',
        cancelado: '#fc8181', devuelto: '#fc8181',
    }

    return (
        <div style={{ display: 'flex', minHeight: '100vh', background: '#020818', color: '#fff', fontFamily: "'Inter', sans-serif" }}>
            <style>{`
                @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600&family=Bebas+Neue&display=swap');
                .stat-card:hover { border-color: rgba(99,179,237,0.4) !important; transform: translateY(-2px); }
                .menu-btn:hover { background: rgba(99,179,237,0.08) !important; color: #fff !important; }
                * { box-sizing: border-box; }
                ::-webkit-scrollbar { width: 4px; }
                ::-webkit-scrollbar-thumb { background: rgba(99,179,237,0.3); border-radius: 2px; }
                select option { background: #0a1628; }
                @media (max-width: 768px) {
                    .admin-sidebar {
                        transform: translateX(-100%);
                        transition: transform 0.3s ease;
                    }
                    .admin-sidebar.open {
                        transform: translateX(0);
                    }
                    .admin-main {
                        margin-left: 0 !important;
                        padding: 80px 16px 40px !important;
                    }
                    .admin-topbar { display: flex !important; }
                    .admin-stats-grid { grid-template-columns: repeat(2, 1fr) !important; gap: 12px !important; }
                    .admin-stats-grid-2 { grid-template-columns: repeat(2, 1fr) !important; }
                    .admin-titulo { font-size: 36px !important; }
                    .admin-pedido-row { flex-direction: column !important; align-items: flex-start !important; gap: 12px !important; }
                    .admin-pedido-select { width: 100% !important; }
                    .admin-usuario-row { flex-wrap: wrap !important; }
                    .admin-overlay { display: block !important; }
                }
            `}</style>

            {/* Overlay móvil */}
            <div className="admin-overlay" onClick={() => setSidebarOpen(false)} style={{
                display: 'none',
                position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.6)', zIndex: 99,
                opacity: sidebarOpen ? 1 : 0,
                pointerEvents: sidebarOpen ? 'all' : 'none',
                transition: 'opacity 0.3s',
            }} />

            {/* Sidebar */}
            <div className={`admin-sidebar${sidebarOpen ? ' open' : ''}`} style={{
                width: '260px',
                background: 'linear-gradient(180deg, #0a1628 0%, #050d1a 100%)',
                borderRight: '1px solid rgba(99,179,237,0.1)',
                display: 'flex', flexDirection: 'column',
                padding: '32px 0', position: 'fixed', height: '100vh', zIndex: 100,
            }}>
                <div style={{ padding: '0 28px', marginBottom: '48px' }}>
                    <img src="/logo.png" alt="Fitt-y-Nova" style={{ height: '42px', marginBottom: '12px' }} />
                    <div style={{
                        display: 'flex', alignItems: 'center', gap: '8px',
                        background: 'rgba(99,179,237,0.08)',
                        border: '1px solid rgba(99,179,237,0.15)',
                        padding: '6px 12px', borderRadius: '4px',
                    }}>
                        <div style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#63b3ed', boxShadow: '0 0 6px #63b3ed' }} />
                        <span style={{ color: '#63b3ed', fontSize: '10px', letterSpacing: '3px', textTransform: 'uppercase' }}>Admin Panel</span>
                    </div>
                </div>

                <nav style={{ flex: 1 }}>
                    {menuItems.map(item => (
                        <button key={item.id} className="menu-btn" onClick={() => handleMenu(item.id)} style={{
                            width: '100%', display: 'flex', alignItems: 'center', gap: '14px',
                            padding: '13px 28px',
                            background: seccion === item.id ? 'rgba(99,179,237,0.1)' : 'transparent',
                            border: 'none',
                            borderLeft: seccion === item.id ? '2px solid #63b3ed' : '2px solid transparent',
                            color: seccion === item.id ? '#fff' : 'rgba(255,255,255,0.4)',
                            fontSize: '13px', letterSpacing: '1px',
                            cursor: 'pointer', textAlign: 'left', transition: 'all 0.2s',
                        }}>
                            <span style={{ color: seccion === item.id ? '#63b3ed' : 'rgba(255,255,255,0.3)', fontSize: '16px' }}>{item.icon}</span>
                            <span>{item.label}</span>
                            {seccion === item.id && <div style={{ marginLeft: 'auto', width: '4px', height: '4px', borderRadius: '50%', background: '#63b3ed', boxShadow: '0 0 6px #63b3ed' }} />}
                        </button>
                    ))}
                </nav>

                <div style={{ padding: '24px 28px', borderTop: '1px solid rgba(99,179,237,0.1)' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
                        <div style={{
                            width: '36px', height: '36px', borderRadius: '50%',
                            background: 'linear-gradient(135deg, #63b3ed, #3182ce)',
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                            fontSize: '14px', fontWeight: '600',
                        }}>
                            {user?.nombre?.[0]?.toUpperCase()}
                        </div>
                        <div>
                            <p style={{ fontSize: '13px', fontWeight: '500', margin: 0 }}>{user?.nombre}</p>
                            <p style={{ fontSize: '11px', color: '#63b3ed', margin: 0, letterSpacing: '1px' }}>Administrador</p>
                        </div>
                    </div>
                    <button onClick={handleLogout} style={{
                        width: '100%', background: 'transparent',
                        border: '1px solid rgba(99,179,237,0.2)',
                        color: 'rgba(255,255,255,0.4)', padding: '8px',
                        fontSize: '11px', letterSpacing: '2px',
                        textTransform: 'uppercase', cursor: 'pointer',
                    }}
                    onMouseEnter={e => { e.currentTarget.style.borderColor = '#63b3ed'; e.currentTarget.style.color = '#63b3ed' }}
                    onMouseLeave={e => { e.currentTarget.style.borderColor = 'rgba(99,179,237,0.2)'; e.currentTarget.style.color = 'rgba(255,255,255,0.4)' }}
                    >Cerrar Sesión</button>
                </div>
            </div>

            {/* Topbar móvil */}
            <div className="admin-topbar" style={{
                display: 'none', position: 'fixed', top: 0, left: 0, right: 0, zIndex: 98,
                background: 'rgba(2,8,24,0.95)', backdropFilter: 'blur(10px)',
                borderBottom: '1px solid rgba(99,179,237,0.1)',
                padding: '12px 16px', alignItems: 'center', justifyContent: 'space-between',
            }}>
                <img src="/logo.png" alt="Fitt-y-Nova" style={{ height: '36px' }} />
                <button onClick={() => setSidebarOpen(!sidebarOpen)} style={{
                    background: 'transparent', border: '1px solid rgba(99,179,237,0.3)',
                    color: '#63b3ed', padding: '8px 12px', fontSize: '18px',
                    cursor: 'pointer', borderRadius: '4px',
                }}>☰</button>
            </div>

            {/* Main */}
            <div className="admin-main" style={{ marginLeft: '260px', flex: 1, padding: '48px', overflowY: 'auto' }}>

                {/* Dashboard */}
                {seccion === 'dashboard' && (
                    <div>
                        <p style={{ color: '#63b3ed', fontSize: '11px', letterSpacing: '4px', textTransform: 'uppercase', marginBottom: '8px' }}>Bienvenido de vuelta</p>
                        <h1 className="admin-titulo" style={{ fontFamily: "'Bebas Neue'", fontSize: '48px', letterSpacing: '6px', margin: '0 0 40px', background: 'linear-gradient(135deg, #fff 0%, #63b3ed 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
                            DASHBOARD
                        </h1>
                        {stats ? (
                            <>
                                <div className="admin-stats-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '20px', marginBottom: '32px' }}>
                                    {[
                                        { label: 'Clientes', value: stats.total_clientes, icon: '👤', color: '#63b3ed' },
                                        { label: 'Vendedores', value: stats.total_vendedores, icon: '🏪', color: '#68d391' },
                                        { label: 'Productos', value: stats.total_productos, icon: '👗', color: '#f6ad55' },
                                        { label: 'Pedidos', value: stats.total_pedidos, icon: '📦', color: '#fc8181' },
                                    ].map(stat => (
                                        <div key={stat.label} className="stat-card" style={{
                                            background: 'linear-gradient(135deg, rgba(10,22,40,0.8) 0%, rgba(5,13,26,0.8) 100%)',
                                            border: '1px solid rgba(99,179,237,0.12)',
                                            padding: '24px 20px', borderRadius: '8px',
                                            transition: 'all 0.3s', position: 'relative', overflow: 'hidden',
                                        }}>
                                            <div style={{ position: 'absolute', top: 0, right: 0, width: '80px', height: '80px', background: `radial-gradient(circle, ${stat.color}15 0%, transparent 70%)` }} />
                                            <div style={{ fontSize: '22px', marginBottom: '10px' }}>{stat.icon}</div>
                                            <div style={{ fontSize: '32px', fontWeight: '700', marginBottom: '6px', color: stat.color }}>{stat.value}</div>
                                            <div style={{ color: 'rgba(255,255,255,0.4)', fontSize: '10px', letterSpacing: '2px', textTransform: 'uppercase' }}>{stat.label}</div>
                                        </div>
                                    ))}
                                </div>
                                <div style={{
                                    background: 'linear-gradient(135deg, rgba(99,179,237,0.08) 0%, rgba(49,130,206,0.04) 100%)',
                                    border: '1px solid rgba(99,179,237,0.2)',
                                    padding: '28px 32px', borderRadius: '8px', marginBottom: '24px',
                                    display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                                }}>
                                    <div>
                                        <p style={{ color: '#63b3ed', fontSize: '11px', letterSpacing: '3px', textTransform: 'uppercase', marginBottom: '8px' }}>Ingresos Totales</p>
                                        <p style={{ fontSize: '40px', fontWeight: '700', margin: 0, background: 'linear-gradient(135deg, #fff, #63b3ed)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
                                            {parseFloat(stats.ingresos_totales || 0).toFixed(2)} €
                                        </p>
                                    </div>
                                    <div style={{ fontSize: '48px', opacity: 0.2 }}>💰</div>
                                </div>
                                <div style={{ background: 'linear-gradient(135deg, rgba(10,22,40,0.8) 0%, rgba(5,13,26,0.8) 100%)', border: '1px solid rgba(99,179,237,0.12)', padding: '28px', borderRadius: '8px' }}>
                                    <p style={{ color: '#63b3ed', fontSize: '11px', letterSpacing: '3px', textTransform: 'uppercase', marginBottom: '20px' }}>Pedidos por Estado</p>
                                    <div className="admin-stats-grid-2" style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
                                        {stats.pedidos_por_estado?.map(p => (
                                            <div key={p.estado} style={{
                                                background: 'rgba(99,179,237,0.06)', border: '1px solid rgba(99,179,237,0.15)',
                                                padding: '16px 20px', borderRadius: '6px', textAlign: 'center', flex: '1', minWidth: '100px',
                                            }}>
                                                <div style={{ fontSize: '24px', fontWeight: '700', color: estadoColors[p.estado] || '#63b3ed' }}>{p.total}</div>
                                                <div style={{ color: 'rgba(255,255,255,0.4)', fontSize: '10px', letterSpacing: '2px', textTransform: 'uppercase', marginTop: '6px' }}>{p.estado}</div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </>
                        ) : (
                            <p style={{ color: '#63b3ed', letterSpacing: '4px', fontSize: '12px' }}>CARGANDO...</p>
                        )}
                    </div>
                )}

                {/* Usuarios */}
                {seccion === 'usuarios' && (
                    <div>
                        <p style={{ color: '#63b3ed', fontSize: '11px', letterSpacing: '4px', textTransform: 'uppercase', marginBottom: '8px' }}>Gestión</p>
                        <h1 className="admin-titulo" style={{ fontFamily: "'Bebas Neue'", fontSize: '48px', letterSpacing: '6px', margin: '0 0 40px', background: 'linear-gradient(135deg, #fff 0%, #63b3ed 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
                            USUARIOS
                        </h1>
                        {loading ? <p style={{ color: '#63b3ed', letterSpacing: '4px' }}>CARGANDO...</p> : (
                            <div style={{ display: 'grid', gap: '12px' }}>
                                {usuarios.map(u => (
                                    <div key={u.id} className="admin-usuario-row" style={{
                                        background: 'rgba(10,22,40,0.8)', border: '1px solid rgba(99,179,237,0.12)',
                                        borderRadius: '8px', padding: '16px 20px',
                                        display: 'flex', alignItems: 'center', gap: '16px',
                                    }}>
                                        <div style={{
                                            width: '40px', height: '40px', borderRadius: '50%', flexShrink: 0,
                                            background: u.rol_id === 2 ? 'linear-gradient(135deg, #68d391, #38a169)' : 'linear-gradient(135deg, #63b3ed, #3182ce)',
                                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                                            fontSize: '16px', fontWeight: '600',
                                        }}>
                                            {u.nombre?.[0]?.toUpperCase()}
                                        </div>
                                        <div style={{ flex: 1, minWidth: 0 }}>
                                            <p style={{ fontSize: '13px', fontWeight: '500', margin: '0 0 2px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{u.nombre} {u.apellidos}</p>
                                            <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: '11px', margin: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{u.email}</p>
                                        </div>
                                        <span style={{
                                            background: u.rol_id === 2 ? 'rgba(104,211,145,0.1)' : 'rgba(99,179,237,0.1)',
                                            border: `1px solid ${u.rol_id === 2 ? 'rgba(104,211,145,0.3)' : 'rgba(99,179,237,0.3)'}`,
                                            color: u.rol_id === 2 ? '#68d391' : '#63b3ed',
                                            padding: '4px 10px', borderRadius: '4px',
                                            fontSize: '10px', letterSpacing: '2px', textTransform: 'uppercase', flexShrink: 0,
                                        }}>
                                            {u.rol?.nombre}
                                        </span>
                                        <span style={{ color: u.activo ? '#68d391' : '#fc8181', fontSize: '11px', flexShrink: 0 }}>
                                            {u.activo ? '● Activo' : '● Inactivo'}
                                        </span>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                )}

                {/* Productos */}
                {seccion === 'productos' && (
                    <div>
                        <p style={{ color: '#63b3ed', fontSize: '11px', letterSpacing: '4px', textTransform: 'uppercase', marginBottom: '8px' }}>Gestión</p>
                        <h1 className="admin-titulo" style={{ fontFamily: "'Bebas Neue'", fontSize: '48px', letterSpacing: '6px', margin: '0 0 40px', background: 'linear-gradient(135deg, #fff 0%, #63b3ed 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
                            PRODUCTOS
                        </h1>
                        {loading ? <p style={{ color: '#63b3ed', letterSpacing: '4px' }}>CARGANDO...</p> : (
                            <div style={{ display: 'grid', gap: '12px' }}>
                                {productos.map(p => (
                                    <div key={p.id} style={{
                                        background: 'rgba(10,22,40,0.8)', border: '1px solid rgba(99,179,237,0.12)',
                                        borderRadius: '8px', padding: '16px 20px',
                                        display: 'flex', alignItems: 'center', gap: '16px',
                                    }}>
                                        <div style={{ width: '48px', height: '48px', background: '#0a1628', borderRadius: '4px', overflow: 'hidden', flexShrink: 0 }}>
                                            {p.imagenes?.[0] && <img src={p.imagenes[0].url} alt={p.nombre} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />}
                                        </div>
                                        <div style={{ flex: 1, minWidth: 0 }}>
                                            <p style={{ fontSize: '13px', fontWeight: '500', margin: '0 0 2px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{p.nombre}</p>
                                            <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: '11px', margin: 0 }}>{p.categoria?.nombre} · {parseFloat(p.precio_base).toFixed(2)} €</p>
                                        </div>
                                        <button onClick={() => toggleProducto(p)} style={{
                                            background: p.activo ? 'rgba(104,211,145,0.1)' : 'rgba(252,129,129,0.1)',
                                            border: `1px solid ${p.activo ? 'rgba(104,211,145,0.3)' : 'rgba(252,129,129,0.3)'}`,
                                            color: p.activo ? '#68d391' : '#fc8181',
                                            padding: '6px 14px', borderRadius: '4px',
                                            fontSize: '10px', letterSpacing: '2px', textTransform: 'uppercase',
                                            cursor: 'pointer', flexShrink: 0,
                                        }}>
                                            {p.activo ? 'Activo' : 'Inactivo'}
                                        </button>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                )}

                {/* Pedidos */}
                {seccion === 'pedidos' && (
                    <div>
                        <p style={{ color: '#63b3ed', fontSize: '11px', letterSpacing: '4px', textTransform: 'uppercase', marginBottom: '8px' }}>Gestión</p>
                        <h1 className="admin-titulo" style={{ fontFamily: "'Bebas Neue'", fontSize: '48px', letterSpacing: '6px', margin: '0 0 40px', background: 'linear-gradient(135deg, #fff 0%, #63b3ed 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
                            PEDIDOS
                        </h1>
                        {loading ? <p style={{ color: '#63b3ed', letterSpacing: '4px' }}>CARGANDO...</p> : (
                            <div style={{ display: 'grid', gap: '12px' }}>
                                {pedidos.map(pedido => (
                                    <div key={pedido.id} className="admin-pedido-row" style={{
                                        background: 'rgba(10,22,40,0.8)', border: '1px solid rgba(99,179,237,0.12)',
                                        borderRadius: '8px', padding: '20px',
                                        display: 'flex', alignItems: 'center', gap: '20px',
                                    }}>
                                        <div style={{ flex: 1, minWidth: 0 }}>
                                            <p style={{ color: '#63b3ed', fontSize: '11px', letterSpacing: '2px', textTransform: 'uppercase', margin: '0 0 4px' }}>
                                                Pedido #{pedido.id}
                                            </p>
                                            <p style={{ fontSize: '13px', margin: '0 0 4px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                                                Cliente: {pedido.cliente?.nombre} {pedido.cliente?.apellidos}
                                            </p>
                                            <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: '12px', margin: 0 }}>
                                                {new Date(pedido.created_at).toLocaleDateString('es-ES')} · {parseFloat(pedido.total).toFixed(2)} €
                                            </p>
                                        </div>
                                        <select className="admin-pedido-select"
                                            value={pedido.estado}
                                            onChange={e => cambiarEstadoPedido(pedido.id, e.target.value)}
                                            style={{
                                                background: '#0a1628', border: '1px solid rgba(99,179,237,0.2)',
                                                color: estadoColors[pedido.estado] || '#fff',
                                                padding: '8px 16px', borderRadius: '4px',
                                                fontSize: '12px', letterSpacing: '1px', cursor: 'pointer',
                                                outline: 'none', flexShrink: 0,
                                            }}
                                        >
                                            {['pendiente', 'confirmado', 'enviado', 'entregado', 'cancelado', 'devuelto'].map(e => (
                                                <option key={e} value={e}>{e}</option>
                                            ))}
                                        </select>
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