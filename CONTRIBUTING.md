# Contributing to getSocial

Thank you for your interest in contributing to getSocial! This document provides guidelines and instructions for contributing to the project.

## Code of Conduct

This project adheres to a code of conduct. By participating, you are expected to uphold this code. Please report unacceptable behavior to the project maintainers.

## How Can I Contribute?

### Reporting Bugs

Before creating bug reports, please check existing issues to avoid duplicates. When you create a bug report, include as many details as possible:

- **Use a clear and descriptive title**
- **Describe the exact steps to reproduce the problem**
- **Provide specific examples** (code samples, screenshots, etc.)
- **Describe the behavior you observed** and what you expected
- **Include your environment details** (OS, Python version, Node version, etc.)

### Suggesting Enhancements

Enhancement suggestions are tracked as GitHub issues. When creating an enhancement suggestion, include:

- **Use a clear and descriptive title**
- **Provide a detailed description** of the suggested enhancement
- **Explain why this enhancement would be useful**
- **Include mockups or examples** if applicable

### Pull Requests

1. **Fork the repository** and create your branch from `main`
2. **Make your changes** following the coding standards below
3. **Add tests** if applicable
4. **Ensure the test suite passes**
5. **Update documentation** as needed
6. **Write a clear commit message**

## Development Setup

### Backend Development

```bash
cd backend
python -m venv venv
source venv/bin/activate
pip install -r requirements.txt
python manage.py migrate
python manage.py runserver
```

### Frontend Development

```bash
cd frontend
npm install
npm run dev
```

### Running Tests

**Backend:**
```bash
cd backend
pytest
```

**Frontend:**
```bash
cd frontend
npm test
```

## Coding Standards

### Python (Backend)

- Follow PEP 8 style guide
- Use meaningful variable and function names
- Add docstrings to classes and functions
- Keep functions focused and small
- Use type hints where appropriate

**Example:**
```python
def get_user_posts(user_id: int, limit: int = 10) -> List[Post]:
    """
    Retrieve posts for a specific user.
    
    Args:
        user_id: The ID of the user
        limit: Maximum number of posts to return
        
    Returns:
        List of Post objects
    """
    return Post.objects.filter(author_id=user_id)[:limit]
```

### TypeScript (Frontend)

- Use TypeScript strict mode
- Define interfaces for all data structures
- Use functional components with hooks
- Follow SOLID principles
- Separate concerns (services, hooks, components)

**Example:**
```typescript
interface User {
    id: number;
    username: string;
    email: string;
}

const useUser = (userId: number): { user: User | null; loading: boolean } => {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);
    
    useEffect(() => {
        fetchUser(userId).then(setUser).finally(() => setLoading(false));
    }, [userId]);
    
    return { user, loading };
};
```

### Git Commit Messages

- Use the present tense ("Add feature" not "Added feature")
- Use the imperative mood ("Move cursor to..." not "Moves cursor to...")
- Limit the first line to 72 characters or less
- Reference issues and pull requests when applicable

**Format:**
```
<type>: <subject>

<body>

<footer>
```

**Types:**
- `feat`: New feature
- `fix`: Bug fix
- `docs`: Documentation changes
- `style`: Code style changes (formatting, etc.)
- `refactor`: Code refactoring
- `test`: Adding or updating tests
- `chore`: Maintenance tasks

**Example:**
```
feat: Add user profile editing functionality

- Add ProfileEditForm component
- Implement PUT endpoint for profile updates
- Add form validation
- Update user profile page to include edit button

Closes #123
```

## Project Structure

### Backend Structure

```
backend/
├── apps/
│   ├── users/          # User models and auth
│   ├── posts/          # Post models
│   ├── interactions/   # Likes and shares
│   ├── analytics/      # Analytics tracking
│   └── core/           # Core models and views
├── config/             # Django settings
└── tests/              # Test files
```

### Frontend Structure

```
frontend/src/
├── components/         # Reusable UI components
├── hooks/             # Custom React hooks
├── pages/             # Page components
├── services/          # API services
├── types/             # TypeScript types
└── utils/             # Utility functions
```

## Branch Naming Convention

- `feature/` - New features
- `fix/` - Bug fixes
- `docs/` - Documentation updates
- `refactor/` - Code refactoring
- `test/` - Test additions or updates

**Examples:**
- `feature/user-authentication`
- `fix/like-button-state`
- `docs/api-endpoints`

## Code Review Process

1. **Automated Checks** - All PRs must pass automated tests
2. **Code Review** - At least one maintainer must review the PR
3. **Discussion** - Address all review comments
4. **Approval** - PR is merged after approval

## Testing Guidelines

### Backend Tests

- Test all API endpoints
- Test model methods and properties
- Test authentication and permissions
- Aim for >80% code coverage

**Example:**
```python
def test_create_post_authenticated():
    client = APIClient()
    user = User.objects.create_user(username='test', password='test')
    client.force_authenticate(user=user)
    
    response = client.post('/api/posts/', {'content': 'Test post'})
    
    assert response.status_code == 201
    assert response.data['content'] == 'Test post'
```

### Frontend Tests

- Test component rendering
- Test user interactions
- Test API integration
- Test error states

**Example:**
```typescript
describe('LoginForm', () => {
    it('should submit form with valid credentials', async () => {
        const onSubmit = jest.fn();
        render(<LoginForm onSubmit={onSubmit} />);
        
        fireEvent.change(screen.getByLabelText('Email'), {
            target: { value: 'test@example.com' }
        });
        fireEvent.change(screen.getByLabelText('Password'), {
            target: { value: 'password123' }
        });
        fireEvent.click(screen.getByText('Login'));
        
        await waitFor(() => {
            expect(onSubmit).toHaveBeenCalledWith({
                email: 'test@example.com',
                password: 'password123'
            });
        });
    });
});
```

## Documentation

- Update README.md if you change core functionality
- Add docstrings to new functions and classes
- Update API documentation for new endpoints
- Include code examples where applicable

## Questions?

If you have questions about contributing, please open an issue with the `question` label.

## License

By contributing to getSocial, you agree that your contributions will be licensed under the same license as the project (MIT License).

---

Thank you for contributing to getSocial!
