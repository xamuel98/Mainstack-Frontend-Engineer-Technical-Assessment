# Mainstack Frontend Engineer Technical Assessment

A modern React application built for transaction management and financial analytics, featuring a comprehensive dashboard with wallet statistics, transaction filtering, and interactive charts.

## 🚀 Features

### Core Functionality

- **Transaction Management**: View, filter, and export transaction records
- **Wallet Statistics**: Real-time wallet balance, revenue, and payout tracking
- **Interactive Charts**: Visual representation of transaction data over time
- **Advanced Filtering**: Filter transactions by date range, type, and status
- **Responsive Design**: Optimized for desktop, tablet, and mobile devices
- **Data Export**: Export filtered transaction data to CSV format

### Key Components

- **Transaction Chart**: Interactive line chart showing transaction trends with date range support
- **Wallet Stats**: Comprehensive wallet balance and financial metrics display
- **Transaction List**: Paginated, filterable transaction records with detailed metadata
- **Filter Panel**: Advanced filtering interface with date pickers and multi-select options
- **App Header**: Navigation and user management interface

## 📱 Responsive Design Showcase

The application features a fully responsive design that adapts seamlessly across all device types and screen sizes:

### Desktop View

![Desktop View](https://res.cloudinary.com/dapdzcfse/image/upload/v1760953274/Screenshot_2025-10-20_at_10.30.21_AM_vwj6a0.png)
_Full desktop layout with comprehensive dashboard and detailed transaction analytics_

### Tablet View

![Tablet View](https://res.cloudinary.com/dapdzcfse/image/upload/v1760953274/Screenshot_2025-10-20_at_10.30.36_AM_y3hqpa.png)
_Optimized tablet layout with adjusted navigation and responsive grid system_

### Mobile View - Portrait

![Mobile Portrait](https://res.cloudinary.com/dapdzcfse/image/upload/v1760953274/Screenshot_2025-10-20_at_10.29.52_AM_vdoszs.png)
_Mobile-first design with collapsible navigation and touch-optimized interface_

### Mobile View - Landscape

![Mobile Landscape](https://res.cloudinary.com/dapdzcfse/image/upload/v1760953274/Screenshot_2025-10-20_at_10.30.49_AM_oa8ued.png)
_Landscape mobile layout maximizing screen real estate for data visualization_

### Responsive Features

- **Adaptive Navigation**: Collapsible sidebar that transforms into a mobile-friendly menu
- **Flexible Grid System**: Dynamic layout that adjusts based on screen size
- **Touch-Optimized Interface**: Enhanced touch targets and gestures for mobile devices
- **Responsive Typography**: Fluid text scaling for optimal readability across devices
- **Optimized Charts**: Interactive charts that maintain functionality on all screen sizes
- **Mobile-First Approach**: Progressive enhancement from mobile to desktop experiences

## 🛠️ Tech Stack

### Frontend Framework

- **React 18** - Modern React with hooks and concurrent features
- **TypeScript** - Type-safe development with full IntelliSense support
- **Vite** - Fast build tool and development server

### UI & Styling

- **Chakra UI** - Component library for consistent design system
- **Emotion** - CSS-in-JS styling solution
- **Framer Motion** - Animation library for smooth interactions
- **React Material Symbols** - Material Design icons

### Data Management

- **TanStack React Query** - Server state management and caching
- **Axios** - HTTP client for API communication
- **React Router DOM** - Client-side routing

### Charts & Visualization

- **Recharts** - Composable charting library for React
- **PrimeReact** - Additional UI components for data display

### Development & Testing

- **Vitest** - Fast unit testing framework
- **Testing Library** - React component testing utilities
- **ESLint** - Code linting and quality enforcement
- **Prettier** - Code formatting
- **Husky** - Git hooks for pre-commit checks

## 📋 Prerequisites

Before running this project, ensure you have the following installed:

- **Node.js** (version 18 or higher)
- **npm**, **yarn**, or **pnpm** package manager
- **Git** for version control

## 🚀 Getting Started

### 1. Clone the Repository

```bash
git clone <repository-url>
cd Mainstack-Technical-Assessment
```

### 2. Install Dependencies

```bash
# Using npm
npm install

# Using yarn
yarn install

# Using pnpm
pnpm install
```

### 3. Environment Setup

Create a `.env` file in the root directory (use `.env.example` as reference):

```bash
cp .env.example .env
```

### 4. Start Development Server

```bash
npm run dev
```

The application will be available at `http://localhost:5174`

## 📜 Available Scripts

### Development

- `npm run dev` - Start development server with hot reload
- `npm run preview` - Preview production build locally

### Building

- `npm run build` - Create production build
- `npm run check` - Type check without emitting files

### Testing

- `npm test` - Run all tests once
- `npm run test:watch` - Run tests in watch mode
- `npm run test:coverage` - Run tests with coverage report

### Code Quality

- `npm run lint` - Run ESLint
- `npm run lint:fix` - Fix ESLint issues automatically
- `npm run format` - Format code with Prettier
- `npm run format:check` - Check code formatting

## 📁 Project Structure

```
src/
├── components/           # Reusable UI components
│   ├── AppHeader/       # Application header and navigation
│   ├── Layout/          # Page layout components
│   ├── Transactions/    # Transaction-related components
│   ├── WalletStats/     # Wallet statistics components
│   └── ui/              # Generic UI components
├── hooks/               # Custom React hooks
│   ├── useTransactions.ts
│   ├── useWallet.ts
│   └── useUser.ts
├── lib/                 # Utility libraries
│   ├── api.ts          # API client configuration
│   ├── formatters.ts   # Data formatting utilities
│   └── csvExport.ts    # CSV export functionality
├── pages/              # Page components
│   ├── Revenue.tsx     # Main dashboard page
│   ├── Analytics.tsx   # Analytics page
│   └── CRM.tsx         # CRM page
├── types/              # TypeScript type definitions
├── utils/              # Utility functions
│   ├── transactionFilters.ts
│   ├── dateRangeCalculator.ts
│   └── fluidCalc.ts
├── __tests__/          # Test files
└── theme/              # Chakra UI theme configuration
```

## 🔌 API Integration

The application integrates with the Mainstack API endpoints:

### Endpoints

- `GET /user` - Fetch user profile information
- `GET /wallet` - Retrieve wallet balance and statistics
- `GET /transactions` - Get transaction history

### Data Flow

1. **React Query** manages server state and caching
2. **Custom hooks** abstract API calls and provide loading states
3. **TypeScript interfaces** ensure type safety for API responses
4. **Error boundaries** handle API failures gracefully

## 🧪 Testing

The project includes comprehensive testing setup:

### Test Structure

- **Component Tests**: UI component behavior and rendering
- **Hook Tests**: Custom hook functionality and state management
- **Utility Tests**: Helper function validation
- **Integration Tests**: Component interaction testing

### Running Tests

```bash
# Run all tests
npm test

# Watch mode for development
npm run test:watch

# Generate coverage report
npm run test:coverage
```

## 🎨 Key Features Deep Dive

### Transaction Chart

- Interactive line chart built with Recharts
- Supports date range filtering
- Displays flat line for periods with no transactions
- Responsive design with breakpoint-specific styling
- Real-time data updates

### Wallet Statistics

- Real-time balance tracking
- Revenue and payout calculations
- Loading states and error handling
- Responsive card layout

### Advanced Filtering

- Date range picker with preset options
- Multi-select transaction type filtering
- Status-based filtering (successful, pending, failed)
- Real-time filter application
- Filter state persistence

### Data Export

- CSV export functionality
- Filtered data export
- Formatted transaction data
- Download with proper file naming

## 🚀 Deployment

### Build for Production

```bash
npm run build
```

The build artifacts will be stored in the `dist/` directory.

## 📝 License

This project is part of the Mainstack Frontend Engineer Technical Assessment.

## 🔗 Links

- [Mainstack](https://mainstack.com)
- [React Documentation](https://react.dev)
- [Chakra UI](https://chakra-ui.com)
- [Vite](https://vitejs.dev)
- [Vitest](https://vitest.dev)
