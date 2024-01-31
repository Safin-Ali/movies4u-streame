import crypto from 'crypto';
import { config } from "dotenv";
config();

export const getRandomUserAgent = () => {
	const userAgents = [
		"Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/97.0.4692.71 Safari/537.36",
		"Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:97.0) Gecko/20100101 Firefox/97.0",
		"Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/15.2 Safari/605.1.15",
		"Mozilla/5.0 (Macintosh; Intel Mac OS X 11_6_2) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/15.3 Safari/605.1.15",
		"Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/97.0.4692.71 Safari/537.36",
		"Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Ubuntu Chromium/97.0.4692.71 Chrome/97.0.4692.71 Safari/537.36",
		"Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) HeadlessChrome/97.0.4692.71 Safari/537.36",
		// Add more user agents as needed
	];

	const randomIndex = Math.floor(Math.random() * userAgents.length);
	return userAgents[randomIndex];
}

export const decryptString = (encryptedStr) => {
	const key = Buffer.from(process.env.ENCRIPTION_KEY, 'hex');
	const iv = Buffer.from(process.env.ENCRIPTION_IV, 'hex');
	const algorithm = 'aes-256-cbc';
	const decipher = crypto.createDecipheriv(algorithm, key, iv);
	let decryptedData = '';
	decryptedData += decipher.update(encryptedStr, 'hex', 'utf8');
	decryptedData += decipher.final('utf8');
	return decryptedData;
}
