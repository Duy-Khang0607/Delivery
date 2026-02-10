'use client'
import { useEffect, useState, useRef } from 'react'
import { MapContainer, TileLayer, Marker, Popup, useMap, useMapEvents } from 'react-leaflet'
import { LatLngExpression, Icon } from 'leaflet'
import { GeoSearchControl, OpenStreetMapProvider } from 'leaflet-geosearch'
import type { Control } from 'leaflet'
import { LocateFixed, MapPin } from 'lucide-react'
import 'leaflet/dist/leaflet.css'
import 'leaflet-geosearch/dist/geosearch.css'

// Custom marker icon
const customIcon = new Icon({
    iconUrl: 'https://cdn-icons-png.flaticon.com/128/684/684908.png',
    shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
    iconSize: [40, 40],
    iconAnchor: [15, 46],
    popupAnchor: [1, -34],
    shadowSize: [41, 41]
})

// Vietnam center coordinates (Ho Chi Minh City)
const VIETNAM_CENTER: LatLngExpression = [10.8231, 106.6297]
const DEFAULT_ZOOM = 13

interface VietnamMapProps {
    onLocationSelect?: (lat: number, lng: number, address?: string) => void
    initialPosition?: LatLngExpression
    height?: string
    showSearch?: boolean
    showCurrentLocation?: boolean
    position?: [number, number]
}

// Component to handle map click events and update center when position changes
function MapClickHandler({
    onLocationSelect,
    markerPosition
}: {
    onLocationSelect?: (lat: number, lng: number) => void
    markerPosition?: LatLngExpression | null
}) {
    const map = useMap()

    // Update map center when markerPosition changes
    useEffect(() => {
        if (markerPosition) {
            map.setView(markerPosition, DEFAULT_ZOOM)
        }
    }, [map, markerPosition])

    useMapEvents({
        click: (e) => {
            const { lat, lng } = e.latlng
            onLocationSelect?.(lat, lng)
        },
    })
    return null
}

// Component to add search control
function SearchControl({ onLocationSelect }: { onLocationSelect?: (lat: number, lng: number, address: string) => void }) {
    const map = useMap()
    const searchControlRef = useRef<any>(null)

    useEffect(() => {
        if (!map) {
            return
        }

        let handleSearchResult: ((e: any) => void) | null = null

        const initializeSearchControl = () => {
            try {


                const provider = new OpenStreetMapProvider({
                    params: {
                        countrycodes: 'vn', // Limit search to Vietnam
                        addressdetails: 1,
                    },
                })

                const searchControl = new (GeoSearchControl as any)({
                    provider,
                    style: 'bar',
                    showMarker: false, // Tắt marker của GeoSearchControl để tránh double marker
                    showPopup: false, // Tắt popup của GeoSearchControl, dùng popup của component
                    maxMarkers: 1,
                    retainZoomLevel: false,
                    animateZoom: true,
                    keepResult: false, // Không giữ marker cũ
                    searchLabel: 'Tìm kiếm địa chỉ tại Việt Nam...',
                }) as Control


                // Kiểm tra map container đã sẵn sàng
                if (!map.getContainer()) {
                    return
                }

                map.addControl(searchControl)
                searchControlRef.current = searchControl

                // Listen to search results
                handleSearchResult = (e: any) => {
                    const { location } = e
                    onLocationSelect?.(location.y, location.x, location.label)
                }

                map.on('geosearch/showlocation', handleSearchResult)
            } catch (error) {
                console.error('Error initializing search control:', error)
            }
        }

        // Đợi map sẵn sàng hoàn toàn
        if (map.getContainer()) {
            // Map đã sẵn sàng, khởi tạo ngay
            initializeSearchControl()
        } else {
            // Đợi map load xong
            const onMapLoad = () => {
                initializeSearchControl()
                map.off('load', onMapLoad)
            }
            map.on('load', onMapLoad)
        }

        return () => {
            if (searchControlRef.current && map) {
                try {
                    map.removeControl(searchControlRef.current)
                    searchControlRef.current = null
                    if (handleSearchResult) {
                        map.off('geosearch/showlocation', handleSearchResult)
                    }
                } catch (error) {
                    console.error('Error removing search control:', error)
                }
            }
        }
    }, [map, onLocationSelect])

    return null
}

// Component to handle current location
function CurrentLocationButton({ onLocationSelect }: { onLocationSelect?: (lat: number, lng: number) => void }) {
    const map = useMap()
    const [isLoading, setIsLoading] = useState(false)

    const getCurrentLocation = () => {
        if (!navigator.geolocation) {
            alert('Trình duyệt của bạn không hỗ trợ định vị')
            return
        }

        setIsLoading(true)
        navigator.geolocation.getCurrentPosition(
            (position) => {
                const { latitude, longitude } = position.coords
                map.setView([latitude, longitude], 15)
                onLocationSelect?.(latitude, longitude)
                setIsLoading(false)
            },
            (error) => {
                console.error('Error getting location:', error)
                alert('Không thể lấy vị trí hiện tại. Vui lòng kiểm tra quyền truy cập vị trí.')
                setIsLoading(false)
            }
        )
    }

    return (
        <div className="absolute bottom-5 right-2" >
            <div className="leaflet-control">
                <button
                    onClick={getCurrentLocation}
                    disabled={isLoading}
                    className="bg-green-600 hover:bg-green-700 text-white p-2 rounded-md shadow-lg flex items-center gap-2 transition-all duration-300 disabled:opacity-50"
                    style={{ zIndex: 1000 }}
                >
                    <LocateFixed className={`w-6 h-6 ${isLoading ? 'animate-spin' : ''}`} />
                </button>
            </div>
        </div>
    )
}

export default function VietnamMap({
    onLocationSelect,
    initialPosition,
    height = '400px',
    showSearch = true,
    showCurrentLocation = true,
    position
}: VietnamMapProps) {
    // Ưu tiên sử dụng position, sau đó initialPosition, cuối cùng là null
    const initialMarkerPosition = position ? [position[0], position[1]] as LatLngExpression : (initialPosition || null)
    const [markerPosition, setMarkerPosition] = useState<LatLngExpression | null>(initialMarkerPosition)
    const [address, setAddress] = useState<string>('')

    // Cập nhật markerPosition khi position hoặc initialPosition thay đổi
    useEffect(() => {
        if (position) {
            const pos: LatLngExpression = [position[0], position[1]]
            setMarkerPosition(pos)
            // Lấy địa chỉ từ vị trí
            fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${position[0]}&lon=${position[1]}&zoom=18&addressdetails=1`)
                .then((res) => res.json())
                .then((data) => {
                    const addr = data.display_name || `${position[0].toFixed(6)}, ${position[1].toFixed(6)}`
                    setAddress(addr)
                    // Chỉ gọi onLocationSelect nếu được cung cấp
                    if (onLocationSelect) {
                        onLocationSelect(position[0], position[1], addr)
                    }
                })
                .catch(() => {
                    const addr = `${position[0].toFixed(6)}, ${position[1].toFixed(6)}`
                    setAddress(addr)
                    if (onLocationSelect) {
                        onLocationSelect(position[0], position[1], addr)
                    }
                })
        } else if (initialPosition) {
            setMarkerPosition(initialPosition)
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [position, initialPosition])

    const handleMapClick = (lat: number, lng: number) => {
        const position: LatLngExpression = [lat, lng]
        setMarkerPosition(position)

        // Reverse geocoding to get address
        fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&zoom=18&addressdetails=1`)
            .then((res) => res.json())
            .then((data) => {
                const addr = data.display_name || `${lat.toFixed(6)}, ${lng.toFixed(6)}`
                setAddress(addr)
                onLocationSelect?.(lat, lng, addr)
            })
            .catch(() => {
                const addr = `${lat.toFixed(6)}, ${lng.toFixed(6)}`
                setAddress(addr)
                onLocationSelect?.(lat, lng, addr)
            })
    }

    const handleSearchResult = (lat: number, lng: number, addr: string) => {
        const position: LatLngExpression = [lat, lng]
        setMarkerPosition(position)
        setAddress(addr)
        onLocationSelect?.(lat, lng, addr)
    }

    const handleCurrentLocation = (lat: number, lng: number) => {
        handleMapClick(lat, lng)
    }

    return (
        <div className="w-full rounded-lg overflow-hidden shadow-lg border border-gray-300" style={{ height }}>
            <MapContainer
                center={markerPosition || VIETNAM_CENTER}
                zoom={markerPosition ? DEFAULT_ZOOM : 6}
                style={{ height: '100%', width: '100%', zIndex: 0 }}
                scrollWheelZoom={true}
                zoomControl={true}
                doubleClickZoom={true}
                dragging={true}
                touchZoom={true}
                className='relative'
            >
                <TileLayer
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />

                {markerPosition && (
                    <Marker position={markerPosition} icon={customIcon}>
                        <Popup>
                            <div className="p-2">
                                <div className="flex items-center gap-2 mb-2">
                                    <MapPin className="w-4 h-4 text-green-600" />
                                    <span className="font-semibold text-sm">Vị trí đã chọn</span>
                                </div>
                                <p className="text-xs text-gray-600">{address || 'Đang tải địa chỉ...'}</p>
                            </div>
                        </Popup>
                    </Marker>
                )}

                {showSearch && <SearchControl onLocationSelect={handleSearchResult} />}
                {showCurrentLocation && <CurrentLocationButton onLocationSelect={handleCurrentLocation} />}
                <MapClickHandler onLocationSelect={handleMapClick} markerPosition={markerPosition} />
            </MapContainer>
        </div>
    )
}

