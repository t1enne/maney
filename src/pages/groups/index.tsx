import { FC } from "hono/jsx";
import { Layout } from "../../components/layout";
import { GroupsService } from "../../services/groups";

export const GroupsListPage: FC<{ userId: number }> = async ({ userId }) => {
  const groups = await GroupsService.getUserGroups(userId);

  return (
    <Layout>
      <div className="flex justify-between items-center mb-6">
        <hgroup>
          <h4 className="m-0 text-2xl font-bold">👥 Groups</h4>
          <h6 className="text-lg">
            <i>Manage your expense groups</i>
          </h6>
        </hgroup>
        <a
          hx-boost
          role="button"
          href="/groups/create"
          className="btn btn-primary"
        >
          Create Group
        </a>
      </div>

      {groups.length === 0 ? (
        <div className="text-center py-8">
          <p className="text-gray-500 mb-4">You're not part of any groups yet.</p>
          <a
            hx-boost
            role="button"
            href="/groups/create"
            className="btn btn-primary"
          >
            Create Your First Group
          </a>
        </div>
      ) : (
        <div className="grid gap-4">
          {groups.map((group) => (
            <div className="card bg-base-100 shadow-sm border">
              <div className="card-body">
                <div className="flex justify-between items-start">
                  <div>
                    <h5 className="card-title">{group.name}</h5>
                    {group.description && (
                      <p className="text-gray-600">{group.description}</p>
                    )}
                  </div>
                  <div className="flex gap-2">
                    <a
                      hx-boost
                      href={`/groups/${group.id}`}
                      className="btn btn-sm btn-primary"
                    >
                      View
                    </a>
                    {group.createdBy === userId && (
                      <a
                        hx-boost
                        href={`/groups/${group.id}/manage`}
                        className="btn btn-sm btn-secondary"
                      >
                        Manage
                      </a>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </Layout>
  );
};