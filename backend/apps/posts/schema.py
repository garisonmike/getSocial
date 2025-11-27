import graphene
from graphene_django import DjangoObjectType
from graphql_jwt.decorators import login_required
from .models import Post, Comment

class PostType(DjangoObjectType):
    class Meta:
        model = Post
        fields = "__all__"

class CommentType(DjangoObjectType):
    class Meta:
        model = Comment
        fields = "__all__"

class CreatePost(graphene.Mutation):
    post = graphene.Field(PostType)

    class Arguments:
        content = graphene.String(required=True)
        is_published = graphene.Boolean()

    @login_required
    def mutate(self, info, content, is_published=True):
        user = info.context.user
        post = Post(
            author=user,
            content=content,
            is_published=is_published
        )
        post.save()
        return CreatePost(post=post)

class CreateComment(graphene.Mutation):
    comment = graphene.Field(CommentType)

    class Arguments:
        post_id = graphene.ID(required=True)
        content = graphene.String(required=True)
        parent_id = graphene.ID()

    @login_required
    def mutate(self, info, post_id, content, parent_id=None):
        user = info.context.user
        post = Post.objects.get(pk=post_id)
        
        parent = None
        if parent_id:
            parent = Comment.objects.get(pk=parent_id)

        comment = Comment(
            author=user,
            post=post,
            content=content,
            parent=parent
        )
        comment.save()
        return CreateComment(comment=comment)

class Mutation(graphene.ObjectType):
    create_post = CreatePost.Field()
    create_comment = CreateComment.Field()

class Query(graphene.ObjectType):
    posts = graphene.List(PostType)
    post = graphene.Field(PostType, id=graphene.Int())

    def resolve_posts(self, info):
        return Post.objects.filter(is_published=True)

    def resolve_post(self, info, id):
        return Post.objects.get(pk=id)
