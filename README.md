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
     yarn prisma generate
     ```
   - Create the database (if not already done):
     ```
     yarn prisma db push
     ```
   - Seed the database with initial data:
     ```
     yarn prisma db seed
     ```

   These commands will set up your database schema, apply all existing migrations, and populate the database with seed data.

5. Start the development server:
   ```
   yarn dev
   ```
