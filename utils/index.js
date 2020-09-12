"use strict";
const crypto = require("crypto");
const constants_1 = require("../utils/ABconstants");

//making encryption and decryption
const cryptFileWithSalt = (file, decrypt = false, { algo = "aes-256-ctr", key = crypto.randomBytes(16).toString("hex"), salt = crypto.randomBytes(8).toString("hex"), }) => {
    if (!decrypt) {
        const cipher = crypto.createCipheriv(algo, key, salt);
        const crypted = Buffer.concat([cipher.update(file.data), cipher.final()]);
        return crypted;
    }
    else {
        const cipher = crypto.createDecipheriv(algo, key, salt);
        const decrypted = Buffer.concat([cipher.update(file.data), cipher.final()]);
        return decrypted;
    }
};
exports.cryptFileWithSalt = cryptFileWithSalt;

//checking whether there is a file or not
const checkFile = (files) => {
    if (!files || !files.file) {
        return false;
    }
    else
        return true;
};
exports.checkFile = checkFile;

//checking whether key and hex are present of not
const checkParams = ({ algo, key, salt }) => {
    if (!algo || !key || !salt) {
        return false;
    }
    const chosenAlgo = constants_1.algoList[algo];
    if (!chosenAlgo || key.length !== chosenAlgo.keyLength || salt.length !== chosenAlgo.ivLength) {
        return false;
    }
    else
        return true;
};
exports.checkParams = checkParams;

//setingupheader for future further fly
const setupHeaders = (res, file) => {
    if (file) {
        res.writeHead(200, {
            'Content-Type': file.mimetype,
            'Content-disposition': 'attachment;filename=' + 'encrypted_' + file.name,
            'Connection': 'close',
        });
    }
    else {
        res.writeHead(200, {
            'Connection': 'close'
        });
    }
};
exports.setupHeaders = setupHeaders;