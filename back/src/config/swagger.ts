import swaggerAutogenInit from "swagger-autogen";
const swaggerAutogen = swaggerAutogenInit({ openapi: "3.0.0" });

const options = {
  info: {
    title: "Wordy API",
    description: "API 자동 문서화 및 테스트",
  },
  servers: [
    {
      url: "http://localhost:8000",
    },
  ],
  schemes: ["http"],
  securityDefinitions: {
    bearerAuth: {
      type: "http",
      scheme: "bearer",
      in: "header",
      bearerFormat: "JWT",
    },
  },
};
const outputFile = "./src/config/swagger-output.json";
const endpointsFiles = ["./src/app.ts"];
swaggerAutogen(outputFile, endpointsFiles, options);
