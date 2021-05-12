const { ApolloServer } = require('apollo-server');
const { PrismaClient } = require('@prisma/client');
const { PubSub } = require('apollo-server');
const fs = require('fs');
const path = require('path');
const { getUserId } = require('./utils');
const Query = require('./resovlers/Query');
const Mutation = require('./resolvers/Mutation');
const Link = require('./resolvers/Link');
const User = require('./resolvers/User');
const Subscription = require('./resolvers/Subscription');


const resolvers = {
    Query,
    Mutation,
    User,
    Link,
    Subscription
}

const prisma = new PrismaClient();
const pubsub = new PubSub();

const server = new ApolloServer({
    typeDefs: fs.readFileSync(
        path.join(__dirname, 'schema.graphql'),
        'utf8'
    ),
    resolvers,
    context: ({ req }) => {
        return {
            ...req,
            prisma,
            pubsub,
            userId:
              req && req.headers.authorization
                ? getUserId(req)
                : null
        };
    }
})

server
  .listen()
  .then(({ url }) => 
    console.log(`Server is running on ${url}`)
  )