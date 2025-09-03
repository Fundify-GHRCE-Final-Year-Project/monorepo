# Fundify - Decentralized Project Funding Platform

A modern, decentralized platform for funding innovative projects with cryptocurrency. Built with Next.js, TypeScript, and blockchain technology.

## 🚀 Features

- **Decentralized Funding**: Fund projects using cryptocurrency with smart contract automation
- **Project Management**: Create, manage, and track project milestones
- **Investment Tracking**: Monitor your investments and project progress
- **User Profiles**: Complete user profiles with skills, experience, and social links
- **Real-time Updates**: Live funding progress and milestone tracking
- **Responsive Design**: Modern, mobile-first UI built with Tailwind CSS
- **Wallet Integration**: Seamless Ethereum wallet connection
- **Caching System**: Optimized performance with browser caching

## 🛠️ Tech Stack

### Frontend
- **Next.js 14** - React framework with App Router
- **TypeScript** - Type-safe development
- **Tailwind CSS** - Utility-first CSS framework
- **Shadcn/ui** - Modern component library
- **Lucide React** - Beautiful icons

### State Management & Data
- **Jotai** - Lightweight state management
- **Axios** - HTTP client for API calls
- **Zod** - Schema validation

### Blockchain & Web3
- **Wagmi** - React hooks for Ethereum
- **Viem** - TypeScript interface for Ethereum
- **Ethers.js** - Ethereum library

### Caching & Storage
- **Browser Local Storage** - Client-side caching
- **LRU Cache** - Server-side caching (ready for backend)

### Database (Ready for Implementation)
- **MongoDB** - NoSQL database
- **Mongoose** - MongoDB object modeling

## 📁 Project Structure

```
src/
├── app/                    # Next.js App Router pages
│   ├── globals.css        # Global styles
│   ├── layout.tsx         # Root layout
│   ├── page.tsx           # Home page
│   ├── projects/          # Projects listing
│   ├── invested-projects/ # User's invested projects
│   ├── my-projects/       # User's created projects
│   ├── publish/           # Project creation form
│   ├── project/[id]/      # Individual project details
│   ├── profile/           # User profile
│   ├── error.tsx          # Global error page
│   └── not-found.tsx      # 404 page
├── components/            # Reusable UI components
│   ├── ui/               # Shadcn/ui components
│   ├── header.tsx        # Navigation header
│   ├── footer.tsx        # Site footer
│   ├── providers.tsx     # Context providers
│   └── project-card.tsx  # Project display component
├── lib/                  # Utility functions and hooks
│   ├── utils.ts          # General utilities
│   ├── calculations.ts   # Business logic calculations
│   ├── browserCache.ts   # Local storage caching
│   └── hooks.ts          # Custom data fetching hooks
├── store/                # Jotai state management
│   └── global.ts         # Global state atoms
└── types/                # TypeScript type definitions
    └── global.ts         # Global types and schemas
```

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn
- Modern web browser with MetaMask or similar wallet

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd fundify
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Run the development server**
   ```bash
   npm run dev
   ```

4. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

### Environment Variables

Create a `.env.local` file in the root directory:

```env
# Database (for future backend implementation)
MONGODB_URI=your_mongodb_connection_string

# Ethereum (for future smart contract integration)
NEXT_PUBLIC_CONTRACT_ADDRESS=your_smart_contract_address
NEXT_PUBLIC_CHAIN_ID=1

# API Keys (for future external services)
NEXT_PUBLIC_API_URL=your_api_url
```

## 📱 Pages & Features

### 1. Home Page (`/`)
- Hero section with platform overview
- Feature highlights
- Statistics and call-to-action
- Modern gradient design

### 2. Projects (`/projects`)
- Browse all available projects
- Search and filter functionality
- Grid and list view options
- Project status indicators

### 3. Invested Projects (`/invested-projects`)
- View projects you've invested in
- Investment statistics dashboard
- Progress tracking
- Only visible if user has investments

### 4. My Projects (`/my-projects`)
- Manage your created projects
- Project creation statistics
- Quick access to project management
- Only visible if user has projects

### 5. Publish Project (`/publish`)
- Comprehensive project creation form
- Milestone configuration
- Team member management
- Form validation with Zod

### 6. Project Details (`/project/[id]`)
- Detailed project information
- Funding progress visualization
- Milestone tracking
- Team member information
- Investment actions

### 7. User Profile (`/profile`)
- Complete user profile management
- Skills and experience editing
- Social media links
- Investment statistics
- Wallet information

## 🔧 Customization

### Adding New Components

1. Create component in `src/components/`
2. Follow Shadcn/ui patterns
3. Use TypeScript interfaces
4. Include proper error handling

### Styling

- Use Tailwind CSS classes
- Follow the design system in `globals.css`
- Use CSS variables for theming
- Maintain responsive design

### State Management

- Use Jotai atoms in `src/store/`
- Create derived atoms for computed values
- Follow atomic design principles
- Implement proper error states

## 🧪 Testing

```bash
# Run tests (when implemented)
npm test

# Run type checking
npm run type-check

# Run linting
npm run lint
```

## 📦 Build & Deployment

### Development
```bash
npm run dev
```

### Production Build
```bash
npm run build
npm start
```

### Static Export (if needed)
```bash
npm run export
```

## 🔒 Security Considerations

- Input validation with Zod schemas
- XSS protection with proper escaping
- CSRF protection (implement in backend)
- Secure wallet connection handling
- Environment variable protection

## 🚀 Future Enhancements

### Backend Implementation
- [ ] MongoDB integration with Mongoose
- [ ] RESTful API endpoints
- [ ] Smart contract integration
- [ ] Real-time updates with WebSockets

### Advanced Features
- [ ] Multi-chain support
- [ ] Advanced analytics dashboard
- [ ] Social features and comments
- [ ] Mobile app development
- [ ] Advanced search and filtering

### Performance Optimizations
- [ ] Image optimization
- [ ] Code splitting
- [ ] Service worker implementation
- [ ] CDN integration

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- [Shadcn/ui](https://ui.shadcn.com/) for the beautiful component library
- [Tailwind CSS](https://tailwindcss.com/) for the utility-first CSS framework
- [Lucide](https://lucide.dev/) for the amazing icons
- [Next.js](https://nextjs.org/) for the powerful React framework

## 📞 Support

For support and questions:
- Create an issue in the repository
- Email: support@fundify.com
- Documentation: [docs.fundify.com](https://docs.fundify.com)

---

**Built with ❤️ for the decentralized future** 