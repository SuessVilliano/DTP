#!/bin/bash
# ==========================================
# DTP Deploy Script — DigitalOcean App Platform
# ==========================================
set -e

APP_NAME="dtp"
REGISTRY="registry.digitalocean.com"
IMAGE_NAME="$REGISTRY/$APP_NAME/dtp-app"
DO_APP_ID="${DO_APP_ID:-}"

echo "🚀 DTP Deploy Script"
echo "===================="

command -v docker >/dev/null 2>&1 || { echo "❌ docker not found"; exit 1; }
command -v doctl >/dev/null 2>&1 || { echo "❌ doctl not found. Install: https://docs.digitalocean.com/reference/doctl/how-to/install/"; exit 1; }

if [ ! -f .env ]; then
    echo "❌ .env file not found. Copy .env.example and fill in your values."
    exit 1
fi

export $(grep -v '^#' .env | xargs)

GIT_SHA=$(git rev-parse --short HEAD 2>/dev/null || echo "latest")
TIMESTAMP=$(date +%Y%m%d-%H%M%S)
IMAGE_TAG="$IMAGE_NAME:$TIMESTAMP-$GIT_SHA"
IMAGE_LATEST="$IMAGE_NAME:latest"

echo "📦 Building Docker image: $IMAGE_TAG"

docker build \
    --platform linux/amd64 \
    --build-arg NEXT_PUBLIC_APP_URL="$NEXT_PUBLIC_APP_URL" \
    --build-arg NEXT_PUBLIC_SOLANA_RPC_URL="$NEXT_PUBLIC_SOLANA_RPC_URL" \
    --build-arg NEXT_PUBLIC_DTP_TOKEN_MINT="$NEXT_PUBLIC_DTP_TOKEN_MINT" \
    --build-arg NEXT_PUBLIC_BINANCE_WS_URL="$NEXT_PUBLIC_BINANCE_WS_URL" \
    --build-arg NEXT_PUBLIC_EXOCLICK_PUBLISHER_ID="$NEXT_PUBLIC_EXOCLICK_PUBLISHER_ID" \
    -t "$IMAGE_TAG" \
    -t "$IMAGE_LATEST" \
    .

echo "🔑 Logging in to DigitalOcean Container Registry"
doctl registry login

echo "📤 Pushing image to registry"
docker push "$IMAGE_TAG"
docker push "$IMAGE_LATEST"

if [ -n "$DO_APP_ID" ]; then
    echo "🌊 Deploying to DigitalOcean App Platform (App ID: $DO_APP_ID)"
    doctl apps create-deployment "$DO_APP_ID" --wait
    echo "✅ Deployment triggered."
else
    echo "⚠️  DO_APP_ID not set. Image built and pushed. Deploy manually:"
    echo "   docker-compose up -d"
fi

echo ""
echo "🎉 Build & push complete!"
echo "   Image: $IMAGE_TAG"
