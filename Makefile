build: 
	docker build -t registry.itforge.io/classnalytic/api .
push:
	docker push registry.itforge.io/classnalytic/api
