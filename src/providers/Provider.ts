import { PROVIDERS } from './constants.js';

export const ProvidersFactory = {
    getAll: (longitude: Number, latitude: Number, boundaries) => {
        const promises = [];

        Object.keys(PROVIDERS).forEach(async providerName => {
            const ProviderClass = PROVIDERS[providerName].class;
            const provider = new ProviderClass();

            try {
                const scooters = provider.getScooters(longitude, latitude, boundaries);
                promises.push(scooters);
            } catch (e) {
                console.log('error while fetching scooters: ', providerName);
            }
        });

        return Promise.all(promises);
    }
}
