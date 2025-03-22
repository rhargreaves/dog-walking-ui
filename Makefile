.DEFAULT_GOAL := help

# Variables
PROJECT_NAME := dog-walking-ui
BUILD_DIR := build
WRANGLER := node_modules/.bin/wrangler

ifneq (,$(wildcard .env))
include .env
export CLOUDFLARE_API_KEY:=$(CLOUDFLARE_API_KEY)
export CLOUDFLARE_ACCOUNT_ID:=$(CLOUDFLARE_ACCOUNT_ID)
export REACT_APP_API_BASE_URL:=$(API_URL)
export REACT_APP_COGNITO_USER_POOL_ID:=$(COGNITO_USER_POOL_ID)
export REACT_APP_COGNITO_CLIENT_ID:=$(COGNITO_CLIENT_ID)
export REACT_APP_AWS_REGION:=$(AWS_REGION)
endif

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

## Create Cloudflare Pages project
create-project: login
	$(WRANGLER) pages project create $(PROJECT_NAME) --production-branch=main
.PHONY: create-project

## Deploy to Cloudflare Pages
deploy: build
	$(WRANGLER) pages deploy $(BUILD_DIR) --project-name=$(PROJECT_NAME) --commit-dirty=true
.PHONY: deploy


## Clean build artifacts
clean:
	rm -rf $(BUILD_DIR)
.PHONY: clean