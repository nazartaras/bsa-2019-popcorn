import { Movie } from "../models/MovieModel";
import MovieRepository from "../repository/movie.repository";
import MovieRateRepository from "../repository/movieRate.repository";
import { getCustomRepository, Like, getRepository } from "typeorm";
import * as elasticRepository from "../repository/movieElastic.repository";

export const getMovies = async (): Promise<any[]> => {
  let data = await elasticRepository.get();

  data = data.hits.hits;

  const arrayMovies = data.map(movie => movie._source);
  const result = await Promise.all(
    arrayMovies.map(async (movie: any) => {
      movie.rate = await getCustomRepository(MovieRateRepository)
        .createQueryBuilder("movieRate")
        .select("AVG(movieRate.rate)", "average")
        .where("movieRate.movieId = :id", { id: movie.id })
        .getRawOne();
      return movie;
    })
  );
  return result;
};

export const getMovieById = async (movieId: number): Promise<Movie> =>
  await getCustomRepository(MovieRepository).findOne(movieId);

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

  return data.map(movie => movie._source);
};

export const saveMovieRate = async (newRate: any) => {
  return await getCustomRepository(MovieRateRepository).save(newRate);
};
