import React, { useState, useEffect } from 'react';
import './main.css'
import api from '../../services/api'
import { Container, Modal, ModalHeader, ModalBody, Col, Row, InputGroup, InputGroupAddon, Input, Button } from 'reactstrap'
import SearchIcon from '@material-ui/icons/Search';
import StarBorderIcon from '@material-ui/icons/StarBorder';

export default function Main() {

    const [movies, setMovies] = useState([])
    const [moviesBase, setMoviesBase] = useState([])
    const [modal, setModal] = useState(false);
    const [original_title, setOriginal_title] = useState('')
    const [overview, setOverview] = useState('')
    const [vote_average, setVote_average] = useState('')
    const [popularity, setPopularity] = useState('')
    const [poster_path, setPoster_path] = useState('')
    const [rating, setRating] = useState('')
    const [searchQuery, setSearchQuery] = useState('')
    const [searchMessage, setSearchMessage] = useState('')

    let filteredMovies = []

    useEffect(() => {
        getMovies()
    }, [])

    const starFilterHandler = (ratingValue) => {

        if (rating === ratingValue) {
            setMovies(moviesBase)
        } else {
            for (let i = 0; i < moviesBase.length; i++) {
                if (moviesBase[i].vote_average < ratingValue && moviesBase[i].vote_average >= (ratingValue - 2)) {
                    filteredMovies.push(moviesBase[i])
                }
            }
            setMovies(filteredMovies)
        }
    }

    const toggle = (id) => {
        
        for (let i = 0; i < movies.length; i++) {
            if (movies[i].id === id) {
                setOriginal_title(movies[i].original_title)
                setOverview(movies[i].overview)
                setVote_average(movies[i].vote_average)
                setPopularity(movies[i].popularity)
                setPoster_path(movies[i].poster_path)
            }
        }
        setModal(!modal);

    }

    const getMovies = async () => {

        try {
            const api_key = '8d3ac704b4968474b79d228979fccc0e'
            const url = `/discover/movie?api_key=${api_key}&sort_by=popularity.desc&page=1`
            const response = await api.get(url)
            console.log(response.data.results)
            setMoviesBase(response.data.results)
            setMovies(response.data.results)
            setSearchMessage('Most Popular Movies:')
        } catch (error) {
            console.log(error)
        }

    };

    const searchMovies = async () => {

        try {
            if (searchQuery !== '') {
                const api_key = '8d3ac704b4968474b79d228979fccc0e'
                const url = `/search/movie?api_key=${api_key}&query=${searchQuery}&page=1`
                const response = await api.get(url)
                setMovies(response.data.results)
                setMoviesBase(response.data.results)
                setSearchMessage(`Search Results for "${searchQuery}: " `)
                if (response.data.results.length === 0) {
                    setSearchMessage(`There are no movies with the title "${searchQuery}" `)
                } else {
                    setSearchMessage(`Search results for: "${searchQuery}"`)
                }
            }
            else {
                setSearchMessage(`Please insert a keyword to Search for a Movie`)
                setMovies([])
                setMoviesBase([])
            }
        } catch (error) {
            console.log(error)
        }

    };

    return (

        <Container>
            <div>
                <Row className="search-bar">
                    <Col xs="auto" md="7">
                        <InputGroup >
                            <Input id="search-input" placeholder="Search for a Movie..."
                                onChange={event => setSearchQuery(event.target.value)}
                                onKeyPress={event => {
                                    if (event.key === 'Enter') {
                                        searchMovies(searchQuery)
                                    }
                                }
                                }
                            />
                            <InputGroupAddon addonType="append">
                                <Button color="secondary" onClick={() => { searchMovies(searchQuery); console.log(setSearchQuery) }}><SearchIcon fontSize="small" /></Button>
                            </InputGroupAddon>
                        </InputGroup>
                    </Col>
                    <Col xs="auto" md="auto">
                        <InputGroup className="star-group">
                            <InputGroupAddon addonType="prepend">
                                <Button disabled color="secondary">Filter by Rating: </Button>
                            </InputGroupAddon>
                            <div>
                                {[...Array(5)].map((star, i) => {
                                    const ratingValue = (i + 1) * 2;

                                    return (

                                        <label className="star-label">
                                            <input type="radio" name="rating" value={ratingValue} onClick={() => { starFilterHandler(ratingValue); (ratingValue === rating) ? setRating(0) : setRating(ratingValue); }} />
                                            <StarBorderIcon className="star" style={{ fontSize: 30 }} color={(ratingValue <= rating) ? "dark" : "disabled"} />
                                        </label>
                                    );
                                })}
                            </div>
                        </InputGroup>
                    </Col>
                </Row>
            </div>

            <div id="search-message" >
                <h5 >{searchMessage}</h5>

            </div>

            <ul className="movies-list">
                {movies.map(movie => (

                    <li className="movie-container" key={movie.id} onClick={() => toggle(movie.id)}>
                        <div className="movie-poster" style={{ backgroundImage: `url(https://image.tmdb.org/t/p/w500${movie.poster_path})` }}></div>
                        <p>{movie.original_title}</p>
                    </li>
                ))}
            </ul>

            <Modal isOpen={modal} toggle={toggle}>
                <ModalHeader toggle={toggle}>{original_title}</ModalHeader>
                <ModalBody>
                    <Row><Col>
                        <div className="movie-poster" style={{ backgroundImage: `url(https://image.tmdb.org/t/p/original${poster_path})` }}></div>
                    </Col>
                        <Col>
                            <p><strong>User Score:</strong> {vote_average}</p>
                            <p><strong>Popularity:</strong> {popularity}</p>
                            <p><strong>Overview:</strong> {overview}</p>
                        </Col>
                    </Row>
                </ModalBody>
            </Modal>
        </Container>
    )
}