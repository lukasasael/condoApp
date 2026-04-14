# CondoApp 🏢

A **Plataforma Integrada de Gestão de Condomínios** que unifica a experiência entre **Moradores**, **Porteiros** e **Síndicos/Administradores** com dados atualizados em tempo real.

O projeto é estruturado num formato **Monolítico Modular** (Monorepo), facilitando o desenvolvimento cross-layer e o reaproveitamento de tipagens entre os ecossistemas Web, Mobile e Backend.

**Stack:** TypeScript, React, Vite, Flutter, Dart, NestJS, Node.js, WebSockets, PostgreSQL, TypeORM, Redis (Pub/Sub), Docker, Passport (JWT), Turborepo, pnpm workspaces.

🔗 **Documentação Viva da API (Swagger):** [Acesse as rotas do backend na Render](https://condoapp-api-ch1n.onrender.com/api/v1/docs)

---

## 🤖 AI-Driven Development (Engenharia Guiada por IAs)

Este projeto foi construído do zero adotando as melhores práticas do mercado, não apenas no código, mas na **concepção metodológica**, utilizando Inteligência Artificial em etapas cruciais da Engenharia de Software:

1. **ChatGPT (Fase Inicial & Concepção do Produto):** Utilizado na fase de *Double Diamond* (Design Council do Reino Unido) para explorar e definir escopos. Auxiliou brutalmente na especificação de requisitos, mapeamento de jornadas de usuário, engenharia de software e nas estratégias de modelagem de dados.
2. **Miro AI (Design de Banco de Dados):** Aplicado na geração e rascunho do Esquema Relacional visual. Garantiu a aplicação severa de boas práticas de Banco de Dados, resolvendo entidades, integridade referencial, normalização, chaves primárias e mapeamento de chaves estrangeiras apropriadas para condomínios.
3. **Antigravity (Desenvolvimento e Orquestração):** Utilizado como Agente de Codificação assistente para arquitetar o Monorepo, estruturar o Monolito Modular no NestJS, e amarrar os conceitos avançados de DevOps e infraestrutura em rede.

---

## 🏗 Arquitetura & Ecossistema Distribuído

Este repositório utiliza **Turborepo** e **pnpm workspaces**. O código está distribuído isoladamente nativa `apps/`:

### 1. Backend API (`apps/api`)
Desenvolvido com o padrão de **Monolito Modular** utilizando **NestJS** e **TypeORM**. Expõe a API RESTful e mapeia a lógica de negócios em módulos (Usuários, Reservas, Acessos). Conta com uma camada de segurança *stateless* baseada em **JWT (Passport)** e proteção de rotas ativas (Guards). Hospeda os roteadores **WebSockets** orquestrados pelo Redis para despachar eventos fulminantes em broadcast para os demais paineis da portaria e síndico.

### 2. Painel Administrativo & Portaria (`apps/web`)
Frontend construído em **React.js + Vite** e **TypeScript** com design *Glassmorphism*. O portal resolve dois universos de operação na mesma aplicação (Protegendo Telas e Componentes pelas Roles de usuário):
- **Painel Portaria:** Focado em operação ostensiva de validação de visitantes via tempo real (a tela interage no mesmo milissegundo de confirmações feitas no backend sem precisar ser recarregada).
- **Painel Síndico:** Visão Macro Administrativa e Dashboards de estatísticas.

### 3. App do Morador (`apps/mobile`)
Aplicação do morador nativamente compilada pelo **Flutter/Dart**. Construída focando em fluxo limpo e alta performance. O morador é capaz de antecipar o cadastro e liberação de visitantes e gerar eventos em tempo-real (como reservar a churrasqueira), integrando a fluidez da UI mobile com segurança HTTP em background. A API e a Mobile suportam futuras integrações completas via **Webhooks de Dispositivos (ex: Control iD)**.

---

## 🔒 Credenciais Padrão (Seed de Desenvolvimento)

Ao rodar a Seed do banco de dados na 1º configuração, os seguintes perfis já estarão instanciados na massa de dados com a senha padrão `senha123`:
* **Síndico:** `admin@condo.com`
* **Porteiro:** `porteiro@condo.com`
* **Morador:** `morador@condo.com`

---

## 🚀 Como Inicializar o Ambiente Local

### Pré-requisitos:
- [Docker Desktop](https://www.docker.com/products/docker-desktop/) ativo na máquina para suportar a infraestrutura (Postgres e Redis).
- [Node.js](https://nodejs.org/) `>= 18.x` e gerenciador de pacotes [`pnpm`](https://pnpm.io/pt/).
- [Flutter SDK](https://docs.flutter.dev/get-started/install) para compilar e emular a arquitetura Mobile.
- Xcode para testes em iPhones físicos (apenas no MacOS).

### 1️⃣ Subindo os Bancos de Dados e Mensageria (Docker)
Na raiz do seu projeto `condoApp`, abra o terminal e deixe a infraestrutura girando em background:
```bash
docker-compose up -d
```
> *Nota:* O arquivo `docker-compose.yml` inicia instantaneamente um contêiner Postgres na porta `5432` e um Redis na porta `6379`.

### 2️⃣ Instalando Dependências NodeJS e Populando o Banco de Dados
Ainda na raiz do monorepo, instale e povoe o ecossistema Javascript:
```bash
# 1. Instalação e *Cache Pipeline* de todos os workspaces via Turborepo
pnpm install

# 2. Injetar tabelas e usuários iniciais via Seed Script:
cd apps/api
pnpm run seed
```

### 3️⃣ Ligando os Servidores (Backend + Web)
Volte à pasta raiz e inicie o ambiente de desenvolvimento em paralelo (O Turbo sabe injetar os builds simultaneamente):
```bash
cd ../..
pnpm run dev
```
> Acesse o Painel Web pelo seu navegador em **`http://localhost:5173`**. *(Se o turborepo falhar por causa de portas em cache, você pode abrir dois terminais: em `/apps/api`, rode `pnpm start:dev` e em `/apps/web` rode `pnpm run dev`).*

### 4️⃣ Configurando e Rodando o App Mobile (Flutter)
Caso esteja usando o Android Emulator em conjunto com o Localhost do seu computador, o projeto suporta o Endereço de Loopback do Emulador nativamente (`10.0.2.2`).

Em um novo terminal, sem desligar o servidor Node, abra a aplicação Mobile:
```bash
cd apps/mobile
flutter run
```

---

## 📱 Testando em iPhone Físico/Dispositivo Real (Pós-instalação)
Se o seu objetivo é testar a aplicação nativamente conectando o seu celular via cabo na mesma rede Wi-Fi que o servidor:
1. Identifique o seu *IP local da máquina* (`ipconfig getifaddr en0` no Mac ou `ipconfig` no Windows).
2. Acesse a pasta `apps/mobile/lib/core/api_client.dart` e substitua o IP da API pelo seu *IP Wi-Fi local* (Ex: `http://192.168.1.14:3000/api/v1`).
3. **Se for Flutter no iOS:** Abra o seu Xcode local com `open ios/Runner.xcworkspace`. Siga na Aba "Signing & Capabilities", assine o seu Apple ID e dê "Play" direto por lá autorizando o perfil nas configurações do iPhone. Use o `flutter run` posteriormente.
