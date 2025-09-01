# Debug API Schema Mismatch

## Overview
This command helps investigate and fix API schema mismatches between frontend and backend services. It's designed to identify when frontend expectations don't match backend responses, causing errors like 422 Unprocessable Entity or validation failures.

## When to Use
- Frontend shows "Error loading [resource]" messages
- Network requests return 422, 400, or validation errors
- API calls succeed but data doesn't display correctly
- Console shows validation or parsing errors
- Components render but with missing or incorrect data

## Investigation Flow

### 1. Identify the Problem
- Navigate to the problematic page/component
- Check browser console for error messages
- Examine network requests for failed API calls
- Look for specific error patterns (422, validation errors, etc.)

### 2. Check API Response
```bash
# Test the API endpoint directly
curl -s http://localhost:8000/api/[resource]/ | jq .
curl -s http://localhost:8000/api/[resource]/[id] | jq .
```

### 3. Compare Schemas
- **Backend Schema**: Check `packages/playground_common/common/schemas.py`
- **Backend Model**: Check `packages/playground_common/common/models.py`
- **Frontend Types**: Check `app/src/types/index.ts`
- **Frontend Validation**: Check `app/src/api/index.ts` Zod schemas

### 4. Common Mismatch Patterns
- Field name differences (`name` vs `username`, `status` vs `is_completed`)
- Missing fields (`phone`, `due_date`, `assignee_name`)
- Type differences (boolean vs enum, string vs number)
- Nested object structures

### 5. Fix the Mismatch
- Update frontend types to match backend schema
- Update API validation schemas
- Update component rendering logic
- Update form handling and state management

### 6. Test the Fix
- Verify API calls work without errors
- Check data displays correctly
- Test create/update/delete operations
- Run linter to ensure code quality

## Example Commands

### Check Backend API
```bash
# Check what endpoints are available
curl -s http://localhost:8000/ | jq .

# Test specific resource endpoints
curl -s http://localhost:8000/api/users/ | jq .
curl -s http://localhost:8000/api/tasks/ | jq .
```

### Check Frontend
```bash
# Navigate to problematic page
# Check console for errors
# Examine network requests
# Look for validation failures
```

### Update Code
```bash
# After fixing, run linter
cd app && task lint

# Commit changes
git add [modified-files]
git commit -m "frontend: fix [resource] schema mismatch with backend API"
```

## Common Issues and Solutions

### Field Name Mismatches
- **Problem**: `user.name` vs `user.username`
- **Solution**: Update frontend to use correct field name

### Missing Fields
- **Problem**: Frontend expects `phone` but backend doesn't have it
- **Solution**: Remove field from frontend or add to backend

### Type Mismatches
- **Problem**: Frontend expects enum `['pending', 'in_progress', 'completed']` but backend has boolean `is_completed`
- **Solution**: Update frontend to match backend type

### Validation Errors
- **Problem**: Zod schema validation fails on API response
- **Solution**: Update Zod schema to match actual API response structure

## Prevention Tips
1. **Document API contracts** between frontend and backend teams
2. **Use shared schema definitions** when possible
3. **Test API endpoints** before implementing frontend
4. **Validate responses** with proper error handling
5. **Keep schemas in sync** during development iterations

## Related Commands
- `task doctor` - Check development environment
- `task lint` - Validate frontend code quality
- `task test` - Run tests to catch regressions
