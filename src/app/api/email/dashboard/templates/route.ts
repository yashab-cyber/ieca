import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/database';

// Simple API to get basic template data for the dashboard
export async function GET() {
  try {
    // Get basic templates data
    const templates = await prisma.$queryRaw`
      SELECT 
        id,
        name,
        type,
        subject,
        description,
        "isActive",
        "createdAt",
        "updatedAt"
      FROM email_templates 
      ORDER BY "updatedAt" DESC
    ` as any[];

    // Convert the data to match the expected format
    const formattedTemplates = templates.map((template: any) => ({
      id: template.id,
      name: template.name,
      type: template.type.toLowerCase(),
      subject: template.subject,
      description: template.description || '',
      lastModified: template.updatedAt.toISOString(),
      status: template.isActive ? 'active' : 'inactive',
      usageCount: Math.floor(Math.random() * 100) // Placeholder for now
    }));

    return NextResponse.json({
      success: true,
      templates: formattedTemplates
    });
  } catch (error) {
    console.error('Error fetching templates:', error);
    return NextResponse.json({
      success: false,
      templates: [],
      error: 'Failed to fetch templates'
    });
  }
}
