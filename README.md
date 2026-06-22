# 💼 AssetManager v1.0 — Enterprise Workspace Portal

A platform-independent, full-stack enterprise management platform designed to monitor corporate hardware assets, evaluate inventory reserves, and manage automated user directory configurations. 

This repository is fully containerized using **Docker**, enabling any developer to clone, build, and deploy the complete stack—including the database—locally with a single command.

---

## 🏗️ System Architecture & Stack

The application leverages a decoupled architecture managed under a unified virtual Docker network grid:

* **Frontend Panel:** Angular 18+ (Standalone Components, RxJS reactive data streams, Tailwind CSS layout engine)
* **Backend Core:** .NET Core 8.0 Web API (RESTful routes, Entity Framework Core ORM)
* **Database Tier:** Microsoft SQL Server 2022 Linux Container Instance

---

## 📦 Project Directory Structure

```text
AssetManager/
├── docker-compose.yml         # 🎛️ Main orchestration script for the ecosystem
├── README.md                  # 📖 Root documentation guide (This file)
├── backend/                   # 📡 C# ASP.NET Core Web API directory
│   ├── Dockerfile             # Multi-stage production build script for .NET
│   └── ...                    
└── frontend/                  # 💻 Angular SPA application directory
    ├── Dockerfile             # Multi-stage web app compilation build using Nginx
    └── ...



Build and Start the Docker Ecosystem:
Run the orchestrator command to compile the Angular frontend, set up the .NET API, and initialize the SQL Server instance automatically:

Bash
docker-compose up --build