# Node.js + MongoDB on Kubernetes


 # This is a demo project for learning and testing purposes only. Not suitable for production.

# A full-stack web application running on Kubernetes. The frontend is HTML/CSS/JS, the backend is Node.js with Express, and the database is MongoDB running as a StatefulSet with a persistent volume. The project also includes a CI/CD pipeline using GitHub Actions that automatically builds and pushes the Docker image to Docker Hub on every push to main.

---

## Architecture


Browser
    |
Node.js app (Deployment - 2 replicas)
    |
MongoDB (StatefulSet - 1 replica + 5Gi PV)


---

## What it does

A simple User Manager app where you can:

- Add a user with a name and email
- View all users
- Delete a user

All data is stored in MongoDB and persists across pod restarts thanks to the PersistentVolume.



## Project Structure


nodejs-mongo-k8s/
|-- app.js
|-- package.json
|-- Dockerfile
|-- public/
|   |-- index.html
|   |-- style.css
|   |-- script.js
|-- k8s/
|   |-- mongo.yaml
|   |-- app.yaml
|-- .github/
    |-- workflows/
        |-- deploy.yml




## What is Running

**Node.js app** - 2 replicas, port 3000, connects to MongoDB via MONGO_URL secret, resource limits set.

**MongoDB** - 1 replica, port 27017, credentials pulled from a Kubernetes Secret, 5Gi persistent volume at /data/db using hostPath.

---

## Resource Limits

| Deployment | CPU Request | CPU Limit | Memory Request | Memory Limit |
|------------|------------|-----------|----------------|--------------|
| Node.js    | 100m       | 250m      | 128Mi          | 256Mi        |
| MongoDB    | 500m       | 1000m     | 512Mi          | 1Gi          |



## Storage

MongoDB uses a PersistentVolume backed by hostPath at /data/mongo on the node. Data survives pod restarts as long as the pod stays on the same node. If the pod moves to a different node, the data stays on the original node.



## Security

MongoDB credentials are stored in a Kubernetes Secret and injected into both the StatefulSet and the Node.js app via secretKeyRef. No hardcoded credentials anywhere in the code.



## CI/CD Pipeline

GitHub Actions automatically builds and pushes the Docker image to Docker Hub on every push to main. Deployment to Kubernetes is done manually after the pipeline runs.


Push to GitHub
      |
GitHub Actions builds Docker image
      |
Pushes to Docker Hub
      |
kubectl apply manually




## Requirements

- Kubernetes cluster (Docker Desktop used here)
- Docker Hub account
- GitHub repository with these secrets set:
  - DOCKER_USERNAME
  - DOCKER_PASSWORD



## Deploy

bash
# build and push image
docker build -t yourdockerhubusername/nodejs-mongo-k8s:latest .
docker push yourdockerhubusername/nodejs-mongo-k8s:latest

# deploy MongoDB first
kubectl apply -f k8s/mongo.yaml

# wait for mongo to be running
kubectl get pods -w

# deploy the app
kubectl apply -f k8s/app.yaml

# test it
kubectl port-forward svc/nodejs-app 3000:3000


Open http://localhost:3000



 Update after a pipeline run


kubectl rollout restart deployment nodejs-app




# Local only

 This demo runs on a local cluster and is not suitable for production as-is. Moving to production requires:

1. LoadBalancer - cloud providers assign a real external IP automatically
2. TLS - handled via cert-manager + Let's Encrypt
3. Real domain instead of localhost
4. Persistent storage backed by real cloud storage like EBS, GCP Persistent Disk, or Azure Disk
5. Proper RBAC and NetworkPolicies
