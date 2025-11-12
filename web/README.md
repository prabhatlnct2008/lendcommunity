# LendCommunity Frontend

React + TypeScript frontend for the LendCommunity platform.

## Tech Stack

- **React 18** - UI library
- **TypeScript** - Type safety
- **Vite** - Build tool and dev server
- **CSS Modules** - Component-scoped styling

## Getting Started

### Prerequisites

- Node.js 18+ and npm
- Backend API running on `http://localhost:8000`

### Installation

```bash
cd web
npm install
```

### Development

Start the dev server:

```bash
npm run dev
```

The app will be available at `http://localhost:3000` with API proxying to the backend.

### Build

Create a production build:

```bash
npm run build
```

Preview the production build:

```bash
npm run preview
```

## Project Structure

```
web/
├── src/
│   ├── app/                 # App routing and providers
│   ├── shared/              # Shared components and utilities
│   │   ├── components/      # Reusable UI components
│   │   └── hooks/           # Custom React hooks
│   └── modules/
│       └── landing/         # Landing page module
│           ├── pages/       # Page components
│           ├── components/  # Landing-specific components
│           ├── api/         # API client and types
│           └── state/       # State management (if needed)
├── public/                  # Static assets
└── index.html              # HTML entry point
```

## Features

### Landing Page Module

Implements the complete landing experience with:

- **Hero Section**: Headline, subheadline, and primary/secondary CTAs
- **Email Capture Form**: Validation, honeypot, UTM tracking, 24h duplicate suppression
- **Teaser Grid**: 3 startup cards with mask-after-N logic (lock icon on hidden cards)
- **Testimonials**: Customer testimonials in responsive grid
- **Exit Intent Modal**: Triggered on mouse exit with gating support
- **Analytics Integration**: Automatic event tracking for impressions, CTA clicks, email submissions

### Responsive Design

Mobile-first responsive design following the grid system:

- **xs/sm** (<640px): Single column, 16px padding
- **md** (≥768px): 2 columns, 24px padding
- **lg** (≥1024px): 3 columns (teaser grid), 32px padding
- **xl** (≥1280px): Max container 1200px

### Accessibility

- Semantic HTML with proper heading hierarchy
- ARIA labels and roles throughout
- Keyboard navigation support
- Focus management (modal focus trap)
- Screen reader friendly
- WCAG AA contrast ratios

### Performance

- Code splitting by route
- Lazy loading for non-critical resources
- ETag/304 caching support
- Optimized bundle size
- Fast initial page load

## API Integration

The app communicates with the backend API at `/landing/v1`:

- `GET /landing/v1/page` - Fetch landing page data
- `GET /landing/v1/exit-intent` - Get exit intent modal content
- `POST /landing/v1/join` - Submit email capture
- `POST /landing/v1/cta-click` - Track CTA clicks

Session management and UTM tracking are handled automatically by the API client.

## Development Guidelines

### Component Structure

Each component follows this pattern:

```
ComponentName/
├── ComponentName.tsx  # React component
└── ComponentName.css  # Scoped styles
```

### Type Safety

- All props are typed with TypeScript interfaces
- API types match backend Pydantic models
- No `any` types in production code

### Styling

- CSS custom properties (variables) for theming
- BEM-like naming convention for classes
- Mobile-first responsive design
- 8px baseline spacing grid

### Accessibility

- Use semantic HTML elements
- Include ARIA attributes where needed
- Ensure keyboard navigation works
- Test with screen readers
- Maintain color contrast ratios

## Browser Support

- Chrome/Edge (last 2 versions)
- Firefox (last 2 versions)
- Safari (last 2 versions)
- Mobile browsers (iOS Safari, Chrome Android)

## Environment Variables

The frontend uses Vite's environment variable system. Create a `.env.local` file:

```env
VITE_API_BASE_URL=http://localhost:8000
```

## Testing

Run linter:

```bash
npm run lint
```

## Deployment

The frontend can be deployed to any static hosting service:

1. Build the app: `npm run build`
2. Deploy the `dist/` directory
3. Configure API proxy or CORS on your backend

Popular options:
- Vercel
- Netlify
- AWS S3 + CloudFront
- GitHub Pages

## Contributing

When adding new features:

1. Follow the module structure
2. Keep components focused and reusable
3. Write TypeScript interfaces for all data
4. Ensure responsive design works
5. Test accessibility with keyboard and screen reader
6. Follow the existing code style

## License

[Same as main project]
