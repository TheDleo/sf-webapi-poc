import { Context } from "../../index"
import validator from "validator"
import bcrypt, { hash } from "bcryptjs"
import JWT from "jsonwebtoken"
import { JWT_SIGNATURE } from "../../keys"

interface SignupArgs {
  credentials: {
    email: string
    password: string
  }
  firstname: string
  lastname: string
}

interface UserPayload {
  userErrors: {
    message: string
  }[]
  token: string | null
}

export const authResolvers = {
  signup: async (_: any, { credentials, firstname, lastname }: SignupArgs, { prisma }: Context):Promise<UserPayload> => {
    // hack for SqlState("42883"), message: "function get_xmlbinary() does not exist" error
    // https://github.com/prisma/prisma/issues/7801
    // https://stackoverflow.com/questions/33945648/heroku-connect-with-cakephp-v3-0-12
    // Maybe set schema to public and prefix all table names with salesforce? e.g. salesforce.contact
    const result = await prisma.$queryRaw`SET search_path TO salesforce, public;`

    const { email, password } = credentials
    const isEmail = validator.isEmail(email)

    if(!isEmail) {
      return {
        userErrors: [{
          message: "Invalid email"
        }],
        token: null
      }
    }

    const isValidPassword = validator.isLength(password, {
      min: 5
    })

    if(!isValidPassword) {
      return {
        userErrors: [{
          message: "Invalid password"
        }],
        token: null
      }
    }

    if(!lastname || !firstname) {
      return {
        userErrors: [{
          message: "Invalid name or bio"
        }],
        token: null
      }
    }

    const hashedPassword = await bcrypt.hash(password, 10)

    const user = await prisma.contact.create({
      data: {
        email,
        firstname,
        lastname,
        password: hashedPassword,
      }
    })

    const token = await JWT.sign({
      userId: user.id
    }, JWT_SIGNATURE, {
      expiresIn: 3600000
    })

    return {
      userErrors: [],
      token
    }
  },
  signin: async (_: any, { credentials }: SignupArgs, { prisma }: Context):Promise<UserPayload> => {

    const { email, password } = credentials
    
    const user = await prisma.contact.findFirst({
      where: {
        email
      }
    })

    if(!user) {
      return {
        userErrors: [{
          message: "Invalid credentials"
        }],
        token: null
      }
    }

    //bcrypt requires a string but password could be null
    const userPassword = user.password !== null ? user.password : ''

    const isMatch = await bcrypt.compare(password, userPassword)

    if(!isMatch) {
      return {
        userErrors: [{
          message: "Invalid credentials"
        }],
        token: null
      }
    }

    return {
      userErrors: [],
      token: JWT.sign({userId:user.id}, JWT_SIGNATURE, {expiresIn: 3600000})
    }
  }
}
