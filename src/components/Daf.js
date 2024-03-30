import React, { useEffect, useState } from 'react';
import * as Tone from 'tone';

const Daf = () => {
  const [isRecording, setIsRecording] = useState(false);
  const [mic, setMic] = useState(null);
  const [delay, setDelay] = useState(0.15); // Initial delay value
  const [micPermission, setMicPermission] = useState(false);

  const handlePermissions = () => {
    navigator.mediaDevices.getUserMedia({ audio: true })
      .then(() => {
        console.log("Microphone Permissions Acquired")
        setMicPermission(true);
      })
      .catch(() => {
        console.error("Microphone Permissions not granted")
        alert("Permissions not granted");
      });
  }

  useEffect(() => {
    handlePermissions();
  }, []);

  const startRecording = async () => {
    try {
      await Tone.start(); // Start the audio context
      const delayNode = new Tone.Delay(delay).toDestination(); // Create a Tone.Delay node
      const micInstance = new Tone.UserMedia(); // Create a UserMedia instance for microphone input
      micInstance.connect(delayNode); // Connect the microphone input to the delay effect
      await micInstance.open(); // Start the microphone
      setIsRecording(true);
      setMic(micInstance);
    } catch (error) {
      console.error('Error accessing microphone:', error);
    }
  };

  const stopRecording = () => {
    if (mic) {
      mic.close();
      setIsRecording(false);
    }
  };

  const handleDelayChange = (e) => {
    const newDelay = parseFloat(e.target.value);
    setDelay(newDelay);
    if (isRecording && mic) {
      mic.disconnect();
      const newDelayNode = new Tone.Delay(newDelay).toDestination();
      mic.connect(newDelayNode);
    }
  };

  return (
    <div>
      <button onClick={() => {
        if (micPermission) {
          isRecording ? stopRecording() : startRecording();
        } else {
          handlePermissions();
        }
      }}>
        {isRecording ? 'Stop' : 'Start DAF'}
      </button>
      <label>
        50Ms
        <input
          type="range"
          min={0.05}
          max={0.5}
          step={0.01}
          value={delay}
          onChange={handleDelayChange}
        />
        500Ms
      </label>
      <br />
      <output>Current delay is: {delay * 1000}Ms</output>
      <br />
      <span>Mic permission: {micPermission ? 'Granted' : 'Not Granted'}</span>
    </div>
  );
};

export default Daf;
