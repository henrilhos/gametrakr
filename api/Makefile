project_name = gametrakr
image_name = gametrakr:latest

help: ## This help dialog
	@grep -F -h "##" $(MAKEFILE_LIST) | grep -F -v fgrep | sed -e 's/\\$$//' | sed -e 's/##//'

run-local: ## Run the app locally
	@air

requirements: ## Generate go.mod & go.mod files
	@go mod tidy

clean-packages: ## Clean packages
	@go clean -modcache

build: ## Generate docker image
	@docker build -t $(image_name) .

build-no-cache: ## Generate docker image with no cache
	@docker build --no-cache -t $(image_name) .

compose-up: ## Run docker compose with dependencies
	@make compose-down;
	@docker-compose up -d;

compose-down: ## Stop docker compose with dependencies
	@docker-compose down
