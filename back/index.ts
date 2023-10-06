import "dotenv/config";
import app from "./src/app";

const PORT = process.env.SERVER_PORT || 5001;

app.listen(PORT, () => {
  console.log(`🚀 :: Server connection :: ${process.env.SERVER_URL}`);
});
