import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import crypto from 'crypto';

const prisma = new PrismaClient();

interface HashCrackRequest {
  hash: string;
  hashType: 'md5' | 'sha1' | 'sha256' | 'sha512';
  attackType: 'dictionary' | 'bruteforce' | 'rainbow';
  wordlist?: string;
  charset?: string;
  maxLength?: number;
}

interface HashCrackResult {
  hash: string;
  hashType: string;
  plaintext?: string;
  attackType: string;
  attempts: number;
  duration: number;
  status: 'cracked' | 'failed' | 'running';
}

// Common passwords dictionary for demonstration
const COMMON_PASSWORDS = [
  'password', '123456', 'password123', 'admin', 'letmein', 'welcome',
  'monkey', '1234567890', 'qwerty', 'abc123', 'Password1', 'iloveyou',
  'princess', 'rockyou', 'football', 'secret', 'charlie', 'jordan',
  'freedom', 'sunshine', 'batman', 'shadow', 'nicole', 'hello',
  'master', 'computer', 'beautiful', 'superman', 'whatever', 'dragon'
];

// Character sets for brute force
const CHARSETS = {
  lowercase: 'abcdefghijklmnopqrstuvwxyz',
  uppercase: 'ABCDEFGHIJKLMNOPQRSTUVWXYZ', 
  numbers: '0123456789',
  symbols: '!@#$%^&*()_+-=[]{}|;:,.<>?',
  all: 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*()_+-=[]{}|;:,.<>?'
};

function hashString(input: string, algorithm: string): string {
  return crypto.createHash(algorithm).update(input).digest('hex');
}

function validateHash(hash: string, hashType: string): boolean {
  const expectedLengths: { [key: string]: number } = {
    md5: 32,
    sha1: 40,
    sha256: 64,
    sha512: 128
  };
  
  return hash.length === expectedLengths[hashType] && /^[a-fA-F0-9]+$/.test(hash);
}

async function dictionaryAttack(targetHash: string, hashType: string, wordlist: string[]): Promise<{ plaintext?: string; attempts: number }> {
  let attempts = 0;
  
  for (const word of wordlist) {
    attempts++;
    const hashedWord = hashString(word, hashType);
    
    if (hashedWord.toLowerCase() === targetHash.toLowerCase()) {
      return { plaintext: word, attempts };
    }
    
    // Try common variations
    const variations = [
      word.toUpperCase(),
      word.toLowerCase(),
      word + '123',
      word + '!',
      word + '1',
      '123' + word,
    ];
    
    for (const variation of variations) {
      attempts++;
      const hashedVariation = hashString(variation, hashType);
      
      if (hashedVariation.toLowerCase() === targetHash.toLowerCase()) {
        return { plaintext: variation, attempts };
      }
    }
  }
  
  return { attempts };
}

async function bruteForceAttack(
  targetHash: string, 
  hashType: string, 
  charset: string, 
  maxLength: number
): Promise<{ plaintext?: string; attempts: number }> {
  let attempts = 0;
  const maxAttempts = 10000; // Limit to prevent infinite loops
  
  // Generate combinations up to maxLength
  function* generateCombinations(chars: string, length: number): Generator<string> {
    if (length <= 0) return;
    if (length === 1) {
      for (const char of chars) {
        yield char;
      }
      return;
    }
    
    for (const char of chars) {
      for (const rest of generateCombinations(chars, length - 1)) {
        yield char + rest;
      }
    }
  }
  
  for (let length = 1; length <= maxLength && attempts < maxAttempts; length++) {
    for (const combination of generateCombinations(charset, length)) {
      attempts++;
      const hashedCombination = hashString(combination, hashType);
      
      if (hashedCombination.toLowerCase() === targetHash.toLowerCase()) {
        return { plaintext: combination, attempts };
      }
      
      if (attempts >= maxAttempts) {
        break;
      }
    }
  }
  
  return { attempts };
}

export async function POST(request: NextRequest) {
  try {
    const body: HashCrackRequest = await request.json();
    const { 
      hash, 
      hashType, 
      attackType, 
      wordlist,
      charset = 'all',
      maxLength = 4 
    } = body;

    // Validate input
    if (!hash || !hashType || !attackType) {
      return NextResponse.json(
        { error: 'Hash, hash type, and attack type are required' },
        { status: 400 }
      );
    }

    // Validate hash format
    if (!validateHash(hash, hashType)) {
      return NextResponse.json(
        { error: `Invalid ${hashType.toUpperCase()} hash format` },
        { status: 400 }
      );
    }

    // Validate hash type
    const validHashTypes = ['md5', 'sha1', 'sha256', 'sha512', 'bcrypt', 'scrypt', 'ntlm', 'lm'];
    if (!validHashTypes.includes(hashType.toLowerCase())) {
      return NextResponse.json(
        { error: 'Unsupported hash type' },
        { status: 400 }
      );
    }

    // Convert to uppercase for Prisma enum
    const hashTypeEnum = hashType.toUpperCase() as 'MD5' | 'SHA1' | 'SHA256' | 'SHA512' | 'BCRYPT' | 'SCRYPT' | 'NTLM' | 'LM';

    // Limit brute force attempts
    if (attackType === 'bruteforce' && maxLength > 6) {
      return NextResponse.json(
        { error: 'Maximum length for brute force is 6 characters' },
        { status: 400 }
      );
    }

    const startTime = Date.now();

    // Create session record
    const session = await (prisma as any).hashCrackSession.create({
      data: {
        hash: hash.toLowerCase(),
        hashType: hashTypeEnum,
        dictionary: attackType === 'dictionary' ? 'common_passwords.txt' : undefined,
        userId: 'user1', // Replace with actual user ID from auth
        status: 'CRACKING',
        startedAt: new Date(startTime)
      }
    });

    let result: { plaintext?: string; attempts: number };

    try {
      switch (attackType) {
        case 'dictionary':
          const dictionary = wordlist ? JSON.parse(wordlist) : COMMON_PASSWORDS;
          result = await dictionaryAttack(hash, hashTypeEnum.toLowerCase(), dictionary);
          break;
          
        case 'bruteforce':
          const selectedCharset = CHARSETS[charset as keyof typeof CHARSETS] || CHARSETS.all;
          result = await bruteForceAttack(hash, hashTypeEnum.toLowerCase(), selectedCharset, maxLength);
          break;
          
        case 'rainbow':
          // For demo purposes, we'll simulate a rainbow table lookup
          // In reality, this would query pre-computed hash tables
          result = await dictionaryAttack(hash, hashTypeEnum.toLowerCase(), COMMON_PASSWORDS);
          break;
          
        default:
          return NextResponse.json(
            { error: 'Unsupported attack type' },
            { status: 400 }
          );
      }

      const endTime = Date.now();
      const duration = endTime - startTime;
      const status = result.plaintext ? 'CRACKED' : 'FAILED';

      // Update session with results
      await (prisma as any).hashCrackSession.update({
        where: { id: session.id },
        data: {
          status: status,
          result: result.plaintext,
          progress: 100,
          completedAt: new Date(endTime)
        }
      });

      const response: HashCrackResult = {
        hash: hash.toLowerCase(),
        hashType: hashTypeEnum,
        plaintext: result.plaintext,
        attackType,
        attempts: result.attempts,
        duration,
        status: result.plaintext ? 'cracked' : 'failed'
      };

      return NextResponse.json({
        success: true,
        result: response,
        sessionId: session.id
      });

    } catch (error) {
      // Update session with error status
      await (prisma as any).hashCrackSession.update({
        where: { id: session.id },
        data: {
          status: 'FAILED',
          completedAt: new Date()
        }
      });

      throw error;
    }

  } catch (error) {
    console.error('Hash crack error:', error);
    return NextResponse.json(
      { error: 'Internal server error during hash cracking' },
      { status: 500 }
    );
  }
}

// Get cracking history
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId') || 'user1';
    const limit = parseInt(searchParams.get('limit') || '10');

    const sessions = await (prisma as any).hashCrackSession.findMany({
      where: {
        userId
      },
      orderBy: {
        startedAt: 'desc'
      },
      take: limit
    });

    return NextResponse.json({
      success: true,
      sessions: sessions.map((session: any) => ({
        id: session.id,
        hash: session.hash,
        hashType: session.hashType,
        attackType: session.dictionary ? 'dictionary' : 'bruteforce',
        status: session.status.toLowerCase(),
        plaintext: session.result,
        attempts: 0, // Not stored in current schema
        duration: 0, // Calculate from timestamps if needed
        startTime: session.startedAt?.toISOString(),
        endTime: session.completedAt?.toISOString()
      }))
    });

  } catch (error) {
    console.error('Error fetching hash crack history:', error);
    return NextResponse.json(
      { error: 'Failed to fetch cracking history' },
      { status: 500 }
    );
  }
}
