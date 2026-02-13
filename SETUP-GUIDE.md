# Setup Guide - Storyblok Language Wire Tool

## 📋 Hvad du skal gøre

### Trin 1: Upload til GitHub

1. **Gå til GitHub**
   - Åbn https://github.com/new i din browser
   - Log ind med din GitHub konto

2. **Opret nyt repository**
   - Repository navn: `storyblok-languagewire-tool`
   - Beskrivelse: `Storyblok Tool Plugin for Language Wire translation`
   - Vælg **Public** (eller Private hvis du foretrækker det)
   - ❌ **VIGTIGT**: Lad ALLE checkboxes være tomme (ingen README, .gitignore eller license)
   - Klik "Create repository"

3. **Push din kode**
   - GitHub viser nu en side med instruktioner
   - Kopier kommandoerne under "…or push an existing repository from the command line"
   - De ser sådan ud:
   ```bash
   git remote add origin https://github.com/DIT-BRUGERNAVN/storyblok-languagewire-tool.git
   git branch -M main
   git push -u origin main
   ```
   - Åbn Terminal på din Mac
   - Gå til projekt mappen:
   ```bash
   cd /Users/marcobjorslevjensen/Desktop/storyblok-languagewire-tool
   ```
   - Indsæt de 3 kommandoer fra GitHub (brug dine egne fra GitHub siden!)
   - Tryk Enter

✅ **Nu er din kode på GitHub!**

---

### Trin 2: Gør appen tilgængelig (Deploy)

Du har flere muligheder for at hoste appen:

#### **Option A: Vercel (Anbefalet - Gratis & Nemt)**

1. Gå til https://vercel.com
2. Klik "Sign Up" og vælg "Continue with GitHub"
3. Klik "Import Project"
4. Vælg dit `storyblok-languagewire-tool` repository
5. Vercel detekterer automatisk at det er en Nuxt app
6. Klik "Deploy"
7. Når deployment er færdig, får du en URL som: `https://storyblok-languagewire-tool.vercel.app`

**Tilføj miljøvariabler i Vercel:**
- Gå til dit projekt i Vercel
- Klik "Settings" → "Environment Variables"
- Tilføj:
  - `CLIENT_ID` (fra Storyblok)
  - `CLIENT_SECRET` (fra Storyblok)
  - `BASE_URL` (din Vercel URL)

#### **Option B: Netlify**

1. Gå til https://netlify.com
2. Klik "Sign Up" og vælg "GitHub"
3. Klik "Add new site" → "Import an existing project"
4. Vælg dit repository
5. Build settings:
   - Build command: `npm run build`
   - Publish directory: `.output/public`
6. Klik "Deploy"

**Tilføj miljøvariabler i Netlify:**
- Gå til "Site settings" → "Environment variables"
- Tilføj samme variabler som til Vercel

#### **Option C: Railway**

1. Gå til https://railway.app
2. Sign up med GitHub
3. "New Project" → "Deploy from GitHub repo"
4. Vælg dit repository
5. Railway deployer automatisk
6. Tilføj miljøvariabler under "Variables"

---

### Trin 3: Konfigurer Storyblok App

Nu hvor din app er tilgængelig online:

1. **Gå til Storyblok Partner Portal**
   - https://app.storyblok.com/#!/me/partner

2. **Opret ny App**
   - Klik "Create App"
   - Navn: "Language Wire Translation Tool"
   - Type: Vælg **"Tool Plugin"**

3. **Konfigurer URLs**
   - **Index URL**: `https://din-app-url.vercel.app/`
   - **Redirect URL**: `https://din-app-url.vercel.app/api/connect/callback`

4. **Vælg Permissions (Scopes)**
   - ✅ `read_content`
   - ✅ `write_content`
   - ✅ `manage_stories`

5. **Aktiver App Bridge**
   - Gå til "Settings" i din app
   - Aktiver "Use App Bridge"

6. **Gem credentials**
   - Kopier `Client ID` og `Client Secret`
   - Gå til din hosting platform (Vercel/Netlify)
   - Tilføj dem som miljøvariabler
   - **VIGTIGT**: Re-deploy appen efter at have tilføjet variablerne

---

### Trin 4: Installer App i dit Storyblok Space

1. Gå til dit Storyblok space
2. Settings → Apps
3. Find din "Language Wire Translation Tool"
4. Klik "Install"
5. Godkend permissions

---

### Trin 5: Test Appen

1. Åbn en vilkårlig story i Storyblok
2. Klik på "Tool" ikonet i højre side
3. Find "Language Wire Translation Tool"
4. Du skulle nu se UI'et med dropdowns! 🎉

---

## 🔧 Fremtidige Steps

### Integration med Language Wire API

Når du er klar til at forbinde til Language Wire:

1. **Få API credentials fra Language Wire**
   - Kontakt Language Wire support
   - Få `API_KEY` og `API_URL`

2. **Tilføj til miljøvariabler**
   - I Vercel/Netlify/Railway
   - `LANGUAGE_WIRE_API_KEY=...`
   - `LANGUAGE_WIRE_API_URL=...`

3. **Implementer API integration**
   - En udvikler skal udkommentere TODO's i:
     - `server/api/translate.post.ts`
     - `server/api/webhook.post.ts`
   - Følg eksemplerne i README.md

---

## 📞 Hjælp og Support

Hvis du sidder fast:

- **GitHub Issues**: Opret et issue i dit repository
- **Vercel Support**: https://vercel.com/support
- **Storyblok Discord**: https://discord.gg/storyblok

---

## ✅ Checklist

- [ ] Oprettet GitHub repository
- [ ] Pushed kode til GitHub
- [ ] Deployed til Vercel/Netlify/Railway
- [ ] Oprettet Storyblok App i Partner Portal
- [ ] Tilføjet miljøvariabler
- [ ] Aktiveret App Bridge
- [ ] Installeret app i Storyblok space
- [ ] Testet UI'et i Storyblok editor

Held og lykke! 🚀
