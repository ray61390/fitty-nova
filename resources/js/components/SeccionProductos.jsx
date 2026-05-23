import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import api from '../services/api'
import ProductoCard from './ProductoCard'

export default function SeccionProductos() {
    const [productos, setProductos] = useState([])
    const [todosProductos, setTodosProductos] = useState([])
    const [categorias, setCategorias] = useState([])
    const [categoriaActiva, setCategoriaActiva] = useState(null)
    const [loading, setLoading] = useState(true)
    const [pagina, setPagina] = useState(1)
    const [totalPaginas, setTotalPaginas] = useState(1)
    const [busqueda, setBusqueda] = useState('')
    const [sugerencias, setSugerencias] = useState([])
    const [mostrarSugerencias, setMostrarSugerencias] = useState(false)
    const navigate = useNavigate()

    useEffect(() => {
        api.get('/categorias').then(res => setCategorias(res.data))
        api.get('/productos?page=1').then(res => setTodosProductos(res.data.data || []))
    }, [])

    useEffect(() => {
        setLoading(true)
        let url = `/productos?page=${pagina}`
        if (categoriaActiva) url += `&categoria_id=${categoriaActiva}`
        api.get(url).then(res => {
            setProductos(res.data.data)
            setTotalPaginas(res.data.last_page)
            setLoading(false)
        })
    }, [categoriaActiva, pagina])

    const cambiarCategoria = (id) => {
        setCategoriaActiva(id)
        setPagina(1)
        setBusqueda('')
        setMostrarSugerencias(false)
    }

    const handleBusqueda = (valor) => {
        setBusqueda(valor)
        if (valor.length > 1) {
            const filtradas = todosProductos
                .filter(p => p.nombre.toLowerCase().includes(valor.toLowerCase()))
                .slice(0, 5)
            setSugerencias(filtradas)
            setMostrarSugerencias(true)
        } else {
            setSugerencias([])
            setMostrarSugerencias(false)
        }
    }

    const buscarProducto = (nombre) => {
        setBusqueda(nombre)
        setMostrarSugerencias(false)
        setCategoriaActiva(null)
        setPagina(1)
        setLoading(true)
        api.get(`/productos?buscar=${nombre}`).then(res => {
            setProductos(res.data.data)
            setTotalPaginas(res.data.last_page)
            setLoading(false)
        })
    }

    return (
        <section style={{ background: '#050a1a', padding: '100px 40px' }}>
            <style>{`
                @media (max-width: 768px) {
                    .seccion-padding { padding: 80px 16px !important; }
                    .seccion-titulo { font-size: 36px !important; letter-spacing: 5px !important; }
                    .filtros-scroll { 
                        display: flex !important;
                        overflowX: auto !important;
                        justifyContent: flex-start !important;
                        flexWrap: nowrap !important;
                        paddingBottom: 8px !important;
                        gap: 8px !important;
                        scrollbarWidth: none !important;
                    }
                    .filtros-scroll::-webkit-scrollbar { display: none; }
                    .filtro-btn { 
                        padding: 7px 16px !important; 
                        fontSize: 10px !important;
                        whiteSpace: nowrap !important;
                        flexShrink: 0 !important;
                    }
                    .productos-grid {
                        grid-template-columns: repeat(2, 1fr) !important;
                        gap: 12px !important;
                    }
                    .paginacion-btn { width: 36px !important; height: 36px !important; font-size: 12px !important; }
                }
                @media (max-width: 400px) {
                    .productos-grid {
                        grid-template-columns: 1fr !important;
                    }
                }
            `}</style>

            <div className="seccion-padding" style={{ padding: '0' }}>
                <div style={{ textAlign: 'center', marginBottom: '40px' }}>
                    <h2 className="seccion-titulo" style={{
                        color: '#fff', fontFamily: "'Bebas Neue', sans-serif",
                        fontSize: '48px', letterSpacing: '8px', marginBottom: '16px',
                    }}>COLECCIÓN</h2>
                    <div style={{ width: '60px', height: '1px', background: '#fff', margin: '0 auto' }} />
                </div>

                {/* Buscador */}
                <div style={{ position: 'relative', maxWidth: '500px', margin: '0 auto 40px', padding: '0 0px' }}>
                    <input
                        type="text"
                        placeholder="Buscar productos..."
                        value={busqueda}
                        onChange={e => handleBusqueda(e.target.value)}
                        onKeyDown={e => e.key === 'Enter' && buscarProducto(busqueda)}
                        style={{
                            width: '100%',
                            background: 'rgba(99,179,237,0.04)',
                            border: '1px solid rgba(99,179,237,0.2)',
                            color: '#fff', padding: '14px 48px 14px 20px',
                            fontSize: '13px', letterSpacing: '1px',
                            outline: 'none', borderRadius: '4px', boxSizing: 'border-box',
                        }}
                    />
                    <button onClick={() => buscarProducto(busqueda)} style={{
                        position: 'absolute', right: '12px', top: '50%',
                        transform: 'translateY(-50%)',
                        background: 'transparent', border: 'none',
                        color: '#63b3ed', cursor: 'pointer', fontSize: '16px',
                    }}>🔍</button>

                    {mostrarSugerencias && sugerencias.length > 0 && (
                        <div style={{
                            position: 'absolute', top: '100%', left: 0, right: 0,
                            background: '#0a1628',
                            border: '1px solid rgba(99,179,237,0.2)',
                            borderTop: 'none', borderRadius: '0 0 4px 4px', zIndex: 100,
                        }}>
                            {sugerencias.map(p => (
                                <div key={p.id} onClick={() => navigate(`/producto/${p.id}`)}
                                    style={{
                                        padding: '12px 20px', cursor: 'pointer',
                                        display: 'flex', alignItems: 'center', gap: '12px',
                                        borderBottom: '1px solid rgba(99,179,237,0.08)',
                                    }}
                                    onMouseEnter={e => e.currentTarget.style.background = 'rgba(99,179,237,0.08)'}
                                    onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                                >
                                    {p.imagenes?.[0] && (
                                        <img src={p.imagenes[0].url} alt={p.nombre}
                                            style={{ width: '36px', height: '36px', objectFit: 'cover', borderRadius: '4px' }} />
                                    )}
                                    <div>
                                        <p style={{ fontSize: '13px', margin: 0 }}>{p.nombre}</p>
                                        <p style={{ fontSize: '11px', color: '#63b3ed', margin: 0 }}>{parseFloat(p.precio_base).toFixed(2)} €</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {/* Filtros categorías */}
                <div className="filtros-scroll" style={{
                    display: 'flex', gap: '12px', justifyContent: 'center',
                    marginBottom: '60px', flexWrap: 'wrap',
                    overflowX: 'auto', paddingBottom: '4px',
                }}>
                    <button className="filtro-btn" onClick={() => cambiarCategoria(null)} style={{
                        background: categoriaActiva === null ? '#fff' : 'transparent',
                        color: categoriaActiva === null ? '#000' : '#fff',
                        border: '1px solid rgba(255,255,255,0.3)',
                        padding: '8px 24px', fontSize: '11px',
                        letterSpacing: '3px', textTransform: 'uppercase', cursor: 'pointer',
                        flexShrink: 0, whiteSpace: 'nowrap',
                    }}>Todos</button>
                    {categorias.map(cat => (
                        <button className="filtro-btn" key={cat.id} onClick={() => cambiarCategoria(cat.id)} style={{
                            background: categoriaActiva === cat.id ? '#fff' : 'transparent',
                            color: categoriaActiva === cat.id ? '#000' : '#fff',
                            border: '1px solid rgba(255,255,255,0.3)',
                            padding: '8px 24px', fontSize: '11px',
                            letterSpacing: '3px', textTransform: 'uppercase', cursor: 'pointer',
                            flexShrink: 0, whiteSpace: 'nowrap',
                        }}>{cat.nombre}</button>
                    ))}
                </div>

                {loading ? (
                    <div style={{ textAlign: 'center', color: 'rgba(255,255,255,0.4)', letterSpacing: '4px' }}>CARGANDO...</div>
                ) : productos.length === 0 ? (
                    <div style={{ textAlign: 'center', color: 'rgba(255,255,255,0.4)', letterSpacing: '4px' }}>NO HAY PRODUCTOS</div>
                ) : (
                    <div className="productos-grid" style={{
                        display: 'grid',
                        gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))',
                        gap: '24px', maxWidth: '1400px', margin: '0 auto',
                    }}>
                        {productos.map(producto => (
                            <ProductoCard key={producto.id} producto={producto} />
                        ))}
                    </div>
                )}

                {totalPaginas > 1 && (
                    <div style={{ display: 'flex', justifyContent: 'center', gap: '12px', marginTop: '60px', flexWrap: 'wrap' }}>
                        {Array.from({ length: totalPaginas }, (_, i) => i + 1).map(p => (
                            <button className="paginacion-btn" key={p} onClick={() => setPagina(p)} style={{
                                background: pagina === p ? '#fff' : 'transparent',
                                color: pagina === p ? '#000' : '#fff',
                                border: '1px solid rgba(255,255,255,0.3)',
                                width: '40px', height: '40px',
                                fontSize: '13px', cursor: 'pointer',
                            }}>{p}</button>
                        ))}
                    </div>
                )}
            </div>
        </section>
    )
}