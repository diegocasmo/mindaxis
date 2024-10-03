# MindAxis

Turn goals into actionable roadmaps.

## Installation

1. Clone the repository:

2. Install dependencies:
   ```
   yarn install
   ```

3. Set up the environment variables:
   - Copy the `.env.example` file to `.env`:
     ```
     cp .env.example .env
     ```
   - Open the `.env` file and fill in the necessary environment variables, including your PostgreSQL database URL

4. Set up Prisma and the database:
   - Generate Prisma client:
     ```
     npx prisma generate
     ```
   - Apply existing migrations to your database:
     ```
     npx prisma migrate deploy
     ```
   This command will apply all existing migrations to your database, bringing it up to date with the current schema.

5. Start the development server:
   ```
   yarn dev
   ```
