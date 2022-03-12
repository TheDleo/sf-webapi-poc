import { Context } from "..";

export const Query = {
  contact: (_: any, { userId }: { userId: string}, { prisma }: Context) => {
    // if(!userInfo) return null
    return prisma.contact.findUnique({
      where: {
        id: Number(userId)
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
