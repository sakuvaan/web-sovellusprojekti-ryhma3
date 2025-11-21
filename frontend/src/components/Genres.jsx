import { useEffect, useState } from "react"

const Genres = () => {
    const [genres, setGenres] = useState([])

    useEffect(() => {
        async function fetchGenres() {
            fetch('https://api.themoviedb.org/3/genre/movie/list?api_key=2f6a442df4faebbf9c34fc82aa0fccbd',{
        })
        .then(response => response.json())
        .then(json => {
            setGenres(json.genres)
        })
        .catch(error => {
            console.log(error)
        })
        }

        fetchGenres()
    }, [])

    return (
        <select id="genres">
            <option value="">Any</option>
            {genres.map(genre => (
                <option key={genre.id} value={genre.id}>
                    {genre.name}
                </option>
            ))}
        </select>
    )
}

export default Genres