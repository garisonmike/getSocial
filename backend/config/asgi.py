"""
ASGI config for config project.

It exposes the ASGI callable as a module-level variable named ``application``.

For more information on this file, see
https://docs.djangoproject.com/en/5.2/howto/deployment/asgi/
"""

import os
from django.core.asgi import get_asgi_application
from django.urls import path
from channels.routing import ProtocolTypeRouter, URLRouter
from channels_graphql_ws import GraphqlWsConsumer

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'config.settings')

django_asgi_app = get_asgi_application()

class MyGraphQLWebsocketConsumer(GraphqlWsConsumer):
    schema = "config.schema.schema"

    async def on_connect(self, payload):
        print("New WebSocket connection")

application = ProtocolTypeRouter({
    "http": django_asgi_app,
    "websocket": URLRouter([
        path("graphql/", MyGraphQLWebsocketConsumer.as_asgi()),
    ]),
})
