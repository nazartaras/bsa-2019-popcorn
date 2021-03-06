import { Movie } from "../models/MovieModel";
import MovieRepository, {
  getMovieVideoLinkById,
  getCredits,
  getAwards,
  getGenres
} from "../repository/movie.repository";

import MovieRateRepository from "../repository/movieRate.repository";
import { getCustomRepository } from "typeorm";
import * as elasticRepository from "../repository/movieElastic.repository";
import DiscussionRepository from "../repository/discussion.repository";
import { ExtendedDiscussion, Discussion } from "models/DiscussionModel";

export const getMovies = async ({ size, from }): Promise<any[]> => {
  let data = await elasticRepository.get(size, from);

  try {
    data = data.hits.hits;

    return data.map(movie => movie._source);
  } catch (e) {
    console.log(e);
    return [];
  }
};

export const getFiltredMovies = async (
  { from, size },
  filters
): Promise<any[]> => {
  let data = await elasticRepository.getFiltred(size, from, filters);
  data = data.hits.hits;
  let movies = data.map(movie => movie._source);
  const moviesId = movies.map(movie => movie.id);
  const averageRates: any[] = await getCustomRepository(
    MovieRateRepository
  ).getRatesByMoviesId(moviesId);
  movies = movies.map(movie => {
    const rateInfo = averageRates.find(rate => rate.movieid == movie.id);
    movie.rateInfo = rateInfo || {
      average: "0",
      count: "0",
      movieid: movie.id
    };
    return movie;
  });
  return movies;
};

export const getMoviesGenres = async (): Promise<any[]> => {
  const genres = await getGenres();
  return genres.genres;
};

export const getMovieAwards = async (imdbId: any): Promise<any> => {
  const awardList = await getAwards(imdbId);
  return awardList.data.movies[0].awards;
};

export const getMovieTitleById = async (movieId: string): Promise<any> => {
  const data = await elasticRepository.getById(movieId);
  const movie = data.hits.hits[0]._source;
  return { id: movie.id, title: movie.title };
};

export const getMovieById = async (movieId: string): Promise<any> => {
  const data = await elasticRepository.getById(movieId);
  const movie = data.hits.hits[0]._source;

  const messages = await getCustomRepository(DiscussionRepository).getMessages(
    movieId
  );
  movie.messages = messages;

  const rate = await getCustomRepository(MovieRateRepository).getRateByMovieId(
    movie.id
  );
  movie.rate = rate ? parseFloat(rate.average).toFixed(2) : null;

  movie.video_link = await getMovieVideoLinkById(movie.id);

  const credits = await getCredits(movieId);
  movie.crew = credits.credits.crew;

  return movie;
};

export const createMovie = async (movie: Movie): Promise<Movie[]> =>
  await getCustomRepository(MovieRepository).save([movie]);

export const updateMovie = async (updatedMovie: Movie): Promise<Movie[]> => {
  let movie = await getCustomRepository(MovieRepository).findOne(
    updatedMovie.id
  );
  movie = updatedMovie;
  return await getCustomRepository(MovieRepository).save([movie]);
};

export const deleteMovieById = async (movieId: number): Promise<Movie> => {
  const movie = await getCustomRepository(MovieRepository).findOne(movieId);
  return await getCustomRepository(MovieRepository).remove(movie);
};

export const getByTitle = async (title: string): Promise<Movie[]> => {
  let data = await elasticRepository.getByTitle(title);

  data = data.hits.hits;
  const movies = data.map(movie => movie._source);
  const moviesSet = new Map();
  movies.forEach(movie => {
    moviesSet.set(movie.id, movie);
  });
  const response = [];
  for (const movie of moviesSet.values()) {
    response.push(movie);
  }
  return response;
};

export const saveMovieRate = async (newRate: any) => {
  const { movieId, userId } = newRate;
  const rateInDB = await getCustomRepository(MovieRateRepository).findOne({
    movieId,
    userId
  });
  if (rateInDB) {
    rateInDB.rate = newRate.rate;
    await getCustomRepository(MovieRateRepository).update(
      { id: rateInDB.id },
      { ...rateInDB }
    );
    return getCustomRepository(MovieRateRepository).findOne({
      id: rateInDB.id
    });
  }
  return await getCustomRepository(MovieRateRepository).save(newRate);
};

export const getMovieRate = async (
  userId: string,
  movieId: string
): Promise<any> => {
  const data = await getCustomRepository(MovieRateRepository).findOne({
    userId,
    movieId
  });
  if (data) {
    return data;
  }
  return { userId, movieId, rate: 0 };
};

export const getAllUserRates = (userId: string) =>
  getCustomRepository(MovieRateRepository).find({ where: { userId } });

export const deleteMovieRate = (rateId: string): Promise<any> =>
  getCustomRepository(MovieRateRepository).delete({ id: rateId });

export const saveDiscussionMessage = async (
  discussion: ExtendedDiscussion
): Promise<Discussion> => {
  const result = await getCustomRepository(DiscussionRepository).save(
    discussion
  );
  return result;
};

export const searchMovieTitles = async (title: string, next): Promise<any> => {
  const elasticData = await elasticRepository.getPropertiesByMovieTitle(title, [
    "id",
    "title",
    "release_date"
  ]);
  if (!elasticData) {
    return next({ status: 404, message: "No connect to elastic" }, null);
  }
  const movieData = elasticData.hits.hits.map(movie => movie._source);
  const result = [];
  movieData.forEach(movie => {
    title.toLowerCase() === movie.title.substr(0, title.length).toLowerCase()
      ? result.unshift(movie)
      : result.push(movie);
  });

  return result;
};

export const getMovieProperties = async (settings: string, next) => {
  const [id, propString] = settings.split("|");
  const properties = propString.split(";");
  const elasticResponse = await elasticRepository.getPropertiesByMovieId(
    id,
    properties
  );
  return elasticResponse.hits.hits[0]._source;
};

export const getMovieStatistics = async (movieId: string) => {
  const statisticsByRate = await getCustomRepository(
    MovieRateRepository
  ).getStatisticsByMovieId(movieId);
  const averageStatistics = await getCustomRepository(
    MovieRateRepository
  ).getAverageStatisticsByMovieId(movieId);
  return { averageStatistics, statisticsByRate };
};
