
# Forge 2 Qualifier - Kanban Board Application

## 📋 Project Overview
A Trello-style Kanban board application built using a two-agent AI system (Hermes + OpenClaw) for the Forge 2 Qualifier.

## ✨ Features
- ✅ Create boards with multiple lists (To-Do, Doing, Done)
- ✅ Add, edit, and delete cards
- ✅ Drag-and-drop cards between lists
- ✅ Color-coded tags/labels for cards
- ✅ Assign members to cards
- ✅ Set due dates with overdue visual indicators
- ✅ Responsive React frontend
- ✅ RESTful Laravel API backend

## 🛠️ Tech Stack

### Backend
- **Framework:** Laravel 10 (PHP 8.2+)
- **Database:** SQLite
- **API:** RESTful endpoints

### Frontend
- **Framework:** React 18
- **Build Tool:** Vite
- **Styling:** CSS3/SCSS

### AI Agents
- **Orchestrator:** Hermes Agent (Planning & Memory)
- **Coder:** OpenClaw (Code Generation & Execution)

### Communication
- **Platform:** Slack
- **Channels:** #sprint-main, #agent-coder, #agent-log

## 🚀 Live Demo
- **Frontend:** https://forge2-qualifier-shrey-agrawal.vercel.app/
- **Backend API:** https://kanbann-backend-uerm.onrender.com

## 📦 Local Development Setup

### Prerequisites
```bash
# Required versions
Node.js >= 22.19.0
PHP >= 8.2
Composer >= 2.0
Python >= 3.11
Git
```

### Backend Setup
```bash
# Clone repository
git clone https://github.com/shrey-agrawal821/forge2-qualifier-shrey-agrawal
cd forge2-qualifier-shrey-agrawal/backend

# Install dependencies
composer install

# Environment configuration
cp .env.example .env
php artisan key:generate

# Database setup (SQLite)
touch database/database.sqlite
php artisan migrate --seed

# Start development server
php artisan serve --port=8000
```

### Frontend Setup
```bash
# Navigate to frontend directory
cd ../frontend

# Install dependencies
npm install

# Start development server
npm run dev
```

### Access the Application
- Frontend: http://localhost:5173
- Backend API: http://localhost:8000/api

## 🤖 Agent System Setup

### OpenClaw Configuration
```bash
# Install OpenClaw
npm install -g openclaw@latest
openclaw onboard

### Hermes Configuration
```bash
# Install Hermes (Windows)
iex (irm https://hermes-agent.nousresearch.com/install.ps1)

# Start Hermes
hermes
```

## 📊 Database Schema

### Boards Table
| Column | Type | Description |
|--------|------|-------------|
| id | bigIncrements | Primary key |
| name | string | Board name |
| description | text | Board description |
| owner_id | unsignedBigInteger | User ID of creator |
| created_at | timestamp | Creation timestamp |

### Lists Table
| Column | Type | Description |
|--------|------|-------------|
| id | bigIncrements | Primary key |
| board_id | unsignedBigInteger | Foreign key to boards |
| name | string | List name (To-Do, Doing, Done) |
| position | integer | Display order |
| created_at | timestamp | Creation timestamp |

### Cards Table
| Column | Type | Description |
|--------|------|-------------|
| id | bigIncrements | Primary key |
| list_id | unsignedBigInteger | Foreign key to lists |
| title | string | Card title |
| description | text | Card description |
| assigned_to | unsignedBigInteger | Assigned member ID |
| due_date | date | Due date for task |
| position | integer | Display order |
| created_at | timestamp | Creation timestamp |

### Tags Table
| Column | Type | Description |
|--------|------|-------------|
| id | bigIncrements | Primary key |
| name | string | Tag name |
| color | string | Hex color code |
| created_at | timestamp | Creation timestamp |

### Card_Tag Table
| Column | Type | Description |
|--------|------|-------------|
| card_id | unsignedBigInteger | Foreign key to cards |
| tag_id | unsignedBigInteger | Foreign key to tags |

### Members Table
| Column | Type | Description |
|--------|------|-------------|
| id | bigIncrements | Primary key |
| name | string | Member name |
| email | string | Email address |
| board_id | unsignedBigInteger | Foreign key to boards |
| created_at | timestamp | Creation timestamp |

## 🔗 API Endpoints

### Boards
```
GET    /api/boards              - List all boards
POST   /api/boards              - Create a new board
GET    /api/boards/{id}         - Get board details
PUT    /api/boards/{id}         - Update board
DELETE /api/boards/{id}         - Delete board
```

### Lists
```
GET    /api/boards/{boardId}/lists - Get lists for a board
POST   /api/boards/{boardId}/lists - Create a new list
PUT    /api/lists/{id}            - Update list
DELETE /api/lists/{id}            - Delete list
```

### Cards
```
GET    /api/lists/{listId}/cards  - Get cards for a list
POST   /api/lists/{listId}/cards  - Create a new card
GET    /api/cards/{id}            - Get card details
PUT    /api/cards/{id}            - Update card
DELETE /api/cards/{id}            - Delete card
POST   /api/cards/{id}/move       - Move card to another list
```

### Tags
```
GET    /api/cards/{cardId}/tags   - Get tags for a card
POST   /api/cards/{cardId}/tags   - Add tag to card
DELETE /api/cards/{cardId}/tags/{tagId} - Remove tag from card
```

### Members
```
GET    /api/boards/{boardId}/members - Get members of a board
POST   /api/boards/{boardId}/members - Add member to board
DELETE /api/boards/{boardId}/members/{memberId} - Remove member
```

## 🎯 Agent Workflow

```
User → #sprint-main (Slack) → Hermes (Planning)
     ↓
Hermes assigns task to OpenClaw in #agent-coder
     ↓
OpenClaw writes code, runs it, reports back
     ↓
User reviews and approves
     ↓
Repeat until all features complete
```

## 📝 Model Routing Strategy

| Agent | Provider | Model | Reason |
|-------|----------|-------|--------|
| Hermes | Groq | llama-3.3-70b-versatile | Fast, free, good for planning |
| OpenClaw | Ollama/LM Studio | qwen2.5-coder | Free, unlimited, good for coding |

## 🧪 Testing

### Backend Tests
```bash
cd backend
php artisan test
```

### Frontend Tests
```bash
cd frontend
npm run test
```

##  License
MIT License - See LICENSE file for details

##  Author
Shrey Agrawal - Forge 2 Qualifier Participant

##  Acknowledgments
- Forge 2 Team for this amazing opportunity
- NousResearch for Hermes Agent
- OpenClaw community
```

---

