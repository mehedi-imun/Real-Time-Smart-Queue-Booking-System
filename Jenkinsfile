pipeline {
  agent any

  environment {
    DOCKERHUB_CREDENTIALS = '149a660c-4391-4cd4-8950-851538eedb0f'   // Jenkins Docker Hub credentials ID
    SMTP_CREDENTIALS = 'smtp-creds'              // Jenkins SMTP credentials ID
    DOCKER_IMAGE = 'mehediimun/real-time-queue-backend'  // Docker Hub image name
    EMAIL_TO = 'mehediimun@gmail.com'          // Email recipient
  }

  stages {
    stage('Checkout Code') {
      steps {
        git branch: 'main', url: 'https://github.com/mehedi-imun/Real-Time-Smart-Queue-Booking-System.git'
      }
    }

    stage('Install Dependencies') {
      steps {
        sh 'npm ci'
      }
    }

    stage('Build') {
      steps {
        sh 'npm run build'
      }
    }

    // stage('Test') {
    //   steps {
    //     sh 'npm test || true'  // Run tests if any; do not fail build if tests are missing
    //   }
    // }

    stage('Build & Push Docker Image') {
      steps {
        script {
          docker.withRegistry('', DOCKERHUB_CREDENTIALS) {
            def appImage = docker.build("${DOCKER_IMAGE}:${env.BUILD_NUMBER}")
            appImage.push()
          }
        }
      }
    }
  }

  post {
    success {
      withCredentials([usernamePassword(credentialsId: SMTP_CREDENTIALS, usernameVariable: 'SMTP_USER', passwordVariable: 'SMTP_PASS')]) {
        emailext (
          subject: "✅ Build Success: ${env.JOB_NAME} #${env.BUILD_NUMBER}",
          body: """
            Hello,

            Build #${env.BUILD_NUMBER} for job ${env.JOB_NAME} succeeded.

            You can view details here: ${env.BUILD_URL}
          """,
          to: EMAIL_TO,
          from: SMTP_USER,
          smtpHost: 'smtp.gmail.com',
          smtpPort: '465',
          authentication: 'LOGIN',
          smtpUsername: SMTP_USER,
          smtpPassword: SMTP_PASS,
          useSsl: true
        )
      }
    }

    failure {
      withCredentials([usernamePassword(credentialsId: SMTP_CREDENTIALS, usernameVariable: 'SMTP_USER', passwordVariable: 'SMTP_PASS')]) {
        emailext (
          subject: "❌ Build Failed: ${env.JOB_NAME} #${env.BUILD_NUMBER}",
          body: """
            Hello,

            Build #${env.BUILD_NUMBER} for job ${env.JOB_NAME} failed.

            Check logs here: ${env.BUILD_URL}
          """,
          to: EMAIL_TO,
          from: SMTP_USER,
          smtpHost: 'smtp.gmail.com',
          smtpPort: '465',
          authentication: 'LOGIN',
          smtpUsername: SMTP_USER,
          smtpPassword: SMTP_PASS,
          useSsl: true
        )
      }
    }
  }
}
