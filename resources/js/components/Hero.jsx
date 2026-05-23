import React from 'react'

export default function Hero() {
    return (
        <section style={{
            position: 'relative',
            height: '100vh',
            overflow: 'hidden',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
        }}>
            <style>{`
                @keyframes ticker {
                    0% { transform: translateX(0); }
                    100% { transform: translateX(-50%); }
                }
                @media (max-width: 768px) {
                    .hero-logo { width: 260px !important; }
                    .hero-tagline { font-size: 16px !important; letter-spacing: 5px !important; }
                    .hero-cta { padding: 12px 32px !important; font-size: 12px !important; }
                    .hero-ticker { font-size: 10px !important; }
                }
            `}</style>

            {/* Video background */}
            <video autoPlay muted loop playsInline style={{
                position: 'absolute', top: 0, left: 0,
                width: '100%', height: '100%',
                objectFit: 'cover', zIndex: 0,
            }}>
                <source src="/video/hero.mp4" type="video/mp4" />
            </video>

            {/* Overlay */}
            <div style={{
                position: 'absolute', inset: 0,
                background: 'linear-gradient(to bottom, rgba(0,0,0,0.3), rgba(0,0,0,0.7))',
                zIndex: 1,
            }} />

            {/* Content */}
            <div style={{
                position: 'relative', zIndex: 2,
                textAlign: 'center',
                display: 'flex', flexDirection: 'column',
                alignItems: 'center', justifyContent: 'center',
                width: '100%', padding: '0 20px',
            }}>
                <img src="/logo.png" alt="Fitt-y-Nova" className="hero-logo" style={{
                    width: '400px', maxWidth: '80vw',
                    marginBottom: '20px', display: 'block', margin: '0 auto 20px',
                }} />

                <p className="hero-tagline" style={{
                    fontFamily: "'Bebas Neue', cursive",
                    fontSize: '22px', letterSpacing: '8px',
                    textTransform: 'uppercase', opacity: 0.9,
                    marginBottom: '40px', color: '#f5f5f5',
                }}>
                    Fashion Flow Passion
                </p>

                <button className="hero-cta" style={{
                    background: 'transparent', border: '1px solid #fff',
                    color: '#fff', padding: '14px 48px', fontSize: '13px',
                    letterSpacing: '4px', textTransform: 'uppercase', cursor: 'pointer',
                    transition: 'all 0.3s',
                }}
                onMouseEnter={e => { e.currentTarget.style.background = '#fff'; e.currentTarget.style.color = '#000' }}
                onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = '#fff' }}
                >
                    Shop Now
                </button>
            </div>

            {/* Ticker */}
            <div style={{
                position: 'absolute', bottom: 0, left: 0, right: 0, zIndex: 3,
                background: 'rgba(255,255,255,0.05)', backdropFilter: 'blur(4px)',
                padding: '12px 0', overflow: 'hidden', whiteSpace: 'nowrap',
            }}>
                <div className="hero-ticker" style={{
                    display: 'inline-block', animation: 'ticker 20s linear infinite',
                    fontSize: '12px', letterSpacing: '4px', textTransform: 'uppercase',
                    color: '#fff', opacity: 0.6,
                }}>
                    {Array(6).fill('FASHION FLOW PASSION / NEW DROP / FITT-Y-NOVA / ').join('')}
                </div>
            </div>
        </section>
    )
}