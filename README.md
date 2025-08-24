# 🎲 Anidle - O Jogo de Adivinhar Animes

Bem-vindo ao Anidle! Um jogo de adivinhação de animes no estilo Wordle, onde o objetivo é descobrir o "Anime do Dia" em até 6 tentativas. A cada chute, o jogador recebe dicas visuais para se aproximar da resposta correta.

Este projeto foi construído como um estudo de uma aplicação full-stack, utilizando React para o frontend, Node.js/Express para o backend e Docker para a containerização.

## 🚀 Tecnologias Principais

* **Frontend:** React, TypeScript, Vite
* **Backend:** Node.js, Express, TypeScript
* **Containerização:** Docker, Docker Compose, Nginx

## 🔧 Como Rodar o Projeto com Docker

**Pré-requisitos:**
-   [Docker](https://www.docker.com/products/docker-desktop/) e Docker Compose instalados.
-   Um `Access Token` válido da API do MyAnimeList (v2).

### Passos para a Execução

1.  **Clone o Repositório**
    ```sh
    git clone [https://github.com/ThomasRoR/Anidle.git](https://github.com/ThomasRoR/Anidle.git)
    cd Anidle
    ```

2.  **Crie o Arquivo de Ambiente do Backend**
    Crie um arquivo chamado `.env` dentro da pasta `backend`. Ele deve ter o seguinte conteúdo:
    ```
    MAL_ACCESS_TOKEN="SEU_ACCESS_TOKEN_AQUI"
    ADMIN_SECRET_KEY="SUA_SENHA_DE_ADMIN_AQUI"
    ```

3.  **Inicie a Aplicação com Docker Compose**
    Na pasta raiz do projeto, execute o seguinte comando. Na primeira vez, ele irá construir as imagens, o que pode levar alguns minutos.
    ```sh
    docker-compose up --build
    ```

4.  **Acesse o Jogo**
    Depois que os contêineres estiverem rodando, abra seu navegador e acesse:
    [http://localhost:8080](http://localhost:8080)

---