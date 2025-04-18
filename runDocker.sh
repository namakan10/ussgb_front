docker build -t ussgb_frontend:1.0.0 .
docker rm -f ussgb_front
docker run -p 8080:80 --name ussgb_front ussgb_frontend:1.0.0
