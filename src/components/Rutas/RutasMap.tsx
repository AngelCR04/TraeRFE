import React, { useEffect, useState } from 'react';
import { GoogleMap, LoadScript, MarkerF, Polyline } from '@react-google-maps/api';
import { Ruta, GeoJsonFeature } from "../../features/dashboard/presentation/types/RutaType";


const mapContainerStyle = {
    width: "100%",
    height: "90%"
};

const defaultCenter = { lat: 18.7357, lng: -70.1627 };

interface RutasMapProps {
    rutas: GeoJsonFeature[];
    onMarkerClick: (ruta: Ruta) => void;
}

const RutasMap: React.FC<RutasMapProps> = ({ rutas, onMarkerClick }) => {
    const [map, setMap] = useState<google.maps.Map | null>(null);
    const [routePaths, setRoutePaths] = useState<{ path: google.maps.LatLng[], color: string }[]>([]);
    const [isApiLoaded, setIsApiLoaded] = useState(false);

    const handleMapLoad = (mapInstance: google.maps.Map) => {
        setMap(mapInstance);
    };

    const handleApiLoad = () => {
        setIsApiLoaded(true);
    };

    useEffect(() => {
        if (map && rutas.length > 0) {
            rutas.forEach(async (ruta) => {
                if (ruta.geometry.coordinates.length >= 2) {
                    const originCoords = ruta.geometry.coordinates[0];
                    const destinationCoords = ruta.geometry.coordinates[ruta.geometry.coordinates.length - 1];

                    if (originCoords && destinationCoords) {
                        const origin = {
                            latitude: originCoords[1],
                            longitude: originCoords[0]
                        };
                        const destination = {
                            latitude: destinationCoords[1],
                            longitude: destinationCoords[0]
                        };

                        // Combinar paradas intermedias y escuelas como waypoints
                        const waypoints = [
                            ...ruta.geometry.coordinates.slice(1, -1).map(coord => ({
                                location: {
                                    latLng: {
                                        latitude: coord[1],
                                        longitude: coord[0]
                                    }
                                }
                            })),   //Este problema es por unos tipos en RutasType, Quedo pendiente en crear un tipo especial para este mapa
                            ...ruta.properties.paradas.slice(1, -1).map(parada => ({
                                location: {
                                    latLng: {
                                        latitude: parada.latitud,
                                        longitude: parada.longitud
                                    }
                                }
                            })),
                            ...ruta.properties.escuelas.map(escuela => ({
                                location: {
                                    latLng: {
                                        latitude: escuela.latitud,
                                        longitude: escuela.longitud
                                    }
                                }
                            }))
                        ];

                        const requestBody = {
                            origin: {
                                location: {
                                    latLng: origin
                                }
                            },
                            destination: {
                                location: {
                                    latLng: destination
                                }
                            },
                            travelMode: 'DRIVE',
                            computeAlternativeRoutes: false,
                            routeModifiers: {
                                avoidTolls: false,
                                avoidHighways: false,
                                avoidFerries: false
                            },
                            languageCode: 'es',
                            units: 'METRIC',
                            intermediates: waypoints
                        };

                        console.log('Request Body:', requestBody);

                        const response = await fetch(`https://routes.googleapis.com/directions/v2:computeRoutes`, {
                            method: 'POST',
                            headers: {
                                'Content-Type': 'application/json',
                                'X-Goog-Api-Key': 'AIzaSyCP27C35blbfm1I7J4jjEcoSb8rHf0JOY8',
                                'X-Goog-FieldMask': 'routes.legs'
                            },
                            body: JSON.stringify(requestBody)
                        });

                        const data = await response.json();
                        if (data.routes && data.routes.length > 0) {
                            const route = data.routes[0].legs.flatMap((leg: any) =>
                                leg.steps.flatMap((step: any) => {
                                    const decodedPath = google.maps.geometry.encoding.decodePath(step.polyline.encodedPolyline);
                                    return decodedPath.map((point: google.maps.LatLng) => ({
                                        lat: point.lat(),
                                        lng: point.lng()
                                    }));
                                })
                            );
                            setRoutePaths(prevPaths => [...prevPaths, { path: route, color: ruta.properties?.color || "#FF0000" }]);
                        } else {
                            console.error('Error fetching routes', data);
                        }
                    }
                }
            });
        }
    }, [map, rutas]);

    return (
        <div className="relative w-full h-[calc(100vh-8rem)]">
            <LoadScript
                googleMapsApiKey="AIzaSyCP27C35blbfm1I7J4jjEcoSb8rHf0JOY8"
                libraries={['geometry']}
                onLoad={handleApiLoad}
            >
                {isApiLoaded && (
                    <GoogleMap
                        mapContainerStyle={mapContainerStyle}
                        zoom={8}
                        center={rutas.length > 0 && rutas[0].geometry.coordinates.length > 0 ? { lat: rutas[0].geometry.coordinates[0][1], lng: rutas[0].geometry.coordinates[0][0] } : defaultCenter}
                        onLoad={handleMapLoad}
                        mapTypeId="hybrid"
                    >
                        {routePaths.map((route, index) => (
                            <Polyline
                                key={index}
                                path={route.path}
                                options={{
                                    strokeColor: route.color,
                                    strokeOpacity: 0.8,
                                    strokeWeight: 2
                                }}
                            />
                        ))}
                        {rutas.map((ruta, index) => (
                            <React.Fragment key={index}>
                                {ruta.geometry.coordinates.length > 0 && (
                                    <>
                                        {ruta.properties.paradas.map((parada, idx) => (
                                            <MarkerF 
                                                key={idx}
                                                position={{ lat: parada.latitud, lng: parada.longitud }}
                                                title={`Parada: ${parada.nombreParada}`}
                                                icon={{
                                                    url: "http://maps.google.com/mapfiles/ms/icons/bus.png",
                                                    scaledSize: new google.maps.Size(30, 30)
                                                }}
                                            />
                                        ))}
                                        {ruta.properties.escuelas.map((escuela, idx) => (
                                            <MarkerF
                                                key={idx}
                                                position={{ lat: escuela.latitud, lng: escuela.longitud }}
                                                title={`Escuela: ${escuela.nombreCentro}`}
                                                icon={{
                                                    url: "https://img.icons8.com/color/48/school.png",
                                                    scaledSize: new google.maps.Size(30, 30)
                                                }}
                                            />
                                        ))}
                                    </>
                                )}
                            </React.Fragment>
                        ))}
                    </GoogleMap>
                )}
            </LoadScript>
        </div>
    );
};

export default RutasMap;