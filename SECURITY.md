# Security Policy

## Supported Versions

We provide security patches and updates for the active release line of the HSE Safety Intelligence Platform.

| Version | Supported          |
| ------- | ------------------ |
| 1.0.x   | :white_check_mark: |
| < 1.0   | :x:                |

---

## Reporting a Vulnerability

The HSE Safety Intelligence Platform team takes system security and data integrity seriously. If you discover a security vulnerability, please report it responsibly:

1. **Do not create a public GitHub issue.**
2. Email your findings directly to the security maintainers or submit a private security advisory through GitHub.
3. Include detailed reproduction steps, environment details, and proof of concept if applicable.
4. We acknowledge receipt within **48 hours** and provide periodic updates regarding triage and remediation.

---

## Security Best Practices in Deployment

- **Environment Variables**: Never commit `.env` files or API secrets into version control.
- **Database Connection**: Ensure the database connection uses encrypted transport (SSL/TLS) in production environments.
- **API Access**: Run the backend behind a reverse proxy (e.g., NGINX, Cloudflare) with rate limiting and HTTPS termination enabled.
- **CORS Configuration**: Restrict allowed origins in `backend/src/app.ts` to authorized production domains.
