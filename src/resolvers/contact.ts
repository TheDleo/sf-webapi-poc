import { Context } from "..";

export const Contact = {
  account: (parent: any , __: any, { prisma }: Context) => {
    return prisma.account.findFirst({
      where: {
        sfid: parent.accountid
      }
    })
  }
}