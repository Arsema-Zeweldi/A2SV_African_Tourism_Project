import { z } from "zod"

export const createPackageSchema = z.object({
  itinerary_id: z.string().uuid("Invalid itinerary ID"),
  title: z.string().min(3, "Title must be at least 3 characters"),
  summary: z
    .string()
    .min(10, "Summary must be at least 10 characters")
    .max(300, "Summary must be under 300 characters"),
  description: z.string().min(20, "Description must be at least 20 characters"),
  price: z
    .number({ invalid_type_error: "Price must be a number" } as never)
    .min(0, "Price must be non-negative"),
  country: z.string().min(2, "Country is required"),
  location: z.string().min(2, "Location is required"),
  currency: z.string().min(1).default("USD"),
  duration_days: z.number().int().min(1),
  category: z.string().min(2, "Category is required"),
  group_size: z.string().min(1, "Group size is required"),
})

export type CreatePackagePayload = z.infer<typeof createPackageSchema>
