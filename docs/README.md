# CulturaPath

> A persona-driven cultural heritage discovery platform leveraging Object-Oriented User Experience (OOUX) to minimize cognitive load and deliver personalized heritage exploration.

![Cultural Heritage](https://img.shields.io/badge/Domain-Cultural%20Heritage-purple)
![React](https://img.shields.io/badge/React-18.3-blue)
![TypeScript](https://img.shields.io/badge/TypeScript-5.x-blue)
![Tailwind CSS](https://img.shields.io/badge/Tailwind%20CSS-3.x-teal)

---

## 📖 About The Project

CulturaPath is an academic research project developed by **Fotis Pastrakis** as part of master's studies in digital experience design and cultural informatics. The application explores how personalization, UX writing, and reflective interaction design can enhance cultural heritage engagement through a Progressive Web Application (PWA).

### Core Vision

The platform redefines how travelers interact with cultural heritage by offering deeply personalized experiences. Instead of generic recommendations, users are guided to discover heritage sites that align with their **travel persona**—a profile shaped through introspective choices and emotional resonance.

---

## 🎯 Application Scope

### Key Features

| Feature | Description |
|---------|-------------|
| **Persona-Based Discovery** | 8 distinct cultural heritage visitor personas based on Konstantakis ACUX typology |
| **Smart Recommendations** | Match scoring algorithm (0-100%) between user personas and heritage sites |
| **Trip Planning** | Create, manage, and organize cultural heritage trips |
| **Heritage Site Catalog** | Comprehensive database of museums, archaeological sites, religious heritage, and more |
| **Evaluation System** | Geneva Emotion Wheel and UEQ-S forms for experience assessment |
| **Study Dashboard** | Academic research tools for analyzing user engagement patterns |

### Persona System (ACUX Typology)

The application implements 8 cultural heritage visitor personas:

- 🏛️ **Archaeologist** - Drawn to archaeological sites and museums
- 🙏 **Religious Seeker** - Interested in religious and spiritual sites
- 🎨 **Art Seeker** - Passionate about museums and performing arts
- 🌿 **Naturalist** - Appreciates traditional crafts and maritime heritage
- 🍷 **Gourmand** - Focused on food heritage and cultural experiences
- 📜 **Traditionalist** - Values traditional crafts and historic districts
- 📸 **Viral Seeker** - Seeks shareable cultural experiences
- 🌅 **Leisure Seeker** - Prefers relaxed maritime and fortress experiences

---

## 🧠 Object-Oriented User Experience (OOUX)

CulturaPath is built using **Object-Oriented User Experience (OOUX)** methodology to minimize cognitive load and create intuitive information architecture.

### What is OOUX?

OOUX is a design methodology that structures digital experiences around real-world objects rather than actions. By identifying core objects, their attributes, and relationships, OOUX creates mental models that users already understand.

### How CulturaPath Applies OOUX

```
┌─────────────────────────────────────────────────────────────┐
│                    CORE OBJECTS                              │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│  ┌──────────┐    ┌──────────────┐    ┌─────────────┐        │
│  │  PERSONA │───▶│ HERITAGE SITE│◀───│    TRIP     │        │
│  └──────────┘    └──────────────┘    └─────────────┘        │
│       │                 │                   │                │
│       ▼                 ▼                   ▼                │
│  • Traits          • Category          • Destinations       │
│  • Affinities      • Location          • Schedule           │
│  • Icon            • Rating            • Personas           │
│                    • Personas                                │
│                                                              │
└─────────────────────────────────────────────────────────────┘
```

### Benefits Achieved

| Principle | Implementation |
|-----------|----------------|
| **Reduced Cognitive Load** | Users navigate through familiar objects (Sites, Trips, Personas) instead of abstract menus |
| **Consistent Mental Models** | Persona cards, site cards, and trip cards follow consistent patterns |
| **Progressive Disclosure** | Information revealed contextually based on user's current object focus |
| **Relationship Clarity** | Clear connections between personas → recommendations → trips |

---

## 🛠️ Technology Stack

### Frontend Framework

| Technology | Version | Purpose |
|------------|---------|---------|
| **React** | 18.3.1 | Component-based UI library |
| **TypeScript** | 5.x | Type-safe JavaScript |
| **Vite** | Latest | Fast build tool and dev server |
| **React Router** | 6.26.2 | Client-side routing |

### Styling & UI

| Technology | Purpose |
|------------|---------|
| **Tailwind CSS** | Utility-first CSS framework |
| **shadcn/ui** | Accessible, customizable component library |
| **Radix UI** | Headless UI primitives for accessibility |
| **Lucide React** | Modern icon library |
| **tailwindcss-animate** | Animation utilities |

### State & Data Management

| Technology | Purpose |
|------------|---------|
| **TanStack React Query** | Server state management and caching |
| **React Hook Form** | Form state management |
| **Zod** | Schema validation |
| **localStorage/Cookies** | Client-side persistence (demo mode) |

### Visualization & Maps

| Technology | Purpose |
|------------|---------|
| **Recharts** | Data visualization and charts |
| **Mapbox GL** | Interactive maps for heritage sites |

### Additional Libraries

| Technology | Purpose |
|------------|---------|
| **date-fns** | Date manipulation |
| **Framer Motion** (via embla-carousel) | Smooth animations |
| **Sonner** | Toast notifications |
| **next-themes** | Dark/light mode theming |

---

## 🔧 Development Platform

### Lovable

This project was prototyped and developed using **[Lovable](https://lovable.dev)** — an AI-powered development platform that enables rapid prototyping and iteration of web applications.

#### What is Lovable?

Lovable is a modern development environment that combines:

- **AI-Assisted Development**: Natural language to code generation
- **Real-time Preview**: Instant visual feedback on changes
- **Built-in Deployment**: One-click publishing to production
- **Component Library**: Pre-configured shadcn/ui components
- **Type Safety**: Full TypeScript support out of the box

#### Why Lovable for Academic Research?

| Benefit | Application |
|---------|-------------|
| **Rapid Iteration** | Quick hypothesis testing for UX research |
| **Low Technical Barrier** | Focus on design decisions, not configuration |
| **Production-Ready Output** | Clean, maintainable React codebase |
| **Version Control** | Git integration for tracking changes |

---

## 🏗️ Architecture

### Frontend-Only Prototype

The entire CulturaPath application is built as a **frontend-only prototype** for demonstration purposes:

- ✅ No backend server required
- ✅ All data persists using `localStorage` and cookies
- ✅ Dummy authentication (credentials: `admin` / `123456`)
- ✅ Self-contained heritage site database

### Project Structure

```
src/
├── components/          # Reusable UI components
│   ├── auth/           # Authentication components
│   ├── discover/       # Discovery page components
│   ├── heritage/       # Heritage site components
│   ├── navigation/     # Navigation components
│   ├── planner/        # Trip planning components
│   ├── profile/        # User profile components
│   ├── study/          # Research study components
│   └── ui/             # shadcn/ui base components
├── data/               # Static data (heritage sites)
├── hooks/              # Custom React hooks
├── lib/                # Utility functions & storage
│   ├── recommendationEngine.ts  # Persona matching algorithm
│   ├── personaStorage.ts        # Persona persistence
│   └── tripStorage.ts           # Trip data management
├── pages/              # Route pages
└── assets/             # Static images
```

---

## 📚 Documentation

All project documentation is organized in the `docs/` folder:

| Document | Description |
|----------|-------------|
| [README.md](./README.md) | Project overview (this file) |
| [DEVELOPMENT_PROCESS.md](./DEVELOPMENT_PROCESS.md) | Analysis and prototyping methodology |
| [USER_JOURNEYS.md](./USER_JOURNEYS.md) | User flow diagrams and journey tables |
| [ARCHITECTURE.md](./ARCHITECTURE.md) | Technical architecture diagrams |

---

## 🚀 Getting Started

### Prerequisites

- Node.js (v18 or higher)
- npm or bun package manager

### Installation

```bash
# Clone the repository
git clone <YOUR_GIT_URL>

# Navigate to project directory
cd <YOUR_PROJECT_NAME>

# Install dependencies
npm install

# Start development server
npm run dev
```

The application will be available at `http://localhost:8080`

### Demo Credentials

For testing authenticated features:
- **Username**: `admin`
- **Password**: `123456`

---

## 📊 Research Focus

### Key Research Areas

- **Personalization** in cultural heritage digital experiences
- **UX Writing** for emotional engagement
- **Reflective Interaction Design** patterns
- **Progressive Web Application** architecture for heritage tourism

### Methodology

- User persona development based on ACUX typology
- Behavioral pattern analysis through evaluation forms
- Cultural preference mapping via recommendation algorithms
- Iterative design validation through study dashboards

---

## 🔗 Links

- **Live Application**: [culturapath.lovable.app](https://culturapath.lovable.app)
- **Development Platform**: [Lovable](https://lovable.dev)
- **Documentation**: [Lovable Docs](https://docs.lovable.dev)

---

## 📄 License

This project is developed for academic research purposes as part of a master's thesis in digital experience design and cultural informatics.

---

## 👤 Author

**Fotis Pastrakis**

Master's Research in Digital Experience Design & Cultural Informatics

---

*Built with ❤️ using [Lovable](https://lovable.dev)*
