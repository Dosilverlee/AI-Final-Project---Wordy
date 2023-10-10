import { Request, Response, NextFunction } from "express";
import { User } from "@prisma/client";
import * as bookService from "../services/bookService";
import { BookDto, BooksDto } from "../dtos/bookDto";

export const createBook = async (req: Request, res: Response, next: NextFunction) => {
  /**
   * #swagger.tags = ['Book']
   * #swagger.summary = '커스텀 단어장 생성'
   * #swagger.security = [{
   *   "bearerAuth": []
   * }]
   */
  try {
    const userId: number = (req.user as User).id;
    const title: string = req.body.title;
    const createdBook: BookDto = await bookService.createBook(userId, title);
    return res.status(201).json(createdBook);
  } catch (error) {
    console.error(error);
    return next(error);
  }
};
export const getBookList = async (req: Request, res: Response, next: NextFunction) => {
  /**
   * #swagger.tags = ['Book']
   * #swagger.summary = '커스텀 단어장 리스트 조회'
   * #swagger.security = [{
   *   "bearerAuth": []
   * }]
   */
  try {
    const userId: number = (req.user as User).id;
    const books: BooksDto[] = await bookService.getBooks(userId);
    if (!books) return res.status(204);
    return res.status(200).json(books);
  } catch (error) {
    console.error(error);
    return next(error);
  }
};

export const getBook = async (req: Request, res: Response, next: NextFunction) => {
  /**
   * #swagger.tags = ['Book']
   * #swagger.summary = '단어장 단어 조회'
   * #swagger.description = '쿼리별 단어장 조회 / ?key=true / 커스텀단어 조회만 ?custom=true?customBookId=id'
   * #swagger.security = [{
   *   "bearerAuth": []
   * }]
   * * #swagger.parameters['correct'] = {  type: 'boolean' }
   *  * #swagger.parameters['incorrect'] = {  type: 'boolean' }
   *  * #swagger.parameters['csat'] = {  type: 'boolean' }
   *  * #swagger.parameters['toeic'] = {  type: 'boolean' }
   *  * #swagger.parameters['toefl'] = { type: 'boolean' }
   *  * #swagger.parameters['ielts'] = {  type: 'boolean' }
   *  * #swagger.parameters['custom'] = {  type: 'boolean' }
   */
  try {
    const userId: number = (req.user as User).id;
    const customBookId: number = Number(req.query.customBookId);
    const page = req.query.page ? Number(req.query.page) : 1;
    const limit = req.query.page ? Number(req.query.limit) : 10;

    const queryServiceMap = {
      correct: () => bookService.getWordByUserId(page, limit, userId, true),
      incorrect: () => bookService.getWordByUserId(page, limit, userId, false),
      csat: () => bookService.getWordByCategory(page, limit, userId, "csat"),
      toeic: () => bookService.getWordByCategory(page, limit, userId, "toeic"),
      toefl: () => bookService.getWordByCategory(page, limit, userId, "toefl"),
      ielts: () => bookService.getWordByCategory(page, limit, userId, "ielts"),
      custom: () => bookService.getWordByCategory(page, limit, userId, "custom", customBookId),
    };

    let book;

    for (const [queryParamKey, serviceFunc] of Object.entries(queryServiceMap)) {
      if (req.query[queryParamKey] === "true") {
        book = await serviceFunc();
        break;
      }
    }

    if (!book) book = await bookService.getAllWords(page, limit);

    return res.status(200).json(book);
  } catch (error) {
    console.error(error);
    return next(error);
  }
};

export const deleteCustomBook = async (req: Request, res: Response, next: NextFunction) => {
  /**
   * #swagger.tags = ['Book']
   * #swagger.summary = '커스텀 단어장 삭제'
   * #swagger.description = '포함된 단어 전부 삭제'
   * #swagger.security = [{
   *   "bearerAuth": []
   * }]
   */
  try {
    const userId = (req.user as User).id;
    const customBookId = Number(req.params.id);

    await bookService.deleteCustomBook(userId, customBookId);

    return res.status(200).json({ message: "단어장이 삭제되었습니다." });
  } catch (error) {
    console.error(error);
    next(error);
  }
};

export const createCustomBookInWord = async (req: Request, res: Response, next: NextFunction) => {
  /**
   * #swagger.tags = ['Book']
   * #swagger.summary = '커스텀 단어장 단어 추가'
   * #swagger.security = [{
   *   "bearerAuth": []
   * }]
   */
  try {
    const customBookId = Number(req.query.customBookId);
    const { word, meaning } = req.body;

    const createdCustomBookInWord = await bookService.createCustomBookInWord(
      customBookId,
      word,
      meaning,
    );
    return res.status(201).json(createdCustomBookInWord);
  } catch (error) {
    console.error(error);
    next(error);
  }
};

export const updateCustomBookInWord = async (req: Request, res: Response, next: NextFunction) => {
  /**
   * #swagger.tags = ['Book']
   * #swagger.summary = '커스텀 단어장 단어 수정'
   * #swagger.description = '포함된 단어 전부 삭제'
   * #swagger.security = [{
   *   "bearerAuth": []
   * }]
   */
  try {
    const customBookId = Number(req.query.customBookId);
    const wordId = Number(req.query.wordId);
    const updatedData = req.body;

    const updatedWord = await bookService.updateCustomBookInWord(customBookId, wordId, updatedData);
    return res.status(200).json(updatedWord);
  } catch (error) {
    console.error(error);
    return next(error);
  }
};

export const deleteCustomBookInWord = async (req: Request, res: Response, next: NextFunction) => {
  /**
   * #swagger.tags = ['Book']
   * #swagger.summary = '커스텀 단어장 단어 삭제'
   * #swagger.security = [{
   *   "bearerAuth": []
   * }]
   */
  try {
    const customBookId = Number(req.query.customBookId);
    const wordId = Number(req.query.wordId);

    await bookService.deleteCustomBookInWord(customBookId, wordId);

    return res.status(200).json({ message: "단어가 삭제되었습니다." });
  } catch (error) {
    console.error(error);
    next(error);
  }
};
