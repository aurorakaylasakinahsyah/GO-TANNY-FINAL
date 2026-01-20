---
title: GoTanny Backend
emoji: 🌿
colorFrom: green
colorTo: yellow
sdk: docker
pinned: false
app_port: 7860
---

# GoTanny Backend

This is the backend service for the GoTanny application. It includes:
- Node.js Express Server (Auth, Database)
- Python FastAPI Service (LLM AI Analysis)
- Nginx (Reverse Proxy)

## endpoints
- `/api/*`: Node.js Backend
- `/analyze`: Python AI Service
