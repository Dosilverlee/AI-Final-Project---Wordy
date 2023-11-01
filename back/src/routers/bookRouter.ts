import Router, { Express } from "express";
import passportJwt from "../middlewares/passportJwt";
import * as bookController from "../controllers/bookController";
import * as joi from "../validators/bookValidator";
import { deleteFavoriteWord, searchBook } from "../controllers/bookController";

const bookRouter: Express = Router();

bookRouter
  .post("/", joi.validateCreateBook, passportJwt, bookController.createBook)
  .get("/", passportJwt, bookController.getBookList)
  .put("/", joi.validateUpdateBook, passportJwt, bookController.updateCustomBook)
  .delete("/", joi.validateDeleteBook, passportJwt, bookController.deleteCustomBook);

bookRouter.delete("/all", passportJwt, bookController.deleteAllCustomBook);

bookRouter
  .post("/word", joi.validateCreateWordInBook, passportJwt, bookController.createCustomWordInBook)
  .get("/word", passportJwt, bookController.getBook)
  .put("/word", joi.validateUpdateWordInBook, passportJwt, bookController.updateCustomWordInBook)
  .delete(
    "/word",
    joi.validateDeleteWordInBook,
    passportJwt,
    bookController.deleteCustomWordInBook,
  );

bookRouter
  .post("/favorite", passportJwt, bookController.createFavoriteWordInBook)
  .delete("/favorite", passportJwt, bookController.deleteFavoriteWord);

bookRouter.get("/search", passportJwt, bookController.searchBook);
export default bookRouter;
