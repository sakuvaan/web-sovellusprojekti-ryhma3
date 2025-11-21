import { useSearchParams } from "react-router-dom"
import { useEffect, useState } from "react"
import ReactPaginate from 'react-paginate'
import '../css/MovieResults.css';

const Search = () => {
    const [movies, setMovies] = useState([])
    const [page, setPage] = useState(1)
    const [pageCount, setPageCount] = useState(0)
    const [searchParams, setSearchParams] = useSearchParams()
    const query = searchParams.get("query")
    const year = searchParams.get("year")
    const include_adult = searchParams.get("include_adult")

    const Movies  = () => {
        return (
            <div className="movie-grid">
            {movies.map(movie => (
                <div key={movie.id} className="movie-item">
                    <img
                        src={`https://image.tmdb.org/t/p/w92${movie.poster_path}`}
                        alt={movie.title}
                    />
                    <span>{movie.title}</span>
                </div>
            ))}
            </div>
        )
    }

    useEffect(() => {
        async function fetchMovies() {
            fetch(`http://localhost:5050/api/search?query=${query}&page=${page}&year=${year}&include_adult=${include_adult}`,{
        })
        .then(response => response.json())
        .then(json => {
            setMovies(json.results)
            setPageCount(json.total_pages)
        })
        .catch(error => {
            console.log(error)
        })
        }

        fetchMovies()
    }, [page, year, query, include_adult])

    if (movies.length > 0) {
        return (
            <div id="nowAiring">
                <h3>Search Results</h3>
                <ReactPaginate
                    breakLabel="..."
                    nextLabel=" >"
                    onPageChange={(e) => setPage(e.selected + 1)}
                    pageRangeDisplayed={5}
                    pageCount={pageCount}
                    previousLabel="< "
                    renderOnZeroPageCount={null}
                    activeClassName="active-page"
                    activeLinkClassName="active-link"
                />
                <Movies />
            </div>
        )
    }

    return (
        <div id="nowAiring">
            <h3>No Results</h3>
        </div>
    )
}

export default Search;