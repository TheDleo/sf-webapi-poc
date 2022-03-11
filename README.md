# Proof of Concept for Salesforce and fh.org integration
This POC creates a GraphQL API that connects to a [Heroku Postgres](https://www.heroku.com/postgres) database that is synchronized to Salesforce via [Heroku Connect](https://www.heroku.com/connect).

I'm currently using my personal Heroku and Salesforce accounts. This will need to be converted to an FH account. All that will change in this application is the DATABASE_URL in the .env

### To get started
Clone the repository, update DATABASE_URL environment variable, install dependencies and run the server. 
```
$ git clone git@bitbucket.org:fhcode/sf-webapi-poc.git
$ cd sf-webapi-poc
$ cp .env.dist .env
$ vi .env # Update the DATABASE_URL variable
$ npm install
$ npm run start:dev
```
You should be able to reach your server at http://localhost:3000/ at this point.

The API uses [Apollo Server](https://www.apollographql.com/docs/apollo-server/) for the [GraphQL](https://graphql.org/) server and [Prisma](https://www.prisma.io/docs/) for the ORM/data access layer.

### Some helpful commands
1. Pull schema changes from the database and update the schema/schema.prisma file

```
npx prisma db pull
```

2. Generate prisma client code from the updated schema/schema.prisma file
```
npx prisma generate
```

3. Update the database schema from changes made in the schema/schema.prisma file. (Be careful with this as it changes the schema and currently the schema is created by Heroku Connect)

```
npx prisma db push
```

4. Use Prisma Studio to view the database schema and data.

```
npm prisma studio
```

