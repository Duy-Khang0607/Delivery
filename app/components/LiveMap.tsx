"use client"

import { MapContainer, Marker, Polyline, Popup, TileLayer, useMap } from 'react-leaflet'
import L, { LatLngExpression } from 'leaflet'
import { useEffect } from 'react'
import 'leaflet/dist/leaflet.css'

interface ILocation {
    latitude: number;
    longitude: number;
}

const deliveryMarkerIcon = new L.Icon({
    iconUrl: "https://cdn-icons-png.flaticon.com/128/9561/9561688.png",
    shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
    iconSize: [40, 40],
    iconAnchor: [15, 46],
    popupAnchor: [1, -34],
    shadowSize: [41, 41],
});

const userMarkerIcon = new L.Icon({
    iconUrl: "https://cdn-icons-png.flaticon.com/128/4821/4821951.png",
    shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
    iconSize: [40, 40],
    iconAnchor: [15, 46],
    popupAnchor: [1, -34],
    shadowSize: [41, 41],
});

const UserMarker: React.FC<{ position: [number, number] | null }> = ({ position }) => {
    if (!position) return null

    return (
        <Marker icon={userMarkerIcon} position={position} draggable={true}
        >
            <Popup>
                User Address
            </Popup>
        </Marker>
    )
}

const DeliveryMarker: React.FC<{ position: [number, number] | null }> = ({ position }) => {
    if (!position) return null

    const map = useMap()

    useEffect(() => {
        map.setView(position as LatLngExpression, 13, { animate: true })
    }, [map, position])

    return (
        <Marker icon={deliveryMarkerIcon} position={position} draggable={true}
        >
            <Popup>
                Delivery Boy
            </Popup>
        </Marker>
    )
}

const isValidLatLng = (lat?: number, lng?: number) =>
    typeof lat === 'number' && Number.isFinite(lat) && typeof lng === 'number' && Number.isFinite(lng)


const LiveMap = ({ userLocation, deliveryLocation }: { userLocation: ILocation | null, deliveryLocation: ILocation | null }) => {
    const linePositions = deliveryLocation && userLocation ?
        [
            [deliveryLocation.latitude, deliveryLocation.longitude],
            [userLocation.latitude, userLocation.longitude]
        ]
        : null

    const userPosition = isValidLatLng(userLocation?.latitude, userLocation?.longitude) && userLocation ?
        ([userLocation.latitude, userLocation.longitude] as [number, number])
        : null

    const deliveryPosition = isValidLatLng(deliveryLocation?.latitude, deliveryLocation?.longitude) && deliveryLocation ?
        ([deliveryLocation.latitude, deliveryLocation.longitude] as [number, number])
        : null

    const center = (userPosition ?? deliveryPosition ?? [0, 0]) as LatLngExpression

    return (
        <div className='w-full h-[400px] rounded-lg overflow-hidden shadow relative z-2'>
            <MapContainer
                key="map"
                center={center}
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
                <DeliveryMarker position={deliveryPosition} />
                <UserMarker position={userPosition} />
                <Polyline positions={linePositions as [number, number][]} color="green" weight={5} opacity={0.5} />
            </MapContainer>
        </div>
    )
}

export default LiveMap