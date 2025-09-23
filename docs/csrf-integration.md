# CSRF Token Integration Guide

## How to Use CSRF Tokens in Your Frontend

### 1. Fetch CSRF Token

```javascript
// Get CSRF token before making state-changing requests
async function getCSRFToken() {
  const response = await fetch('/csrf-token');
  const data = await response.json();
  return data.csrfToken;
}
```

### 2. Include CSRF Token in Requests

#### Option A: Using Headers (Recommended)
```javascript
async function makeAuthenticatedRequest(url, data) {
  const csrfToken = await getCSRFToken();
  
  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-CSRF-Token': csrfToken,
      'Authorization': `Bearer ${accessToken}`
    },
    body: JSON.stringify(data)
  });
  
  return response.json();
}
```

#### Option B: Using Request Body
```javascript
async function loginUser(email, password) {
  const csrfToken = await getCSRFToken();
  
  const response = await fetch('/auth/login', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      email,
      password,
      _csrf: csrfToken
    })
  });
  
  return response.json();
}
```

### 3. React Hook Example

```jsx
import { useState, useEffect } from 'react';

function useCSRFToken() {
  const [csrfToken, setCSRFToken] = useState(null);
  
  useEffect(() => {
    async function fetchToken() {
      try {
        const response = await fetch('/csrf-token');
        const data = await response.json();
        setCSRFToken(data.csrfToken);
      } catch (error) {
        console.error('Failed to fetch CSRF token:', error);
      }
    }
    
    fetchToken();
  }, []);
  
  return csrfToken;
}

// Usage in component
function LoginForm() {
  const csrfToken = useCSRFToken();
  
  const handleSubmit = async (formData) => {
    if (!csrfToken) {
      alert('CSRF token not available');
      return;
    }
    
    const response = await fetch('/auth/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-CSRF-Token': csrfToken
      },
      body: JSON.stringify(formData)
    });
    
    // Handle response
  };
  
  return (
    // Your form JSX
  );
}
```

### 4. Axios Interceptor Example

```javascript
import axios from 'axios';

// Create axios instance
const api = axios.create({
  baseURL: 'http://localhost:3000'
});

// Request interceptor to add CSRF token
api.interceptors.request.use(async (config) => {
  // Skip for GET requests
  if (config.method === 'get') {
    return config;
  }
  
  // Get CSRF token
  try {
    const response = await axios.get('/csrf-token');
    config.headers['X-CSRF-Token'] = response.data.csrfToken;
  } catch (error) {
    console.error('Failed to get CSRF token:', error);
  }
  
  return config;
});

// Usage
api.post('/auth/login', { email, password });
```

### 5. Form-Based Example (Traditional Web Apps)

```html
<!-- Include CSRF token in forms -->
<form action="/auth/login" method="POST">
  <input type="hidden" name="_csrf" value="<%= csrfToken %>">
  <input type="email" name="email" required>
  <input type="password" name="password" required>
  <button type="submit">Login</button>
</form>
```

## Error Handling

```javascript
async function handleCSRFError(response) {
  if (response.status === 403) {
    const error = await response.json();
    if (error.error === 'CSRF token validation failed') {
      // Refresh CSRF token and retry
      const newToken = await getCSRFToken();
      // Retry the request with new token
    }
  }
}
```

## Security Notes

1. **Always use HTTPS in production** - CSRF tokens should never be transmitted over HTTP
2. **Token expiration** - Tokens expire after 1 hour, fetch new ones as needed
3. **SameSite cookies** - Consider using SameSite cookie attributes for additional protection
4. **Double Submit Cookie** - For additional security, you can implement double submit cookie pattern

## Testing CSRF Protection

```bash
# This should fail without CSRF token
curl -X POST http://localhost:3000/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"password"}'

# This should succeed with CSRF token
CSRF_TOKEN=$(curl -s http://localhost:3000/csrf-token | jq -r '.csrfToken')
curl -X POST http://localhost:3000/auth/login \
  -H "Content-Type: application/json" \
  -H "X-CSRF-Token: $CSRF_TOKEN" \
  -d '{"email":"test@example.com","password":"password"}'
```