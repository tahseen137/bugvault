# Security Policy

## Supported Versions

| Version | Supported          |
| ------- | ------------------ |
| 2.0.x   | ✅ Active support  |
| 1.x.x   | ❌ No longer supported (localStorage version) |

## Security Improvements (v2.0)

BugVault v2.0 includes the following security enhancements:

### 🔒 Security Headers (Helmet.js)
- Content-Security-Policy (CSP) to prevent XSS
- X-Frame-Options to prevent clickjacking
- X-Content-Type-Options to prevent MIME sniffing
- Referrer-Policy for privacy
- And more security headers

### 🚦 Rate Limiting
- 100 requests per 15 minutes per IP address
- Prevents brute-force attacks and DoS
- Configurable via `express-rate-limit`

### 🧹 Input Sanitization
- All user inputs are sanitized using DOMPurify
- HTML tags stripped from title, error, solution, context, project, and tags
- Prevents XSS (Cross-Site Scripting) attacks

### 🌐 CORS Restrictions
- Configurable allowed origins via `ALLOWED_ORIGINS` environment variable
- Default: `http://localhost:3000`
- Production: Set to your domain(s)

### 📏 Request Size Limits
- JSON payload limited to 1MB (reduced from 10MB)
- Prevents memory exhaustion attacks

### 🔍 Dependency Scanning
- All npm vulnerabilities fixed
- Zero known vulnerabilities in dependencies

## Recommended Security Practices

### For Personal Use (Local/Private Network)
✅ **Current version is safe** for local, single-user deployments.

No additional authentication needed if:
- Running on localhost
- Behind a firewall
- Only you have access

### For Team/Public Deployment

If deploying BugVault for team use or on the internet, we **strongly recommend** adding:

#### 1. Authentication & Authorization
BugVault does not include built-in authentication. Consider:

**Option A: API Key (Simple)**
```javascript
// server.js
const API_KEY = process.env.API_KEY;

const authenticate = (req, res, next) => {
  const key = req.headers['x-api-key'];
  if (key !== API_KEY) {
    return res.status(401).json({ error: 'Unauthorized' });
  }
  next();
};

app.use('/api', authenticate);
```

**Option B: Reverse Proxy with Auth (Recommended)**
- Deploy behind Nginx/Caddy with basic auth
- Use Cloudflare Access, Tailscale, or similar
- OAuth via Auth0, Okta, or similar

**Option C: OAuth/JWT (Advanced)**
- Implement with Passport.js
- Add user roles (admin, viewer, editor)
- Track issue ownership

#### 2. HTTPS/TLS
**Always use HTTPS in production.** Use:
- Let's Encrypt (free SSL certificates)
- Cloudflare (free SSL + DDoS protection)
- Reverse proxy with TLS termination

#### 3. MongoDB Security
**Secure your MongoDB instance:**
```yaml
# docker-compose.yml
mongo:
  environment:
    MONGO_INITDB_ROOT_USERNAME: admin
    MONGO_INITDB_ROOT_PASSWORD: ${MONGO_PASSWORD}
```

**Production checklist:**
- ✅ Enable MongoDB authentication
- ✅ Use strong passwords
- ✅ Restrict network access (bind to localhost or private network)
- ✅ Enable TLS for MongoDB connections
- ✅ Regular backups

#### 4. Environment Variables
**Never commit secrets to Git.**

Required production variables:
```env
NODE_ENV=production
MONGO_URI=mongodb://user:password@host:27017/bugvault
ALLOWED_ORIGINS=https://yourdomain.com
API_KEY=your-secret-api-key-here
```

Use:
- Docker secrets
- Kubernetes secrets
- Cloud provider secrets (AWS Secrets Manager, etc.)

#### 5. Regular Updates
```bash
# Check for vulnerabilities weekly
npm audit

# Update dependencies monthly
npm update
npm audit fix
```

## Reporting a Vulnerability

If you discover a security vulnerability in BugVault, please:

1. **Do NOT open a public GitHub issue**
2. Email the maintainer directly: tahseen137@gmail.com (replace with actual email)
3. Include:
   - Description of the vulnerability
   - Steps to reproduce
   - Potential impact
   - Suggested fix (if any)

We will respond within **48 hours** and provide a fix within **7 days** for critical issues.

## Security Audit

A comprehensive security audit was conducted on **February 16, 2026**. See [AUDIT.md](AUDIT.md) for full details.

**Summary:**
- ✅ No critical vulnerabilities in core codebase
- ✅ All npm dependencies up to date
- ✅ Security headers implemented
- ✅ Input sanitization active
- ⚠️ Authentication required for production use

## Known Limitations

### No Built-in Authentication
BugVault is designed for personal use and does not include user authentication. See recommendations above for adding auth.

### No Audit Logging
Actions (create, update, delete) are not logged. Consider adding Winston or similar for production.

### No File Upload Sanitization
If you add file upload functionality, ensure:
- File type validation
- Virus scanning
- Size limits
- Secure storage (S3, etc.)

## Security-First Development Practices

When contributing to BugVault:

1. **Sanitize all inputs** using DOMPurify
2. **Validate all data** with express-validator
3. **Never trust user input** (even from authenticated users)
4. **Run `npm audit`** before committing
5. **Test for XSS, SQL injection, and CSRF**
6. **Follow OWASP Top 10** guidelines

## Additional Resources

- [OWASP Top 10](https://owasp.org/www-project-top-ten/)
- [Node.js Security Best Practices](https://nodejs.org/en/docs/guides/security/)
- [Express Security Best Practices](https://expressjs.com/en/advanced/best-practice-security.html)
- [MongoDB Security Checklist](https://www.mongodb.com/docs/manual/administration/security-checklist/)

---

**Last updated:** February 16, 2026  
**Version:** 2.0.0
