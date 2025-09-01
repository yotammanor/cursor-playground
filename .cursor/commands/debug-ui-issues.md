# Debug UI Issues

## Overview
This command provides a comprehensive approach to debugging UI issues in web applications. It covers various problem types including API issues, rendering problems, routing errors, state management issues, and more.

## When to Use
- Components not rendering or displaying incorrectly
- Pages showing error messages or loading states
- Navigation/routing problems
- Data not displaying or updating
- Forms not working properly
- Performance issues or crashes
- Styling/layout problems
- Interactive elements not responding

## Investigation Flow

### 1. Identify the Problem Type
- **Visual Issues**: Components not rendering, wrong layout, missing elements
- **Functional Issues**: Buttons not working, forms not submitting, data not loading
- **Navigation Issues**: Routes not working, wrong pages loading
- **Data Issues**: API errors, validation failures, missing data
- **Performance Issues**: Slow loading, crashes, memory leaks

### 2. Gather Information
- **Browser Console**: Check for JavaScript errors, warnings, and logs
- **Network Tab**: Examine API calls, failed requests, response data
- **Page State**: Observe what's actually rendered vs expected
- **User Actions**: Note what steps led to the problem
- **Environment**: Check if issue is environment-specific

### 3. Systematic Investigation

#### For API/Data Issues
```bash
# Test API endpoints directly
curl -s http://localhost:8000/api/[resource]/ | jq .
curl -s http://localhost:8000/api/[resource]/[id] | jq .

# Check backend logs
# Look for validation errors, missing endpoints, schema mismatches
```

#### For Component Issues
- Check component props and state
- Verify data flow from parent components
- Look for conditional rendering logic
- Check for missing dependencies or imports

#### For Routing Issues
- Verify route definitions in App.tsx
- Check for conflicting route patterns
- Ensure components are properly imported
- Look for route parameter handling issues

#### For State Management Issues
- Check React Query cache and state
- Verify state updates and re-renders
- Look for stale closures or race conditions
- Check for proper dependency arrays in hooks

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

#### State Management Problems
- **Problem**: Data not updating or persisting correctly
- **Symptoms**: Stale data, UI not reflecting changes, infinite loops
- **Solution**: Fix React Query configuration, state updates, and dependencies

#### Styling/Layout Issues
- **Problem**: Visual appearance not matching expectations
- **Symptoms**: Wrong colors, broken layouts, missing styles
- **Solution**: Check CSS classes, Tailwind utilities, and responsive design

### 5. Debugging Tools

#### Browser DevTools
- **Console**: JavaScript errors and logs
- **Network**: API calls and responses
- **Elements**: DOM structure and CSS
- **Performance**: Loading times and bottlenecks

#### Playwright (for automated testing)
- **Page Navigation**: Test user flows
- **Element Interaction**: Click, type, verify
- **Network Monitoring**: Capture API calls
- **Screenshot/Video**: Visual debugging

#### Code Analysis
- **Linting**: Code quality and potential issues
- **Type Checking**: TypeScript errors and mismatches
- **Dependency Analysis**: Missing or conflicting packages

### 6. Fix and Test

#### Make Changes
- Update types, schemas, or components
- Fix routing or state management
- Adjust styling or layout
- Handle edge cases and errors

#### Test the Fix
- Verify the specific issue is resolved
- Test related functionality
- Check for regressions
- Run automated tests if available

#### Code Quality
- Run linter: `task lint`
- Check types: `task type-check` (if available)
- Run tests: `task test`
- Commit changes with descriptive messages

## Example Debugging Scenarios

### Scenario 1: API Schema Mismatch
```bash
# 1. Identify: "Error loading users" message
# 2. Check: Network tab shows 422 errors
# 3. Test: curl -s http://localhost:8000/api/users/ | jq .
# 4. Compare: Backend schema vs frontend types
# 5. Fix: Update frontend to match backend
# 6. Test: Verify users load correctly
```

### Scenario 2: Component Not Rendering
```bash
# 1. Identify: Component shows loading state indefinitely
# 2. Check: Console for errors, props for undefined values
# 3. Debug: Add console.logs, check conditional rendering
# 4. Fix: Handle undefined props, add error boundaries
# 5. Test: Verify component renders with various data states
```

### Scenario 3: Routing Issue
```bash
# 1. Identify: /users/new shows wrong page or 404
# 2. Check: Route definitions, component imports
# 3. Debug: Verify route order, check for conflicts
# 4. Fix: Add missing route, fix import, reorder routes
# 5. Test: Navigate to route, verify correct component loads
```

## Prevention Strategies

1. **Type Safety**: Use TypeScript and proper type definitions
2. **Schema Validation**: Validate API responses with Zod or similar
3. **Error Boundaries**: Handle errors gracefully in React components
4. **Testing**: Write tests for critical user flows
5. **Documentation**: Document API contracts and component interfaces
6. **Code Review**: Review changes for potential issues
7. **Monitoring**: Add logging and error tracking

## Related Commands
- `task doctor` - Check development environment
- `task lint` - Validate code quality
- `task test` - Run automated tests
- `task build` - Check for build errors
- `task type-check` - Verify TypeScript types (if available)

## Quick Reference

### Common Error Patterns
- **422 Unprocessable Entity**: Schema/validation mismatch
- **404 Not Found**: Missing route or API endpoint
- **500 Internal Server Error**: Backend issue
- **CORS errors**: Cross-origin configuration
- **Type errors**: TypeScript/JavaScript type mismatches

### Debugging Checklist
- [ ] Check browser console for errors
- [ ] Verify network requests and responses
- [ ] Test API endpoints directly
- [ ] Check component props and state
- [ ] Verify routing configuration
- [ ] Run linter and tests
- [ ] Check for missing dependencies
- [ ] Verify environment configuration
