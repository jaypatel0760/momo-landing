# MOMO — Enter the MOMO Dimension

A fictional 3D interactive crypto-themed website demonstrating advanced frontend engineering, 3D graphics, and motion design.

## Project Overview

MOMO is a demo landing page for a fictional digital universe combining crypto, digital collectibles, gaming, and community. The site features:

- **Hero Section**: Full-screen 3D animated mascot with mouse parallax and scroll response
- **Interactive Universe**: Auto-rotating camera, floating islands, portals, crystalline structures, and clickable hotspots
- **Token Display**: Procedural 3D rotating coin with emissive rings and companion mascot
- **Roadmap**: Animated timeline with geometric visualizations
- **Responsive Design**: Optimized for desktop, tablet, and mobile

## Technology Stack

- **Framework**: Next.js 16 (App Router)
- **Language**: TypeScript 5
- **Styling**: Tailwind CSS 4
- **3D Graphics**: Three.js via React Three Fiber (@react-three/fiber) + @react-three/drei
- **Animation**: Framer Motion
- **Icons**: Lucide React
- **Fonts**: Syne (display) + Space Grotesk (UI) via next/font
- **Linting**: ESLint 9 with Next.js config

## Local Development

```bash
# Install dependencies
npm install

# Start development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Build for Production

```bash
# Run linting
npm run lint

# Build for production
npm run build

# Preview production build locally
npm run start
```

## Deployment

### Vercel (Recommended)

1. Push this repository to GitHub
2. Import the repository in Vercel
3. Vercel will auto-detect Next.js and configure build settings
4. Deploy

**Build Command**: `npm run build`  
**Output Directory**: `.next` (default)  
**Install Command**: `npm install`

No environment variables are required.

### Manual Deployment

```bash
npm run build
npm run start
```

## Project Structure

```
src/
├── app/
│   ├── layout.tsx          # Root layout with metadata & fonts
│   ├── page.tsx            # Main page composition
│   └── globals.css         # Global styles & Tailwind theme
├── components/
│   ├── Navbar.tsx          # Sticky glass nav with mobile menu
│   ├── Hero.tsx            # Hero with 3D mascot
│   ├── About.tsx           # 3-card feature section
│   ├── Universe.tsx        # Interactive 3D universe scene
│   ├── Ecosystem.tsx       # 4-pillar cards with 3D tilt
│   ├── Token.tsx           # 3D token + companion mascot
│   ├── Roadmap.tsx         # Animated timeline
│   ├── Community.tsx       # Stats + social CTAs
│   └── Footer.tsx          # Links & disclaimer
├── components/3d/
│   ├── MOMOMascot.tsx      # Hero mascot (procedural)
│   ├── Token3D.tsx         # Rotating token with rings
│   ├── TokenMascot.tsx     # Small companion mascot
│   ├── UniverseScene.tsx   # Main universe 3D scene
│   └── ParticleField.tsx   # Reusable particle system
└── lib/
    └── constants.ts        # All content data
```

## Performance Notes

- All 3D assets are procedural (no external models)
- Dynamic imports for all 3D components (`ssr: false`)
- Geometry/material disposal in cleanup effects
- Reduced motion support via `prefers-reduced-motion`
- Device pixel ratio limited via Canvas `gl` props
- Static export compatible (`output: 'export'` not configured but build is static)

## Browser Support

- Chrome/Edge (latest)
- Firefox (latest)
- Safari (latest)
- Mobile Safari/Chrome

WebGL2 required for 3D content. Graceful degradation for non-WebGL environments.

## Disclaimer

**This is a fictional demonstration project.** $MOMO has no monetary value and is not an investment or offer to sell securities. All content is for demonstration purposes only.

## License

MIT License - Feel free to use as a reference or starting point for your own projects.