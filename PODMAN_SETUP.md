# Podman Setup Guide for Sip.AI

**Podman is a free, open-source alternative to Docker** - no subscription required!

Podman is daemonless, rootless, and fully compatible with Docker commands. It's maintained by Red Hat and the open-source community.

---

## Why Podman?

✅ **100% Free** - No subscription fees, ever
✅ **Open Source** - Community-driven, transparent development
✅ **Docker Compatible** - Uses same commands and compose files
✅ **More Secure** - Rootless containers by default
✅ **No Daemon** - Doesn't require a background service
✅ **Drop-in Replacement** - Works with existing Docker Compose files

---

## Installation

### macOS

**Option 1: Homebrew (Recommended)**
```bash
brew install podman
```

**Option 2: Podman Desktop (GUI)**
```bash
brew install podman-desktop
```

Or download from: https://podman-desktop.io/downloads

**Start Podman Machine:**
```bash
# Initialize and start
podman machine init
podman machine start

# Verify it's running
podman info
```

---

### Windows

**Option 1: Podman Desktop (Recommended)**
- Download from: https://podman-desktop.io/downloads
- Install and run
- It will set up WSL2 and Podman automatically

**Option 2: WSL2 + Manual Install**
1. Install WSL2
2. Inside WSL2:
```bash
sudo apt-get update
sudo apt-get install podman
```

---

### Linux

**Ubuntu/Debian:**
```bash
sudo apt-get update
sudo apt-get install podman
```

**Fedora/RHEL:**
```bash
sudo dnf install podman
```

**Arch Linux:**
```bash
sudo pacman -S podman
```

---

## Install podman-compose (Recommended)

To use `docker-compose.yml` files with Podman:

```bash
# Install podman-compose
pip3 install podman-compose

# Or with Homebrew (macOS)
brew install podman-compose
```

**Alternative:** Podman 4.1+ includes `podman compose` built-in (no separate install needed).

---

## Starting the Database

Once Podman is installed, you can start PostgreSQL using any of these commands:

### Option 1: Using podman-compose (Recommended)
```bash
podman-compose up -d
```

### Option 2: Using built-in podman compose
```bash
podman compose up -d
```

### Option 3: Using podman directly (no compose)
```bash
# Start PostgreSQL
podman run -d \
  --name sipai-postgres \
  -e POSTGRES_USER=postgres \
  -e POSTGRES_PASSWORD=password \
  -e POSTGRES_DB=sipai_dev \
  -p 5432:5432 \
  -v postgres_data:/var/lib/postgresql/data \
  postgres:15-alpine

# Start pgAdmin (optional)
podman run -d \
  --name sipai-pgadmin \
  -e PGADMIN_DEFAULT_EMAIL=admin@sipai.local \
  -e PGADMIN_DEFAULT_PASSWORD=admin \
  -p 5050:80 \
  -v pgadmin_data:/var/lib/pgadmin \
  dpage/pgadmin4:latest
```

---

## Verify Database is Running

```bash
# List running containers
podman ps

# You should see:
# - sipai-postgres (PostgreSQL)
# - sipai-pgadmin (pgAdmin - if started)

# Check PostgreSQL logs
podman logs sipai-postgres

# Test database connection
podman exec -it sipai-postgres psql -U postgres -d sipai_dev
```

---

## Common Podman Commands

Podman commands are identical to Docker:

```bash
# Start containers
podman-compose up -d
# or
podman compose up -d

# Stop containers
podman-compose down
# or
podman compose down

# Stop and remove volumes (⚠️ deletes all data)
podman-compose down -v

# View running containers
podman ps

# View all containers (including stopped)
podman ps -a

# View logs
podman logs sipai-postgres
podman logs -f sipai-postgres  # Follow logs

# Restart containers
podman restart sipai-postgres

# Execute commands inside container
podman exec -it sipai-postgres psql -U postgres

# Remove containers
podman rm sipai-postgres

# Remove images
podman rmi postgres:15-alpine

# View volumes
podman volume ls

# Remove volumes
podman volume rm postgres_data
```

---

## Podman Desktop (GUI)

If you prefer a graphical interface:

1. Install Podman Desktop: https://podman-desktop.io
2. Open Podman Desktop
3. You'll see a Docker-like interface with:
   - Container management
   - Image browsing
   - Volume management
   - Compose file support
   - Resource monitoring

---

## Complete Setup Process

### 1. Install Podman

**macOS:**
```bash
brew install podman podman-compose
podman machine init
podman machine start
```

**Windows:**
- Install Podman Desktop from https://podman-desktop.io

**Linux:**
```bash
sudo apt-get install podman
pip3 install podman-compose
```

### 2. Start Database

```bash
# Navigate to project directory
cd /Users/gscoggin/Documents/Code/wine-country-ai

# Start PostgreSQL and pgAdmin
podman-compose up -d
```

### 3. Verify It's Running

```bash
podman ps
```

You should see:
```
CONTAINER ID  IMAGE                        COMMAND     CREATED     STATUS      PORTS                   NAMES
abc123def456  postgres:15-alpine          postgres    2 min ago   Up 2 min    0.0.0.0:5432->5432/tcp  sipai-postgres
def456ghi789  dpage/pgadmin4:latest       /entrypoint 2 min ago   Up 2 min    0.0.0.0:5050->80/tcp    sipai-pgadmin
```

### 4. Set Up Environment

```bash
cp .env.example .env.local
```

Edit `.env.local`:
```env
OPENAI_API_KEY=your_key_here
NEXTAUTH_SECRET=your_secret_here
DATABASE_URL=postgresql://postgres:password@localhost:5432/sipai_dev
```

### 5. Run Migrations

```bash
npm install
npx prisma generate
npx prisma migrate dev --name init
```

### 6. Seed Database

```bash
npm run db:seed
```

### 7. Import All Venue Data

```bash
npm run db:migrate-data
```

### 8. Start App

```bash
npm run dev
```

Open http://localhost:3000

---

## Troubleshooting

### "command not found: podman"

**Solution:** Podman isn't installed or not in PATH
```bash
# macOS
brew install podman

# Verify installation
which podman
podman --version
```

### "cannot connect to Podman socket"

**Solution:** Podman machine not running (macOS/Windows)
```bash
podman machine start
```

### "Port 5432 already in use"

**Solution:** Another database is running
```bash
# Find what's using port 5432
lsof -i :5432

# Kill it or change the port in docker-compose.yml
ports:
  - "5433:5432"  # Use 5433 instead
```

Then update `.env.local`:
```
DATABASE_URL=postgresql://postgres:password@localhost:5433/sipai_dev
```

### "Permission denied" errors

**Solution:** Run podman in rootless mode (default) or fix permissions
```bash
# Check if running rootless
podman info | grep rootless

# If not, you may need to configure rootless mode
podman system migrate
```

### podman-compose not found

**Solution:** Install podman-compose
```bash
pip3 install podman-compose

# Or use built-in (Podman 4.1+)
podman compose up -d
```

### Containers not persisting after restart

**Solution:** Check Podman machine is set to start on boot
```bash
# macOS
podman machine start

# Set to auto-start (if available)
podman machine set --now --rootful=false
```

---

## Podman vs Docker: Key Differences

| Feature | Podman | Docker |
|---------|--------|--------|
| **Cost** | 100% Free | Free for personal, paid for business |
| **Daemon** | No daemon required | Requires Docker daemon |
| **Root** | Rootless by default | Requires root or group membership |
| **Security** | More secure (rootless) | Less secure (root daemon) |
| **Commands** | Same as Docker | Same as Podman |
| **Compose** | Supports docker-compose.yml | Native support |
| **Desktop GUI** | Podman Desktop | Docker Desktop |

---

## Docker Compose Compatibility

Your `docker-compose.yml` works with both Docker and Podman!

**With Podman:**
```bash
podman-compose up -d
# or
podman compose up -d
```

**With Docker:**
```bash
docker compose up -d
```

The same file works for both!

---

## Advanced: Podman Pods

Podman has a unique feature called "Pods" (like Kubernetes pods):

```bash
# Create a pod
podman pod create --name sipai-pod -p 5432:5432 -p 5050:80

# Add containers to the pod
podman run -d --pod sipai-pod \
  -e POSTGRES_USER=postgres \
  -e POSTGRES_PASSWORD=password \
  -e POSTGRES_DB=sipai_dev \
  postgres:15-alpine

podman run -d --pod sipai-pod \
  -e PGADMIN_DEFAULT_EMAIL=admin@sipai.local \
  -e PGADMIN_DEFAULT_PASSWORD=admin \
  dpage/pgadmin4:latest

# All containers in the pod share the same network namespace!
```

---

## Migration from Docker

If you have Docker installed and want to switch to Podman:

```bash
# Stop Docker containers
docker compose down

# Install Podman
brew install podman podman-compose
podman machine init
podman machine start

# Start with Podman (same commands!)
podman-compose up -d

# Optional: Create Docker alias
echo "alias docker=podman" >> ~/.zshrc
echo "alias docker-compose=podman-compose" >> ~/.zshrc
source ~/.zshrc

# Now 'docker' commands will use Podman!
```

---

## Resources

- **Podman Website:** https://podman.io
- **Documentation:** https://docs.podman.io
- **Podman Desktop:** https://podman-desktop.io
- **GitHub:** https://github.com/containers/podman
- **Tutorials:** https://github.com/containers/podman/tree/main/docs/tutorials

---

## Quick Reference Card

```bash
# Installation
brew install podman podman-compose  # macOS
sudo apt install podman              # Linux

# Machine Management (macOS/Windows)
podman machine init
podman machine start
podman machine stop
podman machine list

# Container Management
podman-compose up -d        # Start containers
podman-compose down         # Stop containers
podman ps                   # List running containers
podman logs <container>     # View logs
podman exec -it <container> # Execute command

# Database Access
podman exec -it sipai-postgres psql -U postgres -d sipai_dev

# Cleanup
podman-compose down -v      # Remove everything including volumes
podman system prune -a      # Clean up unused images/containers
```

---

**You're all set!** Podman is free forever and works great with Sip.AI. 🎉

No subscriptions, no fees, just open-source goodness!
