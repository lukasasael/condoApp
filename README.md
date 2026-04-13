# CondoApp 🏢

A Plataforma Integrada de Gestão de Condomínios (MVP) que unifica a experiência entre **Moradores**, **Porteiros** e **Síndicos/Administradores** com dados atualizados em tempo real.

O projeto é estruturado num formato **Monolítico Modular** (Monorepo), facilitando o desenvolvimento cross-layer e o reaproveitamento de tipagens entre Frontend e Backend.

---

## 🏗 Arquitetura

Este repositório utiliza **Turborepo** e **pnpm workspaces**. O código está distribuído na pasta `apps/`:

1. **`apps/api` (Backend)**: Desenvolvido em **NestJS** com **TypeORM**. Expõe a API RESTful e hospeda toda a lógica de negócio, autenticações (JWT), roles guards, validações ativas de horários/reservas e comunicação com o PostgreSQL e Redis. A API roda, por padrão, em `100% aberto` para a rede local (`0.0.0.0`) para permitir validação via app mobile em *devices* físicos.
2. **`apps/web` (Painel Administrativo & Portaria)**: Desenvolvido em **React.js + Vite** e **TypeScript**. Design *Glassmorphism* limpo. Gerencia dois universos:
   - *Painel Portaria*: Operação de validação de visitantes e aberturas rápidas de ocorrências (Time-to-action de segundos).
   - *Painel Síndico*: Visão Macro com *Dashboard* de Estatísticas (Ocorrências em aberto, reservas agendadas e mural de comunicados).
3. **`apps/mobile` (App do Morador)**: Desenvolvido nativamente em **Flutter/Dart**. Foco em experiência fluida, sem frescuras. Permite ao residente registrar seus visitantes de forma antecipada, criar protocolos de reserva de área comum que são liquidados em tempo real no dashboard do Síndico, e acompanhar comunicados sem delay.

O sistema de base de dados é hospedado num empacotamento **Docker** local via Docker Desktop (PostgreSQL e Redis).

---

## 🔒 Credenciais Padrão (Seed)
Ao rodar a Seed do banco de dados na 1º configuração, os seguintes perfis já estarão instanciados na massa de dados com a senha padrão `senha123`:
* **Síndico:** `admin@condo.com`
* **Porteiro:** `porteiro@condo.com`
* **Morador:** `morador@condo.com`

---

## 🚀 Como Inicializar o Ambiente Local

### Pré-requisitos:
- [Docker Desktop](https://www.docker.com/products/docker-desktop/) ativo na máquina para suportar a infraestrutura de dados DB.
- [Node.js](https://nodejs.org/) `>= 18.x` e gerenciador de pacotes [`pnpm`](https://pnpm.io/pt/).
- [Flutter SDK](https://docs.flutter.dev/get-started/install) para compilar e emular a arquitetura Mobile.
- Xcode para testes em iPhones físicos (se no MacOS).

### 1️⃣ Subindo o Banco de Dados (Docker)
Na raiz do seu projeto `condoApp`, abra o terminal e deixe a infraestrutura girando em background:
```bash
docker-compose up -d
```
> *Nota:* O arquivo `docker-compose.yml` criará um contêiner Postgres na porta `5432` e um Redis na `6379`.

### 2️⃣ Instalando Dependências NodeJS e Populando o DB
Ainda na raiz do monorepo, inicie o ecossistema Javascript:
```bash
# 1. Instalar pacotes de todas os workpaces pelo turborepo
pnpm install

# 2. Injetar as tabelas e o administrador inicial via Seed script:
cd apps/api
pnpm run seed
```

### 3️⃣ Ligando os Servidores Web e API
Volte à pasta raiz e inicie o ambiente Dev paralelo:
```bash
cd ../..
pnpm run dev
```
> *(Se o `turborepo` falhar ao localizar a Api, você também pode abrir dois terminais manuais: em `/apps/api`, rode `pnpm start:dev` e em `/apps/web` rode `pnpm run dev`).*
Acesse o Painel Web Administrativo & Portaria pelo seu navegador em **`http://localhost:5173`**.

### 4️⃣ Configurando e Rodando o App Mobile (Flutter)
Caso esteja usando o Android Emulator em conjunto com o Localhost do seu computador, o projeto já está pronto de fábrica apontando para o Endereço de Loopback do Emulador base (`10.0.2.2`).

Em um novo terminal, sem matar o servidor Node, execute:
```bash
cd apps/mobile
flutter run
```

---

## 📱 Testando em iPhone Físico (Pós-instalação)
Se o seu objetivo é debugar a aplicação nativamente conectando o seu iPhone via cabo na rede da residência:
1. Identifique o seu *IP Wi-Fi local* (`ipconfig getifaddr en0`).
2. Acesse `apps/mobile/lib/core/api_client.dart` e insira o seu IP no `baseUrl`  *(Ex: `http://192.168.1.14:3000/api/v1`)*.
3. Abra o Workspace no Xcode pelo comando `open ios/Runner.xcworkspace`.
4. Assine (*Code Sign*) o Sandbox usando seu Apple ID pessoal gratuíto pela Aba "Signing & Capabilities".
5. Clique em "Play" direto no Xcode (na primeira execução) ou autorize o Desenvolvedor Não Reconhecido nos *Ajustes de VPN e Dispositivos* do próprio iPhone.
6. A partir da segunda vez, o seu `flutter run` funcionará diretamente no comando puro de texto enviando a build pro celular.
