'use client';

import { useEffect, useRef, useState } from 'react';
import AgoraRTC, { IAgoraRTCClient, ICameraVideoTrack, IMicrophoneAudioTrack, IRemoteVideoTrack, IRemoteAudioTrack } from 'agora-rtc-sdk-ng';

interface AgoraPlayerProps {
  appId: string;
  channel: string;
  token: string;
  uid: string | number;
  role: 'host' | 'audience';
}

export function AgoraPlayer({ appId, channel, token, uid, role }: AgoraPlayerProps) {
  const [joined, setJoined] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const clientRef = useRef<IAgoraRTCClient | null>(null);
  const localTracksRef = useRef<[IMicrophoneAudioTrack, ICameraVideoTrack] | null>(null);

  useEffect(() => {
    let isMounted = true;

    const initAgora = async () => {
      // Create client
      const client = AgoraRTC.createClient({ mode: 'rtc', codec: 'vp8' });
      clientRef.current = client;

      // Handle remote users
      client.on('user-published', async (user, mediaType) => {
        await client.subscribe(user, mediaType);
        
        if (mediaType === 'video' && user.videoTrack) {
          // Find or create container for remote user
          let remoteContainer = document.getElementById(`remote-${user.uid}`);
          if (!remoteContainer && containerRef.current) {
            remoteContainer = document.createElement('div');
            remoteContainer.id = `remote-${user.uid}`;
            remoteContainer.className = 'w-full h-full';
            containerRef.current.appendChild(remoteContainer);
          }
          if (remoteContainer) {
            user.videoTrack.play(remoteContainer);
          }
        }
        
        if (mediaType === 'audio' && user.audioTrack) {
          user.audioTrack.play();
        }
      });

      client.on('user-unpublished', (user, mediaType) => {
        if (mediaType === 'video') {
          const remoteContainer = document.getElementById(`remote-${user.uid}`);
          if (remoteContainer) {
            remoteContainer.remove();
          }
        }
      });

      try {
        await client.join(appId, channel, token, uid);
        
        if (role === 'host') {
          // If host, create and publish local tracks
          const tracks = await AgoraRTC.createMicrophoneAndCameraTracks();
          localTracksRef.current = tracks;
          
          if (containerRef.current && isMounted) {
            tracks[1].play(containerRef.current);
          }
          
          await client.publish(tracks);
        }
        
        if (isMounted) setJoined(true);
      } catch (error) {
        console.error('Error joining Agora channel:', error);
      }
    };

    initAgora();

    // CRITICAL: Cleanup to prevent zombie connections
    return () => {
      isMounted = false;
      const client = clientRef.current;
      const localTracks = localTracksRef.current;

      if (localTracks) {
        localTracks[0].stop();
        localTracks[0].close();
        localTracks[1].stop();
        localTracks[1].close();
      }

      if (client) {
        // Leave the channel
        client.leave().catch(console.error);
        client.removeAllListeners();
      }
      
      if (containerRef.current) {
        containerRef.current.innerHTML = ''; // Clear remote tracks DOM
      }
    };
  }, [appId, channel, token, uid, role]);

  return (
    <div className="relative w-full aspect-video bg-background rounded-md overflow-hidden border border-border">
      <div 
        ref={containerRef} 
        className="absolute inset-0 flex items-center justify-center [&>div]:w-full [&>div]:h-full"
      >
        {!joined && (
          <div className="flex flex-col items-center justify-center text-foreground/40">
            <div className="h-8 w-8 border-4 border-rose-500 border-t-transparent rounded-full animate-spin mb-4"></div>
            <p>Connecting to session...</p>
          </div>
        )}
      </div>
    </div>
  );
}
