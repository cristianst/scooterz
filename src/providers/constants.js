import { Voi } from './Voi';
import { Tier } from './Tier';
import { Circ } from './Circ';
import { Lime } from './Lime';

export const PROVIDERS = {
    VOI: {
        color: 'rgb(244, 108, 98)',
        class: Voi,
        appURL: 'voiapp://'
    },
    TIER: {
        color: '#001c6f',
        class: Tier,
        appURL: 'http://tier.page.link'
    },
    CIRC: {
        color: '#f56600',
        class: Circ,
        appURL: 'circ://'
    },
    // LIME: {
    //     color: '#0d0',
    //     class: Lime,
    //     appURL: 'http://limebike.app.link'
    // }
};
