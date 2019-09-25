export class Voi {
    label: string;

    async getScooters(longitude: number, latitude: number) {

        const baseUrl = 'https://api.voiapp.io/v1/vehicle/status/ready';
        const urlToFetch = `${baseUrl}?lat=${latitude}&lng=${longitude}&radius=1`;

        const result = await fetch(urlToFetch);
        const data = await result.json()

        return {
            provider: 'voi',
            scooters: data.map(scooter => {
                scooter.lat = scooter.location[0];
                scooter.lng = scooter.location[1];

                return scooter;
            })
        };
    }

}