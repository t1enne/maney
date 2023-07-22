import { Handlers } from "$fresh/server.ts";
import { supabase } from "../../main.ts";
import { Toaster } from "../../utils/Toaster.ts";

function redirectToHome() {
  const headers = new Headers();
  headers.set("Location", "/");
  return new Response(null, {
    status: 303, // "See Other"
    headers,
  });
}

async function upsertMovement(form: FormData) {
  const id = <string> form.get("id");
  const userId = <string> form.get("userId");
  const note = <string> form.get("note");
  const amount: string | number = <string> form.get("amount");
  const type = <string> form.get("type");
  const date = <string> form.get("date");
  const category = <string> form.get("category");

  const payload: Record<string, unknown> = {
    note,
    amount: +amount * +type,
    date,
    category,
    userId,
  };

  if (id) payload.id = +id;
  const res = await supabase.from("movements").upsert([payload]).select();

  if (res.error) {
    console.error("unable to save mvmnt", { res });
    Toaster.showToast({ message: "Updated succesfully", type: "negative" });
    return;
  }
  Toaster.showToast({ message: "Updated succesfully", type: "positive" });
}

async function deleteMovement(form: FormData) {
  const id = <string> form.get("id");
  const res = await supabase.from("movements").delete().eq("id", id).select();

  if (res.error) {
    console.error("unable to delete mvmnt", { res });
    Toaster.showToast({ message: "Updated succesfully", type: "negative" });
    return;
  }

  Toaster.showToast({ message: "Deleted succesfully", type: "positive" });
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
