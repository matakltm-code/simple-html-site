import express, { Request, Response } from 'express'
import NodeCache from 'node-cache';
import cors from 'cors';

const app = express()

app.use(cors({ origin: 'http://localhost:3000' }));


// TODO: update this so it makes a request to https://jsonplaceholder.typicode.com/comments?postId=3
// and it returns a list of comments that match what the user entered
// Bonus: cache results in memory for 5 mins

const cache = new NodeCache({ stdTTL: 300 }); // Cache for 5 minutes (300 seconds)

interface Comment {
    name: string;
    email: string;
    body: string;
}

app.get('/', async (req: Request, res: Response) => {
    const query = req.query.q as string;

    if (!query) {
        return res.status(400).json({ error: 'Query parameter "q" is required' });
    }

    // Check the cache
    const cachedData = cache.get<Comment[]>('comments');
    if (cachedData) {
        console.log('Serving from cache');
        const filteredResults = cachedData.filter((comment) =>
            comment.name.toLowerCase().includes(query.toLowerCase())
        );
        return res.json(filteredResults);
    }

    try {
        const apiResponse = await fetch('https://jsonplaceholder.typicode.com/comments?postId=3');
        if (!apiResponse.ok) throw new Error('Failed to fetch API data');

        const data: Comment[] = await apiResponse.json();
        cache.set('comments', data); // Cache the results

        const filteredResults = data.filter((comment) =>
            comment.name.toLowerCase().includes(query.toLowerCase())
        );

        res.json(filteredResults);
    } catch (error) {
        console.error('Error fetching API data:', error);
        res.status(500).json({ error: 'Failed to fetch data from API' });
    }
});

app.listen(3001, () => {
    console.log('Server is running on port 3001')
})