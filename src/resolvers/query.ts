import { Context } from "..";

export const Query = {
  contact: (_: any, args: any, { prisma }: Context) => {
    // if(!userInfo) return null
    return prisma.contact.findUnique({
      where: {
        id: args.id
      }
    })
  },
  accounts: async (_: any, __: any, { prisma }: Context) => {
    const posts = await prisma.account.findMany({
      orderBy: [
        {
          createddate: "desc"
        }
      ]
    })
    return posts
  },
}
