import { coworkingFormSchema } from "@/lib/validation-schemas";
import { processFormRequest } from "@/lib/api/form-handler";

export async function POST(req: Request) {
  return processFormRequest(req, coworkingFormSchema, "coworking");
}
