import React from 'react'
import Navbar from '../components/Navbar'
import Hero from '../components/Hero'
import SeccionProductos from '../components/SeccionProductos'
import Tendencias from '../components/Tendencias'
export default function Home() {
    return (
        <div style={{ background: '#050a1a', minHeight: '100vh' }}>
            <Navbar />
            <Hero />
            <SeccionProductos />
          {/* <Tendencias /> */}
            
        </div>
    )
}