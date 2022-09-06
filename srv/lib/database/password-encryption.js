import CryptoJS from "crypto-js";

const password = 'password';

const salt = 'salt';

const iterations = 100000;

const keySize = 2;

function encrypt(string) {

	return CryptoJS
		.SHA512(string, salt)
		.toString(CryptoJS.enc.Base64);

}

const test = encrypt(password);

Users.findOne({ username: username }, function (err, user) {

	clientHash = CryptoJS.enc.Hex.stringify(SHA512(user.salt + password));

	userHash = user.hash;

	if (clientHash == userHash) {
		console.log('login successful');
		return done(null, user);
	} else {
		console.log('incorrect password');
	}
});
