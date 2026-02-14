# 🔐 Opdater Vercel Miljøvariabler

## Vigtigt! Du skal tilføje din Storyblok Access Token til Vercel

### Trin 1: Gå til Vercel Settings

1. Åbn: https://vercel.com/dashboard
2. Klik på dit projekt: `storyblok-languagewire-tool`
3. Klik på **"Settings"** tab
4. Klik på **"Environment Variables"** i venstre menu

### Trin 2: Tilføj Ny Miljøvariabel

Klik **"Add New"** og tilføj:

**Key:**
```
STORYBLOK_ACCESS_TOKEN
```

**Value:**
```
J4aetxlFmZ0AhVlISnpRkgtt
```

**Environments:**
- ✅ Production
- ✅ Preview
- ✅ Development

Klik **"Save"**

### Trin 3: Re-deploy Appen

Efter at have tilføjet miljøvariablen:

1. Gå til **"Deployments"** tab
2. Find den seneste deployment (øverst)
3. Klik på de tre prikker **"⋯"** til højre
4. Vælg **"Redeploy"**
5. Vælg **"Use existing Build Cache"** (hurtigere)
6. Klik **"Redeploy"**
7. Vent 1-2 minutter

### Trin 4: Test i Storyblok

Når deployment er færdig:

1. Gå til din story i Storyblok
2. Åbn Tool plugin i sidebaren
3. Hard refresh (Cmd+Shift+R eller Ctrl+Shift+R)
4. **Dropdown'en skulle nu vise dine faktiske mapper fra Storyblok!** 🎉

---

## ✅ Forventet Resultat

Du skulle nu se:
- **Målmappe dropdown** viser dine faktiske mapper fra Space ID: 288946579053471
- Mapperne er sorteret alfabetisk
- Ingen mock data længere

---

## 🔍 Hvis Det Ikke Virker

### Tjek 1: Verificer Access Token er Korrekt
- Gå til Storyblok: Settings → Access Tokens
- Verificer at token `J4aetxlFmZ0AhVlISnpRkgtt` har de rigtige permissions:
  - ✅ Read access til Stories

### Tjek 2: Verificer Space ID
- Dit Space ID er: `288946579053471`
- Det matcher med `#288946579053471` i din Storyblok URL

### Tjek 3: Se Console Logs
- Åbn browser DevTools (F12)
- Gå til Console tab
- Se efter "Loaded folders:" besked
- Hvis du ser en fejl, kopier den og send til mig

### Tjek 4: Se Network Requests
- Åbn DevTools → Network tab
- Reload siden
- Find request til `/api/folders?space_id=...`
- Klik på den og se Response
- Verificer at den returnerer dine mapper

---

## 📊 Hvad Der Sker Nu

1. **Appen loader** i Storyblok iframe
2. **Storyblok sender space info** til appen via App Bridge
3. **Appen ekstrahere Space ID** fra space info
4. **Appen kalder `/api/folders?space_id=288946579053471`**
5. **Server bruger access token** til at hente mapper fra Storyblok Management API
6. **Mapper vises i dropdown** sorteret alfabetisk

---

Held og lykke! 🚀
