FROM node:20-alpine AS builder
WORKDIR /app

# Copia package.json e package-lock.json
COPY package*.json ./

# Instala TODAS as dependências (incluindo devDependencies necessárias para build)
RUN npm install

# Copia o resto dos arquivos do projeto
COPY . .

# Executa o build
RUN npm run build

# Stage de produção
FROM node:20-alpine
WORKDIR /app

# Copia package.json e package-lock.json
COPY package*.json ./

# Instala apenas as dependências de produção
RUN npm install --production

# Copia a pasta dist do builder
COPY --from=builder /app/dist ./dist

EXPOSE 5001

CMD ["node", "dist/main"]