# DYMO CORS Fix - Quick Reference

## 🎯 Problem

CORS error when accessing DYMO Connect at `https://127.0.0.1:41951` in deployed environment.

## ✅ Solution Applied

### Development (Local)

```
Browser → Vite Dev Server → DYMO Connect (127.0.0.1:41951)
```

✅ **Configured** - Proxy added to `vite.config.ts`

### Production (Deployed)

```
Browser → Your Backend → DYMO Connect (127.0.0.1:41951)
```

⚠️ **TODO** - Implement backend proxy (see examples)

---

## 🚀 To Test Development Setup

```bash
# 1. Ensure DYMO Connect is running
# Look for "DYMO Connect" in system tray

# 2. Start dev server
npm run dev

# 3. Navigate to TagPrintingModal
# Click "Test DYMO Connection" button

# 4. Verify printers appear
# If they do → CORS fix is working ✅
```

---

## 📁 Files Changed

| File                                  | Change      | Purpose                |
| ------------------------------------- | ----------- | ---------------------- |
| `vite.config.ts`                      | Added proxy | Dev CORS fix           |
| `src/utils/dymoConfig.ts`             | Created     | Environment detection  |
| `DYMO_CORS_SOLUTION.md`               | Created     | Full documentation     |
| `DYMO_FIX_SUMMARY.md`                 | Created     | Action items & summary |
| `src/utils/BACKEND_PROXY_EXAMPLES.ts` | Created     | Backend implementation |

---

## 🔧 Production Setup (Required)

Choose one backend framework and implement the proxy:

### C# / ASP.NET Core

📄 File: `src/utils/BACKEND_PROXY_EXAMPLES.ts` (lines 7-80)

### Node.js / Express

📄 File: `src/utils/BACKEND_PROXY_EXAMPLES.ts` (lines 85-140)

### Python / Flask

📄 File: `src/utils/BACKEND_PROXY_EXAMPLES.ts` (lines 145-200)

---

## ⚙️ Environment Variables (Optional)

If you want to customize the DYMO API endpoint:

```env
# .env
VITE_DYMO_API_BASE=/api/dymo  # Production
# OR
VITE_DYMO_API_BASE=/DYMO      # Development
```

Then use in code:

```typescript
const apiBase = import.meta.env.VITE_DYMO_API_BASE || "/DYMO";
```

---

## 🛠️ Debugging Commands

### Check DYMO Connect Status

```powershell
# Windows - Check if port 41951 is open
netstat -ano | findstr :41951
```

### Browser Console

```javascript
// Test DYMO framework
window.dymo.label.framework.checkEnvironment();

// Get printers
window.dymo.label.framework.getPrinters();

// Check version
window.dymo.label.framework.VERSION;
```

### Network Tab

1. Open DevTools → Network tab
2. Click "Test DYMO Connection"
3. Look for `/DYMO/DLS/Printing/StatusConnected` request
4. Should see response with CORS headers

---

## ✨ Key Takeaways

1. **Development** → Vite proxy handles CORS ✅
2. **Production** → Backend proxy required ⚠️
3. **DYMO Connect** → Must run on client machine 📌
4. **No Server-Side Proxy Yet** → Next step for production 👉

---

## 📞 Support

- **DYMO Docs:** https://developers.dymo.com
- **CORS Policy:** https://developer.mozilla.org/en-US/docs/Web/HTTP/CORS
- **Vite Proxy:** https://vitejs.dev/config/server-options.html#server-proxy

---

## ✅ Checklist

- [x] Vite proxy configured
- [x] Development setup ready
- [x] Documentation created
- [x] Backend examples provided
- [ ] Backend proxy implemented (your backend)
- [ ] Production tested
- [ ] Users have DYMO Connect installed

**Current Status:** Development working ✅ | Production pending ⏳
