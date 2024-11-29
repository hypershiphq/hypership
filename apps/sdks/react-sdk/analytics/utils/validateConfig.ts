// src/utils/validateConfig.ts

export const validateConfig = (publicKey: string) => {
    if (!publicKey) {
        throw new Error('A publicKey is required to initialise Hypership Analytics.');
    }
};
