# RedeSocialTomorrow
É necessário criar um conexão mySQL e definir um arquivo .env com as seguintes caracteristicas:

´´´env
# Configurações do MySQL
DB_HOST=localhost        
DB_USER=root
DB_PASSWORD=senha
DB_NAME=projeto

# Configurações do JWT
JWT_SECRET=senhasupersecreta007     # Chave gerar e validar JWT.
JWT_EXPIRATION=120s
´´´