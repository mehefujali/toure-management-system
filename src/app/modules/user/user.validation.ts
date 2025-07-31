import z from "zod";

export const createUserZodSchema = z.object({
  name: z
    .string({ invalid_type_error:"Name will be string" })
    .min(2, "Name to short , minimum 2 cracter requird")
    .max(50, "Name to long"),
  email: z.string().email(),
  password: z
    .string({ invalid_type_error: "Name will be string" })
    .min(6, { message: "Password must be at least 8 characters long" })
    .regex(/^(?=.*[A-Z])/, {
      message: "Must contain at least one uppercase letter",
    })
    .regex(/^(?=.*\d)/, { message: "Must contain at least one number" })
    .regex(/^(?=.*[!@#$%^&*])/, {
      message: "Must contain at least one special character (!@#$%^&*)",
    }),
  phone: z.string().optional(),
  address: z.string({ message: "Address must be string" }).optional(),
});
