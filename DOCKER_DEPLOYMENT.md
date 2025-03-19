# Docker Deployment Guide for Vision AI 2.0

This guide explains how to deploy Vision AI 2.0 using Docker for production environments.

## Prerequisites

- [Docker](https://docs.docker.com/get-docker/) installed on your server
- [Docker Compose](https://docs.docker.com/compose/install/) installed on your server
- Git access to the repository

## Deployment Steps

### 1. Clone the Repository

```bash
git clone https://github.com/saban20/vewvisionai20.git
cd vewvisionai20
```

### 2. Automated Deployment

The easiest way to deploy is by using the included deployment script:

```bash
./deploy.sh
```

This script will:
- Pull the latest changes from the repository
- Build the Docker containers
- Start the application
- Verify the containers are running properly

### 3. Manual Deployment

If you prefer to deploy manually, follow these steps:

```bash
# Build the containers
docker-compose build

# Start the containers in detached mode
docker-compose up -d

# Check if the containers are running
docker ps
```

### 4. Accessing the Application

Once deployed, the application will be available at:

- Web application: `http://your-server-ip`

## Configuration Options

### Environment Variables

You can configure the application by modifying the environment variables in the `docker-compose.yml` file:

```yaml
environment:
  - NODE_ENV=production
  - API_URL=https://your-api-url.com
```

### Nginx Configuration

The application uses Nginx to serve the static files. You can customize the Nginx configuration by modifying the `nginx.conf` file.

## Troubleshooting

### Container Not Starting

If the container fails to start, check the logs:

```bash
docker logs vision-ai-web
```

### Application Not Accessible

If you can't access the application, check if:

1. The container is running: `docker ps`
2. The port mapping is correct: check `docker-compose.yml`
3. Firewall settings allow traffic on port 80

## Updating the Application

To update the application to the latest version:

```bash
git pull
docker-compose down
docker-compose build
docker-compose up -d
```

Or simply run `./deploy.sh` again.

## Backup and Restore

If your application stores data that needs to be backed up, you can use Docker volumes as defined in the `docker-compose.yml` file.

### Backup:

```bash
docker run --rm -v vision-ai_data:/data -v $(pwd):/backup alpine tar -czf /backup/data-backup.tar.gz /data
```

### Restore:

```bash
docker run --rm -v vision-ai_data:/data -v $(pwd):/backup alpine sh -c "cd /data && tar -xzf /backup/data-backup.tar.gz --strip 1"
```

## Additional Resources

- [Docker Documentation](https://docs.docker.com/)
- [Nginx Documentation](https://nginx.org/en/docs/)
- [React Production Build](https://create-react-app.dev/docs/production-build/) 