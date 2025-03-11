import { SSMClient, GetParameterCommand } from "@aws-sdk/client-ssm";

const ssmClient = new SSMClient({ 
  region: "us-east-1" // updated to match your Parameter Store region
});

export async function getOpenAIKey() {
  try {
    const environment = process.env.NODE_ENV === 'production' ? 'prod' : 'dev';
    const parameterPath = `/myapp/${environment}/OPENAI_API_KEY`;
    
    // Add debug logging
    console.log('Current NODE_ENV:', process.env.NODE_ENV);
    console.log('Resolved environment:', environment);
    console.log('Attempting to fetch parameter from path:', parameterPath);
    
    const command = new GetParameterCommand({
      Name: parameterPath,
      WithDecryption: true,
    });
    
    const response = await ssmClient.send(command);
    return response.Parameter?.Value;
  } catch (error) {
    console.error('Error fetching OpenAI key from Parameter Store:', error);
    // Fallback to environment variable if Parameter Store fails
    return process.env.OPENAI_API_KEY;
  }
} 