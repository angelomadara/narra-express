import { LogService } from "./src/services/log.service";

const log = new LogService();

log.info("This is an info message", { additional: "data" });