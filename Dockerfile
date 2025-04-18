# Étape 1 : Build de l'application
FROM node:14 AS build

# Installer Angular CLI globalement
RUN npm install -g @angular/cli@8.3.25

# Définir le répertoire de travail dans le conteneur
WORKDIR /app

# Copier uniquement les fichiers nécessaires à l'installation
COPY package.json ./

# Installer python
RUN apt-get update && apt-get install -y python2 build-essential

# Installer les dépendances (node_modules généré ici uniquement)
RUN npm install --legacy-peer-deps

# Copier tout sauf ce qui est listé dans .dockerignore
COPY . .

# Compiler l'application Angular
RUN ng build --output-path=dist/ussgb

# Étape 2 : Image NGINX pour servir les fichiers
FROM nginx:alpine

# Copier les fichiers compilés dans le dossier de nginx
COPY --from=build /app/dist/* /usr/share/nginx/html

# Exposer le port par défaut de nginx
EXPOSE 80

# Lancer nginx en mode foreground
CMD ["nginx", "-g", "daemon off;"]
