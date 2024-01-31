import express from 'express';

import { config } from "dotenv";

config();

import cors from "cors";

import nodeFetch from "node-fetch";

import { getRandomUserAgent } from "./utils.js";

const app = express();

app.use(cors());

app.use(express.json());

const max_chunk_size = 1024*1024*2;

const port = process.env.PORT || 5000;

app.get('/video',async (req,res) => {
	const range = req.headers.range;

	if(!range) {
		res.statusCode(400).send('range_error')
	} else {

		const parts = range.replace(/bytes=/, "").split("-");
        const start = parseInt(parts[0], 10);
		const end = Math.min(start+max_chunk_size,req.query['size']-1);
		const chunksize = (end - start) + 1;
		res.writeHead(206,{
			"accept-ranges":'bytes',
			"content-range":`bytes ${start}-${end}/${req.query.size}`,
			"content-length":chunksize,
			'Content-Type': 'video/mp4'
		});
		const strm = (await nodeFetch(req.query.url,{
			headers:{
				'User-Agent':getRandomUserAgent(),
				'Range':`bytes=${start}-${end}`
			}
		})).body;

		strm.pipe(res);
	}
})

app.listen(port,() => {
	console.log(`server on running ${port}`);
})