import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/database';

// GET /api/email/templates - Get all email templates
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const type = searchParams.get('type');
    const status = searchParams.get('status');
    const search = searchParams.get('search');
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');

    let whereClause = 'WHERE 1=1';
    const params: any[] = [];
    let paramCount = 0;

    if (type) {
      paramCount++;
      whereClause += ` AND type = $${paramCount}`;
      params.push(type);
    }

    if (status === 'active') {
      whereClause += ` AND is_active = true`;
    } else if (status === 'inactive') {
      whereClause += ` AND is_active = false`;
    }

    if (search) {
      paramCount++;
      whereClause += ` AND (name ILIKE $${paramCount} OR description ILIKE $${paramCount} OR subject ILIKE $${paramCount})`;
      params.push(`%${search}%`);
    }

    const offset = (page - 1) * limit;

    // Get templates with variables count
    const templates = await prisma.$queryRaw`
      SELECT 
        t.*,
        COALESCE(v.variable_count, 0) as variable_count,
        COALESCE(l.usage_count, 0) as usage_count
      FROM email_templates t
      LEFT JOIN (
        SELECT "templateId", COUNT(*) as variable_count 
        FROM email_template_variables 
        GROUP BY "templateId"
      ) v ON t.id = v."templateId"
      LEFT JOIN (
        SELECT "templateId", COUNT(*) as usage_count 
        FROM email_logs 
        GROUP BY "templateId"
      ) l ON t.id = l."templateId"
      WHERE 1=1
      ORDER BY t."updatedAt" DESC
      LIMIT ${limit} OFFSET ${offset}
    `;

    // Get total count
    const totalResult = await prisma.$queryRaw`
      SELECT COUNT(*)::int as total 
      FROM email_templates t
      WHERE 1=1
    ` as any[];

    const total = parseInt(totalResult[0]?.total || '0');

    return NextResponse.json({
      templates,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    console.error('Error fetching email templates:', error);
    return NextResponse.json(
      { error: 'Failed to fetch email templates' },
      { status: 500 }
    );
  }
}

// POST /api/email/templates - Create new email template
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      name,
      type,
      subject,
      htmlContent,
      textContent,
      description,
      variables = []
    } = body;

    if (!name || !type || !subject || !htmlContent) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Create template using Prisma ORM
    const template = await prisma.emailTemplate.create({
      data: {
        name,
        type: type.toUpperCase(),
        subject,
        htmlContent,
        textContent: textContent || '',
        description: description || '',
        isActive: true,
      },
      include: {
        variables: true,
      },
    });

    // Create variables if provided
    if (variables && variables.length > 0) {
      await prisma.emailTemplateVariable.createMany({
        data: variables.map((variable: any) => ({
          templateId: template.id,
          name: variable.name,
          description: variable.description || '',
          required: variable.required || false,
          defaultValue: variable.defaultValue || null,
        })),
      });
    }

    return NextResponse.json(template, { status: 201 });
  } catch (error) {
    console.error('Error creating email template:', error);
    return NextResponse.json(
      { error: 'Failed to create email template' },
      { status: 500 }
    );
  }
}
