# 📅💻 RedeSocialTomorrow ️💻📅

RedeSocialTomorrow é um projeto de rede social simples desenvolvido com **Node.js**, utilizando a arquitetura **MVC (Model-View-Controller)**, **MySQL** como banco de dados, **JWT** para autenticação, e um frontend renderizado com **Handlebars** e estilizado com **Bootstrap**. Os usuários podem criar e deletar suas postagens, que neste caso são limitadas a campos de texto, assim como visualizar o perfil e as postagens de outros usuários. Além disso, um usuário não pode deletar as postagens de outro usuário e nem postar na conta de outro perfil.

## 🕹️ Funcionalidades.
- ***Cadastro de Usuários:***
Permite que novos usuários se registrem, armazenando os dados no banco de dados `MySQL`. Caso o nome de usuário já exista, um erro será retornado. As senhas também são armazenadas como hash usando `dcryptjs`.
- ***Login de Usuários:***
O sistema permite que um usuário faça login com seu nome e senha. São tratados erros como: usuário não encontrado ou senha incorreta. Um `token JWT` é gerado para o usuário autenticado.
- ***Autenticação com JWT:***
Após o login, o usuário recebe um `token JWT` que expira em 2 minutos, permitindo acesso a funcionalidades restritas (adicionar e deletar postagens). O token pode ser resgatado usando `cookie-parser`.
- ***Adicionar Postagem:***
Usuários autenticados podem adicionar novas postagens, que são vinculadas ao seu perfil.
- ***Deletar Postagem:***
Os usuários podem remover postagens criadas por eles mesmos. Não é possível deletar postagens de outros usuários.
- ***Buscar Usuários e Postagens:***
Realiza a busca por um usuário específico e, caso encontrado, exibe todas as suas postagens. Use a rota `http://localhost:3000/users/:id`.
- ***Verificação de Expiração de Token:***
Quando o `token JWT` expira, o acesso a rotas protegidas (exceto login e registro) é bloqueado.

## 🖼️ ️Algumas screenshots. 
Veja algumas imagens das telas principais do projeto:
<p align="center">
    <details>
        <summary>Clique para mais detalhes</summary>
        <img src="public/assets/screenshots/home.png" alt="Tela Home" width="800"/>
        <img src="public/assets/screenshots/register.png" alt="Tela Register" width="800"/>
        <img src="public/assets/screenshots/login.png" alt="Tela Login" width="800"/>
        <img src="public/assets/screenshots/profile.png" alt="Tela Profile" width="800"/>
    </details>
  <img src="public/assets/screenshots/navegation.gif" alt="Gif usando a aplicação" width="800">
</p>

## 🚀 Instalação e dependências.
Siga estas etapas para configurar e executar o projeto localmente na sua própria máquina. É necessário instalar [MySQL](https://www.mysql.com/downloads/) e o [Node.js](https://nodejs.org/en/download/package-manager) previamente.
1. Clone o Repositório. 💻
```bash
git clone https://github.com/DavidOSilva/RedeSocialTomorrow
cd RedeSocialTomorrow
```

2. Instale as Dependências. 📱
```bash
npm install
```

3. Crie uma conexão na sua aplicação MySQL, o mesmo nome deve ser usado no arquivo `.env`. Não é necessário criar as tabelas, a configuração é feita automaticamente em `config/db.js`, você pode consultar os trechos do código a seguir: 🗃️
```javascript
// [...]
const createUsersTable = `
  CREATE TABLE IF NOT EXISTS users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    lastname VARCHAR(255) NOT NULL,
    password VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE
  )
`;
const createPostsTable = `
CREATE TABLE IF NOT EXISTS posts (
  user_id INT NOT NULL,
  post_id INT NOT NULL,
  content TEXT NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (user_id, post_id)
)
`;
```

4. Crie e configure as variáveis de ambiente em `.env`. Preencha os dados de acordo com a sua conexão. ⚙️
```env
# Configurações do MySQL
DB_HOST=localhost        
DB_USER=root
DB_PASSWORD=senhadomysql
DB_NAME=nomedoprojeto

# Configurações do JWT
JWT_SECRET=senhasupersecreta007     # Chave gerar e validar JWT.
JWT_EXPIRATION=120s
```

5. Agora basta iniciar a aplicação. Por padrão o servidor estará disponível em `http://localhost:3000`.
```bash
npm start
```

## 📂 Arquitetura MVC 

O projeto "segue" a arquitetura **MVC (Model-View-Controller)**, o que facilita a separação de responsabilidades. A estrutura é dividida em:
- **View**: O frontend é gerado com **Handlebars** para renderizar páginas dinâmicas e usa **Bootstrap** para estilização.
- **Controller**: Controla o fluxo de dados entre as Views e o Model, realizando operações de validação e tratamento de erros.

###  🗂️ Estrutura de Diretórios ️
- `/config`: Configuração e conexão com o banco de dados.
- `/controller`: Lógica de controle do projeto 
- `/helpers`: Funções auxiliares para o front-end, formata ids e datas.
- `/public`: Arquivos públicos (CSS, JS, imagens).
- `/routes`: Definição de rotas da aplicação.
- `/views`: Templates Handlebars para renderização de páginas.
- `.env`: Variáveis de ambiente que configuram a conexão com o banco de dados e outras configurações sensíveis.
- `app.js`: Arquivo principal para a execução.

## 📬 Contato
David Oliveira Silva - @DavidOSilva - davidoliveirasilvaa@gmail.com
