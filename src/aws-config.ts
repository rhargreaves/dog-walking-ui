import { Amplify } from 'aws-amplify';

// This configuration gets injected at build time by the React build process
const awsConfig = {
  Auth: {
    Cognito: {
      userPoolId: process.env.REACT_APP_COGNITO_USER_POOL_ID as string,
      userPoolClientId: process.env.REACT_APP_COGNITO_CLIENT_ID as string,
      loginWith: {
        username: true,
        email: true
      }
    }
  },
  region: process.env.REACT_APP_AWS_REGION as string,
};

// Initialize AWS Amplify with the configuration
const configureAmplify = () => {
  // Only configure if we're not in development mode
  if (process.env.NODE_ENV !== 'development') {
    try {
      Amplify.configure(awsConfig);
      console.log('AWS Amplify configured successfully');
    } catch (error) {
      console.error('Failed to configure AWS Amplify:', error);
    }
  } else {
    console.warn('AWS Amplify configuration skipped due to missing environment variables');
  }
};

export default configureAmplify;