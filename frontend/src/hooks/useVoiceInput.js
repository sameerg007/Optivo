'use client';

import { useState, useCallback, useRef, useEffect } from 'react';

/**
 * Custom hook for voice input using Web Speech API
 * Provides speech-to-text functionality with state management
 */
export function useVoiceInput(options = {}) {
    const {
        language = 'en-IN',
        continuous = false,
        interimResults = true,
        onResult,
        onError,
    } = options;

    const [isListening, setIsListening] = useState(false);
    const [transcript, setTranscript] = useState('');
    const [interimTranscript, setInterimTranscript] = useState('');
    const [error, setError] = useState(null);
    const [isSupported, setIsSupported] = useState(true);

    const recognitionRef = useRef(null);
    const timeoutRef = useRef(null);

    // Initialize speech recognition
    useEffect(() => {
        if (typeof window === 'undefined') {
            setIsSupported(false);
            return;
        }

        const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
        
        if (!SpeechRecognition) {
            setIsSupported(false);
            setError('Speech recognition is not supported in this browser');
            return;
        }

        const recognition = new SpeechRecognition();
        recognition.lang = language;
        recognition.continuous = continuous;
        recognition.interimResults = interimResults;

        recognition.onstart = () => {
            setIsListening(true);
            setError(null);
        };

        recognition.onend = () => {
            setIsListening(false);
            setInterimTranscript('');
            if (timeoutRef.current) {
                clearTimeout(timeoutRef.current);
            }
        };

        recognition.onresult = (event) => {
            let finalTranscript = '';
            let interim = '';

            for (let i = event.resultIndex; i < event.results.length; i++) {
                const result = event.results[i];
                if (result.isFinal) {
                    finalTranscript += result[0].transcript;
                } else {
                    interim += result[0].transcript;
                }
            }

            if (finalTranscript) {
                setTranscript(finalTranscript);
                onResult?.(finalTranscript);
            }
            setInterimTranscript(interim);
        };

        recognition.onerror = (event) => {
            let errorMessage = 'An error occurred during speech recognition';
            
            switch (event.error) {
                case 'no-speech':
                    errorMessage = 'No speech was detected. Please try again.';
                    break;
                case 'audio-capture':
                    errorMessage = 'No microphone was found. Please ensure a microphone is connected.';
                    break;
                case 'not-allowed':
                    errorMessage = 'Microphone permission was denied. Please allow microphone access.';
                    break;
                case 'network':
                    errorMessage = 'Network error occurred. Please check your connection.';
                    break;
                case 'aborted':
                    errorMessage = 'Speech recognition was aborted.';
                    break;
                default:
                    errorMessage = `Speech recognition error: ${event.error}`;
            }

            setError(errorMessage);
            setIsListening(false);
            onError?.(errorMessage);
        };

        recognitionRef.current = recognition;

        return () => {
            if (recognitionRef.current) {
                recognitionRef.current.abort();
            }
            if (timeoutRef.current) {
                clearTimeout(timeoutRef.current);
            }
        };
    }, [language, continuous, interimResults, onResult, onError]);

    // Start listening
    const startListening = useCallback(() => {
        if (!recognitionRef.current || !isSupported) {
            setError('Speech recognition is not available');
            return;
        }

        setTranscript('');
        setInterimTranscript('');
        setError(null);

        try {
            recognitionRef.current.start();
            
            // Auto-stop after 10 seconds to prevent endless listening
            timeoutRef.current = setTimeout(() => {
                stopListening();
            }, 10000);
        } catch (err) {
            // Recognition might already be started
            if (err.name === 'InvalidStateError') {
                recognitionRef.current.stop();
                setTimeout(() => {
                    recognitionRef.current.start();
                }, 100);
            } else {
                setError('Failed to start speech recognition');
            }
        }
    }, [isSupported]);

    // Stop listening
    const stopListening = useCallback(() => {
        if (recognitionRef.current) {
            recognitionRef.current.stop();
        }
        if (timeoutRef.current) {
            clearTimeout(timeoutRef.current);
        }
    }, []);

    // Toggle listening
    const toggleListening = useCallback(() => {
        if (isListening) {
            stopListening();
        } else {
            startListening();
        }
    }, [isListening, startListening, stopListening]);

    // Reset state
    const reset = useCallback(() => {
        setTranscript('');
        setInterimTranscript('');
        setError(null);
    }, []);

    return {
        isListening,
        transcript,
        interimTranscript,
        error,
        isSupported,
        startListening,
        stopListening,
        toggleListening,
        reset,
    };
}

export default useVoiceInput;
