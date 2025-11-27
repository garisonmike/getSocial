import graphene
import apps.users.schema
import apps.posts.schema

class Query(apps.posts.schema.Query, graphene.ObjectType):
    hello = graphene.String(default_value="Hello World")

class Mutation(apps.users.schema.Mutation, apps.posts.schema.Mutation, graphene.ObjectType):
    pass

schema = graphene.Schema(query=Query, mutation=Mutation)
