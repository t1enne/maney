import { FC } from "hono/jsx";
import { Layout } from "../../components/layout";
import { GroupsService } from "../../services/groups";

export const ManageGroupPage: FC<{
  groupId: number;
  userId: number;
}> = async ({ groupId, userId }) => {
  const group = await GroupsService.getGroupById(groupId);
  const members = await GroupsService.getGroupMembers(groupId);

  if (!group) {
    return (
      <Layout>
        <div className="text-center py-8">
          <h4>Group not found</h4>
          <a hx-boost href="/groups" className="btn btn-primary">
            Back to Groups
          </a>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="max-w-2xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <hgroup>
            <h4 className="m-0 text-2xl font-bold">Manage {group.name}</h4>
            <h6 className="text-lg">
              <i>Add or remove members</i>
            </h6>
          </hgroup>
          <a
            hx-boost
            href={`/groups/${groupId}`}
            className="btn btn-secondary"
          >
            Back to Group
          </a>
        </div>

        <div className="grid gap-6">
          <div className="card bg-base-100 shadow-sm border">
            <div className="card-body">
              <h5 className="card-title">Add Member</h5>
              <form hx-post={`/groups/${groupId}/members`} className="flex gap-2">
                <input
                  type="email"
                  name="email"
                  className="input input-bordered flex-1"
                  placeholder="Enter user email"
                  required
                />
                <button type="submit" className="btn btn-primary">
                  Add
                </button>
              </form>
            </div>
          </div>

          <div className="card bg-base-100 shadow-sm border">
            <div className="card-body">
              <h5 className="card-title">Current Members ({members.length})</h5>
              <div className="space-y-2">
                {members.map((member) => (
                  <div key={member.id} className="flex justify-between items-center p-3 bg-base-200 rounded">
                    <div>
                      <span className="font-medium">{member.mail}</span>
                      <span className="badge badge-sm ml-2">
                        {member.role}
                      </span>
                    </div>
                    {member.id !== userId && (
                      <button
                        hx-delete={`/groups/${groupId}/members/${member.id}`}
                        hx-confirm="Are you sure you want to remove this member?"
                        className="btn btn-sm btn-error"
                      >
                        Remove
                      </button>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};