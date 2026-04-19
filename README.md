# 🎴 KAST User Card Generator

A professional, interactive user card generator with a premium cyberpunk/digital aesthetic. Create personalized cards with custom avatars, dynamic roles, bios, and animated backgrounds, then export them in high-quality PNG format.

## ✨ Key Features

### 🎨 Customization
- 🖼️ **Custom Avatar Upload** – Supports any image with automatic scaling and fitting.
- 📅 **Join Date Picker** – Built-in Flatpickr calendar with localization.
- 📝 **Bio Field** – Personal description text.
- 🏷️ **Role System** – Select from 6 predefined tags (`@Staff`, `@OG`, `@KAST Evangelist`, etc.) with dynamic gradient styling.
- 🌓 **Text Theme Toggle** – Switch between `Dark (White/Cyan)` and `Light (Black/Teal)` for perfect readability on any background.

### 🃏 Background Gallery
- 12 premium card designs (Bitcoin, Solana, Pengu, VISA Platinum/Business/Illuma, etc.).
- Instant background switching without page reload.
- Adaptive scaling with rounded corners and aspect ratio preservation.

### 🎬 Visual Effects (Canvas API)
- 🌧️ **Animated Background** – Digital rain/particles that react to cursor movement.
- ⚡ **Glitch Effects** – Random visual distortions during card generation.
- 📡 **Scan-Line Animation** – Animated scanning beam during rendering.
- 📐 **3D Tilt Effect** – Interactive card tilt on mouse hover.
- ✨ **Dynamic Light Reflection** – Passing highlight overlay for a premium feel.
- 📱 **Auto QR Code** – Automatically generates a QR code linking to `kast.xyz`.

### 💾 Export & UX
- 📥 **One-Click PNG Export** – Save the rendered card instantly.
- 📱 **Fully Responsive** – Optimized for desktop, tablet, and mobile.
- 🔊 **Audio Feedback** – Click and generation sounds for better UX.

## 🛠 Tech Stack

| Technology | Purpose |
|------------|---------|
| HTML5 / CSS3 | Layout, Glassmorphism, gradients, animations |
| Vanilla JS | Logic, state management, event handling |
| Canvas API | Card rendering, particles, clipping masks, export |
| Flatpickr | Date selection |
| GitHub Raw / WebP/PNG | Background image hosting |
| Vercel | CI/CD & deployment |

## 🚀 How to Use

1. Upload an avatar via the `Choose Avatar` button.
2. Enter a username, pick a join date, and write a short bio.
3. Select desired roles from the checklist.
4. Choose a text theme (`Dark` or `Light`) to match your selected background.
5. Click a card in the gallery at the top to apply the background.
6. Press **Generate Card** to trigger the rendering animation.
7. Click **Download** to save the final PNG.

## 🌐 Deploy to Vercel

1. Create a new GitHub repository and push the project files.
2. Go to [Vercel Dashboard](https://vercel.com) → `Add New` → `Project`.
3. Import your repository and click `Deploy`.
4. Your site will be live automatically (~30 seconds).

> 💡 **Optimization Tip:** Background images are hosted in the repository. For faster loading, convert them to `WebP` format and compress each to `~1 MB`.

## 👨‍ Author & License

© 2026 [kast.xyz](https://kast.xyz)  
Developer: [@kaye_moni](https://x.com/kaye_moni)  
Built for community and educational purposes.
