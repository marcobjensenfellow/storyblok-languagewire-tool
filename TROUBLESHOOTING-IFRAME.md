# Troubleshooting: App åbner i helt vindue i stedet for iframe

## 🔍 Problem
Når du klikker på Tool plugin i Storyblok, åbner den i et helt nyt vindue i stedet for at blive vist i et iframe i sidebaren.

## ✅ Løsning: Tjek disse punkter

### 1. Verificer Plugin Type i Storyblok

**VIGTIGT**: Appen SKAL være oprettet som en **Tool Plugin**, ikke en Space Plugin.

**Sådan tjekker du:**

1. Gå til: https://app.storyblok.com/#!/me/partner
2. Find din "Language Wire Translation Tool" app
3. Klik på appen for at åbne indstillinger
4. **Tjek at der står "Tool Plugin"** øverst

**Hvis der står "Space Plugin":**
- Du skal slette appen og oprette en ny
- Når du opretter ny app, vælg **"Tool Plugin"** (IKKE "Space Plugin")

---

### 2. Verificer URLs er Korrekte

**Index URL SKAL have trailing slash:**
```
✅ KORREKT: https://storyblok-languagewire-tool-kni5.vercel.app/
❌ FORKERT: https://storyblok-languagewire-tool-kni5.vercel.app
```

**Redirect URL:**
```
https://storyblok-languagewire-tool-kni5.vercel.app/api/connect/callback
```

---

### 3. Verificer App Bridge er Aktiveret

I din app indstillinger:
1. Find "App Bridge" eller "Authentication" section
2. ✅ Aktivér **"Use App Bridge"**
3. Gem ændringerne

---

### 4. Verificer Plugin Location

I app indstillingerne, tjek **"Plugin Location"**:
- ✅ Skal være sat til: **"Tool"** eller **"Visual Editor Tool"**
- ❌ IKKE: "App" eller "Navigation"

---

### 5. Re-install Appen i Dit Space

Efter at have rettet ovenstående:

1. Gå til dit Storyblok space
2. Settings → Apps
3. Find "Language Wire Translation Tool"
4. Hvis den allerede er installeret:
   - Klik **"Uninstall"**
   - Vent 10 sekunder
   - Klik **"Install"** igen
5. Hvis ikke installeret:
   - Klik **"Install"**

---

### 6. Clear Browser Cache

1. Åbn DevTools (F12 eller Cmd+Option+I)
2. Højreklik på reload knappen
3. Vælg **"Empty Cache and Hard Reload"**
4. Eller gå til Settings → Privacy → Clear browsing data

---

## 🎯 Forventet Resultat

Efter at have rettet ovenstående:

1. Åbn en story i Storyblok
2. Klik på **Tools** 🧰 i højre sidebar
3. Klik på "Language Wire Translation Tool"
4. **Appen skal nu åbne i et iframe panel i højre side** (IKKE i et nyt vindue)

---

## 🔧 Alternativ Løsning: Opret App Forfra

Hvis ovenstående ikke virker, opret appen forfra:

### Trin 1: Slet Eksisterende App
1. Gå til: https://app.storyblok.com/#!/me/partner
2. Find "Language Wire Translation Tool"
3. Klik **"Delete"** eller **"Remove"**

### Trin 2: Opret Ny App
1. Klik **"Create App"**
2. **App Type**: Vælg **"Tool Plugin"** ⚠️ VIGTIGT!
3. **Name**: `Language Wire Translation Tool`
4. Klik "Create"

### Trin 3: Konfigurer URLs
Under "General" eller "Configuration":

**Plugin URL (Index URL):**
```
https://storyblok-languagewire-tool-kni5.vercel.app/
```
(Husk trailing slash!)

**OAuth Redirect URL:**
```
https://storyblok-languagewire-tool-kni5.vercel.app/api/connect/callback
```

### Trin 4: Konfigurer Scopes
Aktivér:
- ✅ `read_content`
- ✅ `write_content`
- ✅ `manage_stories`

### Trin 5: Aktivér App Bridge
- Find "App Bridge" setting
- ✅ Toggle ON
- Gem

### Trin 6: Konfigurer Plugin Location
- Find "Plugin Location" eller "Where to show"
- Vælg: **"Tool"** eller **"Visual Editor Tool"**
- Gem

### Trin 7: Gem Client Credentials
- Kopier **Client ID**
- Kopier **Client Secret**
- Opdater dem i Vercel Environment Variables
- Re-deploy appen i Vercel

### Trin 8: Installer i Space
1. Gå til dit space → Settings → Apps
2. Find "Language Wire Translation Tool"
3. Klik **"Install"**

---

## 📸 Hvad Du Skal Se

**KORREKT (iframe i sidebar):**
- Tool plugin åbner i et panel i højre side af editoren
- Du kan stadig se story editoren til venstre
- Plugin'et er embeded i et iframe

**FORKERT (helt vindue):**
- Hele browseren navigerer til plugin URL'en
- Du kan ikke se story editoren længere
- Det ser ud som en helt separat side

---

## 🆘 Stadig Problemer?

Hvis det stadig ikke virker:

1. **Tjek Console for fejl:**
   - Åbn DevTools (F12)
   - Gå til Console tab
   - Kopi eventuelle røde fejlmeddelelser

2. **Tjek Network tab:**
   - Åbn DevTools → Network tab
   - Reload siden
   - Se om der er failing requests

3. **Kontakt mig:**
   - Send screenshots af:
     - Storyblok app settings
     - Browser console fejl
     - Hvad der sker når du klikker på tool

Held og lykke! 🚀
