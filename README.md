<p align="center">
    <img src="https://godely.s3.us-east-1.amazonaws.com/logoGodely.jpg" alt="Logo de Godely" width="40%">
</p>

# GoDely Backend

Proyecto de Desarrollo de Software de la Universidad Catolica Andres Bello

# Instalación

---

1. **Clona el Repositorio desde GitHub**:

   - Abre una terminal y ejecuta el siguiente comando:
     ```bash
     git clone https://github.com/Blue-Team-UCAB/go-delivery-backend.git
     ```

2. **Configura el archivo `.env`**:

   - En la raíz del proyecto, crea un archivo llamado `.env`.
   - Agrega las siguientes variables de entorno en el archivo `.env`:

     - `PGDB_HOST=your`
     - `PGDB_PORT=your_port`
     - `PGDB_NAME=godely_db`
     - `PGDB_USER=your_username`
     - `PGDB_PASSWORD=secret`
     - `PGDB_SCHEMA=your_schema`

     - `openIA_api_key=your_openai_api_key`
     - `openIA_project=your_openai_project`
     - `openIA_organization=your_openai_organization`

     - `MONGO_DB_URL=your_mongo_db_url`

     - `AWS_ACCESS_KEY_ID=your_aws_access_key_id`
     - `AWS_SECRET_ACCESS_KEY=your_aws_secret_access_key`
     - `AWS_REGION=your_aws_region`
     - `AWS_S3_BUCKET_NAME=your_s3_bucket_name`

     - `FIRE_BASE_TYPE=your_firebase_type`
     - `FIRE_BASE_PROJECT_ID=your_firebase_project_id`
     - `FIRE_BASE_PRIVATE_KEY_ID=your_firebase_private_key_id`
     - `FIRE_BASE_PRIVATE_KEY=your_firebase_private_key`
     - `FIRE_BASE_CLIENT_EMAIL=your_firebase_client_email`
     - `FIRE_BASE_CLIENT_ID=your_firebase_client_id`
     - `FIRE_BASE_AUTH_URI=your_firebase_auth_uri`
     - `FIRE_BASE_TOKEN_URI=your_firebase_token_uri`
     - `FIRE_BASE_AUTH_PROVIDER_X509_CERT_URL=your_firebase_auth_provider_x509_cert_url`
     - `FIRE_BASE_CLIENT_X509_CERT_URL=your_firebase_client_x509_cert_url`
     - `FIRE_BASE_UNIVERSE_DOMIAN=your_firebase_universe_domain`

     - `JWT_SECRET_KEY=your_jwt_secret`

     - `RABBITMQ_URL=amqp://localhost`
     - `RABBITMQ_QUEUE=your_rabbitmq_queue`

     - `EMAIL_HOST_USER=your_email_host_user`
     - `EMAIL_HOST_PASSWORD=your_email_host_password`
     - `EMAIL_HOST=your_email_host`
     - `EMAIL_PORT=your_email_port`
     - `EMAIL_FROM=your_email_from`

     - `STRIPE_TEST_KEY=your_stripe_test_key`

3. **Instala las Dependencias del Proyecto**:

   - Una vez clonado el repositorio, navega hasta la carpeta del proyecto y ejecuta:
     ```bash
     npm install
     ```

4. **Levanta los Servicios con Docker (opcional)**:

   - Si prefieres usar Docker, asegúrate de tener Docker y Docker Compose instalados, luego ejecuta:
     ```bash
     docker-compose up
     ```

5. **Inicia la Aplicación**:
   - Finalmente, para iniciar la aplicación en modo desarrollo, ejecuta:
     ```bash
     npm run start:dev
     ```
