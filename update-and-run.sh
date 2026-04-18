#!/bin/bash
git pull origin main || echo "Git pull ignored or failed"
docker-compose up -d --build
