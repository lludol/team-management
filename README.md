This is a simple team management application. It allows you to create teams and add members to them. You can also see the team's tree.

## Table of Contents

- [Setup for Local Development](#setup-for-local-development)
- [Environment Variables](#environment-variables)
- [Technical Choices](#technical-choices)
- [Query Design Decisions](#query-design-decisions)
- [Production Deployment](#production-deployment)

## Setup for local development

1. Clone the repository
2. Run `pnpm install` to install the dependencies
3. Create a .env file (see below)
4. Run `docker-compose up` to start the database
5. Run `pnpm migrate:latest` to apply the migrations
6. Run `pnpm dev` to start the development server

## Environment Variables

Create a .env file in the root of the project with the following content:

```
DATABASE_URL=postgresql://team_management:team_management@localhost:5432/team_management
```

## Technical choices

| Syntax       | Why |
| ------------ | ----------- |
| Next.js      | Server-side rendering, simple to use, production ready |
| Kysely (ORM) | TypeScript ready, allows writing SQL queries with less abstraction |
| Formik       | Good for form validation and hooks available |
| Yup          | Used for form validation, integrates well with Formik |
| TaiwindCSS   | Utility-first CSS framework for rapid UI development |
| DaisyUI      | TailwindCSS components for faster styling |

## Query decisions

To create the team's tree, I am using a recursive common table expression (CTE) to get all the children of each team and to create the full path in the hierarchy of each team. For the rest, I am using normal queries to get the data.

## Production deployment

Example: https://team-management-production.up.railway.app/

I am using Railway to deploy the application. The database is hosted on Railway as well. To scale the app, we can use the Railway interface to increase the number of instances (a load balancer will split the traffic between the instances). We need to make sure the database is able to handle the load as well. We can increase the number of connections to the database and increase the size of the database if needed.
