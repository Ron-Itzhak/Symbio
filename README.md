## Symbio app

the application contains frontend in next.js, api in golang and MySql database
First, run the development composition file that contains the api,ui,db witho hot reload:

```bash
docker-compose -f docker-compose-dev.yml build
docker-compose -f docker-compose-dev.yml up --watch

docker-compose -f docker-compose-dev.yml up --build --watch

```

you can also , run the prd file :

```bash
docker-compose -f docker-compose-prd.yml up --build
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the frontend page

## Postman collection

the postman collection can be imported  
file name: Symbio Api.postman_collection.json

## Cli script

to run the script from main folder location, first need to run the main docker-compose file (dev/prd) to get the database working, than the script will get the posts and export them into json file in the next app and the docker will run the next.js app with nginx

```bash
cd cli-script
go run generate_posts.go
docker-compose up --build
```

Open [http://localhost](http://localhost) with your browser to see the frontend page
