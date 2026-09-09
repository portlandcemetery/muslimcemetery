// Load Next-style env before any module that reads process.env at import time.
import { config } from "dotenv";

config({ path: ".env.local" });
config({ path: ".env" });
