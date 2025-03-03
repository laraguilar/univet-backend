# Dockerfile
FROM node:18-alpine AS builder

WORKDIR /

# Copia os arquivos de configuração
COPY package*.json ./

# Instala as dependências
RUN npm ci

# Gera o cliente Prisma
RUN npx prisma generate

# Copia o resto do código fonte
COPY . .

# Compila a aplicação
RUN npm run build

# Production stage
FROM node:18-alpine

WORKDIR /

# Copia os arquivos de configuração
COPY package*.json ./
COPY . ./prisma/

# Instala apenas as dependências de produção
RUN npm ci --only=production

RUN npm install dotenv-cli@8.0.0 prisma@6.3.1
# Gera o cliente Prisma para produção

# Copia os arquivos compilados do estágio anterior
COPY --from=builder /dist ./dist

# Script para aguardar o banco e iniciar a aplicação
COPY docker-entrypoint.sh ./
RUN chmod +x docker-entrypoint.sh

EXPOSE 5001

ENV NODE_ENV=production

# Usa o script de entrypoint ao invés de iniciar direto
ENTRYPOINT ["./docker-entrypoint.sh"]

