# Contributing to Homyz 🏡

Thank you for your interest in contributing to Homyz! This document provides guidelines and information for contributors.

## 📋 Table of Contents

- [Code of Conduct](#code-of-conduct)
- [Getting Started](#getting-started)
- [Development Process](#development-process)
- [Code Standards](#code-standards)
- [Pull Request Process](#pull-request-process)
- [Issue Reporting](#issue-reporting)
- [Feature Requests](#feature-requests)

## 🤝 Code of Conduct

This project follows a code of conduct that we expect all contributors to follow:

- **Be respectful** and inclusive in all interactions
- **Be constructive** in feedback and discussions
- **Be patient** with newcomers and learning contributors
- **Be professional** in all communications

## 🚀 Getting Started

### Prerequisites

- Node.js (v18 or higher)
- npm or yarn
- Expo CLI
- Git
- A code editor (VS Code recommended)

### Setting Up Development Environment

1. **Fork the repository**
   ```bash
   # Click the "Fork" button on GitHub
   ```

2. **Clone your fork**
   ```bash
   git clone https://github.com/YOUR_USERNAME/homyz-real-estate-app.git
   cd homyz-real-estate-app
   ```

3. **Add upstream remote**
   ```bash
   git remote add upstream https://github.com/mirnabadr/homyz-real-estate-app.git
   ```

4. **Install dependencies**
   ```bash
   npm install
   ```

5. **Set up environment variables**
   ```bash
   cp .env.example .env
   # Edit .env with your Appwrite credentials
   ```

6. **Start development server**
   ```bash
   npm start
   ```

## 🔄 Development Process

### Branch Naming Convention

Use descriptive branch names with prefixes:

- `feature/` - New features (e.g., `feature/user-profiles`)
- `fix/` - Bug fixes (e.g., `fix/login-validation`)
- `docs/` - Documentation updates (e.g., `docs/api-documentation`)
- `refactor/` - Code refactoring (e.g., `refactor/component-structure`)
- `test/` - Test additions/updates (e.g., `test/unit-tests`)

### Commit Message Convention

Follow the [Conventional Commits](https://www.conventionalcommits.org/) specification:

```
<type>[optional scope]: <description>

[optional body]

[optional footer(s)]
```

**Types:**
- `feat`: New feature
- `fix`: Bug fix
- `docs`: Documentation changes
- `style`: Code style changes (formatting, etc.)
- `refactor`: Code refactoring
- `test`: Adding or updating tests
- `chore`: Maintenance tasks

**Examples:**
```
feat(auth): add social login functionality
fix(ui): resolve image loading issue on Android
docs(readme): update installation instructions
```

## 📝 Code Standards

### TypeScript Guidelines

- **Use TypeScript** for all new code
- **Define interfaces** for all data structures
- **Use strict type checking** - no `any` types unless absolutely necessary
- **Add JSDoc comments** for complex functions

```typescript
/**
 * Fetches property data from Appwrite
 * @param propertyId - The unique identifier for the property
 * @returns Promise resolving to property data or null
 */
export async function getPropertyById(propertyId: string): Promise<Property | null> {
  // Implementation
}
```

### React Native Best Practices

- **Use functional components** with hooks
- **Implement proper error boundaries**
- **Optimize performance** with React.memo and useMemo
- **Follow React Native naming conventions**

```typescript
// Good
const PropertyCard = React.memo(({ property, onPress }: PropertyCardProps) => {
  const handlePress = useCallback(() => {
    onPress(property.id);
  }, [property.id, onPress]);

  return (
    <TouchableOpacity onPress={handlePress}>
      {/* Component content */}
    </TouchableOpacity>
  );
});
```

### Styling Guidelines

- **Use NativeWind** for styling
- **Follow mobile-first design** principles
- **Ensure accessibility** compliance
- **Test on multiple screen sizes**

```typescript
// Good
<View className="flex-1 bg-white px-4 py-2">
  <Text className="text-lg font-bold text-gray-800">
    Property Title
  </Text>
</View>
```

### File Organization

- **Group related files** in appropriate directories
- **Use descriptive file names**
- **Keep components small** and focused
- **Export components** from index files

```
components/
├── PropertyCard/
│   ├── index.ts
│   ├── PropertyCard.tsx
│   └── PropertyCard.types.ts
├── Search/
│   ├── index.ts
│   ├── Search.tsx
│   └── Search.types.ts
└── index.ts
```

## 🔍 Testing Guidelines

### Unit Tests

- **Write tests** for utility functions
- **Test component behavior** with React Native Testing Library
- **Mock external dependencies** appropriately
- **Aim for 80%+ code coverage**

```typescript
// Example test
import { render, fireEvent } from '@testing-library/react-native';
import { PropertyCard } from '../PropertyCard';

describe('PropertyCard', () => {
  it('calls onPress when pressed', () => {
    const mockOnPress = jest.fn();
    const property = { id: '1', name: 'Test Property' };
    
    const { getByText } = render(
      <PropertyCard property={property} onPress={mockOnPress} />
    );
    
    fireEvent.press(getByText('Test Property'));
    expect(mockOnPress).toHaveBeenCalledWith('1');
  });
});
```

### Integration Tests

- **Test user workflows** end-to-end
- **Test API integrations** with mocked responses
- **Test navigation** between screens

## 📋 Pull Request Process

### Before Submitting

1. **Ensure all tests pass**
   ```bash
   npm test
   ```

2. **Run linting and formatting**
   ```bash
   npm run lint:fix
   npm run format
   ```

3. **Update documentation** if needed

4. **Test on both platforms** (iOS and Android)

### Pull Request Template

When creating a PR, include:

- **Clear description** of changes
- **Screenshots** for UI changes
- **Testing instructions**
- **Breaking changes** (if any)
- **Related issues** (closes #123)

### Review Process

- **All PRs require review** from maintainers
- **Address feedback** promptly
- **Keep PRs focused** and reasonably sized
- **Update PR** if requested changes are made

## 🐛 Issue Reporting

### Bug Reports

When reporting bugs, include:

- **Clear description** of the issue
- **Steps to reproduce**
- **Expected vs actual behavior**
- **Screenshots/videos** if applicable
- **Device/OS information**
- **App version**

### Feature Requests

For feature requests, include:

- **Clear description** of the feature
- **Use case** and motivation
- **Proposed implementation** (if you have ideas)
- **Alternative solutions** considered

## 🎯 Areas for Contribution

### High Priority

- **Performance optimization**
- **Accessibility improvements**
- **Test coverage**
- **Documentation**

### Medium Priority

- **New features**
- **UI/UX enhancements**
- **Code refactoring**
- **Bug fixes**

### Low Priority

- **Code style improvements**
- **Minor documentation updates**
- **Dependency updates**

## 📞 Getting Help

- **GitHub Discussions** - For questions and general discussion
- **GitHub Issues** - For bug reports and feature requests
- **Email** - mirnabadr33@gmail.com for direct contact

## 🏆 Recognition

Contributors will be recognized in:

- **README.md** contributors section
- **Release notes** for significant contributions
- **GitHub contributors** page

## 📄 License

By contributing to Homyz, you agree that your contributions will be licensed under the MIT License.

---

Thank you for contributing to Homyz! 🏡✨
