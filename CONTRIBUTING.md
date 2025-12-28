# Contributing to DataVoid

Thank you for your interest in contributing to DataVoid! 🎉

## How to Contribute

### Reporting Bugs

1. Check if the bug has already been reported in [Issues](https://github.com/yourusername/datavoid/issues)
2. If not, create a new issue with:
   - Clear title and description
   - Steps to reproduce
   - Expected vs actual behavior
   - Browser/OS information

### Suggesting Features

1. Check existing [Issues](https://github.com/yourusername/datavoid/issues) and [Roadmap](README.md#roadmap)
2. Create a new issue with:
   - Clear description of the feature
   - Use case and benefits
   - Any implementation ideas

### Adding to Deletion Database

The deletion database is always growing! To add a new service:

1. Edit `utils/deletion-database.js`
2. Add entry in this format:
   ```javascript
   'example.com': {
     url: 'https://example.com/delete-account',
     difficulty: 'easy', // easy, medium, hard, or unknown
     time: 'Immediate', // or '30 days', 'Varies', etc.
     notes: 'Delete from account settings'
   }
   ```
3. Submit a pull request

### Code Contributions

1. **Fork the repository**
2. **Create a feature branch**
   ```bash
   git checkout -b feature/your-feature-name
   ```
3. **Make your changes**
   - Follow existing code style
   - Add comments for complex logic
   - Test thoroughly
4. **Commit your changes**
   ```bash
   git commit -m 'Add: Description of your feature'
   ```
5. **Push to your fork**
   ```bash
   git push origin feature/your-feature-name
   ```
6. **Open a Pull Request**
   - Describe your changes
   - Reference any related issues
   - Add screenshots if UI changes

## Code Style

- Use ES6+ JavaScript
- Follow existing naming conventions
- Add JSDoc comments for functions
- Keep functions focused and small
- Handle errors gracefully

## Testing

Before submitting:
- Test on Chrome (latest version)
- Test with various browser history sizes
- Test edge cases (empty history, many accounts)
- Check for console errors
- Verify all features work

## Questions?

Feel free to open an issue or discussion for any questions!

Thank you for contributing to DataVoid! ⚡

