"use server";

import { LoopsClient, APIError } from "loops";
import { loops } from "../loops";

export const joinWaitlist = async (email: string) => {
  console.log("Joining waitlist with email", email);
  try {
    const resp = await loops.createContact(email);
    // resp.success and resp.id available when successful
    return resp;
  } catch (error) {
    if (error instanceof APIError) {
      console.log(error.json);
      console.log(error.statusCode);
      throw error; // Optionally rethrow to handle it in the caller
    } else {
      console.log(error);
      throw error;
    }
  }
};