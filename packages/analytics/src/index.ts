import analytics from './analytics.js';
import { getHypershipPublicKey } from './lib/getHypershipPublicKey.js';

import { AnalyticsConfig } from './types/index.js';

let analyticsConfig: AnalyticsConfig = {} as AnalyticsConfig;

export const HypershipAnalytics = ({ publicKey }: AnalyticsConfig = {}) => {
  if(!publicKey) {
    analyticsConfig.publicKey = getHypershipPublicKey();
  } else {
    analyticsConfig.publicKey = publicKey;
  }

  if (!analyticsConfig.publicKey) {
    throw new Error('Hypership API Public Key not found');
  }

  return analytics({ publicKey: analyticsConfig.publicKey });
}
