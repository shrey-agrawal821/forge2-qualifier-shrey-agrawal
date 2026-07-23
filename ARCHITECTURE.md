# Forge 2 Qualifier - System Architecture

## 🏗️ Overview
This document describes the architecture of the two-agent system built for the Forge 2 Qualifier.

## 🎯 Agent Roles

### Hermes (The Brain)
**Purpose:** Orchestrator, planner, and memory system

**Responsibilities:**
- ✅ Create and manage project plans
- ✅ Break down tasks into actionable steps
- ✅ Maintain persistent memory across sessions
- ✅ Delegate tasks to OpenClaw
- ✅ Generate status reports
- ✅ Schedule autonomous runs via cron

**Technical Details:**
- Provider: Groq (free tier)
- Model: llama-3.3-70b-versatile
- Memory: Persistent database storage
- Skills: Status-report skill for updates

### OpenClaw (The Hands)
**Purpose:** Code generation and execution

**Responsibilities:**
- ✅ Write code based on assigned tasks
- ✅ Run commands and scripts
- ✅ Report results back to Slack
- ✅ Execute terminal commands
- ✅ Manage file operations

**Technical Details:**
- Provider: Ollama/LM Studio (local)
- Model: qwen2.5-coder
- Execution: Local terminal backend
- Scope: Workspace directory

## 📡 Communication Flow

### Slack Channel Scheme

| Channel | Purpose | Agents |
|---------|---------|--------|
| #sprint-main | Human ↔ Hermes | Planning, decisions, status |
| #agent-coder | Hermes ↔ OpenClaw | Task assignment, coding |
| #agent-log | All agent activity | Audit trail, logs |

### Message Flow
```
┌─────────────┐
│   User in   │
│#sprint-main │
└──────┬──────┘
       │ "Build Kanban app"
       ▼
┌─────────────┐
│   Hermes    │
│   (Brain)   │
└──────┬──────┘
       │ Creates plan & tasks
       ▼
┌─────────────┐
│   Hermes    │
│   Assigns   │
│   Task to   │
│  OpenClaw   │
└──────┬──────┘
       │ Task in #agent-coder
       ▼
┌─────────────┐
│  OpenClaw   │
│  (Hands)    │
└──────┬──────┘
       │ Writes code, runs commands
       ▼
┌─────────────┐
│  OpenClaw   │
│   Reports   │
│   Results   │
└──────┬──────┘
       │ Response in #agent-coder
       ▼
┌─────────────┐
│   User in   │
│#sprint-main │
└─────────────┘
```

## 🧠 Memory Architecture

### Hermes Memory System

**What is stored:**
- Project plans and tasks
- User preferences and facts
- Context from previous conversations
- Skill definitions and usage

**Storage:**
- File-based: `~/.hermes/memories/`
- Format: Markdown with structured metadata
- Persistence: Cross-session via database

**Search Capability:**
- Full-text search across conversations
- Semantic search for relevant context
- Tag-based categorization

## 🔧 Skills System

### Status Report Skill
```yaml
name: status-report
description: Post a What I Did / What's Left / What Needs Your Call update
```

**Usage:**
- Triggered by: "Create a status report" or "Give me a status update"
- Output: Three sections with formatted response
- Channel: #sprint-main (human) and #agent-log (audit)

### Creating New Skills
1. Create SKILL.md in skills/<skill-name>/
2. Define metadata (name, description)
3. Define behavior and output format
4. Register with: `hermes skill add skills/<skill-name>`

## 🌐 Model Routing Strategy

### Why Groq for Hermes?
- ✅ Free tier available
- ✅ Fast response times
- ✅ Good for planning and reasoning
- ✅ 70B parameter model for complex tasks

### Why Ollama for OpenClaw?
- ✅ 100% free and offline
- ✅ No rate limits
- ✅ Good for code generation
- ✅ Runs locally on the machine

### Fallback Strategy
1. Primary: Groq → If rate limit hit
2. Secondary: Ollama/LM Studio → Unlimited local
3. Tertiary: Gemini free tier → If available

## 🔄 Agent Orchestration Workflow

### Task Breakdown Process
```
1. User: "Build a Kanban app"
   ↓
2. Hermes analyzes requirements
   ↓
3. Hermes creates task list:
   - Task 1: Setup Laravel backend
   - Task 2: Create database migrations
   - Task 3: Build REST API endpoints
   - Task 4: Setup React frontend
   - Task 5: Connect frontend to API
   - Task 6: Add UI features
   ↓
4. Hermes assigns Task 1 to OpenClaw
   ↓
5. OpenClaw executes Task 1
   ↓
6. OpenClaw reports completion
   ↓
7. Hermes verifies and moves to next task
   ↓
8. Repeat until all tasks complete
```

### Autonomous Run Schedule
```yaml
Name: daily-status
Frequency: Every 10 minutes
Action: Post status report to #agent-log
Trigger: Cron scheduler
Format: What I Did / What's Left / What Needs Your Call
```

## 🛡️ Security Considerations

### Token Management
- Environment variables for all API keys
- No hardcoded secrets in repository
- `.env.example` provided for placeholder values

### File System Isolation
- OpenClaw works within designated workspace
- Hermes runs in dedicated directory
- Containerization recommended for production

### Slack Permissions
- Minimal required scopes
- Channel allowlist only
- DM pairing for security

## 📈 Performance Metrics

### Agent Response Times
- Hermes planning: 5-15 seconds
- OpenClaw execution: 10-30 seconds
- Slack messaging: 1-3 seconds

### Success Metrics
- Task completion rate: >90%
- Code quality: No critical errors
- Feature completeness: All required features
- Agent availability: 99% uptime during qualifier

## 🔮 Future Enhancements

### Planned Features
1. Multi-language support
2. Advanced memory graph
3. External tool integration
4. CI/CD pipeline integration
5. Custom model fine-tuning

### Potential Improvements
1. Reduce latency with better models
2. Improved error handling
3. Self-healing mechanisms
4. Auto-scaling capabilities

---

## Appendix A: Technology Stack

| Layer | Technology | Version |
|-------|-----------|---------|
| Frontend | React + Vite | 18.2.0 |
| Backend | Laravel | 10.x |
| Database | SQLite | 3.x |
| Agent Orchestration | Hermes | 0.19.0 |
| Agent Execution | OpenClaw | Latest |
| AI Models (Planning) | Groq (llama-3.3) | - |
| AI Models (Coding) | Ollama (qwen2.5) | - |
| Communication | Slack API | Latest |

---

