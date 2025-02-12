# Etapa 1: Builder (Construção da Aplicação)
FROM node:20-alpine AS builder

WORKDIR /app

# Copia apenas os arquivos necessários para a instalação de dependências
COPY package.json package-lock.json ./
RUN npm install --only=production

# Copia o restante dos arquivos
COPY . .

# Garante que a build do NestJS seja feita corretamente
RUN npm run build

# Etapa 2: Produção
FROM node:20-alpine AS runner

WORKDIR /app

# Copia as dependências já instaladas
COPY --from=builder /app/node_modules ./node_modules

# Copia a pasta dist (código compilado)
COPY --from=builder /app/dist ./dist

# Copia os arquivos de configuração necessários
COPY package.json ./

# Exposição da porta que o NestJS usa
EXPOSE 5001

# Comando de inicialização do NestJS
CMD ["node", "dist/main"]