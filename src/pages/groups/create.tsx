import { FC } from "hono/jsx";
import { Layout } from "../../components/layout";

export const CreateGroupPage: FC = () => {
  return (
    <Layout>
      <div className="max-w-md mx-auto">
        <hgroup className="mb-6">
          <h4 className="m-0 text-2xl font-bold">Create New Group</h4>
          <h6 className="text-lg">
            <i>Start sharing expenses with others</i>
          </h6>
        </hgroup>

        <form hx-post="/groups" hx-boost className="space-y-4">
          <div>
            <label className="label">
              <span className="label-text">Group Name *</span>
            </label>
            <input
              type="text"
              name="name"
              className="input input-bordered w-full"
              placeholder="e.g., Roommates, Trip to Paris"
              required
            />
          </div>

          <div>
            <label className="label">
              <span className="label-text">Description</span>
            </label>
            <textarea
              name="description"
              className="textarea textarea-bordered w-full"
              placeholder="Optional description for the group"
              rows={3}
            />
          </div>

          <div className="flex gap-2 pt-4">
            <button type="submit" className="btn btn-primary flex-1">
              Create Group
            </button>
            <a
              hx-boost
              href="/groups"
              className="btn btn-secondary"
            >
              Cancel
            </a>
          </div>
        </form>
      </div>
    </Layout>
  );
};