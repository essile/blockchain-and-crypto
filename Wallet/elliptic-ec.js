const EC = require('elliptic').ec;
const cryptohash = require('../Blockchain/crypto-hash');

// node module - Elliptic (elliptic-curve cryptography)

// Copyright Fedor Indutny, 2014.
// This software is licensed under the MIT License.

const ec = new EC('secp256k1');
const verifySignature = ({ publicKey, data, signature }) => {
    const keyFromPublic = ec.keyFromPublic(publicKey, 'hex');
    return keyFromPublic.verify(cryptohash(data), signature);
};

module.exports = { ec, verifySignature };