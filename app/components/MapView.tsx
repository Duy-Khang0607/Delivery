import { MapContainer, Marker, Popup, TileLayer, useMap } from 'react-leaflet'
import L, { LatLngExpression } from 'leaflet'
import { useEffect } from 'react'
import "leaflet/dist/leaflet.css";


const MapView = ({ position, setPosition }: { position: [number, number] | null, setPosition: (position: [number, number]) => void }) => {

    if (!position) return null

    const markerIcon = new L.Icon({
        iconUrl: 'https://cdn-icons-png.flaticon.com/128/684/684908.png',
        shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
        iconSize: [40, 40],
        iconAnchor: [15, 46],
        popupAnchor: [1, -34],
        shadowSize: [41, 41]
    })

    const DraggableMarker: React.FC<{ position: [number, number] | null }> = ({ position }) => {
        if (!position) return null

        const map = useMap()

        useEffect(() => {
            map.setView(position as LatLngExpression, 13, { animate: true })
        }, [map, position])

        return (
            <Marker icon={markerIcon} position={position} draggable={true}
                eventHandlers={{
                    dragend: (e: L.LeafletEvent) => {
                        const marker = e?.target as L.Marker
                        const { lat, lng } = marker.getLatLng()
                        setPosition([lat, lng])
                    }
                }}
            >
                <Popup>
                    A pretty CSS3 popup. <br /> Easily customizable.
                </Popup>
            </Marker>
        )
    }

    return (
        <MapContainer
            key="map" center={position as LatLngExpression}
            zoom={13}
            scrollWheelZoom={true}
            zoomControl={true}
            doubleClickZoom={true}
            dragging={true}
            touchZoom={true}
            className='w-full h-[400px] z-9'>
            <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            <DraggableMarker position={position} />
        </MapContainer>
    )
}

export default MapView