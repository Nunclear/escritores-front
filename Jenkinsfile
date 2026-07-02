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

        stage('Debug NPM Jenkins') {
            steps {
                sh '''
                    whoami
                    node -v
                    npm -v
                    npm config get registry
                    env | grep -i proxy || true
                    curl -I https://registry.npmjs.org/ || true
                '''
            }
        }

        stage('Install Dependencies') {
            steps {
                sh '''
                    npm config set registry https://registry.npmjs.org/
                    npm config delete proxy || true
                    npm config delete https-proxy || true
                    npm cache clean --force

                    if [ -f package-lock.json ]; then
                      npm ci --fetch-retries=5 --fetch-timeout=120000
                    else
                      npm install --fetch-retries=5 --fetch-timeout=120000
                    fi
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
