setup:
	@[ ! -f infra/.env ] && cp infra/.env.example infra/.env || echo "infra/.env exists"
	@[ ! -f backend/.env ] && cp backend/.env.example backend/.env || echo "backend/.env exists"
	@[ ! -f frontend/.env ] && cp frontend/.env.example frontend/.env || echo "frontend/.env exists"

dev: setup
	docker compose -f infra/docker-compose.yml up --watch

stop:
	docker compose -f infra/docker-compose.yml down

clean: stop
	docker compose -f infra/docker-compose.yml down -v
	docker volume rm $(docker volume ls -q)
	docker rmi $(docker images -q)
	docker network rm $(docker network ls -q)