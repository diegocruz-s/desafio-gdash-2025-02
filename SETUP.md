# 🌤 Projeto Clima

Sistema completo para coleta, armazenamento e visualização de dados meteorológicos, utilizando **NestJS** (backend), **Vite** (frontend), **Python** (coletor), **Go** (worker), **MongoDB** e **RabbitMQ**.

---

## 📂 Estrutura do projeto

```

.
├── backend/       # API NestJS
├── collector/     # Coletor Python
├── frontend/      # Frontend Vite
├── worker/        # Worker Go
└── docker-compose.yml

````

---

## ⚙️ Pré-requisitos

- Docker e Docker Compose
- Node.js (para rodar localmente, se necessário)
- Python (para rodar o coletor local, se necessário)
- Go (para rodar o worker local, se necessário)

---

## 🔑 Variáveis de ambiente

Os arquivos `.env.example` são apenas uma referência, os arquivos .env devem ser criados seguindo cada um dos exemplos apresentados a seguir

### Backend (`backend/api/.env.example`)
```env
MONGO_URI=mongodb://mongo:27017/climadb
JWT_SECRET=seu_segredo_jwt
````

### Collector (`collector/.env.example`)

```env
LAT=sua_latitude
LON=sua_longitude
CITY=sua_cidade

RABBITMQ_URL="amqp://guest:guest@rabbitmq:5672/"
RABBITMQ_EXCHANGE="weather"
RABBITMQ_ROUTING_KEY="weather.snapshot"
RABBITMQ_HOST=rabbitmq
RABBITMQ_PORT=5672
RABBITMQ_USER=guest
RABBITMQ_PASS=guest
RABBITMQ_QUEUE=weather_queue
```

### Frontend (`frontend/.env.example`)

```env
VITE_API_URL=http://localhost:3000
```

### Worker (`worker/.env.example`)

```env
RABBITMQ_URL="amqp://guest:guest@rabbitmq:5672/"
RABBITMQ_QUEUE="weather_queue"
API_URL="http://api:3000/weather"
```

---

## 🚀 Executando tudo com Docker Compose

Na raiz do projeto:

```bash
# Subir todos os serviços
docker compose up --build

# Parar todos os serviços
docker compose down -v
```

### Serviços incluídos

| Serviço        | Porta / Info        |
| -------------- | ------------------- |
| MongoDB        | 27017               |
| RabbitMQ       | 5672, painel: 15672 |
| Worker Go      | -                   |
| Coletor Python | -                   |
| API NestJS     | 3000                |
| Frontend Vite  | 5173                |

---

## 🛠 Rodando serviços individualmente

### API NestJS

```bash
cd backend/api
npm install
npm run start:dev
```

### Frontend Vite

```bash
cd frontend
npm install
npm run dev
```

### Coletor Python

```bash
cd collector
python main.py
```

### Worker Go

```bash
cd worker
go run main.go
```

---

## 🌐 URLs principais

| Serviço        | URL                                                    |
| -------------- | ------------------------------------------------------ |
| Frontend       | [http://localhost:5173](http://localhost:5173)         |
| API            | [http://localhost:3000](http://localhost:3000)         |
| RabbitMQ Admin | [http://localhost:15672](http://localhost:15672)       |

---

## 📌 Rotas da API

| Método | Rota                 | Descrição                                                                                     |
| ------ | -------------------- | ------------                                                                                  |
| POST   | /signin              | Autenticação                                                                                  |
| POST   | /weather             | Criação de um registro de tempo (acessado pelo Go)                                            |
| GET    | /weather/logs        | Listar registros de tempo (aceita parâmetro ?page={number})                                   |
| GET    | /weather/latest      | Lista último registro de tempo                                                                |
| GET    | /weather/export.csv  | Exporta registros de tempo em CSV                                                             |
| GET    | /weather/export.xlsx | Exporta registros de tempo em XLSX                                                            |
| GET    | /weather/insights    | Informações adicionais sobre um período de tempo coletado (aceita parâmetro ?period={number}) |
| POST   | /user                | Criação de usuário                                                                            |
| GET    | /user/:id            | Busca um usuário pelo id                                                                      |
| PATCH  | /user/:id            | Atualiza um usuário pelo id                                                                   |
| DELETE | /user/:id            | Deleta um usuário pelo id                                                                     |

---

## 👤 Usuário padrão

* **Login:** emailPadrao@example.com
* **Senha:** SenhaPadrao123


---

## 🎥 Vídeo explicativo

Link do vídeo no YouTube (não listado)

