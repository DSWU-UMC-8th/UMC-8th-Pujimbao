import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";

interface MovieDetail {
  id: number;
  title: string;
  overview: string;
  poster_path: string;
  release_date: string;
  vote_average: number;
  genres: { id: number; name: string }[];
}

interface Cast {
  id: number,
  name: string,
  character: string,
  profile_path: string | null;
}

interface Crew {
  id: number,
  name: string,
  job: string,
  department: string;
}

const MovieDetailPage = (): Element => {
  const { movieId } = useParams<{ movieId: string }>();
  const [movie, setMovie] = useState<MovieDetail | null>(null);
  const [isError, setIsError] = useState(false);
  const [cast, setCast] = useState<Cast[]>([]);
  const [director, setDirector] = useState<string | null>(null);

  useEffect(() => {
    const fetchMovieDetail = async () => {
      try {
        // 1. 영화 상세 정보
        const { data } = await axios.get<MovieDetail>(
          `https://api.themoviedb.org/3/movie/${movieId}`,
          {
            params: {
              api_key: import.meta.env.VITE_TMDB_KEY,
              language: 'ko-KR',
            },
          }
        );
        setMovie(data);
      } catch (error) {
        console.error("영화 정보를 불러오는 중 오류 발생:", error);
        setIsError(true);
      }

      // 2. 크레딧 정보
      const {data: creditData} = await axios.get<CreditResponse>(
        `https://api.themoviedb.org/3/movie/${movieId}/credits`,
        {
          params: {
            api_key: import.meta.env.VITE_TMDB_KEY,
            language: 'ko-KR',
          }
        }
      )
      setCast(creditData.cast.slice(0, 10)); //주요 출연진 10명만
      const directorInfo = creditData.crew.find((member) => member.job === 'Director');
      setDirector(directorInfo?.name ?? null);
    };

    fetchMovieDetail();
  }, [movieId]);

  if (isError) {
    return <div className="text-red-500 text-xl">영화 정보를 불러오는 데 실패했습니다.</div>;
  }

  if (!movie) {
    return <div className="text-gray-500 text-lg">로딩 중...</div>;
  }

  return (
    <div className="p-8 flex flex-col md:flex-row gap-8">
      <img
        src={`https://image.tmdb.org/t/p/w300${movie.poster_path}`}
        alt={`${movie.title} 포스터`}
        className="rounded-lg shadow-lg w-[200px] h-[300px] object-cover"
      />
      <div>
        <h1 className="text-3xl font-bold mb-4">{movie.title}</h1>
        <p className="text-gray-500 mb-2">개봉일: {movie.release_date}</p>
        <p className="text-yellow-500 mb-4">⭐ 평점: {movie.vote_average}</p>
        <div className="mb-4">
          <strong>장르:</strong>{" "}
          {movie.genres.map((g) => g.name).join(", ")}
        </div>
        <p className="text-gray-700">{movie.overview}</p>

        {cast.length > 0 && (
          <div className="mt-6">
            <strong className="block mb-2">출연진:</strong>
            <div className="flex flex-wrap gap-4">
              {cast.map((actor) => (
                <div key={actor.id} className="w-28 text-center">
                  <img
                    src={
                      actor.profile_path
                        ? `https://image.tmdb.org/t/p/w185${actor.profile_path}`
                        : 'https://via.placeholder.com/185x278?text=No+Image'
                    }
                    alt={actor.name}
                    className="rounded-lg shadow-md mb-2 w-full h-40 object-cover"
                  />
                  <p className="text-sm font-medium">{actor.name}</p>
                  <p className="text-xs text-gray-500 truncate">{actor.character}</p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default MovieDetailPage;
