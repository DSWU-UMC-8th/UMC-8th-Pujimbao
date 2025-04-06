import { useEffect, useState } from "react";
import axios from "axios";
import {Movie, MovieResponse} from '../types/movie'
import MovieCard from "../components/movieCard";

export default function MoviePage() {
  const [movies, setMovies] = useState<Movie[]>([]);

  useEffect((): void => {
    const apiKey = import.meta.env.VITE_TMDB_KEY;
    const fetchMovies = async(): Promise<void> => {
      const {data} = await axios.get<MovieResponse>(
        `https://api.themoviedb.org/3/movie/popular?api_key=${apiKey}&language=en-US&page=1`
      );
      //fetch를 사용할 때는 실질적인 데이터 값을 json으로 한번 풀어주는 과정 필요
      //const result = await response.json();

      setMovies(data.results);
    }

    fetchMovies();
  }, []);
  console.log(movies);


  return (
    <div className="p-10 grid gap-4 grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grod-cols-5 xl:grid-cols-6">
    {movies.map((movie) => (
      <MovieCard movie={movie}></MovieCard>
    ))}
    </div>
  )
}