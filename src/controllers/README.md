# Controller Abstraction Documentation

## Overview

The `BaseController` class provides a standardized abstraction for all controllers in the application. It includes common functionality such as error handling, response formatting, validation, and automatic method binding.

## Features

### 🔄 Automatic Method Binding
- All controller methods are automatically bound to the instance
- No need for manual binding in constructors
- Prevents `this` context issues when passing methods as callbacks

### 📝 Standardized Response Formats
- Consistent success and error response structures
- Built-in status code handling
- Metadata support for pagination, timestamps, etc.

### ✅ Built-in Validation Helpers
- Express-validator integration
- Required field validation
- ID parameter validation
- Pagination parameter parsing

### 🛠️ Error Handling
- Centralized error handling with context logging
- Automatic error type detection and appropriate HTTP status codes
- Consistent error response format

## Usage

### Creating a New Controller

```typescript
import { Request, Response } from 'express';
import { BaseController } from './base.controller';

class MyController extends BaseController {
  constructor() {
    super(); // Important: Call parent constructor
    // Initialize services here
  }

  async myMethod(req: Request, res: Response): Promise<void> {
    // Your implementation here
  }
}

export default new MyController();
```

### Available Methods

#### Response Methods

```typescript
// Success response
this.sendSuccessResponse(res, 200, 'Success message', data, metadata);

// Error response
this.sendErrorResponse(res, 400, 'Error type', 'Error message', details);
```

#### Validation Methods

```typescript
// Validate express-validator results
if (!this.validateRequest(req, res)) {
  return; // Automatically sends error response
}

// Validate required fields
if (!this.validateRequiredFields(req, res, ['field1', 'field2'])) {
  return; // Automatically sends error response
}

// Validate and parse ID parameter
const id = this.validateId(req, res, 'id'); // 'id' is default
if (id === null) return; // Automatically sends error response
```

#### Utility Methods

```typescript
// Parse pagination parameters
const { page, limit, offset } = this.parsePagination(req, 10); // default limit: 10

// Create pagination metadata
const pagination = this.createPagination(page, limit, total);
```

#### Error Handling

```typescript
try {
  // Your code here
} catch (error) {
  this.handleError(error, res, 'Context description');
}
```

## Migration Examples

### Before (Old Controller)

```typescript
class OldController {
  constructor() {
    // Manual method binding
    this.method1 = this.method1.bind(this);
    this.method2 = this.method2.bind(this);
  }

  async method1(req: Request, res: Response): Promise<void> {
    try {
      // Manual validation
      if (!req.body.field1) {
        res.status(400).json({
          error: 'Validation failed',
          message: 'field1 is required'
        });
        return;
      }

      const result = await this.service.doSomething();
      
      res.status(200).json({
        message: 'Success',
        data: result
      });
    } catch (error) {
      console.error('Error:', error);
      res.status(500).json({
        error: 'Server error',
        message: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  }
}
```

### After (Using BaseController)

```typescript
class NewController extends BaseController {
  constructor() {
    super(); // Automatic method binding
  }

  async method1(req: Request, res: Response): Promise<void> {
    try {
      // Simple validation
      if (!this.validateRequiredFields(req, res, ['field1'])) {
        return;
      }

      const result = await this.service.doSomething();
      
      this.sendSuccessResponse(res, 200, 'Success', result);
    } catch (error) {
      this.handleError(error, res, 'Method1');
    }
  }
}
```

## Error Handling

The base controller automatically handles common error patterns:

- **404 Errors**: `'Not found'`, `'Earthquake not found'`, `'User not found'`
- **401 Errors**: `'Unauthorized'`
- **403 Errors**: `'Forbidden'`
- **400 Errors**: `'Validation failed'`
- **500 Errors**: All other errors default to server error

Custom error handling can be added in individual controllers before calling `this.handleError()`.

## Response Formats

### Success Response

```json
{
  "message": "Operation successful",
  "data": { /* response data */ },
  "pagination": { /* pagination info */ },
  "timestamp": "2025-10-15T12:00:00Z"
}
```

### Error Response

```json
{
  "error": "Error type",
  "message": "Detailed error message",
  "details": { /* optional error details */ }
}
```

## Best Practices

1. **Always call `super()`** in the constructor
2. **Use validation helpers** instead of manual validation
3. **Use response helpers** for consistent formatting
4. **Let base controller handle common errors**
5. **Add context to error handling** for better debugging
6. **Extend error handling** for controller-specific errors before calling `handleError()`

## Benefits

- **Reduced code duplication**: Common functionality is centralized
- **Consistent responses**: All controllers use the same response format
- **Better error handling**: Centralized and context-aware error management
- **Easier maintenance**: Updates to common functionality only need to be made in one place
- **Type safety**: Full TypeScript support with proper typing
- **Developer experience**: Less boilerplate code in individual controllers