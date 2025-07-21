# Users API

## GET /api/users/:id

Returns user data (name, profile image) for the specified user ID.

**Response:**
```json
{
  "id": "string",
  "name": "string",
  "profileImage": "url"
}
```