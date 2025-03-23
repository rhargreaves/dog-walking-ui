.DEFAULT_GOAL := help
PROJECT_NAME := dog-walking-ui
BUILD_DIR := build
WRANGLER := node_modules/.bin/wrangler

ifneq (,$(wildcard .env))
include .env
endif

export CLOUDFLARE_API_TOKEN:=$(CLOUDFLARE_API_TOKEN)
export CLOUDFLARE_ACCOUNT_ID:=$(CLOUDFLARE_ACCOUNT_ID)
export REACT_APP_API_BASE_URL:=$(API_URL)
export REACT_APP_COGNITO_USER_POOL_ID:=$(COGNITO_USER_POOL_ID)
export REACT_APP_COGNITO_CLIENT_ID:=$(COGNITO_CLIENT_ID)
export REACT_APP_AWS_REGION:=$(AWS_REGION)

## Start development server
start: install
	npm start
.PHONY: start

start-auth:
	npm run start:auth
.PHONY: start-auth

## Start all development servers (UI + Auth)
dev: install
	npm run dev
.PHONY: dev

install:
	npm install
.PHONY: install

build:
	npm run build
.PHONY: build

create-project:
	$(WRANGLER) pages project create $(PROJECT_NAME) --production-branch=main
.PHONY: create-project

deploy: build
	$(WRANGLER) pages deploy $(BUILD_DIR) --project-name=$(PROJECT_NAME) --commit-dirty=true
.PHONY: deploy

clean:
	rm -rf $(BUILD_DIR)
.PHONY: clean