import express from "express"
import cors from "cors"

import authRoutes from "../routes/authRoutes.js"
import userRoutes from "../routes/userRoutes.js"

const app = express()

app.use(cors())
app.use(express.json())

app.use("/api/auth", authRoutes)
app.use("/api/users", userRoutes)

app.get("/api/health", (req, res) => res.json({ status: "ok" }));

app.get('/api/search', async (req, res) => {
    const query = req.query.query
    const page = req.query.page
    const year = req.query.year
    const include_adult = req.query.include_adult

    if (!query) {
        return res.status(400).json({ error: 'Query parameter is required' });
    }

    try {
        fetch(`https://api.themoviedb.org/3/search/movie?query=${query}&page=${page}&primary_release_year=${year}&include_adult=${include_adult}`,{
            headers: {
                'Authorization': 'Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiI3NWMyOWYwYmZkYjNkOWE3OTgxZTliODBjNjZmNDNhOCIsIm5iZiI6MTc2MjkzNjQ1OS4yMTI5OTk4LCJzdWIiOiI2OTE0NDY4Yjg4MzY4NWI1NzVhMGJkNGIiLCJzY29wZXMiOlsiYXBpX3JlYWQiXSwidmVyc2lvbiI6MX0.LKen2F9MBf8zSHRSHF4VXZsHlrSl7xmkkxEMsp4GABY',
                'Content-Type': 'application/json'
            }
        })
        .then(response => response.json())
        .then(json => {
            res.json(json)
        })
        .catch(error => {
            console.log(error)
        })
    } catch (error) {
        console.error(error.message);
        res.status(500).json({ error: 'Failed to fetch data from Movie API' });
    }
});

app.listen(5000, () =>
  console.log("Backend running on port 5000")
);
