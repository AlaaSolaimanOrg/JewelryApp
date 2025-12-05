# DYMO Label Writer 550 Turbo - CORS Error Solution

## Problem

When the application is deployed, CORS errors occur when trying to communicate with the DYMO Connect service at `https://127.0.0.1:41951/DYMO/DLS/Printing/StatusConnected`.

**Error:**

```
Access to XMLHttpRequest at 'https://127.0.0.1:41951/...' from origin 'https://yourdomain.com'
has been blocked by CORS policy: No 'Access-Control-Allow-Origin' header is present on the requested resource.
```

## Root Cause

- The DYMO Connect service runs locally on port 41951
- Browsers enforce CORS policies by default
- The DYMO Connect service doesn't provide CORS headers
- This is a known issue with local service integration in web applications

## Solution Overview

### 1. Development Environment (Vite Dev Server)

Configure Vite to proxy DYMO requests through the dev server:

**File:** `vite.config.ts`

```typescript
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), "");

  return {
    plugins: [react()],
    base: env.VITE_ROUTE_PREFIX || "/",
    server: {
      port: 5173,
      proxy: {
        "/DYMO": {
          target: "http://127.0.0.1:41951",
          changeOrigin: true,
          secure: false,
        },
      },
    },
  };
});
```

This routes all `/DYMO/*` requests to the local DYMO Connect service.

### 2. Production Environment Solutions

#### **Option A: Backend Proxy (Recommended for Deployed Apps)**

Create a backend endpoint that proxies DYMO requests:

**C# / ASP.NET Core Example:**

```csharp
[ApiController]
[Route("api/dymo")]
public class DymoProxyController : ControllerBase
{
    private static readonly HttpClient _client = new HttpClient(
        new HttpClientHandler
        {
            ServerCertificateCustomValidationCallback = (_, _, _, _) => true
        });

    [HttpGet("status")]
    public async Task<IActionResult> GetStatus()
    {
        try
        {
            var response = await _client.GetAsync("https://127.0.0.1:41951/DYMO/DLS/Printing/StatusConnected");
            var content = await response.Content.ReadAsStringAsync();
            return Ok(content);
        }
        catch (Exception ex)
        {
            return BadRequest(ex.Message);
        }
    }

    [HttpPost("print")]
    public async Task<IActionResult> Print([FromBody] PrintRequest request)
    {
        try
        {
            var content = new StringContent(request.Data, Encoding.UTF8, "application/json");
            var response = await _client.PostAsync("https://127.0.0.1:41951/DYMO/DLS/Printing/Print", content);
            var responseContent = await response.Content.ReadAsStringAsync();
            return Ok(responseContent);
        }
        catch (Exception ex)
        {
            return BadRequest(ex.Message);
        }
    }
}
```

#### **Option B: Electron / Desktop App Wrapper**

If this is eventually a desktop app, use Electron to eliminate CORS issues entirely.

#### **Option C: Browser Extension**

Create a minimal browser extension to handle DYMO communication without CORS restrictions.

#### **Option D: DYMO Cloud Service (Future)**

Use DYMO's cloud API if available for your SDK version.

## Implementation Steps

### Development

1. ✅ Updated `vite.config.ts` with proxy configuration
2. The DYMO SDK will now route through: `http://localhost:5173/DYMO/...` → `http://127.0.0.1:41951/DYMO/...`
3. No code changes needed in the React component

### Production Deployment

1. **For Traditional Web Hosting:**

   - Implement a backend proxy (Option A)
   - Ensure DYMO Connect is running on the server/user machine
   - Update API calls to use your backend proxy endpoints

2. **Update TagPrintingModal.tsx for Production:**
   ```typescript
   // In production, use backend proxy
   const DYMO_API_BASE =
     process.env.NODE_ENV === "production"
       ? "/api/dymo" // Backend proxy
       : "/DYMO"; // Dev proxy
   ```

## Important Notes

### DYMO Connect Service Requirements

- **Must be running** on the client machine (not server)
- Default address: `127.0.0.1:41951` (localhost only)
- Installation: [Download DYMO Connect](https://www.dymo.com/en-US/dymo-web-service)
- The user must have DYMO Connect installed and running to print

### Security Considerations

- DYMO Connect only accepts connections from `127.0.0.1`
- It cannot be accessed from remote servers
- For production: Implement server-side validation before proxying requests

### Testing

1. Ensure DYMO Connect is running
2. Test connection with "Test DYMO Connection" button in the modal
3. Check browser console for detailed error messages
4. Use the "Debug DYMO Object" button to inspect the framework

## Debugging CORS Issues

### Check if DYMO Connect is running:

```powershell
netstat -ano | findstr :41951
```

### Browser Console Diagnostics:

```javascript
// In browser console
window.dymo.label.framework.checkEnvironment();
window.dymo.label.framework.getPrinters();
```

### Network Tab:

- Look for requests to `127.0.0.1:41951`
- Check response headers for CORS errors
- Verify proxy is working in dev mode

## References

- [DYMO Label Framework Documentation](https://developers.dymo.com/)
- [CORS Policy Overview](https://developer.mozilla.org/en-US/docs/Web/HTTP/CORS)
- [Vite Proxy Configuration](https://vitejs.dev/config/server-options.html#server-proxy)
