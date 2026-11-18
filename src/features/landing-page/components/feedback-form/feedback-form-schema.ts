import * as z from "zod";

export const feedbackCategories = [
  "Nowa funkcjonalność",
  "Pochwała",
  "Błąd",
] as const;

export const feedbackFormSchema = z.object({
  email: z.string().email("Podaj poprawny adres e-mail").or(z.literal("")),
  category: z.enum([...feedbackCategories], {
    errorMap: () => ({ message: "Wybierz kategorię zgłoszenia" }),
  }),
  message: z
    .string()
    .min(1, "Wpisz treść wiadomości")
    .max(1000, "Wiadomość może mieć maksymalnie 1000 znaków"),
});

export type FeedbackFormValues = z.infer<typeof feedbackFormSchema>;
