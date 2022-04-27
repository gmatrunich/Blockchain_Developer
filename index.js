const crypto = require('crypto');
const secp256k1 = require('secp256k1');

const msg = process.argv[2]; // message to be signed you pass
const digested = digest(msg);
console.log(`0) Alice's message: 
	message: ${msg}
	message digest: ${digested.toString("hex")}`);

// generate privateKey
let privateKey;
do {
  privateKey = crypto.randomBytes(32);
} while (!secp256k1.privateKeyVerify(privateKey));
// get the public key in a compressed format
const publicKey = secp256k1.publicKeyCreate(privateKey);
console.log(`1) Alice aquired new keypair:
	publicKey: ${publicKey.toString("hex")}
	privateKey: ${privateKey.toString("hex")}`);

/*
 Sign the message
*/
console.log(`2) Alice signed her message digest with her privateKey to get its signature:`);
const sigObj = secp256k1.ecdsaSign(digested, privateKey);
const sig = sigObj.signature;
console.log("	Signature:", Buffer.from(sig).toString("hex"));

/*
 Verify
*/
console.log(`3) Bob verifyed by 3 elements ("message digest", "signature", and Alice's "publicKey"):`);
let verified = secp256k1.ecdsaVerify(sig, digested, publicKey);
console.log("	verified:", verified);
// => true


function digest(str, algo = "sha256") {
  return crypto.createHash(algo).update(str).digest();
}

