# Alignbits Dashboard

## Getting Started

### Prerequisites

- Node.js 24 or later
- npm 11 or later
- Access to the REST service and its credentials

### Install and configure

1. Clone the repository and enter the project directory:

   ```bash
   git clone https://github.com/Ri5ha6h/align-board.git
   cd align-board
   ```

2. Install dependencies:

   ```bash
   npm install
   ```

3. Create `.env.local` in the project root and provide the required values:

   ```dotenv
   APP_ORIGIN=http://localhost:3000
   REST_URL=<rest-service-url>
   REST_USERNAME=<rest-service-username>
   REST_PASSWORD=<rest-service-password>
   TOKEN_SECRET=<jwt-signing-secret>
   TEST_USER_BACKEND_USERNAME=<test-user-backend-username>
   TEST_USER_BACKEND_PASSWORD=<test-user-backend-password>
   ```

   Set `APP_ORIGIN` to the browser-facing application origin in deployed environments, for
   example `https://tracking.alignbits.com`. This keeps authentication redirects on the public
   host when Next.js runs behind a reverse proxy.

   Obtain the real values through the project's approved secure channel. Do not commit
   `.env.local` or share its secrets.

4. Start the development server:

   ```bash
   npm run dev
   ```

5. Open [http://localhost:3000](http://localhost:3000) in a browser.

## Project Structure

```text
src/
  actions/             # Server actions and API-facing business logic
  app/                 # Next.js routes, pages, and layouts
  components/          # Shared and feature-specific React components
    ui/                # Canonical shadcn/ui components
  custom-wrappers/     # Application providers and wrappers
  hooks/               # Reusable React hooks
  lib/                 # Shared libraries and access helpers
  utils/               # Schemas, types, queries, mutations, and default data
public/                 # Static assets
styles/                 # Global styles
```

## Best Practices

- Use npm for dependency management and project scripts.
- Keep secrets in `.env.local`; never commit credentials or tokens.
- Keep canonical shadcn/ui primitives in `src/components/ui` unchanged and extend them
  through feature components or wrappers.
- Place feature-specific components in focused subdirectories under `src/components`.
- Put reusable hooks in `src/hooks` and shared utilities in `src/lib` or `src/utils`.
- Run `npm run lint` and `npm run build` before submitting changes.
