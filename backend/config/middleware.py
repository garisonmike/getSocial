from graphql_jwt.middleware import JSONWebTokenMiddleware
from django.utils.deprecation import MiddlewareMixin

class CustomJSONWebTokenMiddleware(MiddlewareMixin, JSONWebTokenMiddleware):
    def __init__(self, get_response=None):
        self.get_response = get_response
        super().__init__(get_response)
