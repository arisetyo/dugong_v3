# PDF Document Reading - Architecture Guide

## Overview

This guide provides architectural guidance for implementing PDF document reading functionality in a Node.js application.

---

## Architecture Flowchart

```
┌──────────────────────────────────────────────────────────────────┐
│                    PDF Reading Pipeline                          │
└──────────────────────────────────────────────────────────────────┘

                         ┌───────────────┐
                         │  PDF Upload   │
                         │ (Multipart)   │
                         └───────┬───────┘
                                 │
                                 ▼
               ┌─────────────────────────────────┐
               │      1. UPLOAD HANDLING         │
               │  - Validate file type           │
               │  - Extract user metadata        │
               │  - Convert stream to buffer     │
               └─────────────────┬───────────────┘
                                 │
                                 ▼
               ┌─────────────────────────────────┐
               │       2. FILE STORAGE           │
               │  - Cloud storage (S3-compatible)│
               │  - Or local filesystem (dev)    │
               │  - Database for metadata        │
               └─────────────────┬───────────────┘
                                 │
                                 ▼
               ┌─────────────────────────────────┐
               │       3. PDF PARSING            │
               │  - Extract text content         │
               │  - Retrieve page count          │
               │  - Get PDF metadata             │
               └─────────────────┬───────────────┘
                                 │
                                 ▼
                      ┌───────────────────┐
                      │   Text Content    │
                      │   Ready for Use   │
                      └───────────────────┘
```

---

## Recommended Technology Stack

| Component | Recommended Options | Purpose |
|-----------|---------------------|---------|
| **Web Server** | Fastify, Express | HTTP server with multipart support |
| **File Upload** | Fastify Multipart, Multer | Handle multipart form-data |
| **PDF Parser** | pdf-parse, pdf.js | Extract text from PDF files |
| **Cloud Storage** | AWS S3, Cloudflare R2, GCS | Store PDF files |
| **Database** | PostgreSQL, MongoDB | Store document metadata |

---

## Key Dependencies

| Package | Purpose |
|---------|---------|
| `pdf-parse-debugging-disabled` | PDF text extraction |
| `@fastify/multipart` or `multer` | File upload handling |
| `@aws-sdk/client-s3` | S3-compatible storage operations |
| Database driver (e.g., `pg`, `mongoose`) | Metadata persistence |

---

## Implementation Guidelines

### 1. Upload Handling

- **Validate file type**: Check MIME type is `application/pdf`
- **Set file size limits**: Configure maximum upload size (e.g., 100MB)
- **Extract metadata**: Capture user-provided fields (title, author, description)
- **Buffer conversion**: Convert file stream to buffer for processing

### 2. Storage Strategy

**Cloud Storage (Production)**
- Use S3-compatible storage (AWS S3, Cloudflare R2, MinIO)
- Generate unique keys using UUID + timestamp to avoid collisions
- Store file path/key reference in database

**Local Storage (Development)**
- Use filesystem for development environment
- Implement same interface as cloud storage for easy switching
- Use environment variables to toggle between providers

**Storage Factory Pattern**
- Create unified interface for storage operations
- Switch providers based on environment configuration
- Methods: `uploadFile()`, `downloadFile()`, `deleteFile()`, `fileExists()`

### 3. PDF Parsing

**Text Extraction**
- Pass file buffer to PDF parsing library
- Returns: full text content, page count, PDF metadata

**Available Data**
- `text` - Complete extracted text content
- `numpages` - Total number of pages
- `info` - PDF document information (title, author, creation date)
- `metadata` - Additional embedded metadata

**Error Handling**
- Wrap parsing in try-catch for corrupted/malformed PDFs
- Return meaningful error messages to users
- Log failures for debugging

### 4. Database Schema

**Documents Table**
- `id` - Unique identifier
- `title` - Document title
- `file_path` - Storage key/path reference
- `metadata` - JSONB field for flexible metadata
- `created_at` - Timestamp

---

## Best Practices

- **Validation First**: Always validate file type before any processing
- **Unique Identifiers**: Use UUID or timestamp prefixes for file storage keys
- **Environment-Based Config**: Use env variables for storage provider selection
- **Memory Management**: Be mindful of memory usage with large PDFs
- **Async Operations**: Use async/await for all I/O operations
- **Separation of Concerns**: Keep upload, storage, and parsing in separate modules

---

## Security Considerations

- Validate MIME type server-side (don't trust client headers alone)
- Sanitize filenames before storage
- Set appropriate file size limits
- Use secure credentials management for storage access keys
- Implement proper access control for stored documents
