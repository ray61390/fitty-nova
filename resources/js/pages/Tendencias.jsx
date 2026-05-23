import React from 'react'
import Navbar from '../components/Navbar'
import TendenciasComponent from '../components/Tendencias'

export default function Tendencias() {
    return (
        <div style={{ background: '#020818', minHeight: '100vh' }}>
            <Navbar />
            <div style={{ paddingTop: '80px' }}>
                <TendenciasComponent />
            </div>
        </div>
    )
}