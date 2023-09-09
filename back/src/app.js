"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const cors_1 = __importDefault(require("cors"));
const express_1 = __importDefault(require("express"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const path_1 = __importDefault(require("path"));
const errorMiddleware_1 = __importDefault(require("./middlewares/errorMiddleware"));
const resLogingMiddleware_1 = __importDefault(require("./middlewares/resLogingMiddleware"));
const swagger_output_json_1 = __importDefault(require("./config/swagger-output.json"));
const swagger_ui_express_1 = __importDefault(require("swagger-ui-express"));
const app = (0, express_1.default)();
app.use((0, cors_1.default)());
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: false }));
app.use((0, cookie_parser_1.default)());
app.use(express_1.default.static(path_1.default.join(__dirname, "../public")));
app.use("/api-docs", swagger_ui_express_1.default.serve, swagger_ui_express_1.default.setup(swagger_output_json_1.default, { explorer: true }));
// app.use(passport.initialize());
// passport.use("local", local);
// passport.use("jwt", jwt);
// passport.use("kakao", kakao);
app.use(resLogingMiddleware_1.default);
// app.use(authRouter);
// app.use(postRouter);
// app.use(commentRouter);
app.use(errorMiddleware_1.default);
exports.default = app;
