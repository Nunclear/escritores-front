pipeline {
    agent any

    environment {
        IMAGE_NAME = 'escritores-frontend'
        CONTAINER_NAME = 'escritores-frontend'
        DOCKER_NETWORK = 'escritores-net'
        APP_PORT = '5173'
        NPM_CONFIG_REGISTRY = 'https://registry.npmjs.org/'
    }

    stages {
        stage('Checkout') {
            steps {
                checkout scm
            }
        }

        stage('Debug NPM') {
            steps {
                sh '''
                    echo "Usuario:"
                    whoami

                    echo "Node:"
                    node -v

                    echo "NPM:"
                    npm -v

                    echo "Registry:"
                    npm config get registry

                    echo "Buscando registry interno en archivos:"
                    grep -R "applied-caas\\|artifactory\\|npm-public" package-lock.json .npmrc 2>/dev/null || true
                '''
            }
        }

        stage('Install Dependencies') {
            steps {
                sh '''
                    npm config set registry https://registry.npmjs.org/
                    npm config delete proxy || true
                    npm config delete https-proxy || true

                    rm -rf node_modules

                    npm ci --registry=https://registry.npmjs.org/ \
                      --fetch-retries=5 \
                      --fetch-timeout=120000
                '''
            }
        }

        stage('Build React Vite') {
            steps {
                sh 'npm run build'
            }
        }

        stage('Lint') {
            steps {
                sh '''
                    if npm run | grep -q "lint"; then
                      npm run lint
                    else
                      echo "No hay script de lint configurado."
                    fi
                '''
            }
        }

        stage('Build Docker Image') {
            steps {
                sh 'docker build -t $IMAGE_NAME:latest .'
            }
        }

        stage('Deploy Frontend') {
            steps {
                sh '''
                    docker network create $DOCKER_NETWORK || true

                    docker stop $CONTAINER_NAME || true
                    docker rm $CONTAINER_NAME || true

                    docker run -d \
                      --name $CONTAINER_NAME \
                      --restart always \
                      --network $DOCKER_NETWORK \
                      -p $APP_PORT:80 \
                      $IMAGE_NAME:latest
                '''
            }
        }
    }

    post {
        success {
            echo 'Frontend desplegado correctamente en http://0.0.0.0:5173'
        }
        failure {
            echo 'Falló el pipeline del frontend.'
        }
    }
}
