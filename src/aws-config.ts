import { Amplify } from 'aws-amplify';

// This configuration will be replaced with your actual Cognito values in production
const awsConfig = {
  Auth: {
    Cognito: {
      // For production, replace with your actual Cognito User Pool ID
      userPoolId: process.env.REACT_APP_COGNITO_USER_POOL_ID || 'us-east-1_XXXXXXXXX',

      // For production, replace with your actual Cognito App Client ID
      userPoolClientId: process.env.REACT_APP_COGNITO_CLIENT_ID || 'XXXXXXXXXXXXXXXXXXXXXXXXXX',

      // For production, replace with your actual AWS region
      loginWith: {
        username: true,
        email: true
      }
    }
  },
  // Add the AWS region
  region: process.env.REACT_APP_AWS_REGION || 'us-east-1',
};

// Initialize AWS Amplify with the configuration
const configureAmplify = () => {
  // Only configure if we're not in development mode
  if (process.env.NODE_ENV !== 'development') {
    Amplify.configure(awsConfig);
  }
};

export default configureAmplify;