import { LoopsClient, APIError } from "loops";

export const loops = new LoopsClient(process.env.LOOPS_API_KEY!);
