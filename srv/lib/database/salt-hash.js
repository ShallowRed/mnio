import CryptoJS from "crypto-js";

export default function (string, salt) {
	
	salt ??= CryptoJS.lib.WordArray.random(16).toString();

	const hash = CryptoJS.SHA512(salt + string).toString(CryptoJS.enc.Base64);

	return { salt, hash }
}