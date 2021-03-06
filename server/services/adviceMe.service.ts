import {
  getByGTRating,
  getByGTRatingAndGenre
} from "../repository/movieElastic.repository";
import { getRandomFromArray, getRandomNumber } from "../helpers/random.helper";
import { User } from "../models/UserModel";
import { getCustomRepository } from "typeorm";
import UserRepository from "../repository/user.repository";
import { getAllUserWatch, getWatched } from "./watch.service";
import { getMovieVideoLinkById } from "../repository/movie.repository";
import MovieRateRepository from "../repository/movieRate.repository";

const minimalRating = "5";
const amount = 3;

const movieFromList = (movies: any[], list: any[]): boolean => {
  return list.some(
    movieItem =>
      movies.filter(movie => {
        return movie.id === movieItem.id;
      }).length !== 0
  );
};

export const getAdviceMeList = async (userId: string, next) => {
  const movies = await getAdviceMovie(userId, next);

  let adviceMovies: any[] = await addVideoLinkToMovies(movies);
  const moviesId = adviceMovies.map(adviceItem => adviceItem.id);
  const averageRates: any[] = await getCustomRepository(
    MovieRateRepository
  ).getRatesByMoviesId(moviesId);
  adviceMovies = adviceMovies.map(advice => {
    const rateInfo = averageRates.find(rate => rate.movieid == advice.id);
    advice.rateInfo = rateInfo || {
      average: "0",
      movieid: advice.id,
      count: "0"
    };
    return advice;
  });

  return adviceMovies;
};

const addVideoLinkToMovies = async (movies: any) =>
  Promise.all(
    movies.map(async movie => {
      const video_link = await getMovieVideoLinkById(movie.id);
      movie.video_link = video_link;
      return movie;
    })
  );

export const getAdviceMovie = async (userId: string, next) => {
  const user: User = await getCustomRepository(UserRepository).findOne(userId);
  if (user && user.id !== userId) {
    return getRandomMovie(amount);
  }
  const list = (await getAllUserWatch(user.id, next)).sort((elem1, elem2) => {
    return elem2.movie.vote_average - elem1.movie.vote_average;
  });

  return getAdviceByList(list);
};

export const getAdviceByList = async (list: any[]) => {
  const set = new Set();
  list.forEach(elem => set.add(elem.id));

  const fetchMovies = async () => {
    let movies;

    movies =
      list.length >= 3
        ? await getMoviesFromList(list, minimalRating, amount)
        : await getRandomMovie(amount);

    if (inList(movies)) {
      return fetchMovies();
    }

    return movies;
  };
  const inList = adviceMovie => {
    return adviceMovie.some(movie => {
      return set.has(movie.id);
    });
  };

  return fetchMovies();
};

const getRandomMovie = async amountOfMovie => {
  const movies: any[] = (
    (await getByGTRating(minimalRating)).hits.hits || []
  ).map(movie => movie._source);

  return getRandomFromArray(movies, amountOfMovie);
};

const getMoviesFromList = async (
  list: any[],
  rating: string,
  amountOfMovie: number
) => {
  return await movieByGenre(
    list[getRandomNumber(0, list.length - 1)],
    rating,
    amountOfMovie
  );
};

const movieByGenre = async (
  list: any,
  rating: string,
  amountOfMovie: number
) => {
  let genres = "";
  if (list.movie.genres) {
    const parsed = JSON.parse(list.movie.genres);
    genres = parsed ? parsed[0].name : "";
  }

  const movies = (
    (await getByGTRatingAndGenre(rating, genres)) || []
  ).hits.hits.map(movie => movie._source);

  return getRandomFromArray(movies, amountOfMovie);
};
