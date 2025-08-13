# 🎲 Anidle - O Jogo de Adivinhar Animes

Um jogo de adivinhação de animes no estilo Wordle, onde os jogadores têm 6 tentativas para descobrir o "Anime do Dia". A cada chute, o jogador recebe dicas visuais para se aproximar da resposta correta.

## ✨ Funcionalidades

-   **Desafio Diário:** Um novo anime é selecionado automaticamente todos os dias.
-   **Pista Visual:** O jogo começa com uma imagem embaçada da capa do anime, que fica mais nítida a cada tentativa.
-   **Feedback Detalhado:** A cada chute, o jogador recebe feedback em 5 categorias (Nome, Estúdio, Ano e Gêneros) com cores indicativas:
    -   🟩 **Verde:** Acerto exato.
    -   🟧 **Laranja:** Acerto parcial (ex: mesmo gênero, palavras em comum no título).
    -   🟥 **Vermelho:** Incorreto.
-   **Busca com Autocomplete:** Um campo de busca integrado com a API do MyAnimeList para ajudar os jogadores a encontrarem e selecionarem seus chutes.
-   **Salvamento de Progresso:** O estado do jogo diário é salvo no navegador (`localStorage`), permitindo que os jogadores continuem de onde pararam se recarregarem a página.
-   **Popup de Estatísticas:** Ao final do jogo (vitória ou derrota), um popup exibe as estatísticas do jogador: porcentagem de vitórias, sequências e um gráfico com a distribuição de tentativas.
-   **Contagem Regressiva:** O popup de estatísticas mostra um timer para o próximo desafio.
-   **Botão de Compartilhar:** Permite copiar o resultado do dia em formato de emojis para compartilhar nas redes sociais.
-   **Ferramenta de Admin:** Uma rota de backend protegida por senha para forçar a atualização do anime do dia para fins de teste.

## 🚀 Tecnologias Utilizadas

#### **Backend**
-   Node.js
-   Express
-   TypeScript
-   Axios (para comunicação com a API do MyAnimeList)
-   Dotenv (para gerenciamento de variáveis de ambiente)
-   CORS

#### **Frontend**
-   React
-   TypeScript
-   Vite
-   Axios
-   CSS moderno (Flexbox & Grid)

## 🔧 Como Rodar o Projeto Localmente

**Pré-requisitos:**
-   Node.js (v16 ou superior)
-   Um `Access Token` válido da API do MyAnimeList (v2)

### **Configurando o Backend**

1.  Navegue para a pasta do backend:
    ```sh
    cd backend
    ```
2.  Instale as dependências:
    ```sh
    npm install
    ```
3.  Crie um arquivo `.env` na raiz da pasta `backend` e adicione suas credenciais:
    ```
    MAL_ACCESS_TOKEN="SEU_ACCESS_TOKEN_AQUI"
    ADMIN_SECRET_KEY="SUA_SENHA_DE_ADMIN_AQUI"
    ```
4.  Inicie o servidor de desenvolvimento:
    ```sh
    npm run dev
    ```
    O servidor estará rodando em `http://localhost:3001`.

### **Configurando o Frontend**

1.  Em um **novo terminal**, navegue para a pasta do frontend:
    ```sh
    cd frontend
    ```
2.  Instale as dependências:
    ```sh
    npm install
    ```
3.  Inicie o servidor de desenvolvimento:
    ```sh
    npm run dev
    ```
    A aplicação estará acessível em `http://localhost:5173` (ou a porta indicada no terminal).

### **Funcionalidades de Admin**

Para forçar o reset do anime do dia (para testes), use o seguinte comando no terminal, substituindo pela sua senha de admin:
```powershell
# Exemplo para PowerShell (Windows)
$body = @{ secret = "SUA_SENHA_DE_ADMIN_AQUI" } | ConvertTo-Json
Invoke-RestMethod -Uri http://localhost:3001/api/admin/reset -Method Post -Body $body -ContentType 'application/json'

# Exemplo para Bash (Linux/Mac)
curl -X POST -H "Content-Type: application/json" -d '{"secret": "SUA_SENHA_DE_ADMIN_AQUI"}' http://localhost:3001/api/admin/reset
```