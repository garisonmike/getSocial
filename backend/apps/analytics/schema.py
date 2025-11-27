import graphene
from graphene_django import DjangoObjectType
from .models import Analytics

class AnalyticsType(DjangoObjectType):
    class Meta:
        model = Analytics
        fields = "__all__"

class Query(graphene.ObjectType):
    post_analytics = graphene.Field(AnalyticsType, post_id=graphene.ID(required=True))

    def resolve_post_analytics(self, info, post_id):
        try:
            return Analytics.objects.get(post__id=post_id)
        except Analytics.DoesNotExist:
            return None
