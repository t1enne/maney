import { Hono } from "hono";
import { withJwt } from "../utils";
import { GroupsService } from "../services/groups";
import { ToastSvc } from "../services/notifications";
import { db } from "../db/kysely";
import { GroupsListPage } from "../pages/groups/index";
import { CreateGroupPage } from "../pages/groups/create";
import { GroupDetailPage } from "../pages/groups/[id]";
import { ManageGroupPage } from "../pages/groups/manage";
import {
  requireGroupMembership,
  requireGroupAdmin,
} from "../middleware/groups";

const groups = new Hono();

groups.get("/", async (c) => {
  const jwt = withJwt(c);
  return c.render(<GroupsListPage userId={jwt.userId} />);
});

groups.get("/create", (c) => {
  return c.render(<CreateGroupPage />);
});

groups.post("/", async (c) => {
  const jwt = withJwt(c);
  const body = await c.req.formData();
  const name = body.get("name") as string;
  const description = body.get("description") as string;

  if (!name) {
    ToastSvc.error({ subtitle: "Group name is required" });
    return c.redirect("/groups/create");
  }

  try {
    const group = await GroupsService.createGroup({
      name,
      description: description || null,
      createdBy: jwt.userId,
    });

    ToastSvc.success({ subtitle: "Group created successfully" });
    return c.redirect(`/groups/${group.id}`);
  } catch (error) {
    ToastSvc.error({ subtitle: "Failed to create group" });
    return c.redirect("/groups/create");
  }
});

groups.get("/:id", requireGroupMembership(), async (c) => {
  const jwt = withJwt(c);
  const groupId = parseInt(c.req.param("id"));

  return c.render(<GroupDetailPage groupId={groupId} userId={jwt.userId} />);
});

groups.get("/:id/manage", requireGroupAdmin(), async (c) => {
  const jwt = withJwt(c);
  const groupId = parseInt(c.req.param("id"));

  return c.render(<ManageGroupPage groupId={groupId} userId={jwt.userId} />);
});

groups.post("/:id/members", requireGroupAdmin(), async (c) => {
  const groupId = parseInt(c.req.param("id"));
  const body = await c.req.formData();
  const userEmail = body.get("email") as string;

  try {
    const user = await db
      .selectFrom("user")
      .select("id")
      .where("mail", "=", userEmail)
      .executeTakeFirst();

    if (!user) {
      ToastSvc.error({ subtitle: "User not found" });
      return c.redirect(`/groups/${groupId}/manage`);
    }

    await GroupsService.addMember(groupId, user.id);
    ToastSvc.success({ subtitle: "Member added successfully" });
  } catch (error) {
    ToastSvc.error({ subtitle: "Failed to add member" });
  }

  return c.redirect(`/groups/${groupId}/manage`);
});

groups.delete("/:id/members/:userId", requireGroupAdmin(), async (c) => {
  const groupId = parseInt(c.req.param("id"));
  const targetUserId = parseInt(c.req.param("userId"));

  try {
    await GroupsService.removeMember(groupId, targetUserId);
    ToastSvc.success({ subtitle: "Member removed successfully" });
    return c.text("OK");
  } catch (error) {
    ToastSvc.error({ subtitle: "Failed to remove member" });
    return c.text("Error", 500);
  }
});

export default groups;

