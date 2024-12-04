import Events from './events.js';
import { getHypershipPublicKey } from './lib/getHypershipPublicKey.js';
import { EVENTS_API_ENDPOINT } from './lib/config.js';

import { EventsConfig } from './types/index.js';

let eventsConfig: EventsConfig = {} as EventsConfig;

export const HypershipEvents = ({ publicKey }: EventsConfig = {}) => {
  if(!publicKey) {
    eventsConfig.publicKey = getHypershipPublicKey();
  } else {
    eventsConfig.publicKey = publicKey;
  }

  if (!eventsConfig.publicKey) {
    throw new Error('Hypership API Public Key not found');
  }

  return new Events(EVENTS_API_ENDPOINT, eventsConfig.publicKey);
}
