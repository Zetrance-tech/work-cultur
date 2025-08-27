import express, { Application, Request, Response, NextFunction } from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import routes from '@/routes';
import globalErrorHandler from '@/middlewares/globalApiError.middleware';
import path from 'path';
import fs from 'fs-extra';
import axios from 'axios';
import * as sdk from 'microsoft-cognitiveservices-speech-sdk';
import { v4 as uuidv4 } from 'uuid';
import { apiVersion, deployment, endpoint } from './config/env.config';
const app: Application = express();
import dotenv from 'dotenv';

dotenv.config();

// Middleware
// app.use(cors({
//     origin: process.env.CORS_ORIGIN,
//     credentials: true
// }));

app.use(
  cors({
    origin: ['http://127.0.0.1:8080',
       'http://127.0.0.1:8081',      
      'http://127.0.0.1:8081',
      'http://127.0.0.1:5500',
      'http://localhost:8080',
      'http://localhost:8081',
      'http://192.168.223.1:8080',
      'https://wc.zetrance.com', //main frontend url
      'https://wc-avatar.zetrance.com' // avatar frontend url
      ],
    credentials: true,
  })
);
app.use(express.json({ limit: '16kb' }));
app.use(express.urlencoded({ extended: true, limit: '16kb' }));
app.use(cookieParser());


////----------> Static File Serving and visems chats <------------------
app.use('/avatars', express.static(path.join(__dirname, '.', 'public', 'avatars')));
app.use('/api/v1/audio', express.static(path.join(__dirname, '.', 'public', 'audio')));
// app.use('/api/v1/audio', express.static(path.join(__dirname, '..', 'public', 'audio')));

// Ensure output directories exist
const outputDir = path.join(__dirname, '..', 'public', 'audio');
fs.ensureDirSync(outputDir) as any;

// Azure OpenAI Configuration
const azureOpenAIConfig = {
  apiKey: process.env.OPEN_AI_apikey_v2,
  endpoint: process.env.OPEN_AI_endpoint_v2,
  deploymentName: process.env.OPEN_AI_deploymentName_v2,
  apiVersion: process.env.OPEN_AI_apiVersion_v2,
};

// Azure TTS Configuration
const azureTTSConfig = {
  apiKey: process.env.TTS_apikey_v2,
  region: process.env.TTS_region_v2,
  voiceName: process.env.TTS_voiceName_v2,
};


// System prompt
const systemPrompt = 'You are a helpful AI assistant. Provide clear, concise, and accurate responses to user queries.';

// Function to call Azure OpenAI
async function callAzureOpenAI(userQuery: string): Promise<string> {
  try {
    const url = `${azureOpenAIConfig.endpoint}openai/deployments/${azureOpenAIConfig.deploymentName}/chat/completions?api-version=${azureOpenAIConfig.apiVersion}`;
    
    const response = await axios.post(
      url,
      {
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: userQuery },
        ],
        max_tokens: 500,
        temperature: 0.7,
      },
      {
        headers: {
          'Content-Type': 'application/json',
          'api-key': azureOpenAIConfig.apiKey,
        },
      }
    );

    return response.data.choices[0].message.content;
  } catch (error: any) {
    console.error('Azure OpenAI API Error:', error.response?.data || error.message);
    throw new Error('Failed to get response from Azure OpenAI');
  }
}

// Function to escape XML special characters
function escapeXml(text: string): string {
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}


// Function to call Azure TTS with visemes
async function callAzureTTS(text: string, sessionId: string): Promise<{
  audioPath: string;
  audioFileName: string;
  visemeData: { viseme: number; timestamp: number }[];
  duration: number;
}> {
  return new Promise((resolve, reject) => {
    const audioFileName = `${sessionId}_audio.wav`;
    const audioPath = path.join(outputDir, audioFileName);
    
    const speechConfig = sdk.SpeechConfig.fromSubscription(
      azureTTSConfig.apiKey || '',
      azureTTSConfig.region || ''
    );
    
    speechConfig.speechSynthesisVoiceName = azureTTSConfig.voiceName || '';
    
    const audioConfig = sdk.AudioConfig.fromAudioFileOutput(audioPath);
    
    const synthesizer = new sdk.SpeechSynthesizer(speechConfig, audioConfig);
    
    const visemeData: { viseme: number; timestamp: number }[] = [];
    
    synthesizer.visemeReceived = (s: any, e: any) => {
      visemeData.push({
        viseme: e.visemeId,
        timestamp: e.audioOffset / 10000, // Convert to milliseconds
      });
    };
    
    const ssml = `
      <speak version="1.0" xmlns="http://www.w3.org/2001/10/synthesis"
        xmlns:mstts="https://www.w3.org/2001/mstts" xml:lang="en-US">
        <voice name="${speechConfig.speechSynthesisVoiceName}">
          <mstts:viseme type="FacialExpression"/>
          ${escapeXml(text)}
        </voice>
      </speak>
    `;
    
    synthesizer.speakSsmlAsync(
      ssml,
      (result: any) => {
        synthesizer.close();
        
        if (result.reason === sdk.ResultReason.SynthesizingAudioCompleted) {
          if (visemeData.length > 0 && visemeData[visemeData.length - 1].viseme !== 0) {
            visemeData.push({
              viseme: 0,
              timestamp: result.audioDuration / 10000, // Use actual duration
            });
          }
          
          resolve({
            audioPath,
            audioFileName,
            visemeData,
            duration: result.audioDuration / 10000, // in ms
          });
        } else {
          reject(new Error(`Speech synthesis failed: ${result.errorDetails}`));
        }
      },
      (error: any) => {
        synthesizer.close();
        reject(error);
      }
    );
  });
}


//main api end point
app.post('/api/v1/process-query', async (req: Request, res: Response) => {
  console.log('Received request to /api/v1/process-query...');
   let ttsResult: any;
  try {
    const { query } = req.body;
    
    if (!query) {
      return res.status(400).json({ error: 'Query is required' });
    }

    console.log('Processing query:', query);
    
    const sessionId = uuidv4();
    
    console.log('Calling Azure OpenAI...');
    const aiResponse = await callAzureOpenAI(query);
    console.log('AI Response:', aiResponse);
    
    console.log('Generating speech with visemes...');
    ttsResult = await callAzureTTS(aiResponse, sessionId);
    
    if (ttsResult.visemeData.length === 0 || ttsResult.visemeData[ttsResult.visemeData.length - 1].viseme !== 0) {
      ttsResult.visemeData.push({
        viseme: 0,
        timestamp: ttsResult.duration,
      });
    }
    
    const response = {
      sessionId,
      query,
      aiResponse,
      audioData: {
        audioPath: ttsResult.audioPath,
        audioFileName: ttsResult.audioFileName,
        duration: ttsResult.duration,
         audioUrl: `http://localhost:5000/audio/${ttsResult.audioFileName}` //replace with host backend url
      },
      visemeData: ttsResult.visemeData,
      timestamp: new Date().toISOString(),
    };
    
    console.log('TTS processing completed for session:', sessionId);
    console.log('Response:', JSON.stringify(response, null, 2));
    
    res.json(response);

    
    
  } catch (error: any) {
    console.error('Error processing query:', error);
    res.status(500).json({ 
      error: 'Failed to process query',
      details: error.message,
    });
  } 
});


// Routes
routes(app);

app.use('/audio', express.static(outputDir));

// 404 handler
app.use((req: Request, res: Response, next: NextFunction) => {
    res.status(404).json({
        success: false,
        message: 'Route not found'
    });
});

// Global error handler
app.use(globalErrorHandler);

export default app; 
