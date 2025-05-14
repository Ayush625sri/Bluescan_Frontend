// src/utils/webrtcService.js

class WebRTCService {
  constructor() {
    this.peerConnection = null;
    this.localStream = null;
    this.remoteStream = null;
    this.dataChannel = null;
    this.onIceCandidateCallback = null;
    this.onTrackCallback = null;
    this.onDataChannelMessageCallback = null;
    this.onConnectionStateChangeCallback = null;
  }

  /**
   * Initialize WebRTC with STUN/TURN servers
   */
  async initialize() {
    // Configure ICE servers
    const configuration = {
      iceServers: [
        { urls: 'stun:stun.l.google.com:19302' },
        { urls: 'stun:stun1.l.google.com:19302' },
        // Add TURN servers for production
      ]
    };

    // Create peer connection
    this.peerConnection = new RTCPeerConnection(configuration);

    // Set up event handlers
    this.peerConnection.onicecandidate = (event) => {
      if (event.candidate && this.onIceCandidateCallback) {
        this.onIceCandidateCallback(event.candidate);
      }
    };

    this.peerConnection.ontrack = (event) => {
      this.remoteStream = event.streams[0];
      if (this.onTrackCallback) {
        this.onTrackCallback(event.streams[0]);
      }
    };

    this.peerConnection.onconnectionstatechange = () => {
      if (this.onConnectionStateChangeCallback) {
        this.onConnectionStateChangeCallback(this.peerConnection.connectionState);
      }
    };

    // Create data channel for image transfer
    this.dataChannel = this.peerConnection.createDataChannel('images', {
      ordered: true
    });

    this.dataChannel.onopen = () => {
      console.log('Data channel opened');
    };

    this.dataChannel.onmessage = (event) => {
      if (this.onDataChannelMessageCallback) {
        this.onDataChannelMessageCallback(event.data);
      }
    };

    return this.peerConnection;
  }

  /**
   * Set callbacks for WebRTC events
   */
  setCallbacks({
    onIceCandidate,
    onTrack,
    onDataChannelMessage,
    onConnectionStateChange
  }) {
    this.onIceCandidateCallback = onIceCandidate;
    this.onTrackCallback = onTrack;
    this.onDataChannelMessageCallback = onDataChannelMessage;
    this.onConnectionStateChangeCallback = onConnectionStateChange;
  }

  /**
   * Access user media devices
   */
  async getUserMedia(constraints = { video: true, audio: true }) {
    try {
      this.localStream = await navigator.mediaDevices.getUserMedia(constraints);
      
      // Add tracks to peer connection if it exists
      if (this.peerConnection) {
        this.localStream.getTracks().forEach(track => {
          this.peerConnection.addTrack(track, this.localStream);
        });
      }
      
      return this.localStream;
    } catch (error) {
      console.error('Error accessing media devices:', error);
      throw error;
    }
  }

  /**
   * Create and send an offer
   */
  async createOffer() {
    if (!this.peerConnection) {
      throw new Error('Peer connection not initialized');
    }

    try {
      const offer = await this.peerConnection.createOffer({
        offerToReceiveAudio: true,
        offerToReceiveVideo: true
      });
      
      await this.peerConnection.setLocalDescription(offer);
      return offer;
    } catch (error) {
      console.error('Error creating offer:', error);
      throw error;
    }
  }

  /**
   * Process and accept an offer, creating an answer
   */
  async processOffer(offer) {
    if (!this.peerConnection) {
      throw new Error('Peer connection not initialized');
    }

    try {
      const rtcOffer = new RTCSessionDescription(offer);
      await this.peerConnection.setRemoteDescription(rtcOffer);
      
      const answer = await this.peerConnection.createAnswer();
      await this.peerConnection.setLocalDescription(answer);
      
      return answer;
    } catch (error) {
      console.error('Error processing offer:', error);
      throw error;
    }
  }

  /**
   * Process an answer from remote peer
   */
  async processAnswer(answer) {
    if (!this.peerConnection) {
      throw new Error('Peer connection not initialized');
    }

    try {
      const rtcAnswer = new RTCSessionDescription(answer);
      await this.peerConnection.setRemoteDescription(rtcAnswer);
    } catch (error) {
      console.error('Error processing answer:', error);
      throw error;
    }
  }

  /**
   * Add ICE candidate received from remote peer
   */
  async addIceCandidate(candidate) {
    if (!this.peerConnection) {
      throw new Error('Peer connection not initialized');
    }

    try {
      await this.peerConnection.addIceCandidate(new RTCIceCandidate(candidate));
    } catch (error) {
      console.error('Error adding ICE candidate:', error);
      throw error;
    }
  }

  /**
   * Send data through the data channel
   */
  sendData(data) {
    if (!this.dataChannel || this.dataChannel.readyState !== 'open') {
      throw new Error('Data channel not open');
    }

    this.dataChannel.send(data);
  }

  /**
   * Capture image from video stream
   */
  captureImage(videoElement) {
    if (!videoElement) {
      throw new Error('Video element not provided');
    }

    const canvas = document.createElement('canvas');
    canvas.width = videoElement.videoWidth;
    canvas.height = videoElement.videoHeight;
    
    const ctx = canvas.getContext('2d');
    ctx.drawImage(videoElement, 0, 0, canvas.width, canvas.height);
    
    return canvas.toDataURL('image/jpeg');
  }

  /**
   * Toggle video track
   */
  toggleVideo(enabled) {
    if (!this.localStream) return false;
    
    const videoTrack = this.localStream.getVideoTracks()[0];
    if (videoTrack) {
      videoTrack.enabled = enabled;
      return true;
    }
    
    return false;
  }

  /**
   * Toggle audio track
   */
  toggleAudio(enabled) {
    if (!this.localStream) return false;
    
    const audioTrack = this.localStream.getAudioTracks()[0];
    if (audioTrack) {
      audioTrack.enabled = enabled;
      return true;
    }
    
    return false;
  }

  /**
   * Clean up resources
   */
  disconnect() {
    if (this.localStream) {
      this.localStream.getTracks().forEach(track => track.stop());
      this.localStream = null;
    }
    
    if (this.peerConnection) {
      this.peerConnection.close();
      this.peerConnection = null;
    }
    
    this.dataChannel = null;
    this.remoteStream = null;
  }
}

export default new WebRTCService();