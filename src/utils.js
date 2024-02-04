import crypto from 'crypto';
import { config } from "dotenv";
config();
import nodeFetch from "node-fetch";

export const getRandomUserAgent = () => {
	// Array of common components for generating random user agents
	const components = {
		os: ['Windows NT 10.0', 'Macintosh; Intel Mac OS X 10_15_7', 'Linux x86_64'],
		browsers: [
			{ name: 'Chrome', version: '97.0.' },
			{ name: 'Firefox', version: '96.0.' },
			{ name: 'Safari', version: '15.2' },
			{ name: 'Edge', version: '97.0.' },
			{ name: 'Opera', version: '83.0.' }
		]
	};
	const os = components.os[Math.floor(Math.random() * components.os.length)];
	const browser = components.browsers[Math.floor(Math.random() * components.browsers.length)];
	const newAgent = `Mozilla/5.0 (${os}) AppleWebKit/537.36 (KHTML, like Gecko) ${browser.name}/${browser.version}${Math.floor(Math.random() * (100 - 999 + 1)) + 999}.99 Safari/537.36`;
	return newAgent;
};

/**
 *
 *	return array buffer
 *
 * if response headers is 403 then again fetch with current range after 5 second later and return arrayBuffer
 * @param {string} url
 * @returns
 */
export const getArrayBuff = async ({
	url,
	range,
	response
}) => {
	try {
		if(response.status === 403) {
			return new Promise (resolve => {
				setTimeout(async () => {
					const res = await nodeFetch(url,{
						headers:{
							'User-Agent': getRandomUserAgent(),
							'Range': range
						}
					});

					const status = res.status;
					if(status !== 200 || status !== 206) {
						throw new Error('link expired');
					} else {
						const arrBuff = await res.arrayBuffer();
						resolve(arrBuff);
					}
				},5*1000)
			})
		} else if(response.status === 200 || response.status === 206) {
		// else we make response into array buffer
		const arrBuff = await response.arrayBuffer();
		return arrBuff;
		} else {
			throw new Error('link issue');
		}
	} catch (error) {
		return error.message;
	}
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
