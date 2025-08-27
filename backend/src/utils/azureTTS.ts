
import * as sdk from 'microsoft-cognitiveservices-speech-sdk';
import dotenv from 'dotenv';

import {subscriptionKey,serviceRegion} from '@/config/env.config'


interface ConvertToSpeechOptions {
  outputFormat?: 'base64' | 'buffer';
}

export const textToSpeech = async (text: string, options: ConvertToSpeechOptions = { outputFormat: 'base64' }): Promise<string | Buffer | null> => {
  if (!text) {
    return null;
  }

  try {
    const speechConfig = sdk.SpeechConfig.fromSubscription(subscriptionKey, serviceRegion);
    speechConfig.speechSynthesisVoiceName =  `${process.env.AZURE_VOICE} `; 
    speechConfig.speechSynthesisOutputFormat = sdk.SpeechSynthesisOutputFormat.Audio16Khz32KBitRateMonoMp3;

    const synthesizer = new sdk.SpeechSynthesizer(speechConfig);

    const ssml = `
      <speak version='1.0' xmlns='http://www.w3.org/2001/10/synthesis' xml:lang='en-IN'>
        <voice name='en-IN-KunalNeural'>${text}</voice>
      </speak>`;

    return new Promise((resolve, reject) => {
      synthesizer.speakSsmlAsync(
        ssml,
        (result) => {
          if (result.reason === sdk.ResultReason.SynthesizingAudioCompleted) {
            const audioBuffer = Buffer.from(result.audioData);
            synthesizer.close();
            if (options.outputFormat === 'base64') {
              resolve(audioBuffer.toString('base64'));
            } else {
              console.log("audio buffer---->")
              resolve(audioBuffer);
            }
          } else {
            synthesizer.close();
            resolve(null);
          }
        },
        (err) => {
          synthesizer.close();
          console.error('Speech synthesis error:', err);
          resolve(null);
        }
      );
    });
  } catch (error) {
    console.error('TTS error:', error);
    return null;
  }
};


