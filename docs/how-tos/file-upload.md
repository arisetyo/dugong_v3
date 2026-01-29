# File Upload Architecture Guide

## Overview

This document describes the file upload architecture used in this project. The implementation follows a **direct upload pattern** where files are uploaded from the client browser directly to the application server for local storage.

---

## Architecture

### Flow Diagram

```
[Browser] → [Fastify Server] → [Local Storage]
    ↓              ↓                  ↓
 FormData     Multipart         File System /
 + Metadata   Processing        Database Record
```

### Layers

1. **Client Layer (Browser)**
   - Handles file selection via drag-and-drop or file picker
   - Performs client-side validation before submission
   - Submits FormData to the server

2. **Server Layer (Fastify)**
   - Receives and parses multipart requests
   - Validates file type, size, and metadata
   - Saves file to configured storage location
   - Records file metadata in the database

3. **Storage Layer**
   - Stores uploaded files in `public/media/` or configured directory
   - Database stores file metadata (filename, path, size, MIME type, upload date)

---

## Rules and Conventions

### Multipart Form Data

- All file uploads MUST use `multipart/form-data` encoding
- The form element MUST include `enctype="multipart/form-data"` attribute
- The file input field MUST have `name="file"` to match the expected field name
- NEVER manually set the `Content-Type` header when using FormData — let the browser or fetch API set the boundary automatically

### File Validation

- Validate file type on both client and server sides
- Client-side validation provides immediate user feedback
- Server-side validation ensures security and data integrity
- File size limits must be configured at both application and plugin levels
- Maintain an allowlist of permitted MIME types

### Plugin Registration

- Register the multipart plugin with explicit file size limits
- Configure limits at the plugin level, not per-request
- The multipart plugin must be registered before route handlers

### Request Processing Order

1. Check if request is multipart using `request.isMultipart()`
2. Iterate through all parts using async iteration (`for await...of`)
3. Distinguish file parts from text field parts using the `file` property
4. Convert file streams to buffers immediately to prevent stream consumption issues
5. Store text fields in a structured object for later processing
6. Generate a unique filename to prevent collisions
7. Save file to storage and record metadata in database

### File Naming Convention

- Generate unique filenames using timestamp + random string or UUID
- Preserve the original file extension
- Store original filename in database for display purposes
- Example: `1706544000000-a1b2c3d4.pdf`

### Storage Location

- Store uploaded files in `public/media/` for publicly accessible files
- Use a non-public directory (e.g., `uploads/`) for private files
- Organize files into subdirectories by date or type if needed
- Ensure the storage directory exists before writing files

---

## Best Practices

### Client-Side

- Implement drag-and-drop functionality with visual feedback
- Display file information (name, size) after selection
- Provide a clear mechanism to remove/change selected file
- Disable submit button until a valid file is selected
- Show upload progress indicator during submission
- Handle and display errors gracefully

### Server-Side

- Log upload stages for debugging without exposing sensitive data
- Validate MIME types server-side regardless of client validation
- Return structured JSON responses with consistent status fields
- Implement proper error categorization (400 for validation, 401 for auth, 500 for server errors)
- Clean up partially written files on error conditions
- Use streams for large files to minimize memory usage

### Form Design

- Mark optional metadata fields clearly
- Provide sensible defaults where applicable
- Filter out empty optional fields before submission
- Use appropriate input types for metadata (text, textarea, select)

### Error Handling

- Return descriptive error messages for common failure scenarios
- Differentiate between authentication errors and validation errors
- Log errors with sufficient context for debugging
- Never expose internal error details to clients in production
- Handle disk full and permission errors gracefully

### Security

- Authenticate requests before processing uploads
- Validate file types by checking MIME type, not just file extension
- Enforce file size limits at multiple levels
- Sanitize filenames to prevent path traversal attacks
- Use secure session management for authentication state
- Never execute uploaded files (disable script execution in upload directories)
- Consider virus scanning for uploaded files in production

---

## Configuration Requirements

### Environment Variables

The following environment variables should be configured:

- **UPLOAD_DIR**: Directory path for storing uploaded files (default: `public/media`)
- **MAX_FILE_SIZE**: Maximum upload size in bytes (default: `10485760` for 10MB)
- **ALLOWED_MIME_TYPES**: Comma-separated list of allowed MIME types
- **SESSION_SECRET**: Secure secret for session management (required in production)

### Plugin Configuration

- **File Size Limit**: Maximum upload size in bytes
- **Session Settings**: Cookie security, expiry, and storage options

### Directory Setup

Ensure the upload directory exists and has proper permissions:

```bash
mkdir -p public/media
chmod 755 public/media
```

---

## Database Schema

Store file metadata in the database for retrieval and management:

```sql
CREATE TABLE uploads (
  id SERIAL PRIMARY KEY,
  original_filename VARCHAR(255) NOT NULL,
  stored_filename VARCHAR(255) NOT NULL,
  file_path VARCHAR(500) NOT NULL,
  mime_type VARCHAR(100) NOT NULL,
  file_size INTEGER NOT NULL,
  uploaded_by INTEGER REFERENCES users(id),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

---

## Response Handling Conventions

### Success Response Structure

```json
{
  "status": "success",
  "file": {
    "id": 123,
    "filename": "document.pdf",
    "path": "/media/1706544000000-a1b2c3d4.pdf",
    "size": 102400,
    "mimeType": "application/pdf"
  }
}
```

### Error Response Structure

```json
{
  "status": "error",
  "message": "<human-readable-error-message>"
}
```

### Client Response Handling

- Check response status code first
- Parse JSON response body
- Check `status` field for success/error
- Display appropriate feedback based on result
- Redirect or update UI on success
- Show error message on failure

---

## Tech Stack Assumptions

This architecture assumes:

- **Server Framework**: Fastify with multipart plugin
- **Database**: PostgreSQL for file metadata storage
- **Templating**: EJS for server-side rendering
- **Client Enhancement**: Vanilla JavaScript (optionally with htmx/Alpine.js)
- **Styling**: SCSS compiled to CSS
- **Session Management**: Cookie-based sessions with secure configuration
