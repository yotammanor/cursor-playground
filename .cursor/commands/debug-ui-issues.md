# Debug UI Issues

## Overview
This command provides a systematic approach to debugging UI issues using Playwright MCP tools for interactive investigation and testing.

## When to Use
- Components not rendering or displaying incorrectly
- Pages showing error messages or loading states
- Navigation/routing problems
- Data not displaying or updating
- Forms not working properly
- Interactive elements not responding

## Investigation Flow

### 1. Identify the Problem
- Navigate to problematic page using Playwright
- Observe what's rendered vs expected
- Check for error messages or loading states

### 2. Gather Information
- **Console Messages**: Use Playwright to check for JavaScript errors and logs
- **Network Requests**: Monitor API calls and responses
- **Page State**: Capture current page state and rendered content

### 3. Systematic Investigation

#### For API/Data Issues
```bash
# Test API endpoints directly
curl -s http://localhost:8000/api/[resource]/ | jq .
curl -s http://localhost:8000/api/[resource]/[id] | jq .
```

#### For Component Issues
- Check component props and state
- Verify data flow from parent components
- Look for conditional rendering logic

#### For Routing Issues
- Verify route definitions in App.tsx
- Check for conflicting route patterns
- Ensure components are properly imported

### 4. Common Problem Categories

#### Schema/Data Mismatches
- **Problem**: Frontend expects different data structure than backend provides
- **Symptoms**: Validation errors, 422 responses, missing fields
- **Solution**: Align frontend types with backend schemas

#### Component Rendering Issues
- **Problem**: Components not rendering or showing wrong content
- **Symptoms**: Blank pages, missing elements, wrong data display
- **Solution**: Check props, state, conditional logic, and data flow

#### Routing Problems
- **Problem**: Navigation not working or wrong pages loading
- **Symptoms**: 404 errors, wrong components rendering, broken links
- **Solution**: Fix route definitions, component imports, and parameter handling

### 5. Debugging Tools

#### Playwright MCP Tools (Primary)
Use Playwright MCP tools for interactive debugging when available. If these tools are not available, consult the user for alternative debugging approaches.

- **Navigation**: Navigate to pages and capture state
- **Page State**: Capture current page state and elements
- **Console**: Check for JavaScript errors and logs
- **Network**: Monitor API calls and responses
- **Interaction**: Click, type, and interact with elements
- **Waiting**: Wait for elements or time to pass

#### Code Analysis
- **Linting**: `task lint`
- **Type Checking**: TypeScript errors and mismatches
- **Dependency Analysis**: Missing or conflicting packages

### 6. Fix and Test

#### Make Changes
- Update types, schemas, or components
- Fix routing or state management
- Handle edge cases and errors

#### Test the Fix
- Use Playwright to verify the issue is resolved
- Test related functionality
- Check for regressions

#### Code Quality
- Run linter: `task lint`
- Run tests: `task test`
- Commit changes with descriptive messages

## Prevention Strategies

1. **Type Safety**: Use TypeScript and proper type definitions
2. **Schema Validation**: Validate API responses with Zod or similar
3. **Error Boundaries**: Handle errors gracefully in React components
4. **Testing**: Write tests for critical user flows
5. **Code Review**: Review changes for potential issues

## Related Commands
- `task doctor` - Check development environment
- `task lint` - Validate code quality
- `task test` - Run automated tests

## Quick Reference

### Common Error Patterns
- **422 Unprocessable Entity**: Schema/validation mismatch
- **404 Not Found**: Missing route or API endpoint
- **500 Internal Server Error**: Backend issue
- **Type errors**: TypeScript/JavaScript type mismatches

### Debugging Checklist
- [ ] Navigate to problematic page using Playwright
- [ ] Check console for errors
- [ ] Verify network requests and responses
- [ ] Test API endpoints directly
- [ ] Check component props and state
- [ ] Verify routing configuration
- [ ] Run linter and tests
- [ ] Test fix to ensure it works correctly
