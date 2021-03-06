import { Router } from "express";
import errorHandlerMiddleware from "../middlewares/error-handler.middleware";
import * as reviewService from "../services/review.service";

const router = Router();

router
  .post("/", errorHandlerMiddleware, (req, res, next) =>
    reviewService
      .createReview(req.body, next)
      .then(result => res.send(result))
      .catch(next)
  )

  .get("/movie/:id", errorHandlerMiddleware, (req, res, next) =>
    reviewService
      .getReviewsByMovieId(req.params.id, req.user.id, next)
      .then(result => res.send(result))
      .catch(next)
  )
  .get("/user/:id", errorHandlerMiddleware, (req, res, next) =>
    reviewService
      .getReviewsByUserId(req.params.id, next)
      .then(result => res.send(result))
      .catch(next)
  )
  .get("/:userId/:movieId", errorHandlerMiddleware, (req, res, next) =>
    reviewService
      .getReviewByMovieIdUserId(req.params.userId, req.params.movieId, next)
      .then(result => res.send(result))
      .catch(next)
  )
  .put("/:id", errorHandlerMiddleware, (req, res, next) =>
    reviewService
      .updateReviewById(req.params.id, req.body, next)
      .then(result => res.send(result))
      .catch(next)
  )
  .delete("/:id", errorHandlerMiddleware, (req, res, next) =>
    reviewService
      .deleteReviewById(req.params.id, next)
      .then(result => res.send(result))
      .catch(next)
  )
  .post("/reaction", errorHandlerMiddleware, (req, res, next) =>
    reviewService
      .setNewReaction(req.user.id, req.body, next)
      .then(result => res.send(result))
      .catch(next)
  );

export default router;
