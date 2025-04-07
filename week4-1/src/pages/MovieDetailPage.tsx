import { useParams } from "react-router-dom";
import { MovieDetailResponse } from "../types/movie";
import useCustomFetch from "../hooks/useCustomFetch";

const MovieDetailPage = (): Element => {
  const params = useParams();
  const url = `https://api.themoviedb.org/3/movie/${params.movieId}`;

  const {isPending, isError, data:movie} = useCustomFetch<MovieDetailResponse>(url, "ko-KR");

  if(isPending) {
    return <div>Loading...</div>
  }

  if (isError) {
    return <div className="text-red-500 text-xl">영화 정보를 불러오는 데 실패했습니다.</div>;
  }

  return (
    <div>
      MovieDetailPage{params.movieId}
      {movie?.id}
      {movie?.production_companies.map((company) => company.name)}
      {movie?.original_title}
      {movie?.overview}
    </div>
  )
}

export default MovieDetailPage;
