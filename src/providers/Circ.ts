import { AsyncStorage } from 'react-native';

export class Circ {
    private smsToken: string;
    constructor() {
        this.smsToken = '629062';
        //this.init();

        //this.remove()
    }
    async remove() {
        await AsyncStorage.removeItem('circAccessToken');
        await AsyncStorage.removeItem('circRefreshToken');
    }
    async init() {
        const accessToken = await AsyncStorage.getItem('circAccessToken');
        const refreshToken = await AsyncStorage.getItem('circRefreshToken');

        if (!accessToken && !refreshToken) {
            //console.log('no token, login');
            this.login();
            return;
        }

    }

    login() {
        console.log('login');
        const url = 'https://node.goflash.com/signup/phone';
        const body = {
            phoneCountryCode: '+49',
            phoneNumber: '15121127730',
            token: this.smsToken
        };

        fetch(url, {
            method: 'post',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
            },
            body: JSON.stringify(body)
        })
            .then(response => {
                return response.json();
            })
            .then(async data => {
                const { accessToken, refreshToken } = data;

                try {
                    console.log('store tokens');
                    await AsyncStorage.setItem('circAccessToken', accessToken);
                    await AsyncStorage.setItem('circRefreshToken', refreshToken);

                } catch (e) {
                    console.log("error while storing");

                }
            })
            .catch(err => console.log('Unable to login Circ.'))
    }

    async refreshToken({ longitude, latitude, boundaries }) {
        const url = 'https://node.goflash.com/login/refresh';

        const accessToken = await AsyncStorage.getItem('circAccessToken');
        const refreshToken = await AsyncStorage.getItem('circRefreshToken');

        fetch(url, {
            method: 'post',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
            },
            body: JSON.stringify({ accessToken, refreshToken })
        })
            .then(response => response.json())
            .then(async data => {
                console.log('refreshing')
                const { accessToken, refreshToken } = data;

                await AsyncStorage.setItem('circAccessToken', accessToken);
                await AsyncStorage.setItem('circRefreshToken', refreshToken);

                console.log('new stuff stored, try again');

                this.getScooters(longitude, latitude, boundaries);

            })
    }

    async getScooters(longitude: number, latitude: number, boundaries: Array<number>) {
        //console.log('Fetch circ');
        const [longitudeTopLeft, latitudeBottomRight, longitudeBottomRight, latitudeTopLeft] = boundaries;

        const urlToFetch = `https://node.goflash.com/devices?latitudeTopLeft=${latitudeTopLeft}&longitudeTopLeft=${longitudeTopLeft}&latitudeBottomRight=${latitudeBottomRight}&longitudeBottomRight=${longitudeBottomRight}`;

        const accessToken = await AsyncStorage.getItem('circAccessToken');

        if (!accessToken) {
            console.log('no token, cant fetch');
            console.log('need to login');
            this.login();
        }

        try {
            const response = await fetch(urlToFetch, {
                headers: {
                    'Authorization': accessToken
                }
            });

            const data = await response.json();

            return {
                provider: 'circ',
                scooters: data.devices.map(scooter => {
                    scooter.id = scooter.identifier;
                    scooter.lat = scooter.latitude;
                    scooter.lng = scooter.longitude;
                    scooter.code = scooter.qrCode;
                    scooter.battery = scooter.energyLevel;

                    return scooter;
                })
            };

        } catch (e) {
            //console.log('error getScooters Circ', e);
            //console.log({ e });
            this.refreshToken({ longitude, latitude, boundaries })
        }
    }
}