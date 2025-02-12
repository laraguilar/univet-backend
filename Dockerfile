# Build stage
FROM node:18-alpine AS builder

# Define o diretório de trabalho
WORKDIR /

# Copia todo o conteúdo do projeto
COPY . .

# Instala as dependências
RUN npm ci

# Compila a aplicação
RUN npm run build

# Production stage
FROM node:18-alpine

# Define o diretório de trabalho
WORKDIR /

# Copia os arquivos de configuração do projeto
COPY package*.json ./

# Instala apenas as dependências de produção
RUN npm ci --only=production

# Copia os arquivos compilados do estágio anterior
COPY --from=builder /dist ./dist

# Expõe a porta 5001
EXPOSE 5001

# Define as variáveis de ambiente para produção
ENV NODE_ENV=production

# Comando para iniciar a aplicação
CMD ["npm", "run", "start:prod"]