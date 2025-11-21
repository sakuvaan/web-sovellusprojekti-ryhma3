import { useEffect, useState } from 'react'
import ReactPaginate from 'react-paginate'
import '../css/NowAiring.css';

const NowAiring = () =>  {//<h1 className="text-3xl font-bold">test2</h1>;
    const [movies, setMovies] = useState([])
    const [page, setPage] = useState(1)
    const [pageCount, setPageCount] = useState(0)

    const Movies = () => {
        return (
            <div className="movie-grid">
                {movies.map(movie => (
                    <div key={movie.id} className="movie-item">
                        <img
                            src={`https://image.tmdb.org/t/p/w185${movie.poster_path}`} //92,154,185,342,500,780,original
                            alt={movie.title}
                        />
                        <span>{movie.title}</span>
                    </div>
                ))}
             </div>
        );
    };
    //https://api.themoviedb.org/3/movie/now_playing?language=en-US&region=FI
    useEffect(() => { 
        fetch('https://api.themoviedb.org/3/movie/now_playing?language=en-US&region=FI&page=' + page,{
            headers: {
                'Authorization': 'Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiI3NWMyOWYwYmZkYjNkOWE3OTgxZTliODBjNjZmNDNhOCIsIm5iZiI6MTc2MjkzNjQ1OS4yMTI5OTk4LCJzdWIiOiI2OTE0NDY4Yjg4MzY4NWI1NzVhMGJkNGIiLCJzY29wZXMiOlsiYXBpX3JlYWQiXSwidmVyc2lvbiI6MX0.LKen2F9MBf8zSHRSHF4VXZsHlrSl7xmkkxEMsp4GABY',
                'Content-Type': 'application/json'
            }
        })
        .then(response => response.json())
        .then(json => {
            setMovies(json.results)
            setPageCount(json.total_pages)
        })
        .catch(error => {
            console.log(error)
        })
    }, [page])
    return (
        <div id="nowAiring">
            <h3>Now Airing movies</h3>
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
    );
}
export default NowAiring;