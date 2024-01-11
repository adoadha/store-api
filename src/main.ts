import config from "./constant/config";
import { app } from "./server";

import "dotenv/config";

app.listen({ port: Number(config.PORT), host: "127.0.0.1" }, (err, address) => {
  if (err) {
    console.log(err);
    process.exit(1);
  }
  console.log(config);
  console.log(`server listening at ${address}`);
});
