import express from 'express';
import { config } from "dotenv";
config();
import cors from "cors";
import nodeFetch from "node-fetch";
import { decryptString, getRandomUserAgent } from "./utils.js";

const app = express();
app.use(cors());
app.use(express.json());

const port = process.env.PORT || 5000;

const max_chunk_size = 1024 * 1024 * 1.5;

app.get('/',(req,res) => {
	if(req.headers['awake-key'] === process.env.AWAKE_KEY){
		setTimeout(() => {
			nodeFetch(process.env.SELF_DOMAIN,{
				method:'HEAD',
				headers:{
					'User-Agent':getRandomUserAgent(),
					'awake-key': process.env.AWAKE_KEY
				}
			})

		},120*1000)
		res.send('Awaked')
	} else {
		res.send('Welcome MOVIES4U Streaming API')
	}
});

app.get('/video/:url/:size', async (req, res) => {
    const range = req.headers.range;

    if (!range) {
        return res.status(400).send('Range header is required');
    }

    const parts = range.replace(/bytes=/, "").split("-");
    const start = parseInt(parts[0], 10);
    const end = Math.min(start + max_chunk_size, req.params.size - 1);
    const chunksize = (end - start) + 1;

    res.writeHead(206, {
        "Accept-Ranges": 'bytes',
        "Content-Range": `bytes ${start}-${end}/${req.params.size}`,
        "Content-Length": chunksize,
        'Content-Type': 'video/mp4'
    });

    try {
        const response = await nodeFetch(decryptString(req.params.url), {
            headers: {
                'User-Agent': getRandomUserAgent(),
                'Range': `bytes=${start}-${end}`
            }
        });
        const stream = await response.arrayBuffer();
        res.write(Buffer.from(stream));
        res.end();
    } catch (error) {
        console.error("Error fetching video:", error.message);
        res.status(500).send("server side error");
    }
});

app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});
