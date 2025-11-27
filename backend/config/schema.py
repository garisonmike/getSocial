import graphene
import apps.users.schema
import apps.posts.schema
import apps.interactions.schema
import apps.analytics.schema

class Query(
    apps.posts.schema.Query,
    apps.analytics.schema.Query,
    graphene.ObjectType
):
    pass

class Mutation(
    apps.users.schema.Mutation,
    apps.posts.schema.Mutation,
    apps.interactions.schema.Mutation,
    graphene.ObjectType
):
    pass

class Subscription(apps.posts.schema.Subscription, graphene.ObjectType):
    pass

schema = graphene.Schema(query=Query, mutation=Mutation, subscription=Subscription)
