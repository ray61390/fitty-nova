import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { useCart } from '../context/CartContext'
import { useLang } from '../context/LangContext'

export default function Navbar() {
    const [menuOpen, setMenuOpen] = useState(false)
    const navigate = useNavigate()
    const { user, logout } = useAuth()
    const { totalItems } = useCart()
    const { lang, setLang, t } = useLang()

    const links = [
        { label: t.productos, href: '/' },
        { label: t.tendencias, href: '/tendencias' },
        { label: t.outfits, href: '/outfits' },
        { label: t.ruleta, href: '/ruleta' },
    ]

    const handleNav = (href) => {
        setMenuOpen(false)
        navigate(href)
    }

    return (
        <>
            <style>{`
                @media (max-width: 768px) {
                    .nav-links { display: none !important; }
                    .nav-actions { display: none !important; }
                    .nav-hamburger { display: flex !important; }
                    .nav-logo { height: 48px !important; }
                }
                @media (min-width: 769px) {
                    .nav-hamburger { display: none !important; }
                    .mobile-menu { display: none !important; }
                }
            `}</style>

            <nav style={{
                position: 'fixed', top: 0, left: 0, right: 0, zIndex: 1000,
                display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                padding: '16px 40px',
                background: 'rgba(0,0,0,0.3)', backdropFilter: 'blur(10px)',
            }}>
                {/* Logo */}
                <img
                    src="/logo.png"
                    alt="Fitt-y-Nova"
                    className="nav-logo"
                    style={{ height: '70px', cursor: 'pointer' }}
                    onClick={() => handleNav('/')}
                />

                {/* Links escritorio */}
                <ul className="nav-links" style={{ display: 'flex', gap: '40px', listStyle: 'none', margin: 0, padding: 0 }}>
                    {links.map(link => (
                        <li key={link.label}>
                            <a href={link.href} style={{ color: '#fff', textDecoration: 'none', fontSize: '13px', letterSpacing: '2px', textTransform: 'uppercase', opacity: 0.8 }}
                                onMouseEnter={e => e.target.style.opacity = 1}
                                onMouseLeave={e => e.target.style.opacity = 0.8}>
                                {link.label}
                            </a>
                        </li>
                    ))}
                </ul>

                {/* Acciones escritorio */}
                <div className="nav-actions" style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                    <select value={lang} onChange={e => setLang(e.target.value)} style={{
                        background: 'transparent', border: '1px solid rgba(255,255,255,0.3)',
                        color: '#fff', padding: '6px 10px', fontSize: '12px',
                        cursor: 'pointer', borderRadius: '4px', outline: 'none',
                    }}>
                        <option value="es" style={{ background: '#020818' }}>ES</option>
                        <option value="en" style={{ background: '#020818' }}>EN</option>
                        <option value="fr" style={{ background: '#020818' }}>FR</option>
                    </select>

                    <button onClick={() => navigate('/carrito')} style={{
                        position: 'relative', background: 'transparent',
                        border: '1px solid rgba(255,255,255,0.4)',
                        color: '#fff', padding: '8px 16px',
                        fontSize: '18px', cursor: 'pointer', borderRadius: '4px',
                    }}>
                        🛒
                        {totalItems > 0 && (
                            <span style={{
                                position: 'absolute', top: '-8px', right: '-8px',
                                background: '#63b3ed', color: '#000',
                                borderRadius: '50%', width: '18px', height: '18px',
                                fontSize: '10px', fontWeight: '700',
                                display: 'flex', alignItems: 'center', justifyContent: 'center',
                            }}>{totalItems}</span>
                        )}
                    </button>

                    {user ? (
                        <>
                            <span onClick={() => navigate('/perfil')} style={{ color: '#fff', fontSize: '12px', letterSpacing: '1px', cursor: 'pointer', opacity: 0.8 }}
                                onMouseEnter={e => e.target.style.opacity = 1}
                                onMouseLeave={e => e.target.style.opacity = 0.8}>
                                {user.nombre}
                            </span>
                            {(user.rol_id === 1 || user.rol_id === 2) && (
                                <button onClick={() => { user.rol_id === 1 ? navigate('/admin') : navigate('/vendedor') }} style={{
                                    background: 'transparent', border: '1px solid rgba(255,255,255,0.4)',
                                    color: '#fff', padding: '8px 20px', fontSize: '12px',
                                    letterSpacing: '2px', textTransform: 'uppercase', cursor: 'pointer',
                                }}>{t.panel}</button>
                            )}
                            <button onClick={logout} style={{
                                background: 'transparent', border: '1px solid rgba(255,255,255,0.4)',
                                color: '#fff', padding: '8px 20px', fontSize: '12px',
                                letterSpacing: '2px', textTransform: 'uppercase', cursor: 'pointer',
                            }}>{t.salir}</button>
                        </>
                    ) : (
                        <>
                            <button onClick={() => navigate('/login')} style={{
                                background: 'transparent', border: '1px solid rgba(255,255,255,0.4)',
                                color: '#fff', padding: '8px 20px', fontSize: '12px',
                                letterSpacing: '2px', textTransform: 'uppercase', cursor: 'pointer',
                            }}>{t.login}</button>
                            <button onClick={() => navigate('/login?modo=registro')} style={{
                                background: '#fff', border: '1px solid #fff',
                                color: '#000', padding: '8px 20px', fontSize: '12px',
                                letterSpacing: '2px', textTransform: 'uppercase', cursor: 'pointer',
                            }}>{t.registro}</button>
                        </>
                    )}
                </div>

                {/* Hamburguesa movil */}
                <div className="nav-hamburger" style={{ display: 'none', alignItems: 'center', gap: '12px' }}>
                    <button onClick={() => navigate('/carrito')} style={{
                        position: 'relative', background: 'transparent',
                        border: '1px solid rgba(255,255,255,0.4)',
                        color: '#fff', padding: '6px 12px',
                        fontSize: '16px', cursor: 'pointer', borderRadius: '4px',
                    }}>
                        🛒
                        {totalItems > 0 && (
                            <span style={{
                                position: 'absolute', top: '-6px', right: '-6px',
                                background: '#63b3ed', color: '#000',
                                borderRadius: '50%', width: '16px', height: '16px',
                                fontSize: '9px', fontWeight: '700',
                                display: 'flex', alignItems: 'center', justifyContent: 'center',
                            }}>{totalItems}</span>
                        )}
                    </button>
                    <button onClick={() => setMenuOpen(!menuOpen)} style={{
                        background: 'transparent', border: '1px solid rgba(255,255,255,0.4)',
                        color: '#fff', padding: '8px 12px', fontSize: '18px',
                        cursor: 'pointer', borderRadius: '4px', lineHeight: 1,
                    }}>
                        {menuOpen ? '✕' : '☰'}
                    </button>
                </div>
            </nav>

            {/* Menu movil desplegable */}
            <div className="mobile-menu" style={{
                position: 'fixed', top: '80px', left: 0, right: 0, zIndex: 999,
                background: 'rgba(2,8,24,0.97)', backdropFilter: 'blur(10px)',
                borderBottom: '1px solid rgba(99,179,237,0.15)',
                padding: '24px 24px 32px',
                transform: menuOpen ? 'translateY(0)' : 'translateY(-110%)',
                transition: 'transform 0.3s ease',
            }}>
                {/* Links */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', marginBottom: '24px' }}>
                    {links.map(link => (
                        <a key={link.label} href={link.href} onClick={() => setMenuOpen(false)} style={{
                            color: '#fff', textDecoration: 'none', fontSize: '14px',
                            letterSpacing: '2px', textTransform: 'uppercase',
                            padding: '12px 0', borderBottom: '1px solid rgba(255,255,255,0.06)',
                            opacity: 0.8,
                        }}>
                            {link.label}
                        </a>
                    ))}
                </div>

                {/* Selector idioma */}
                <select value={lang} onChange={e => { setLang(e.target.value); }} style={{
                    background: 'rgba(99,179,237,0.08)', border: '1px solid rgba(99,179,237,0.2)',
                    color: '#fff', padding: '10px 14px', fontSize: '13px',
                    cursor: 'pointer', borderRadius: '4px', outline: 'none',
                    width: '100%', marginBottom: '16px',
                }}>
                    <option value="es" style={{ background: '#020818' }}>Espanol</option>
                    <option value="en" style={{ background: '#020818' }}>English</option>
                    <option value="fr" style={{ background: '#020818' }}>Francais</option>
                </select>

                {/* Acciones usuario */}
                {user ? (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                        <button onClick={() => handleNav('/perfil')} style={{
                            background: 'rgba(99,179,237,0.08)', border: '1px solid rgba(99,179,237,0.2)',
                            color: '#63b3ed', padding: '12px', fontSize: '12px',
                            letterSpacing: '2px', textTransform: 'uppercase', cursor: 'pointer', borderRadius: '4px',
                        }}>
                            {user.nombre} — Mi perfil
                        </button>
                        {(user.rol_id === 1 || user.rol_id === 2) && (
                            <button onClick={() => handleNav(user.rol_id === 1 ? '/admin' : '/vendedor')} style={{
                                background: 'rgba(99,179,237,0.08)', border: '1px solid rgba(99,179,237,0.2)',
                                color: '#63b3ed', padding: '12px', fontSize: '12px',
                                letterSpacing: '2px', textTransform: 'uppercase', cursor: 'pointer', borderRadius: '4px',
                            }}>{t.panel}</button>
                        )}
                        <button onClick={() => { logout(); setMenuOpen(false) }} style={{
                            background: 'transparent', border: '1px solid rgba(255,255,255,0.2)',
                            color: 'rgba(255,255,255,0.5)', padding: '12px', fontSize: '12px',
                            letterSpacing: '2px', textTransform: 'uppercase', cursor: 'pointer', borderRadius: '4px',
                        }}>{t.salir}</button>
                    </div>
                ) : (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                        <button onClick={() => handleNav('/login')} style={{
                            background: 'transparent', border: '1px solid rgba(255,255,255,0.3)',
                            color: '#fff', padding: '12px', fontSize: '12px',
                            letterSpacing: '2px', textTransform: 'uppercase', cursor: 'pointer', borderRadius: '4px',
                        }}>{t.login}</button>
                        <button onClick={() => handleNav('/login?modo=registro')} style={{
                            background: '#fff', border: '1px solid #fff',
                            color: '#000', padding: '12px', fontSize: '12px',
                            letterSpacing: '2px', textTransform: 'uppercase', cursor: 'pointer', borderRadius: '4px',
                        }}>{t.registro}</button>
                    </div>
                )}
            </div>
        </>
    )
}