import { NextRequest, NextResponse } from 'next/server';
import { globalChatService } from '@/lib/services';
import { writeFile, mkdir } from 'fs/promises';
import { join } from 'path';
import { z } from 'zod';

const uploadSchema = z.object({
  userId: z.string(),
  messageType: z.enum(['FILE', 'IMAGE', 'CODE', 'DOCUMENT']),
});

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File;
    const userId = formData.get('userId') as string;
    const messageType = formData.get('messageType') as string;

    console.log('Upload attempt:', { fileName: file?.name, userId, messageType });

    if (!file) {
      return NextResponse.json(
        { success: false, message: 'No file provided' },
        { status: 400 }
      );
    }

    if (!userId) {
      return NextResponse.json(
        { success: false, message: 'User ID is required' },
        { status: 400 }
      );
    }

    // Validate inputs
    let validatedData;
    try {
      validatedData = uploadSchema.parse({ userId, messageType });
    } catch (validationError) {
      console.error('Validation error:', validationError);
      return NextResponse.json(
        { success: false, message: 'Invalid input data' },
        { status: 400 }
      );
    }

    // Check file size (limit to 50MB)
    const maxSize = 50 * 1024 * 1024; // 50MB
    if (file.size > maxSize) {
      return NextResponse.json(
        { success: false, message: 'File size too large (max 50MB)' },
        { status: 400 }
      );
    }

    // Create upload directory if it doesn't exist
    const uploadDir = join(process.cwd(), 'public', 'uploads', 'chat');
    try {
      await mkdir(uploadDir, { recursive: true });
    } catch (dirError) {
      console.error('Directory creation error:', dirError);
      // Directory might already exist, continue
    }

    // Generate unique filename
    const timestamp = Date.now();
    const randomId = Math.random().toString(36).substring(2);
    const fileExtension = file.name.split('.').pop() || 'bin';
    const fileName = `${timestamp}-${randomId}.${fileExtension}`;
    const filePath = join(uploadDir, fileName);

    // Write file to disk
    try {
      const bytes = await file.arrayBuffer();
      const buffer = Buffer.from(bytes);
      await writeFile(filePath, buffer);
      console.log('File written successfully:', filePath);
    } catch (fileError) {
      console.error('File write error:', fileError);
      return NextResponse.json(
        { success: false, message: 'Failed to save file' },
        { status: 500 }
      );
    }

    // Get or create the global room
    let room;
    try {
      room = await globalChatService.getGlobalRoom();
      console.log('Room retrieved:', room?.id);
    } catch (roomError) {
      console.error('Room retrieval error:', roomError);
      return NextResponse.json(
        { success: false, message: 'Failed to access global chat room' },
        { status: 500 }
      );
    }
    
    if (!room) {
      console.error('No room found and could not create one');
      return NextResponse.json(
        { success: false, message: 'Failed to access global chat room' },
        { status: 500 }
      );
    }

    // Join user to room if not already joined
    try {
      await globalChatService.joinRoom(room.id, userId);
      console.log('User joined room:', { roomId: room.id, userId });
    } catch (joinError) {
      console.error('Join room error:', joinError);
      // Continue anyway, user might already be in room
    }

    // Create message with file
    let message;
    try {
      message = await globalChatService.sendMessage({
        roomId: room.id,
        userId,
        content: file.name, // Store original filename as content
        messageType: validatedData.messageType as any,
      });
      console.log('Message created:', message.id);
    } catch (messageError) {
      console.error('Message creation error:', messageError);
      return NextResponse.json(
        { success: false, message: 'Failed to create message' },
        { status: 500 }
      );
    }

    // Add attachment
    const downloadUrl = `/uploads/chat/${fileName}`;
    try {
      await globalChatService.addAttachment({
        messageId: message.id,
        fileName,
        originalName: file.name,
        mimeType: file.type,
        fileSize: file.size,
        downloadUrl,
      });
      console.log('Attachment added successfully');
    } catch (attachmentError) {
      console.error('Attachment creation error:', attachmentError);
      return NextResponse.json(
        { success: false, message: 'Failed to add attachment' },
        { status: 500 }
      );
    }

    // Fetch the complete message with attachments
    let completeMessage;
    try {
      const messages = await globalChatService.getMessages(room.id, 1, 0);
      completeMessage = messages[0];
      console.log('Complete message retrieved');
    } catch (fetchError) {
      console.error('Message fetch error:', fetchError);
      // Return success anyway since the upload worked
      return NextResponse.json({
        success: true,
        data: { id: message.id, content: file.name },
      });
    }

    return NextResponse.json({
      success: true,
      data: completeMessage,
    });

  } catch (error) {
    console.error('File upload error:', error);
    return NextResponse.json(
      { success: false, message: `Failed to upload file: ${error instanceof Error ? error.message : 'Unknown error'}` },
      { status: 500 }
    );
  }
}
