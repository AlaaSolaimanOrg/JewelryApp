# 🖨️ DYMO Label Writer 550 Turbo - Implementation Guide

## 📋 Quick Start

### For Development (Ready Now)

1. Ensure DYMO Connect is running
2. Run: `npm run dev`
3. Test printing → should work ✅

### For Production (Implement Next)

See "Production Setup" section below

---

## ✅ What's Included

### Configuration Files

- ✅ `vite.config.ts` - Proxy configured
- ✅ `src/utils/dymoConfig.ts` - Helper utilities
- ✅ `src/utils/BACKEND_PROXY_EXAMPLES.ts` - Backend code

### Documentation

- ✅ `README_DYMO_FIX.md` - Overview
- ✅ `DYMO_QUICK_REFERENCE.md` - Quick answers
- ✅ `DYMO_FIX_SUMMARY.md` - Detailed steps
- ✅ `DYMO_CORS_SOLUTION.md` - Technical analysis
- ✅ `DYMO_FIX_VERIFICATION.md` - Verification guide

---

## 🚀 Test Development Setup

### Prerequisites

- DYMO Connect installed: https://www.dymo.com/en-US/dymo-web-service
- DYMO Label Writer 550 Turbo connected via USB
- Node.js and npm installed

### Testing Steps

```bash
# 1. Start development server
npm run dev

# 2. Open browser to http://localhost:5173

# 3. Navigate to Inventory → Select Product → Click "Print Tags"

# 4. In TagPrintingModal, click "Test DYMO Connection"

# 5. Expected result:
#    ✅ Printers dropdown populated
#    ✅ "Connected" status shown
#    ✅ Framework version displayed

# 6. Try printing:
#    - Select a printer
#    - Set quantity to 1
#    - Click "Print 1 Tag(s)"
#    - Label should print ✅
```

---

## 🔧 How the Fix Works

### The CORS Problem

```
Browser                                  DYMO Connect
  ↓                                         ↓
Makes request to 127.0.0.1:41951
  ↓
Browser blocks it!
"No 'Access-Control-Allow-Origin' header"
  ✗ CORS Error
```

### The Solution (Development)

```
Browser                   Vite Dev Server              DYMO Connect
  ↓                              ↓                           ↓
Request to /DYMO/...
  ↓
Vite intercepts & proxies
  ↓─────────────────────────────────→ 127.0.0.1:41951
                                       ↓
                                    Processes
                                       ↓
                                    Responds
  ←───────────────────────────────────┘
  ↓
Browser receives response
  ✓ Success! No CORS error
```

### The Solution (Production)

```
Browser                  Your Backend              DYMO Connect
  ↓                           ↓                           ↓
Request to /api/dymo/...
  ↓
Backend intercepts & proxies
  ↓──────────────────────────────→ 127.0.0.1:41951
                                   (on client machine)
                                   ↓
                                Processes
                                   ↓
                                Responds
  ←──────────────────────────────────┘
  ↓
Backend returns response
  ↓
Browser receives response
  ✓ Success! No CORS error
```

---

## 📦 Production Setup

### Step 1: Choose Your Backend

- [ ] C# / ASP.NET Core
- [ ] Node.js / Express
- [ ] Python / Flask
- [ ] Other

### Step 2: Implement Proxy

1. Open: `src/utils/BACKEND_PROXY_EXAMPLES.ts`
2. Find your backend language section
3. Copy the proxy controller code
4. Add to your backend project
5. Test locally first

### Step 3: Configure Frontend

Update `src/utils/dymoConfig.ts` (optional):

```typescript
export function getDymoConfig(): DymoConfig {
  const isDevelopment = process.env.NODE_ENV === "development";

  return {
    isDevelopment,
    apiBaseUrl: isDevelopment ? "/DYMO" : "/api/dymo", // Update endpoint
    useBackendProxy: !isDevelopment,
  };
}
```

### Step 4: Test Backend Proxy

```bash
# With backend running locally:
1. Start frontend: npm run dev
2. Run backend on localhost
3. Test printing (same as dev)
4. Should still work ✅
```

### Step 5: Deploy

1. Deploy backend with proxy endpoints
2. Update API endpoint in production build
3. Test on staging environment
4. Deploy to production

---

## 🐛 Troubleshooting

### Issue: "DYMO Framework not detected"

**Check 1:** DYMO Connect Running

```
Look for DYMO Connect icon in system tray (bottom right)
If not there → Download from: https://www.dymo.com/en-US/dymo-web-service
```

**Check 2:** USB Connection

```
Verify DYMO printer is connected via USB
Check Device Manager for "DYMO LabelWriter"
If not appearing → Check USB port
```

**Check 3:** Browser Console

```javascript
// Paste in browser console:
window.dymo;
// Should see an object with label.framework
```

### Issue: "CORS error in development"

**Check 1:** Vite Config

```
Open vite.config.ts
Verify proxy section exists (see below)
Should have /DYMO proxy to 127.0.0.1:41951
```

**Check 2:** Dev Server Restarted

```bash
# Stop current dev server (Ctrl+C)
# Clear node_modules cache
npm run dev
```

**Check 3:** Clear Browser Cache

```
Browser DevTools → Application → Clear Site Data
Reload page (Ctrl+Shift+R)
```

### Issue: "Port 41951 blocked"

**Check Windows Firewall:**

```powershell
# Run as Administrator
netstat -ano | findstr :41951
# If no results, DYMO Connect not running or port blocked
```

**Firewall Exception:**

```
1. Windows Defender Firewall → Allow app through
2. Add DYMO Connect to allowed apps
3. Allow on Private network
```

### Issue: "In production, still getting CORS error"

**Check 1:** Backend Proxy Implemented

```
Backend should have /api/dymo endpoints
Test with: curl https://yourserver/api/dymo/status
Should return JSON response
```

**Check 2:** DYMO Connect on Client Machine

```
DYMO Connect must run on user's machine
Not on server
Verify with: netstat -ano | findstr :41951 (on client)
```

**Check 3:** Backend Proxy Routes Correctly

```
Backend /api/dymo/...
  → should proxy to http://127.0.0.1:41951/DYMO/...
Check backend logs for proxy requests
```

---

## 🔍 Debugging Commands

### Windows Debugging

```powershell
# Check if DYMO Connect running
netstat -ano | findstr :41951

# Find process using port
Get-Process | Where-Object { $_.ProcessName -like "*dymo*" }

# Restart DYMO Connect
Stop-Process -Name "DymoConnectService"
Start-Service -Name "DymoConnectService"
```

### Browser Console

```javascript
// Check DYMO framework
window.dymo;
window.dymo.label;
window.dymo.label.framework;
window.dymo.label.framework.VERSION;

// Check environment
window.dymo.label.framework.checkEnvironment();

// Get printers
window.dymo.label.framework.getPrinters();

// Get connected printers only
window.dymo.label.framework.getPrinters().filter((p) => p.isConnected);
```

### Network Debugging

1. Open DevTools (F12)
2. Go to Network tab
3. Filter by "DYMO" or "127.0.0.1"
4. Click "Test DYMO Connection"
5. Observe network requests
6. Check response status and headers

---

## 📊 File Structure After Fix

```
JewelryApp.UI/
├── vite.config.ts (✅ MODIFIED)
│   └── Added proxy for /DYMO routes
│
├── src/
│   ├── utils/
│   │   ├── dymoConfig.ts (✨ NEW)
│   │   │   └── Helper functions for DYMO configuration
│   │   │
│   │   └── BACKEND_PROXY_EXAMPLES.ts (✨ NEW)
│   │       └── Backend implementation examples
│   │
│   └── components/
│       └── modals/
│           └── TagPrintingModal/
│               └── TagPrintingModal.tsx (No changes needed)
│
├── Documentation/ (✨ NEW)
│   ├── README_DYMO_FIX.md
│   ├── DYMO_CORS_SOLUTION.md
│   ├── DYMO_FIX_SUMMARY.md
│   ├── DYMO_FIX_VERIFICATION.md
│   └── DYMO_QUICK_REFERENCE.md
```

---

## ✨ Key Configuration

### vite.config.ts (Development Proxy)

```typescript
server: {
  port: 5173,
  proxy: {
    "/DYMO": {
      target: "http://127.0.0.1:41951",
      changeOrigin: true,
      secure: false,
      rewrite: (path) => path,
    },
  },
}
```

### What It Does

- Intercepts requests to `/DYMO/...`
- Forwards to `http://127.0.0.1:41951/DYMO/...`
- Returns response to browser
- Solves CORS by using same-origin (localhost:5173)

---

## 📚 Documentation Map

| Document                   | Purpose             | Read When             |
| -------------------------- | ------------------- | --------------------- |
| `README_DYMO_FIX.md`       | Overview & status   | First time            |
| `DYMO_QUICK_REFERENCE.md`  | Quick answers       | Need fast help        |
| `DYMO_CORS_SOLUTION.md`    | Technical deep-dive | Want to understand    |
| `DYMO_FIX_SUMMARY.md`      | Action items        | Planning next steps   |
| `DYMO_FIX_VERIFICATION.md` | Detailed guide      | Setting up production |
| This file                  | Implementation      | Actually implementing |

---

## ✅ Verification Checklist

### Development Setup

- [ ] vite.config.ts has /DYMO proxy
- [ ] DYMO Connect installed and running
- [ ] DYMO printer connected via USB
- [ ] npm run dev starts without errors
- [ ] "Test DYMO Connection" shows printers
- [ ] Can print test label

### Production Setup

- [ ] Backend proxy code copied to backend project
- [ ] Backend proxy endpoints implemented
- [ ] Backend proxy tested locally
- [ ] Frontend API endpoint updated for production
- [ ] End-to-end tested on staging
- [ ] Ready for production deployment

---

## 🎯 Success Criteria

### Development ✅

```
✓ npm run dev starts without errors
✓ Modal "Test DYMO Connection" button works
✓ Printers appear in dropdown
✓ Can send print job to printer
✓ Label prints successfully
```

### Production ✅

```
✓ Backend proxy endpoint responds
✓ Frontend calls /api/dymo/... (not /DYMO/...)
✓ Backend forwards to 127.0.0.1:41951 successfully
✓ Users have DYMO Connect installed
✓ Label prints from production server
```

---

## 🚀 You're Ready!

All the code, examples, and documentation are in place.

**Next:** Test printing in development right now! 🖨️

Questions? Check:

- `DYMO_QUICK_REFERENCE.md` for quick help
- `DYMO_CORS_SOLUTION.md` for technical details
- Browser console for error messages

Happy printing! 🎉
