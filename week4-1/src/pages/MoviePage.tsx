import { useEffect, useState } from "react";
import axios from "axios";
import {Movie, MovieResponse} from '../types/movie'
import MovieCard from "../components/movieCard";
import { LoadingSpinner } from "../components/LoadingSpinner";
import { useParams } from "react-router-dom";
import useCustomFetch from "../hooks/useCustomFetch";

export default function MoviePage() {
  // 페이지 상태
  const [page, setPage] = useState(1);

  const {category} = useParams<{
    category: string;
  }>();

  const apiKey = import.meta.env.VITE_TMDB_KEY;
  const url: string = `https://api.themoviedb.org/3/movie/${category}?api_key=${apiKey}&language=en-US&page=${page}`;

  const {data:movies, isPending, isError} = useCustomFetch<MovieResponse>(url);

  console.log(category);

  if (isError) {
    return <div>
      <span className="text-red-500 text-2xl">에러가 발생했습니다.</span>
    </div>
  }

  return (
    <>
      <div className="flex items-center justify-center gap-6 mt-5">
        <button 
          className='bg-[#dda5e3] text-white px-6 py-3 rounded-lg shadow-md
          hover:bg-[#b2dab1] transition-all duration-200 disabled:bg-gray-300
          cursor-pointer disabled:cursor-not-allowed'
          disabled={page === 1} 
          onClick={(): void => setPage((prev): number => prev-1)}>
          {'<'}
        </button>
        <span>{page} 페이지</span>
        <button
          className='bg-[#dda5e3] text-white px-6 py-3 rounded-lg shadow-md
          hover:bg-[#b2dab1] transition-all duration-200 cursor-pointer'
          onClick={(): void => setPage((prev): number => prev+1)}>
          {'>'}
        </button>
      </div>

      {/*페이지 넘길때 로딩스피너 처리*/}
      {isPending && (
        <div className="flex items-center justify-center h-dvh">
          <LoadingSpinner/>
        </div>
      )}
      {!isPending && movies?.results && (
        <div className="p-10 grid gap-4 grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6">
        {movies.results.map((movie) => (
          <MovieCard key={movie.id} movie={movie}></MovieCard>
        ))}
        </div>
      )}
    </>
  )
}