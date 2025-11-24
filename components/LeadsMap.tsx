
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
        // Access global L from window
        const L = (window as any).L;
        if (!L) return;

        // Initialize map if not already done
        if (!mapRef.current) {
            mapRef.current = L.map(mapContainerRef.current, {
                scrollWheelZoom: false, // Prevents the map from hijacking page scroll
                zoomControl: true,
            }).setView([20, 0], 2);
            
            L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
                attribution: '&copy; OpenStreetMap contributors',
                maxZoom: 19
            }).addTo(mapRef.current);
        }

        const map = mapRef.current;
        
        // Ensure map renders correctly if container size changed
        // This fixes the issue where map might appear gray or not centered
        setTimeout(() => {
            map.invalidateSize();
        }, 200);

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
                
                // Enhanced Tooltip
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

        // Smart Focus: Only zoom if we have valid markers
        if (validMarkers > 0) {
            // Use flyToBounds for smoother transition
            map.flyToBounds(bounds, { 
                padding: [50, 50],
                maxZoom: 14, // Prevent zooming in too close on a single pin
                animate: true,
                duration: 1.5
            });
        }

    }, [leads, onLeadClick]); // Re-run when leads change

    return (
        <div className="w-full h-full relative z-0">
            <div ref={mapContainerRef} className="w-full h-full rounded-xl bg-gray-100 outline-none" style={{ minHeight: '100%' }}></div>
        </div>
    );
};

export default LeadsMap;
