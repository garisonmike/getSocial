import graphene
from graphene_django import DjangoObjectType
from .models import Interaction
from apps.posts.models import Post

class InteractionType(DjangoObjectType):
    class Meta:
        model = Interaction

class LikePost(graphene.Mutation):
    ok = graphene.Boolean()
    action = graphene.String()

    class Arguments:
        post_id = graphene.ID(required=True)

    def mutate(self, info, post_id):
        user = info.context.user
        if not user.is_authenticated:
            raise Exception("Authentication credentials were not provided")

        try:
            post = Post.objects.get(pk=post_id)
        except Post.DoesNotExist:
            raise Exception("Post not found")

        # Check if interaction exists
        interaction = Interaction.objects.filter(
            user=user, 
            post=post, 
            interaction_type='like'
        ).first()

        if interaction:
            interaction.delete()
            return LikePost(ok=True, action="unliked")
        else:
            Interaction.objects.create(
                user=user,
                post=post,
                interaction_type='like'
            )
            return LikePost(ok=True, action="liked")

class Mutation(graphene.ObjectType):
    like_post = LikePost.Field()
