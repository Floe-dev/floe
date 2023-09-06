# Contributing to Floe

Thanks for your interest in contributing to Floe! 😊 The only ask is to check out the standards outlined [here](https://www.contributor-covenant.org/version/1/4/code-of-conduct/).

If you have any questions, please reach out in the [contributing Discord channel](https://discord.gg/EHwDvBhKHk).

## Getting started

Floe is a monorepo built with PNPM and Turborepo.

To get setup locally:

1. Clone the repository, or fork it if you don't plan to open PRs.

2. Create a GitHub App for testing. If you need access to the production account reach out to me on Discord.

a. Go to [https://github.com/settings/apps/new](https://github.com/settings/apps/new)
b. Fill in name and Homepage URL as you like
c. Set `http://localhost:3001/api/auth/callback/github` for the Callback URL
d. Set a Webhook URL. I use [Ngrok](https://ngrok.com/), ie. `ngrok http 3001`
e. Generate a random token (you can use `openssl rand -base64 32`) and set it to the Webhook Secret. You'll need this value again later!
f. Set permissions. You will need: `Contents: Read-only`, `Metadata: Read-only`, and `Members: Read-only`.
g. Create the App. Make a note of the `App ID` and `Client ID` at the top for later.
h. Scroll down to Client secrets and click "Generate a new client secret"
i. Scroll to the bottom and generate a private key (save this for later)

3. Configure your database. The product app uses a MySQL database with [PlanetScale](https://planetscale.com/), but you can use whatever MySQL database you like. Get the database connection URL and save for later.

4. Add environment variables to `.env` inside `apps/cloud`, `apps/api`, and `apps/web`. You can copy the `.env.example` files to see which are required. Here is a break down for how to populate them:

(Inside `apps/cloud/.env`)
a. Set `APP_ID` to the value from Step 2g.
b. Set `PRIVATE_KEY` to the value from Step 2i.
c. Set `WEBHOOK_SECRET` to the value from Step 2e.
d. Set `GITHUB_CLIENT_ID` to the value from Step 2g.
e. Set `GITHUB_CLIENT_SECRET` to the value from Step 2h.
f. Set `DATABASE_URL` to the value from Step 3.
g. Set `NEXTAUTH_URL` to `http://localhost:3001`
h. Create a random value for `NEXTAUTH_SECRET`. You can use `openssl rand -base64 32`;
i. Set `NEXT_PUBLIC_FLOE_BASE_URL` to `http://localhost:4000/`

5. Install deps:

```
pnpm i
```

6. Start the dev server:

```
pnpm dev
```

Your dashboard should be running on port `localhost:3001`, api on `localhost:4000`, and your website on `localhost:3000`. If not...🤷‍♂️

7. You can now configure the web application according to the [usual setup instructions](https://www.notion.so/floe-dev/Docs-UI-Templates-ef503e987aaa4dabb1e388cac9e14d62?pvs=4) 🎉

## Workflow

Floe uses [Changesets](https://github.com/changesets/changesets) for versioning. Be sure to _carefully_ bump your package versions with each PR.
