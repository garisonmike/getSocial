import pytest
from django.contrib.auth import get_user_model
from graphene.test import Client
from config.schema import schema

User = get_user_model()

@pytest.mark.django_db
def test_create_user():
    user = User.objects.create_user(username='testuser', email='test@example.com', password='password123')
    assert user.username == 'testuser'
    assert user.check_password('password123')

@pytest.mark.django_db
def test_register_mutation():
    client = Client(schema)
    mutation = '''
        mutation {
            register(username: "newuser", email: "new@example.com", password: "password123") {
                user {
                    username
                    email
                }
            }
        }
    '''
    result = client.execute(mutation)
    assert 'errors' not in result
    data = result['data']['register']['user']
    assert data['username'] == 'newuser'
    assert data['email'] == 'new@example.com'

from django.test import RequestFactory

@pytest.mark.django_db
def test_login_mutation():
    User.objects.create_user(username='loginuser', email='login@example.com', password='password123')
    client = Client(schema)
    mutation = '''
        mutation {
            tokenAuth(username: "loginuser", password: "password123") {
                token
            }
        }
    '''
    factory = RequestFactory()
    request = factory.post('/')
    result = client.execute(mutation, context_value=request)
    assert 'errors' not in result
    assert result['data']['tokenAuth']['token'] is not None
