
import React, { useEffect, useRef } from 'react';
import { Lead } from '../types';

interface LeadsMapProps {
    leads: Lead[];
    onLeadClick: (lead: Lead) => void;
}

const LeadsMap: React.FC<LeadsMapProps> = ({ leads, onLeadClick }) => {
    const mapRef = useRef<any>(null);
    const mapContainerRef = useRef<HTMLDivElement>(null);
    const markersRef = useRef<any[]>([]);

    useEffect(() => {
        if (!mapContainerRef.current) return;
        const L = (window as any).L;
        if (!L) return;

        // Initialize map if not already done
        if (!mapRef.current) {
            mapRef.current = L.map(mapContainerRef.current, {
                scrollWheelZoom: false, // Prevents scroll trapping
                zoomControl: true,
                attributionControl: false 
            }).setView([20, 0], 2);
            
            L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
                attribution: '&copy; OpenStreetMap contributors',
                maxZoom: 19
            }).addTo(mapRef.current);

            // Add clear attribution for the user
            L.control.attribution({
                prefix: 'Locations via Google Maps'
            }).addTo(mapRef.current);
        }

        const map = mapRef.current;
        
        // Clear existing markers
        markersRef.current.forEach(m => map.removeLayer(m));
        markersRef.current = [];

        const bounds = L.latLngBounds([]);
        let validMarkers = 0;

        const icon = L.divIcon({
            className: 'custom-div-icon',
            html: "<div class='pulsating-marker'></div>",
            iconSize: [16, 16],
            iconAnchor: [8, 8],
            popupAnchor: [0, -10]
        });

        leads.forEach(lead => {
            if (!lead.coordinates) return;
            const parts = lead.coordinates.split(',');
            if (parts.length < 2) return;
            
            const lat = parseFloat(parts[0].trim());
            const lng = parseFloat(parts[1].trim());

            if (!isNaN(lat) && !isNaN(lng)) {
                const marker = L.marker([lat, lng], { icon: icon })
                    .addTo(map)
                    .on('click', () => onLeadClick(lead));
                
                marker.bindTooltip(`
                    <div class="text-center">
                        <div class="font-bold text-gray-900">${lead.companyName}</div>
                        <div class="text-[10px] text-gray-500">${lead.address}</div>
                    </div>
                `, {
                    permanent: false,
                    direction: 'top',
                    offset: [0, -10],
                    className: 'px-3 py-2 bg-white border border-gray-200 rounded-lg shadow-lg opacity-100'
                });

                markersRef.current.push(marker);
                bounds.extend([lat, lng]);
                validMarkers++;
            }
        });

        // CRITICAL FIX: Invalidate size then fly to bounds to ensure correct centering
        // The timeout allows the container to render fully in the DOM before calculating bounds
        setTimeout(() => {
            map.invalidateSize();
            if (validMarkers > 0) {
                map.flyToBounds(bounds, { 
                    padding: [50, 50],
                    maxZoom: 15,
                    animate: true,
                    duration: 1.0
                });
            } else {
                map.setView([20, 0], 2);
            }
        }, 300);

    }, [leads, onLeadClick]);

    return (
        <div className="w-full h-full relative z-0">
            <div ref={mapContainerRef} className="w-full h-full rounded-xl bg-gray-100 outline-none" style={{ minHeight: '100%' }}></div>
        </div>
    );
};

export default LeadsMap;
