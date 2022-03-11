import { gql } from "apollo-server"

export const typeDefs = gql`
  type Query {
    contact(userId: ID!): Contact
    accounts: [Account]
  }

  type Mutation {
    signup(credentials: CredentialsInput!, firstname: String!, lastname: String!): AuthPayload!
    signin(credentials: CredentialsInput!): AuthPayload!
  }

  input CredentialsInput {
    email: String!
    password: String!
  }

  type UserError {
    message: String!
  }

  type AuthPayload {
    userErrors: [UserError!]!
    token: String
  }

  type Contact {
    id: ID!
    sfid: String!
    firstname: String!
    lastname: String!
    email: String!
    account: Account
  }

  type Account {
    id: ID!
    sfid: String!
    name: String!
    description: String
    industry: String
    billingstreet: String
    billingcity: String
    billlingstate: String
    billingpostalcode: String
    createddate: String
    contacts: [Contact]!
  }
`