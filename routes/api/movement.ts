import { Handlers } from "$fresh/server.ts";
import { supabase } from "../../main.ts";

function redirectToHome() {
  const headers = new Headers();
  headers.set("Location", "/");
  return new Response(null, {
    status: 303, // "See Other"
    headers,
  });
}

async function upsertMovement(form: FormData) {
  const id = <number> +(form.get("id") as string);
  const note = <string> form.get("note");
  const amount = parseFloat(form.get("amount") as string).toFixed(2);
  const date = <string> form.get("date");
  const category = <string> form.get("category");
  console.log({ id, amount });
  const res = await supabase
    .from("movements")
    .upsert([
      {
        id,
        note,
        amount,
        date,
        category,
      },
    ])
    .select();

  if (res.error) {
    console.error("unable to save mvmnt", { res });
    return;
  }
}

async function deleteMovement(form: FormData) {
  const id = <string> form.get("id");
  console.log("attempting to delete entry with id: ", id);
  const res = await supabase.from("movements").delete().eq("id", id).select();
  console.log(res);
}

export const handler: Handlers = {
  async POST(req, _) {
    let res: Response;
    const form = await req.formData();
    const method = form.get("_method");
    switch (method) {
      case "DELETE":
        await deleteMovement(form);
        res = redirectToHome();
        return res;
      default:
        await upsertMovement(form);
        res = redirectToHome();
        return res;
    }
  },
};
