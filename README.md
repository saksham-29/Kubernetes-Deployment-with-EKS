
# Kubernetes Deployment with EKS

This repository demonstrates a **production-grade Kubernetes deployment pipeline** on **AWS EKS** using **GitOps principles**.

The project implements:
- Secure CI using GitHub Actions + OIDC
- Immutable Docker images stored in AWS ECR
- Helm-based Kubernetes manifests
- ArgoCD for continuous delivery
- AWS ALB Ingress for public access

---

## Architecture Overview

```

Developer → GitHub → GitHub Actions (CI)
↓
Docker Image
↓
AWS ECR
↓
Git (Helm desired state update)
↓
ArgoCD (CD)
↓
Amazon EKS
↓
ALB Ingress → Browser

```

---

## Repository Structure

```

Kubernetes-Deployment-with-EKS/
│
├── app/                         # Application source (developer owned)
│   ├── src/
│   │   └── index.js
│   ├── package.json
│   └── package-lock.json
│
├── devops/                      # Platform / DevOps owned
│   ├── docker/
│   │   ├── Dockerfile
│   │   └── .dockerignore
│   │
│   ├── helm/
│   │   └── demo-app/
│   │       ├── Chart.yaml
│   │       ├── values.yaml
│   │       └── templates/
│   │           ├── deployment.yaml
│   │           ├── service.yaml
│   │           └── ingress.yaml
│   │
│   └── argocd/
│       └── application.yaml
│
├── .github/
│   └── workflows/
│       └── ci-cd.yml
│
└── README.md

```

---

## Technology Stack

| Component | Purpose |
|---------|--------|
| Amazon EKS | Managed Kubernetes |
| AWS ECR | Container registry |
| Docker | Application containerization |
| GitHub Actions | CI pipeline |
| Helm | Kubernetes packaging |
| ArgoCD | GitOps-based CD |
| AWS ALB Ingress | External traffic routing |

---

## CI Pipeline (Build Only)

**Trigger**
- Runs only when application or Docker files change
- Does NOT run for Helm changes

**Responsibilities**
- Build Docker image
- Tag image with Git SHA
- Push image to AWS ECR

CI never deploys to Kubernetes.

---

## CD Pipeline (GitOps with ArgoCD)

**Trigger**
- Change to Helm `values.yaml`

**Responsibilities**
- Detect desired state change
- Render Helm chart
- Apply manifests to EKS
- Continuously self-heal drift

---

## Deployment Flow

1. Developer pushes application code
2. GitHub Actions builds and pushes image to ECR
3. Image tag is updated in Helm `values.yaml`
4. ArgoCD detects Git change
5. ArgoCD deploys application to EKS
6. ALB Ingress exposes the service publicly

---

## Helm Image Update (Deployment Trigger)

File:
```

devops/helm/demo-app/values.yaml

````

Example:
```yaml
image:
  repository: 123456789012.dkr.ecr.us-east-1.amazonaws.com/demo-app
  tag: f6618eee90e87580bae510d415907b5b7a485f16
````

Updating this file and pushing to Git deploys a new version.

---

## ArgoCD Application Bootstrap (One-Time)

```bash
kubectl apply -f devops/argocd/application.yaml
```

After this:

* All deployments are Git-driven
* kubectl apply is no longer used

---

## Accessing the Application

```bash
kubectl get ingress
kubectl describe ingress demo-app
```

Open the ALB DNS name in a browser:

```
http://<ALB_DNS_NAME>
```

Health check:

```bash
curl http://<ALB_DNS_NAME>/health
```

---

## Common Commands

```bash
# Check ArgoCD app status
kubectl get application demo-app -n argocd

# Watch pod rollout
kubectl get pods -w

# Check deployment status
kubectl rollout status deployment/demo-app

# Validate Helm locally
helm lint devops/helm/demo-app
```

## Interview-Ready Summary

> This project implements a production-grade GitOps pipeline on AWS EKS where GitHub Actions builds immutable images, Helm defines desired state, and ArgoCD continuously deploys and reconciles workloads using Git as the single source of truth.



