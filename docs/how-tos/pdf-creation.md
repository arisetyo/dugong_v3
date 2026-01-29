# PDF Generation

This document describes the patterns for generating PDF documents in this project.

## Overview

- **Puppeteer** is used to generate PDFs from HTML templates
- Templates are stored in the `templates/` directory
- PDF generation logic is encapsulated in a dedicated module

## Architecture

```
┌─────────────┐      ┌─────────────┐      ┌─────────────┐      ┌─────────┐
│   Routes    │ ──▶  │  Generator  │ ──▶  │  Template   │ ──▶  │   PDF   │
│  (trigger)  │      │  (worker)   │      │   (HTML)    │      │ (output)│
└─────────────┘      └─────────────┘      └─────────────┘      └─────────┘
```

## Dependencies

The project uses `puppeteer` for headless Chrome PDF generation:

```json
{
  "dependencies": {
    "puppeteer": "^24.x"
  }
}
```

## Template Guidelines

PDF templates should:

1. Be stored in `templates/` directory
2. Use EJS for dynamic content
3. Include all styles inline or in `<style>` tags
4. Be designed for print media (A4, Letter, etc.)
5. Account for page margins and breaks

### Template Structure

```
templates/
├── invoice.ejs
├── report.ejs
└── certificate.ejs
```

## Generator Module Guidelines

The PDF generator module should:

1. Accept template name and data as parameters
2. Render the EJS template with provided data
3. Launch Puppeteer in headless mode
4. Generate PDF with appropriate settings
5. Return the PDF buffer or save to file
6. Clean up browser instance after generation

## Puppeteer Configuration

| Setting | Recommendation |
|---|---|
| Format | `'A4'` or `'Letter'` depending on region |
| Print background | `true` for colors and backgrounds |
| Margins | Define consistent margins for all documents |
| Headless | `true` for production, configurable for debugging |

## Page Break Control

Use CSS to control page breaks:

| CSS Property | Use Case |
|---|---|
| `page-break-before: always` | Start element on new page |
| `page-break-after: always` | Force break after element |
| `page-break-inside: avoid` | Keep element together |

## Best Practices

- **Inline styles** - External stylesheets may not load reliably
- **Use absolute URLs** - For any images or assets
- **Test print output** - Browser print preview helps debug layouts
- **Handle errors gracefully** - Puppeteer can fail on resource-heavy pages
- **Set timeouts** - Prevent hanging on slow renders
- **Close browser instances** - Always clean up to prevent memory leaks
- **Consider queuing** - For high-volume PDF generation, use a job queue

## Security Considerations

- Sanitize all user input before rendering in templates
- Don't expose raw file paths in generated PDFs
- Limit PDF generation rate to prevent abuse
- Run Puppeteer with minimal permissions (`--no-sandbox` only if necessary)

## Testing

- Test templates with various data lengths
- Verify page breaks with multi-page documents
- Check rendering on different paper sizes
- Validate that all dynamic content renders correctly