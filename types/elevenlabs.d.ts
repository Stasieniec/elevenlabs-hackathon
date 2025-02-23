import * as React from 'react';

declare global {
  namespace JSX {
    interface IntrinsicElements {
      'elevenlabs-convai': React.DetailedHTMLProps<{
        'signed-url': string;
        'override-config': string;
        'dynamic-variables': string;
        variant: string;
        'action-text': string;
        'start-call-text': string;
        'end-call-text': string;
        'speaking-text': string;
        'listening-text': string;
        'avatar-orb-color-1': string;
        'avatar-orb-color-2': string;
        style?: React.CSSProperties;
      }, HTMLElement>;
    }
  }
} 