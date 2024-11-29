// src/utils/validateConfig.ts

export const validateConfig = (publicKey: string) => {
    if (!publicKey) {
        throw new Error('A public key is required to initialise Hypership Events.');
    }
};
