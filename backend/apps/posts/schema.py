import graphene
from graphene_django import DjangoObjectType
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
        image = graphene.String()

    def mutate(self, info, content, image=None):
        user = info.context.user
        if not user.is_authenticated:
            raise Exception("Authentication credentials were not provided")
        
        post = Post.objects.create(author=user, content=content, image=image)
        return CreatePost(post=post)

class CreateComment(graphene.Mutation):
    comment = graphene.Field(CommentType)

    class Arguments:
        post_id = graphene.ID(required=True)
        content = graphene.String(required=True)
        parent_id = graphene.ID()

    def mutate(self, info, post_id, content, parent_id=None):
        user = info.context.user
        if not user.is_authenticated:
            raise Exception("Authentication credentials were not provided")

        try:
            post = Post.objects.get(pk=post_id)
        except Post.DoesNotExist:
            raise Exception("Post not found")

        parent = None
        if parent_id:
            try:
                parent = Comment.objects.get(pk=parent_id)
            except Comment.DoesNotExist:
                raise Exception("Parent comment not found")

        comment = Comment.objects.create(
            author=user,
            post=post,
            content=content,
            parent=parent
        )
        return CreateComment(comment=comment)

class Query(graphene.ObjectType):
    all_posts = graphene.List(PostType)
    post_by_id = graphene.Field(PostType, id=graphene.Int(required=True))

    def resolve_all_posts(self, info):
        return Post.objects.all()

    def resolve_post_by_id(self, info, id):
        return Post.objects.get(pk=id)

class Mutation(graphene.ObjectType):
    create_post = CreatePost.Field()
    create_comment = CreateComment.Field()
