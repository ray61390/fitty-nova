import React from 'react'
import Navbar from '../components/Navbar'
import OutfitGenerator from '../components/OutfitGenerator'

export default function Outfits() {
    return (
        <div style={{ background: '#020818', minHeight: '100vh' }}>
            <Navbar />
            <div style={{ paddingTop: '80px' }}>
                <OutfitGenerator />
            </div>
        </div>
    )
}