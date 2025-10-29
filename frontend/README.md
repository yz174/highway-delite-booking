# Frontend - Highway Delite

React + TypeScript + Vite frontend for the Highway Delite travel booking application.

## 📋 Overview

This is a modern, responsive web application built with React 19, TypeScript, and TailwindCSS. It provides an intuitive interface for users to browse travel experiences, check availability, and make bookings.

## 🏗️ Architecture

### Project Structure

```
frontend/
├── src/
│   ├── components/          # Reusable UI components
│   │   ├── Button.tsx       # Button component with variants
│   │   ├── ExperienceCard.tsx
│   │   ├── PriceSummary.tsx
│   │   ├── ErrorBoundary.tsx
│   │   ├── ErrorMessage.tsx
│   │   ├── ErrorAlert.tsx
│   │   ├── EmptyState.tsx
│   │   └── Header.tsx
│   │
│   ├── pages/               # Page components
│   │   ├── HomePage.tsx     # Experience listing and search
│   │   ├── ExperienceDetailsPage.tsx  # Details, date/time selection
│   │   ├── CheckoutPage.tsx # Booking form and payment
│   │   └── ConfirmationPage.tsx  # Booking confirmation
│   │
│   ├── hooks/               # Custom React hooks
│   │   ├── useExperiences.ts
│   │   ├── useExperienceDetails.ts
│   │   ├── useBooking.ts
│   │   └── usePromoCode.ts
│   │
│   ├── services/            # API services
│   │   └── api.ts           # Axios client and API functions
│   │
│   ├── types/               # TypeScript types
│   │   └── index.ts
│   │
│   ├── App.tsx              # Main app with routing
│   ├── main.tsx             # Entry point
│   └── index.css            # Global styles
│
├── public/                  # Static assets
├── .env                     # Environment variables
├── .env.example             # Environment template
├── index.html               # HTML template
├── package.json
├── tailwind.config.js       # TailwindCSS configuration
├── tsconfig.json            # TypeScript configuration
└── vite.config.ts           # Vite configuration
```

## 🚀 Getting Started

### Prerequisites

- Node.js 18+
- npm or yarn

### Installation

```bash
# Install dependencies
npm install

# Copy environment file
cp .env.example .env

# Start development server
npm run dev
```

The app will be available at `http://localhost:5173`

## 🔧 Configuration

### Environment Variables

Create a `.env` file:

```env
VITE_API_URL=http://localhost:3000/api
```

**Note**: All Vite environment variables must be prefixed with `VITE_`

### TailwindCSS Configuration

The app uses a custom TailwindCSS configuration with:

**Colors:**
- Primary: Yellow (#FCD34D) for CTAs and highlights
- Secondary: Gray shades for text and backgrounds
- Success: Green for confirmations
- Error: Red for errors

**Breakpoints:**
- sm: 640px
- md: 768px
- lg: 1024px
- xl: 1280px

**Typography:**
- Font: Inter (system fallback)
- Sizes: xs to 3xl

## 📦 Components

### Button

Reusable button component with variants and sizes.

```tsx
<Button 
  variant="primary" // primary | secondary | outline
  size="md"         // sm | md | lg
  onClick={handleClick}
  disabled={false}
>
  Click Me
</Button>
```

### ExperienceCard

Displays experience summary with image, name, location, and price.

```tsx
<ExperienceCard
  id="uuid"
  name="Kayaking"
  location="Udupi"
  description="..."
  imageUrl="https://..."
  price={999}
  onViewDetails={handleViewDetails}
/>
```

### PriceSummary

Shows booking price breakdown.

```tsx
<PriceSummary
  experienceName="Kayaking"
  date="Oct 30"
  time="09:00"
  quantity={2}
  basePrice={999}
  discount={100}
  taxes={54}
  total={952}
/>
```

### ErrorBoundary

Catches React errors and displays fallback UI.

```tsx
<ErrorBoundary>
  <App />
</ErrorBoundary>
```

### ErrorMessage

Displays error messages with optional retry.

```tsx
<ErrorMessage
  message="Failed to load experiences"
  onRetry={handleRetry}
/>
```

## 🪝 Custom Hooks

### useExperiences

Fetches and manages experience list.

```tsx
const { experiences, loading, error, fetchExperiences } = useExperiences();
```

### useExperienceDetails

Fetches single experience with availability.

```tsx
const { experience, loading, error } = useExperienceDetails(id);
```

### useBooking

Handles booking creation.

```tsx
const { createBooking, loading, error } = useBooking();

await createBooking({
  experienceId,
  slotId,
  date,
  time,
  quantity,
  customerName,
  customerEmail,
  agreedToTerms: true
});
```

### usePromoCode

Validates promo codes.

```tsx
const { discount, validatePromoCode, loading, error } = usePromoCode();

const result = await validatePromoCode('SAVE10', subtotal);
```

## 🎨 Styling

### TailwindCSS Utilities

The app uses utility-first CSS with TailwindCSS:

```tsx
// Responsive grid
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">

// Button styling
<button className="bg-primary text-black px-6 py-3 rounded-lg hover:bg-primary-dark">

// Form input
<input className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary">
```

### Responsive Design

Mobile-first approach with breakpoints:

```tsx
// Mobile: full width
// Tablet: 2 columns
// Desktop: 3 columns
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
```

## 🛣️ Routing

React Router v7 is used for navigation:

```tsx
const router = createBrowserRouter([
  { path: '/', element: <HomePage /> },
  { path: '/experience/:id', element: <ExperienceDetailsPage /> },
  { path: '/checkout', element: <CheckoutPage /> },
  { path: '/confirmation', element: <ConfirmationPage /> }
]);
```

### Navigation

```tsx
// Programmatic navigation
const navigate = useNavigate();
navigate('/checkout', { state: bookingData });

// Link component
<Link to="/experience/123">View Details</Link>
```

## 📡 API Integration

### API Client

Axios instance configured in `services/api.ts`:

```tsx
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  headers: {
    'Content-Type': 'application/json'
  }
});
```

### API Functions

```tsx
// Get all experiences
const experiences = await getExperiences(searchQuery);

// Get experience details
const experience = await getExperienceById(id);

// Create booking
const booking = await createBooking(bookingData);

// Validate promo code
const discount = await validatePromoCode(code, subtotal);
```

## 🧪 Testing

### Manual Testing

Use browser DevTools to test:

1. **Responsive Design**: Toggle device toolbar (Ctrl+Shift+M)
2. **Network**: Monitor API calls in Network tab
3. **Console**: Check for errors in Console tab
4. **React DevTools**: Inspect component state

### Test Scenarios

1. Browse experiences
2. Search for experiences
3. View experience details
4. Select date and time
5. Adjust quantity
6. Apply promo code
7. Fill checkout form
8. Submit booking
9. View confirmation

## 🔍 Debugging

### Common Issues

**1. API Connection Error**

Check:
- Backend is running
- VITE_API_URL is correct
- CORS is configured

**2. Environment Variables Not Loading**

- Restart dev server after changing `.env`
- Ensure variables are prefixed with `VITE_`

**3. Styles Not Applying**

- Check TailwindCSS classes are correct
- Verify `index.css` imports Tailwind directives
- Clear browser cache

### Debug Tools

```tsx
// Log component renders
useEffect(() => {
  console.log('Component rendered', { state });
}, [state]);

// Log API responses
api.interceptors.response.use(response => {
  console.log('API Response:', response);
  return response;
});
```

## 📦 Build & Deployment

### Development Build

```bash
npm run dev
```

### Production Build

```bash
# Build
npm run build

# Preview build
npm run preview
```

Build output goes to `dist/` directory.

### Deployment

**Vercel:**
```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel
```

**Netlify:**
```bash
# Install Netlify CLI
npm i -g netlify-cli

# Deploy
netlify deploy --prod
```

**Environment Variables:**
Set `VITE_API_URL` in deployment platform settings.

## 🎯 Performance

### Optimization Tips

1. **Code Splitting**: Use React.lazy() for route-based splitting
2. **Image Optimization**: Use WebP format, lazy loading
3. **Memoization**: Use useMemo/useCallback for expensive operations
4. **Bundle Size**: Analyze with `npm run build -- --analyze`

### Current Optimizations

- Vite for fast HMR
- TailwindCSS purging unused styles
- React 19 automatic batching
- Axios request/response interceptors

## 📚 Resources

- [React Documentation](https://react.dev/)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)
- [Vite Guide](https://vitejs.dev/guide/)
- [TailwindCSS Docs](https://tailwindcss.com/docs)
- [React Router](https://reactrouter.com/)
- [Axios Documentation](https://axios-http.com/)

## 🤝 Contributing

When contributing:

1. Follow existing code style
2. Use TypeScript types
3. Write meaningful component names
4. Keep components small and focused
5. Test responsive design
6. Check for console errors

## 📝 Scripts Reference

| Command | Description |
|---------|-------------|
| `npm run dev` | Start development server |
| `npm run build` | Build for production |
| `npm run preview` | Preview production build |
| `npm run lint` | Run ESLint |
