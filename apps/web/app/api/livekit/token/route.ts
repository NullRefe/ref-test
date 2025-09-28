// File: apps/web/app/api/livekit/token/route.ts

import { AccessToken } from 'livekit-server-sdk';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const room = searchParams.get('room');
    const identity = searchParams.get('identity');

    console.log('🔑 Token request received:', { room, identity });

    if (!room || !identity) {
      console.log('❌ Missing room or identity');
      return NextResponse.json(
        { error: 'Missing room or identity parameters' },
        { status: 400 }
      );
    }

    // Get environment variables
    const apiKey = process.env.LIVEKIT_API_KEY;
    const apiSecret = process.env.LIVEKIT_API_SECRET;
    const wsUrl = process.env.LIVEKIT_URL;

    console.log('🔧 Environment check:', {
      hasApiKey: !!apiKey,
      hasApiSecret: !!apiSecret,
      hasWsUrl: !!wsUrl,
      wsUrl: wsUrl
    });

    if (!apiKey || !apiSecret || !wsUrl) {
      console.log('❌ Missing LiveKit environment variables');
      return NextResponse.json(
        { error: 'Server configuration error - missing LiveKit credentials' },
        { status: 500 }
      );
    }

    // Create access token with video permissions
    const at = new AccessToken(apiKey, apiSecret, { 
      identity,
      ttl: '6h'
    });

    // Add video grant using the correct method for newer versions
    at.addGrant({
      room,
      roomJoin: true,
      canPublish: true,
      canSubscribe: true,
      canPublishData: true,
      canUpdateOwnMetadata: true,
    });

    const token = await at.toJwt();

    console.log('✅ Token generated successfully');

    return NextResponse.json({
      token,
      url: wsUrl,
      identity,
      room,
    });

  } catch (error) {
    console.error('❌ Error generating token:', error);
    return NextResponse.json(
      { 
        error: 'Failed to generate access token',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}