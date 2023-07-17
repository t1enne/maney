import Layout from "../layouts/Layout.tsx";

export default () => {
  return (
    <Layout>
      <article class="grid">
        <div>
          <hgroup>
            <h4>Login</h4>
            <h6></h6>
          </hgroup>
          <form method="POST" action="/api/login">
            <input
              type="text"
              name="email"
              aria-label="email"
              autocomplete="email"
              placeholder="Your email"
              required
            />
            <input
              type="password"
              name="password"
              placeholder="Password"
              aria-label="Password"
              autocomplete="current-password"
              required
            />
            <button type="submit" class="contrast">
              Login
            </button>
          </form>
        </div>
      </article>
    </Layout>
  );
};
