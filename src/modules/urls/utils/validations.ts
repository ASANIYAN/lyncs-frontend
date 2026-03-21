import { z } from "zod";

export const ShortenSchema = z.object({
  url: z
    .string()
    .min(1, "URL is required")
    .url("Please enter a valid URL including https://"),
});

export type ShortenFormType = z.infer<typeof ShortenSchema>;
