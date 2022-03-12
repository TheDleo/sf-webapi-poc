import { Context } from "..";

export const Account = {
  contacts: (parent: any, __:any, { prisma }: Context) => {
    return prisma.contact.findMany({
      where: {
        accountid: parent.sfid
      }
    })
  }
}