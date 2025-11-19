import fs from 'fs';
import path from 'path';
import crypto, { KeyObject } from 'crypto';

export const getPrivateKey = (): string => {
    const filePath = path.resolve('resources', 'credentials', 'id_rsa.pem');
    return fs.readFileSync(filePath, 'utf-8');
};
export const getPrivateKeyObject = (): KeyObject => {
    const privateKey = getPrivateKey();

    return crypto.createPrivateKey({
        key: privateKey,
        passphrase: '',
        format: 'pem',
    });
};

export const getPublicKey = (): string => {
    const filePath = path.resolve('resources', 'credentials', 'id_rsa_pub.pem');
    return fs.readFileSync(filePath, 'utf-8');
};
export const getPublicKeyObject = (): KeyObject => {
    const publicKey = getPublicKey();

    return crypto.createPublicKey({
        key: publicKey,
        format: 'pem',
    });
};
