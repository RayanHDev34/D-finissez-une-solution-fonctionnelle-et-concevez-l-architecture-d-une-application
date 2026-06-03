# Your Car Your Way - Frontend

Frontend Angular de l'application **Your Car Your Way**.  
Cette application permet aux clients de contacter le service support et aux agents support de gérer les conversations en temps réel.

## Technologies utilisées

- Angular
- TypeScript
- RxJS
- Angular Router
- FormsModule
- WebSocket / STOMP
- SockJS

## Fonctionnalités

### Côté client

- Connexion simulée avec un compte client
- Accès à l'espace support client
- Création d'une nouvelle conversation
- Consultation de ses conversations
- Accès au détail d'une conversation
- Envoi et réception de messages en temps réel

### Côté support

- Connexion simulée avec un compte agent support
- Consultation des conversations disponibles
- Consultation des conversations assignées à l'agent connecté
- Prise en charge d'une conversation
- Accès au chat support
- Réponse au client en temps réel
- Fermeture d'une conversation

## Prérequis

Avant de lancer le projet, il faut avoir installé :

- Node.js
- npm
- Angular CLI

Installation d'Angular CLI si nécessaire :

```bash

npm install -g @angular/cli

Install les lib
npm install

Lancer l'app en local
ng serve

# Your Car Your Way - Backend Chat Support

Backend Spring Boot de l'application **Your Car Your Way**.  
Ce service permet de gérer les utilisateurs, les conversations de support client et les messages échangés en temps réel entre un client et un agent support.

## Technologies utilisées

- Java
- Spring Boot
- Spring Web
- Spring Data JPA
- MySQL
- WebSocket / STOMP
- Maven

## Fonctionnalités

- Création et récupération des utilisateurs
- Création d'une conversation par un client
- Récupération des conversations côté client
- Récupération des conversations côté support
- Assignation d'une conversation à un agent support
- Fermeture d'une conversation
- Envoi et récupération des messages
- Mise à jour du chat en temps réel via WebSocket

## Prérequis

Avant de lancer le projet, il faut avoir installé :

- Java 17 ou supérieur
- Maven
- MySQL

## Configuration de la base de données
Il faut dans application properties configurer pour acceder a la bdd
Créer uniquement la base de données MySQL :

```sql
CREATE DATABASE your_car_your_way_chat
CHARACTER SET utf8mb4
COLLATE utf8mb4_unicode_ci;

