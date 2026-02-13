# Deployment Steps - Næste Trin

## ✅ Hvad du har gjort indtil nu:
- ✅ Kode på GitHub
- ✅ Deployed til Vercel: https://storyblok-languagewire-tool-kni5.vercel.app

---

## 📝 Trin 1: Opret Storyblok App

### 1.1 Gå til Storyblok Partner Portal
- Åbn: https://app.storyblok.com/#!/me/partner
- Log ind hvis nødvendigt

### 1.2 Opret ny App
1. Klik på **"Create App"** eller **"New App"**
2. Udfyld:
   - **App Name**: `Language Wire Translation Tool`
   - **Slug**: `languagewire-translation` (automatisk)
   - **Plugin Type**: Vælg **"Tool Plugin"** ⚠️ VIGTIGT!

### 1.3 Konfigurer URLs
Under "Settings" eller "Configuration":

- **Index URL** (Plugin URL):
  ```
  https://storyblok-languagewire-tool-kni5.vercel.app/
  ```

- **Redirect URL** (OAuth Callback):
  ```
  https://storyblok-languagewire-tool-kni5.vercel.app/api/connect/callback
  ```

### 1.4 Vælg Scopes (Permissions)
Aktivér følgende scopes:
- ✅ `read_content` - Læse story indhold
- ✅ `write_content` - Skrive story indhold
- ✅ `manage_stories` - Oprette og administrere stories

### 1.5 Aktiver App Bridge
- Find "App Bridge" setting
- ✅ Aktivér **"Use App Bridge"**
- Gem ændringerne

### 1.6 Gem Client Credentials
Efter oprettelse får du vist:
- **Client ID**: `cb.XXXXX-XXXXX-XXXXX`
- **Client Secret**: `XXXXX-XXXXX-XXXXX`

⚠️ **VIGTIG**: Kopier begge værdier - du skal bruge dem i næste trin!

---

## 🔐 Trin 2: Tilføj Miljøvariabler i Vercel

### 2.1 Gå til Vercel Project Settings
1. Åbn: https://vercel.com/dashboard
2. Klik på dit projekt: `storyblok-languagewire-tool`
3. Klik på **"Settings"** tab
4. Klik på **"Environment Variables"** i venstre menu

### 2.2 Tilføj Følgende Variabler

Klik **"Add New"** for hver variabel:

**Variable 1:**
- Key: `CLIENT_ID`
- Value: `[Indsæt Client ID fra Storyblok]`
- Environment: ✅ Production, ✅ Preview, ✅ Development

**Variable 2:**
- Key: `CLIENT_SECRET`
- Value: `[Indsæt Client Secret fra Storyblok]`
- Environment: ✅ Production, ✅ Preview, ✅ Development

**Variable 3:**
- Key: `BASE_URL`
- Value: `https://storyblok-languagewire-tool-kni5.vercel.app`
- Environment: ✅ Production, ✅ Preview, ✅ Development

### 2.3 Re-deploy Appen
Efter at have tilføjet miljøvariabler:

1. Gå til **"Deployments"** tab i Vercel
2. Find den seneste deployment
3. Klik **"⋯"** (three dots) → **"Redeploy"**
4. Vælg **"Use existing Build Cache"**
5. Klik **"Redeploy"**
6. Vent 1-2 minutter

---

## 🎯 Trin 3: Installer App i Dit Storyblok Space

### 3.1 Gå til Dit Space
1. Åbn: https://app.storyblok.com
2. Vælg det space hvor du vil bruge appen

### 3.2 Gå til Apps
1. Klik på **"Settings"** (tandhjul ikon) i venstre menu
2. Klik på **"Apps"**

### 3.3 Find og Installer Din App
1. Scroll ned til "Available Apps" eller søg efter "Language Wire"
2. Find **"Language Wire Translation Tool"**
3. Klik **"Install"**
4. Godkend de permissions den beder om
5. Klik **"Install"** eller **"Authorize"**

---

## 🧪 Trin 4: Test Appen

### 4.1 Åbn en Story
1. Gå til **"Content"** i dit space
2. Åbn en vilkårlig story (eller opret en ny)

### 4.2 Åbn Tool Plugin
1. I story editoren, find **"Tools"** panelet (normalt i højre side)
2. Klik på værktøjskassen ikonet 🧰
3. Find **"Language Wire Translation Tool"**
4. Klik på den

### 4.3 Forventet Resultat
Du skulle nu se:
- ✅ Info box med nuværende side navn
- ✅ Dropdown med sprog (Dansk, English, Deutsch, etc.)
- ✅ Dropdown med mapper (Home, Produkter, etc.)
- ✅ "Translate page" knap

---

## 🎉 Hvis Alt Virker

Tillykke! Din Storyblok Language Wire Tool er nu live og klar til brug!

### Næste Steps for Produktion:

1. **Få Language Wire API credentials**
   - Kontakt Language Wire support
   - Få `API_KEY` og `API_URL`

2. **Tilføj til Vercel Environment Variables**:
   - `LANGUAGE_WIRE_API_KEY`
   - `LANGUAGE_WIRE_API_URL`

3. **Få en udvikler til at implementere API integration**
   - Se `README.md` for kode eksempler
   - Implementer i `server/api/translate.post.ts`
   - Implementer i `server/api/webhook.post.ts`

---

## ❌ Troubleshooting

### Problem: Appen loader ikke i Storyblok
- Tjek at Index URL er korrekt i Storyblok app settings
- Tjek at App Bridge er aktiveret
- Tjek browser console for fejl (højreklik → Inspect → Console)

### Problem: "Authentication failed"
- Tjek at CLIENT_ID og CLIENT_SECRET er korrekte i Vercel
- Tjek at Redirect URL matcher præcist
- Re-deploy efter at have ændret miljøvariabler

### Problem: "Not authorized"
- Tjek at du har valgt de rigtige scopes (read_content, write_content, manage_stories)
- Geninstaller appen i dit space

### Problem: Blank page
- Åbn browser console (F12) og tjek for JavaScript fejl
- Tjek Vercel deployment logs for build fejl

---

## 📞 Support

Hvis du sidder fast:
- Tjek Vercel deployment logs: https://vercel.com/dashboard
- Tjek Storyblok app logs i Partner Portal
- Læs Storyblok docs: https://www.storyblok.com/docs/plugins/tool

Held og lykke! 🚀
