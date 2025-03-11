import { SSMClient, GetParameterCommand } from "@aws-sdk/client-ssm";

const ssmClient = new SSMClient({ 
  region: "ap-south-1" // replace with your AWS region
});

export async function getOpenAIKey() {
  try {
    const environment = process.env.NODE_ENV || 'development';
    const parameterPath = `/myapp/${environment}/OPENAI_API_KEY`;
    
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