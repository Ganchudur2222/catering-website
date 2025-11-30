# Вэбсайтаа Интернетэд Байршуулах Заавар

## Шаардлагатай зүйлс:
- GitHub account
- Vercel account (GitHub-ээр нэвтрэх боломжтой)

## Алхам 1: GitHub Repository үүсгэх

1. **GitHub.com** руу орж нэвтэрнэ үү
2. **New repository** товч дарна
3. Repository нэр өгнө: `catering-website`
4. **Public** эсвэл **Private** сонгоно
5. **Create repository** дарна

## Алхам 2: Кодоо GitHub руу оруулах

Терминал нээж доорх командуудыг дараалалтай ажиллуулна:

```bash
cd "C:\Users\Dell AIO 7700\.gemini\antigravity\scratch\catering_service"

# Git эхлүүлэх
git init

# Бүх файлуудыг нэмэх
git add .

# Commit хийх
git commit -m "Initial commit"

# GitHub repository холбох (ТАНЫ repository URL-ээр солино)
git remote add origin https://github.com/ТАНЫ_USERNAME/catering-website.git

# Push хийх
git branch -M main
git push -u origin main
```

## Алхам 3: Vercel дээр Deploy хийх

1. **Vercel.com** руу орно уу: https://vercel.com
2. **Sign Up** эсвэл **Login** (GitHub-ээр нэвтэрнэ)
3. **Add New Project** товч дарна
4. **Import Git Repository** хэсэгт өөрийн `catering-website` repository-г сонгоно
5. **Framework Preset**: Vite сонгогдсон эсэхийг шалгана
6. **Environment Variables** хэсэгт доорх хоёр зүйлийг нэмнэ:
   ```
   VITE_SUPABASE_URL=https://qmjkwsumdkufqbwwvxby.supabase.co
   VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFtamt3c3VtZGt1ZnFid3d2eGJ5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjQ0ODU5MjAsImV4cCI6MjA4MDA2MTkyMH0.tphhmoHpHMUlEsLIeLyzerm3aysDpvGjSCagHEkqHjE
   ```
7. **Deploy** товч дарна

## Алхам 4: Хүлээх

2-3 минутын дараа таны вэбсайт бэлэн болно!

Vercel танд дараах хэлбэрийн линк өгнө:
```
https://catering-website-xxxxx.vercel.app
```

## Өөрийн домайн холбох (Сонголттой)

Хэрэв та өөрийн домайн (жишээ нь: `allcatering.mn`) байгаа бол:

1. Vercel дээрх төслийн **Settings** руу орно
2. **Domains** хэсэг рүү орно
3. Өөрийн домайн нэмж, заавар дагана

---

## Шинэчлэлт хийх

Ирээдүйд кодоо өөрчлөхөд:

```bash
git add .
git commit -m "Өөрчлөлтийн тайлбар"
git push
```

Vercel автоматаар шинэ хувилбарыг deploy хийнэ!

---

## Бусад сонголтууд:

- **Netlify**: Vercel-тэй төстэй, мөн үнэгүй
- **GitHub Pages**: Зөвхөн статик сайтад (backend байхгүй)
- **Railway/Render**: Backend-тэй төслүүдэд тохиромжтой

Танд ямар нэг асуулт байвал асуугаарай!
