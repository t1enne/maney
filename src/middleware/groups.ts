import { Context, Next } from "hono";
import { GroupsService } from "../services/groups";
import { withJwt } from "../utils";

export const requireGroupMembership = () => {
  return async (c: Context, next: Next) => {
    const jwt = withJwt(c);
    const groupId = parseInt(c.req.param("id"));

    if (!groupId || isNaN(groupId)) {
      return c.text("Invalid group ID", 400);
    }

    const isMember = await GroupsService.isUserInGroup(jwt.userId, groupId);
    if (!isMember) {
      return c.text("Access denied", 403);
    }

    await next();
  };
};

export const requireGroupAdmin = () => {
  return async (c: Context, next: Next) => {
    const jwt = withJwt(c);
    const groupId = parseInt(c.req.param("id"));

    if (!groupId || isNaN(groupId)) {
      return c.text("Invalid group ID", 400);
    }

    const role = await GroupsService.getUserRole(jwt.userId, groupId);
    if (role !== "admin") {
      return c.text("Admin access required", 403);
    }

    await next();
  };
};