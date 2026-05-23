import React from 'react'
import Navbar from '../components/Navbar'
import RuletaComponent from '../components/Ruleta'

export default function Ruleta() {
    return (
        <div style={{ background: '#020818', minHeight: '100vh' }}>
            <Navbar />
            <div style={{ paddingTop: '80px' }}>
                <RuletaComponent />
            </div>
        </div>
    )
}