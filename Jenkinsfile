pipeline {
    agent any

    environment {
        IMAGE_NAME = 'escritores-frontend'
        CONTAINER_NAME = 'escritores-frontend'
        DOCKER_NETWORK = 'escritores-net'
        APP_PORT = '3000'
    }

    stages {
        stage('Checkout') {
            steps {
                checkout scm
            }
        }

        stage('Install Dependencies') {
            steps {
                sh 'npm ci'
            }
        }

        stage('Build React Vite') {
            steps {
                sh 'npm run build'
            }
        }

        stage('Unit Tests') {
            steps {
                sh '''
                if npm run | grep -q "test"; then
                  npm test -- --watch=false || npm test
                else
                  echo "No hay script de test configurado."
                fi
                '''
            }
        }

        stage('Static Analysis') {
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

        stage('Security Scan') {
            steps {
                sh 'npm audit --audit-level=high || true'
            }
        }

        stage('Docker Build') {
            steps {
                sh 'docker build -t $IMAGE_NAME:latest .'
            }
        }

        stage('Deploy') {
            steps {
                sh '''
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
            echo 'Frontend desplegado correctamente en el puerto 3000.'
        }

        failure {
            echo 'Falló el pipeline del frontend.'
        }
    }
}
