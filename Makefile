.DEFAULT_GOAL := help
PROJECT_NAME := dog-walking-ui
BUILD_DIR := build
WRANGLER := node_modules/.bin/wrangler
BUILD_TIMESTAMP := $(shell date -u +"%Y-%m-%dT%H:%M:%SZ")

ifneq (,$(wildcard .env))
include .env
endif

export NODE_ENV:=$(NODE_ENV)
export CLOUDFLARE_API_TOKEN:=$(CLOUDFLARE_API_TOKEN)
export CLOUDFLARE_ACCOUNT_ID:=$(CLOUDFLARE_ACCOUNT_ID)
export REACT_APP_API_BASE_URL:=$(API_URL)
export REACT_APP_COGNITO_USER_POOL_ID:=$(COGNITO_USER_POOL_ID)
export REACT_APP_COGNITO_CLIENT_ID:=$(COGNITO_CLIENT_ID)
export REACT_APP_AWS_REGION:=$(AWS_REGION)
export REACT_APP_BUILD_TIMESTAMP:=$(BUILD_TIMESTAMP)

## Start development server
start: install
	npm start
.PHONY: start

start-auth:
	npm run start:auth
.PHONY: start-auth

## Start all development servers (UI + local API server)
dev: install
	npm run dev
.PHONY: dev

install:
	npm install
.PHONY: install

## Ensure scripts directory exists
ensure-scripts-dir:
	@mkdir -p scripts && chmod +x scripts/update-version.js
.PHONY: ensure-scripts-dir

## Build the application with timestamp
build: ensure-scripts-dir
	npm run build
.PHONY: build

create-project:
	$(WRANGLER) pages project create $(PROJECT_NAME) --production-branch=main
.PHONY: create-project

deploy: build
	$(WRANGLER) pages deploy $(BUILD_DIR) \
	--project-name=$(PROJECT_NAME) \
	--commit-dirty=true \
	--branch=$(BRANCH)
.PHONY: deploy

clean:
	rm -rf $(BUILD_DIR)
.PHONY: clean