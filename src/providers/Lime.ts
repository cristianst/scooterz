import { AsyncStorage } from 'react-native';

export class Lime {
    private smsToken: string;
    private phone: string;

    constructor() {
        this.smsToken = '768354';
        this.phone = '%2B4915121127730';
    }

    async deleteTokens() {
        await AsyncStorage.removeItem('limeCookie');
        await AsyncStorage.removeItem('limeAccessToken')
    }

    async init() {
        const limeToken = await AsyncStorage.getItem('limeAccessToken');

        if (!limeToken) {
            console.log('need to login lime')
            this.login();
        }
    }

    getToken() {
        console.log('get token');
        const phone = '+4915121127730';
        const loginUrl = 'https://web-production.lime.bike/api/rider/v1/login?phone=%2B4915121127730';

        fetch(loginUrl)
            .then(response => response.json())
            .then(data => console.log({ tokendata: data }))
    }
    async login() {
        console.log('login');
        const loginUrl = 'https://web-production.lime.bike/api/rider/v1/login';

        const body = {
            phone: '+4915121127730',
            login_code: this.smsToken
        };
        //this.getToken()
        try {
            const response = await fetch(loginUrl, {
                method: 'post',
                body: JSON.stringify(body),
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                },
            });

            const cookie = await AsyncStorage.getItem('limeCookie');
            if (!cookie) {
                console.log('setcookie');
                await AsyncStorage.setItem('limeCookie', response.headers["map"]["set-cookie"]);
            }

            console.log({ response })
            console.log('fail');
            const data = await response.json();
            const { token } = data;
            console.log('settoken');
            console.log({ data });
            await AsyncStorage.setItem('limeAccessToken', token);

        } catch (e) {
            console.log('error lime');
            console.log({ errL: e });
        }

    }
    async getScooters(longitude: number, latitude: number, boundaries) {
        return new Promise(async (resolve, reject) => {
            const baseUrl = 'https://web-production.lime.bike/api/rider';

            const accessToken = await AsyncStorage.getItem('limeAccessToken');
            const cookie = await AsyncStorage.getItem('limeCookie')

            console.log({ accessToken, cookie });
            if (!accessToken) {
                console.log('no token, cant fetch - lime');
                console.log('need to login - lime');
                this.login();
            }

            try {
                const urlToFetch = `${baseUrl}/v1/views/map?ne_lat=${latitude}.6&ne_lng=${longitude}&sw_lat=${latitude}&sw_lng=${longitude}&user_latitude=${latitude}&user_longitude=${longitude}&zoom=16'`;

                const headers = {
                    'Authorization': accessToken,
                    "Cookie": cookie
                };

                const response = await fetch(urlToFetch, {
                    headers
                });

                console.log({ response });
                const data = await response.json();
                //console.log({ data })
                const result = {
                    provider: 'lime',
                    scooters: data.data.attributes.bikes.map(scooter => {
                        scooter.code = scooter.attributes.plate_number;

                        scooter.lat = scooter.attributes.latitude;
                        scooter.lng = scooter.attributes.longitude;
                        return scooter;
                    })
                };

                resolve(result);
            } catch (e) {
                reject(e);
            }
        })
    }

}