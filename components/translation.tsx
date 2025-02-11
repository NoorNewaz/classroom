"use client";

import React, { useEffect, useState } from "react";
import * as mcsSDK from "microsoft-cognitiveservices-speech-sdk";
const speechConfig = mcsSDK.SpeechConfig.fromSubscription(
  process.env.NEXT_PUBLIC_SPEECH_KEY ?? "",
  process.env.NEXT_PUBLIC_SPEECH_REGION ?? ""
);

speechConfig.speechRecognitionLanguage = "en-US";

const Translation = () => {
  const [text, setText] = useState("test");
  const [micOn, setMicOn] = useState(false);
  return (
    <div>
      <button
        onClick={() => {
          const audioConfig = mcsSDK.AudioConfig.fromDefaultMicrophoneInput();
          const speechRecognizer = new mcsSDK.SpeechRecognizer(
            speechConfig,
            audioConfig
          );
          speechRecognizer.recognizeOnceAsync(async (result) => {
            console.log("Starting");
            switch (result.reason) {
              case mcsSDK.ResultReason.RecognizedSpeech:
                console.log(`RECOGNIZED: Text=${result.text}`);
                setText(result.text);
                break;
              case mcsSDK.ResultReason.NoMatch:
                console.log("NOMATCH: Speech could not be recognized.");
                break;
              case mcsSDK.ResultReason.Canceled:
                const cancellation =
                  mcsSDK.CancellationDetails.fromResult(result);
                console.log(`CANCELED: Reason=${cancellation.reason}`);
                if (cancellation.reason == mcsSDK.CancellationReason.Error) {
                  console.log(`CANCELED: ErrorCode=${cancellation.ErrorCode}`);
                  console.log(
                    `CANCELED: ErrorDetails=${cancellation.errorDetails}`
                  );
                  console.log(
                    "CANCELED: Did you set the speech resource key and region values?"
                  );
                }
                break;
            }
            speechRecognizer.close();
          });
        }}
      >
        Press Me!
      </button>
      <p>{text}</p>
    </div>
  );
};

export default Translation;
