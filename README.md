# Your Car Your Way

Application web de démonstration pour le projet **Your Car Your Way**.

Le projet contient deux parties :

* `front` : application Angular utilisée par les clients et les agents support.
* `back` : API Spring Boot permettant de gérer les utilisateurs, les conversations et les messages du support client.

L’objectif principal est de permettre à un client de contacter le service support via un chat, et à un agent support de prendre en charge une conversation puis d’échanger avec le client en temps réel.

---

# Frontend - Angular

## Description

Le frontend Angular permet aux clients et aux agents support d’utiliser l’application via une interface web.

Les clients peuvent créer une conversation avec le support, consulter leurs conversations et envoyer des messages.

Les agents support peuvent consulter les conversations disponibles, prendre en charge une conversation, répondre au client et fermer une conversation.

## Technologies utilisées

* Angular
* TypeScript
* RxJS
* Angular Router
* FormsModule
* WebSocket / STOMP
* SockJS

## Fonctionnalités

### Côté client

* Connexion simulée avec un compte client
* Accès à l’espace support client
* Création d’une nouvelle conversation
* Consultation de ses conversations
* Accès au détail d’une conversation
* Envoi et réception de messages en temps réel

### Côté support

* Connexion simulée avec un compte agent support
* Consultation des conversations disponibles
* Consultation des conversations assignées à l’agent connecté
* Prise en charge d’une conversation
* Accès au chat support
* Réponse au client en temps réel
* Fermeture d’une conversation

## Prérequis

Avant de lancer le frontend, il faut installer :

* Node.js
* npm
* Angular CLI

Installation d’Angular CLI si nécessaire :

```bash
npm install -g @angular/cli
```

## Installation

Depuis le dossier `front` :

```bash
npm install
```

## Lancement en local

```bash
ng serve
```

L’application sera disponible à l’adresse :

```txt
http://localhost:4200
```

## Comptes de test

L’authentification est simulée côté frontend.

### Client

```txt
Email : client@test.com
Mot de passe : password
```

### Support

```txt
Email : support@test.com
Mot de passe : password
```

---

# Backend - Spring Boot

## Description

Le backend Spring Boot permet de gérer les utilisateurs, les conversations de support client et les messages échangés entre un client et un agent support.

Il expose une API REST pour les opérations classiques et utilise WebSocket / STOMP pour mettre à jour le chat en temps réel.

## Technologies utilisées

* Java
* Spring Boot
* Spring Web
* Spring Data JPA
* MySQL
* WebSocket / STOMP
* Maven

## Fonctionnalités

* Création et récupération des utilisateurs
* Création d’une conversation par un client
* Récupération des conversations côté client
* Récupération des conversations côté support
* Assignation d’une conversation à un agent support
* Fermeture d’une conversation
* Envoi et récupération des messages
* Mise à jour du chat en temps réel via WebSocket

## Prérequis

Avant de lancer le backend, il faut installer :

* Java 17 ou supérieur
* Maven
* MySQL

## Configuration de la base de données

Créer uniquement la base de données MySQL :

```sql
CREATE DATABASE your_car_your_way_chat
CHARACTER SET utf8mb4
COLLATE utf8mb4_unicode_ci;
```

Les tables sont ensuite créées automatiquement par Spring Boot à partir des entités JPA.

## Configuration du fichier `application.properties`

Dans le fichier `application.properties`, configurer l’accès à la base de données :

```properties
spring.datasource.url=jdbc:mysql://localhost:3306/your_car_your_way_chat
spring.datasource.username=root
spring.datasource.password=your_password

spring.jpa.hibernate.ddl-auto=update
spring.jpa.show-sql=true

server.port=8081
```

Pendant le développement, pour recréer les tables automatiquement, il est possible d’utiliser temporairement :

```properties
spring.jpa.hibernate.ddl-auto=create
```

Puis remettre ensuite :

```properties
spring.jpa.hibernate.ddl-auto=update
```

## Lancement du backend

Depuis le dossier `back` :

```bash
mvn spring-boot:run
```

Le backend sera disponible à l’adresse :

```txt
http://localhost:8081
```

## Création des utilisateurs de test

Après le premier lancement du backend, Spring Boot crée les tables automatiquement.

Il faut ensuite insérer les deux utilisateurs utilisés par le frontend :

```sql
INSERT INTO utilisateur (utilisateur_id, nom, prenom, email, password, role, created_at)
VALUES
(1, 'Test', 'Client', 'client@test.com', 'password', 'CUSTOMER', NOW()),
(2, 'Test', 'Support', 'support@test.com', 'password', 'SUPPORT_AGENT', NOW());
```

Si la colonne `created_at` n’existe pas dans la table `utilisateur`, utiliser :

```sql
INSERT INTO utilisateur (utilisateur_id, nom, prenom, email, password, role)
VALUES
(1, 'Test', 'Client', 'client@test.com', 'password', 'CUSTOMER'),
(2, 'Test', 'Support', 'support@test.com', 'password', 'SUPPORT_AGENT');
```

## Endpoints principaux

### Utilisateurs

```txt
POST /api/utilisateurs
GET  /api/utilisateurs
GET  /api/utilisateurs/{id}
```

### Conversations

```txt
POST /api/conversations/customer/{customerId}
GET  /api/conversations/customer/{customerId}
GET  /api/conversations/support
GET  /api/conversations/{conversationId}
PUT  /api/conversations/{conversationId}/assign/{agentId}
PUT  /api/conversations/{conversationId}/close
```

### Messages

```txt
GET  /api/messages/conversation/{conversationId}
POST /api/messages
```

Exemple de body pour l’envoi d’un message :

```json
{
  "conversationId": 1,
  "senderId": 1,
  "content": "Bonjour, j'ai besoin d'aide."
}
```

## WebSocket

Le backend expose un endpoint WebSocket :

```txt
/ws
```

Le topic utilisé pour les messages d’une conversation est :

```txt
/topic/conversations/{conversationId}/messages
```

Dans cette version du POC, lorsqu’un message est envoyé, le backend sauvegarde le message puis renvoie la liste complète des messages de la conversation via WebSocket.

## Remarque sur l’authentification

Pour ce POC, l’authentification est simulée côté frontend.

Le backend ne vérifie pas encore les identifiants ni les rôles avec un système JWT.

Une évolution possible serait d’ajouter :

* une authentification réelle côté backend
* un système de token JWT
* une protection des endpoints selon les rôles
* le chiffrement des mots de passe avec BCrypt
