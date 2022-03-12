import { ApolloServer } from "apollo-server"
import { typeDefs } from "./schema"
import { Query, Mutation, Contact, Account } from "./resolvers"
import { PrismaClient, Prisma } from "@prisma/client"
import { getUserFromToken } from "./utils/getUserFromToken"

export const prisma = new PrismaClient({
  log: ['info', 'query'],
})

export interface Context {
  prisma: PrismaClient<Prisma.PrismaClientOptions, never, Prisma.RejectOnNotFound | Prisma.RejectPerOperation | undefined>
  userInfo: {
    userId: number
  } | null
}

const server = new ApolloServer({
  typeDefs,
  resolvers: {
    Query,
    Mutation,
    Contact,
    Account
  },
  context: async ({ req }: any): Promise<Context> => {
    const userInfo = await getUserFromToken(req.headers.authorization)
    return {
      prisma,
      userInfo
    }
  }
})

server.listen({port: 3000, host: "0.0.0.0"}).then(({ url }) => {
  console.log(`Server ready on ${url}`)
})
