.DEFAULT_GOAL := help

# Variables
PROJECT_NAME := dog-walking-ui
BUILD_DIR := build
WRANGLER := node_modules/.bin/wrangler
API_URL ?= https://api.example.com
COGNITO_USER_POOL_ID := your-cognito-user-pool-id
COGNITO_CLIENT_ID := your-cognito-client-id
AWS_REGION := your-aws-region

## Help command
help:
	@echo "Dog Walking UI - Cloudflare Pages Deployment"
	@echo ""
	@echo "Usage:"
	@echo "  make start              - Start development server"
	@echo "  make install            - Install dependencies"
	@echo "  make build              - Build the application"
	@echo "  make create-project     - Create new Cloudflare Pages project"
	@echo "  make deploy             - Deploy to Cloudflare Pages (development)"
	@echo "  make deploy-prod        - Deploy to Cloudflare Pages (production)"
	@echo "  make set-env-dev        - Set API URL for development environment"
	@echo "  make set-env-prod       - Set API URL for production environment"
	@echo "  make login              - Login to Cloudflare"
	@echo "  make clean              - Remove build artifacts"
	@echo ""
	@echo "Environment Variables:"
	@echo "  API_URL                 - Dog Walking API URL (default: $(API_URL))"
	@echo "  PROJECT_NAME            - Cloudflare Pages project name (default: $(PROJECT_NAME))"
	@echo "  COGNITO_USER_POOL_ID     - Cognito User Pool ID (default: $(COGNITO_USER_POOL_ID))"
	@echo "  COGNITO_CLIENT_ID        - Cognito Client ID (default: $(COGNITO_CLIENT_ID))"
	@echo "  AWS_REGION              - AWS Region (default: $(AWS_REGION))"
	@echo ""
.PHONY: help

## Start development server
start: install
	npm start
.PHONY: start

## Start local auth server
start-auth:
	npm run start:auth
.PHONY: start-auth

## Start all development servers (UI + Auth)
dev: install
	npm run dev
.PHONY: dev

## Install dependencies
install:
	npm install
.PHONY: install

## Build the application
build:
	npm run build
.PHONY: build

## Login to Cloudflare
login:
	$(WRANGLER) login
.PHONY: login

## Create Cloudflare Pages project
create-project: login
	$(WRANGLER) pages project create $(PROJECT_NAME) --production-branch=main
.PHONY: create-project

## Set environment variables for development
set-env-dev: login
	$(WRANGLER) pages project set-env $(PROJECT_NAME) \
	--binding REACT_APP_API_BASE_URL="$(API_URL)" \
	--binding REACT_APP_COGNITO_USER_POOL_ID="$(COGNITO_USER_POOL_ID)" \
	--binding REACT_APP_COGNITO_CLIENT_ID="$(COGNITO_CLIENT_ID)" \
	--binding REACT_APP_AWS_REGION="$(AWS_REGION)" \
	--preview
.PHONY: set-env-dev

## Set environment variables for production
set-env-prod: login
	$(WRANGLER) pages project set-env $(PROJECT_NAME) \
	--binding REACT_APP_API_BASE_URL="$(API_URL)" \
	--binding REACT_APP_COGNITO_USER_POOL_ID="$(COGNITO_USER_POOL_ID)" \
	--binding REACT_APP_COGNITO_CLIENT_ID="$(COGNITO_CLIENT_ID)" \
	--binding REACT_APP_AWS_REGION="$(AWS_REGION)" \
	--production
.PHONY: set-env-prod

## Deploy to Cloudflare Pages (development)
deploy: build
	$(WRANGLER) pages publish $(BUILD_DIR) \
		--project-name=$(PROJECT_NAME)
.PHONY: deploy

## Deploy to Cloudflare Pages (production)
deploy-prod: build
	$(WRANGLER) pages publish $(BUILD_DIR) \
		--project-name=$(PROJECT_NAME) \
		--branch=main \
		--commit-dirty=true
.PHONY: deploy-prod

## Clean build artifacts
clean:
	rm -rf $(BUILD_DIR)
.PHONY: clean