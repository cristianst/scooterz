export class Tier {
    label: string;

    async getScooters(longitude: number, latitude: number) {

        const baseUrl = 'https://platform.tier-services.io/vehicle';
        const urlToFetch = `${baseUrl}?lat=${latitude}&lng=${longitude}&radius=500`

        const headers = {
            'X-Api-Key': 'bpEUTJEBTf74oGRWxaIcW7aeZMzDDODe1yBoSxi2'
        };

        const result = await fetch(urlToFetch, { headers });
        const data = await result.json()

        return {
            provider: 'tier',
            scooters: data.data
        }
    }

}