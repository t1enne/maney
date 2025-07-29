import { FC } from "hono/jsx";
import { Layout } from "../../components/layout";
import { GroupsService } from "../../services/groups";
import { db } from "../../db/kysely";
import { fmtCurrency, fmtDate } from "../../utils";
import dayjs from "dayjs";

export const GroupDetailPage: FC<{
  groupId: number;
  userId: number;
}> = async ({ groupId, userId }) => {
  const group = await GroupsService.getGroupById(groupId);
  const members = await GroupsService.getGroupMembers(groupId);
  const userRole = await GroupsService.getUserRole(userId, groupId);

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

  const memberIds = members.map((m) => m.id);
  const movements = await db
    .selectFrom("movement")
    .innerJoin("user", "movement.userId", "user.id")
    .select([
      "movement.id",
      "movement.amount",
      "movement.date",
      "movement.category",
      "movement.description",
      "movement.userId",
      "user.mail",
    ])
    .where("movement.userId", "in", memberIds)
    .orderBy("movement.date", "desc")
    .limit(50)
    .execute();

  const totalAmount = movements.reduce((sum, m) => sum + m.amount, 0);

  return (
    <Layout>
      <div className="flex justify-between items-start mb-6">
        <hgroup>
          <h4 className="m-0 text-2xl font-bold">👥 {group.name}</h4>
          {group.description && (
            <h6 className="text-lg">
              <i>{group.description}</i>
            </h6>
          )}
          <p className="text-sm text-gray-600">
            Total expenses: <strong>{fmtCurrency(totalAmount)}</strong>
          </p>
        </hgroup>
        <div className="flex gap-2">
          {userRole === "admin" && (
            <a
              hx-boost
              href={`/groups/${groupId}/manage`}
              className="btn btn-secondary"
            >
              Manage
            </a>
          )}
          <a hx-boost href="/groups" className="btn btn-primary">
            Back to Groups
          </a>
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <div>
          <h5 className="text-lg font-semibold mb-4">
            Members ({members.length})
          </h5>
          <div className="space-y-2">
            {members.map((member) => (
              <div
                key={member.id}
                className="flex justify-between items-center p-2 bg-base-200 rounded"
              >
                <span>{member.mail}</span>
                <span className="badge badge-sm">{member.role}</span>
              </div>
            ))}
          </div>
        </div>
        <div className="md:col-span-2">
          <h5 className="text-lg font-semibold mb-4">Recent Expenses</h5>
          {movements.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              No expenses recorded yet
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="table table-zebra">
                <thead>
                  <tr>
                    <th>Date</th>
                    <th>Description</th>
                    <th>Category</th>
                    <th>Amount</th>
                    <th>User</th>
                  </tr>
                </thead>
                <tbody>
                  {movements.map((movement) => (
                    <tr key={movement.id}>
                      <td>{fmtDate(dayjs(movement.date).toDate())}</td>
                      <td>{movement.description}</td>
                      <td>{movement.category}</td>
                      <td>{fmtCurrency(movement.amount)}</td>
                      <td>
                        <div class="tooltip" data-tip={movement.mail}>
                          <button class="btn btn-link">
                            {movement.mail.slice(0, 2)}
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
};

