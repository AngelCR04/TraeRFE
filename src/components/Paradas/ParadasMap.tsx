import React, { useState } from 'react';
import { GoogleMap, LoadScript, MarkerF } from '@react-google-maps/api';
import { FeatureCollection, Geometry } from 'geojson';
import { ParadaFeature, ParadaProperties } from '../../features/dashboard/presentation/types/Parada';

const mapContainerStyle = {
    width: "100%",
    height: "80%"
};

const defaultCenter = { lat: 18.7357, lng: -70.1627 };

interface ParadasMapProps {
    apiKey: string;
    geoJsonData: FeatureCollection<Geometry, ParadaProperties>;
    selectedMarker: ParadaFeature | null;
    setSelectedMarker: (marker: ParadaFeature | null) => void;
    handleSelectParada: (paradaFeature: ParadaFeature) => void;
}

const ParadasMap: React.FC<ParadasMapProps> = ({
    apiKey,
    geoJsonData,
}) => {
    const [,setMap] = useState<google.maps.Map | null>(null);
    const [isApiLoaded, setIsApiLoaded] = useState(false);

    const handleMapLoad = (mapInstance: google.maps.Map) => {
        setMap(mapInstance);
    };

    const handleApiLoad = () => {
        setIsApiLoaded(true);
    };

    return (
        <div className="relative w-full h-[calc(100vh-8rem)]">
            <LoadScript
                googleMapsApiKey={apiKey}
                onLoad={handleApiLoad}
            >
                {isApiLoaded && (
                    <GoogleMap
                        mapContainerStyle={mapContainerStyle}
                        zoom={15}
                        center={geoJsonData.features.length > 0 && geoJsonData.features[0].geometry.type === 'Point' ? { lat: geoJsonData.features[0].geometry.coordinates[1], lng: geoJsonData.features[0].geometry.coordinates[0] } : defaultCenter}
                        onLoad={handleMapLoad}
                        mapTypeId="hybrid"
                        options={{
                            zoomControl: true,
                            mapTypeControl: true,
                            streetViewControl: true,
                            fullscreenControl: true
                        }}
                    >
                        {geoJsonData.features.map((feature, index) => {
                            if (feature.geometry.type === 'Point') {
                                const lat = feature.geometry.coordinates[1];
                                const lng = feature.geometry.coordinates[0];

                                return (
                                    <MarkerF
                                        key={`marker-${index}`}
                                        position={{ lat, lng }}
                                        title={feature.properties.nombreParada}
                                        icon={{
                                            url: 'https://maps.google.com/mapfiles/ms/icons/bus.png'
                                        }}
                                    />
                                );
                            }
                            return null;
                        })}
                    </GoogleMap>
                )}
            </LoadScript>
        </div>
    );
};

export default ParadasMap;