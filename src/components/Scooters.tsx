import React from 'react';
import { ScooterMarker } from './ScooterMarker';

interface ScooterProps {
    provider: {
        provider: string,
        scooters: Array<object>
    },
    visible: boolean,
    handleScooterSelect: Function

}

export const Scooters = React.memo((props: ScooterProps) => {
    const { provider, visible, handleScooterSelect } = props;
    console.log('render scooters');
    return (
        <>
            {provider.scooters.map(scooter => (
                <ScooterMarker
                    key={scooter.id}
                    visible={visible}
                    scooter={scooter}
                    brand={provider.provider}
                    coordinate={{
                        latitude: scooter.lat,
                        longitude: scooter.lng
                    }}
                    onSelectScooter={handleScooterSelect}
                />
            ))}
        </>
    )
}, (prevProps, nextProps) => {
    return prevProps.provider === nextProps.provider;
});