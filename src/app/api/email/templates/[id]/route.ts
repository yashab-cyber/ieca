import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/database';

// GET /api/email/templates/[id] - Get specific email template
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // For now, allow access without authentication for testing
    // TODO: Add proper authentication when auth system is fully implemented

    // Use raw SQL query until Prisma client types are resolved
    const template = await prisma.$queryRaw`
      SELECT 
        t.*,
        u.name as creator_name,
        u.email as creator_email,
        COALESCE(
          json_agg(
            json_build_object(
              'id', v.id,
              'name', v.name,
              'description', v.description,
              'required', v.required,
              'defaultValue', v."defaultValue"
            )
          ) FILTER (WHERE v.id IS NOT NULL), 
          '[]'::json
        ) as variables
      FROM email_templates t
      LEFT JOIN users u ON t."createdBy" = u.id
      LEFT JOIN email_template_variables v ON t.id = v."templateId"
      WHERE t.id = ${params.id}
      GROUP BY t.id, u.name, u.email
    `;

    if (!template || (Array.isArray(template) && template.length === 0)) {
      return NextResponse.json(
        { error: 'Template not found' },
        { status: 404 }
      );
    }

    const templateData = Array.isArray(template) ? template[0] : template;
    
    return NextResponse.json({
      ...templateData,
      creator: templateData.creator_name ? {
        name: templateData.creator_name,
        email: templateData.creator_email
      } : null
    });
  } catch (error) {
    console.error('Error fetching email template:', error);
    return NextResponse.json(
      { error: 'Failed to fetch email template' },
      { status: 500 }
    );
  }
}

// PUT /api/email/templates/[id] - Update email template
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // For now, allow access without authentication for testing
    // TODO: Add proper authentication when auth system is fully implemented

    const body = await request.json();
    const {
      name,
      type,
      subject,
      htmlContent,
      textContent,
      description,
      isActive,
      variables = []
    } = body;

    // Check if template exists using raw SQL
    const existingTemplate = await prisma.$queryRaw`
      SELECT id FROM email_templates WHERE id = ${params.id}
    `;

    if (!existingTemplate || (Array.isArray(existingTemplate) && existingTemplate.length === 0)) {
      return NextResponse.json(
        { error: 'Template not found' },
        { status: 404 }
      );
    }

    // Update template and variables using raw SQL in a transaction
    const result = await prisma.$transaction(async (tx) => {
      // Delete existing variables
      await tx.$executeRaw`
        DELETE FROM email_template_variables WHERE "templateId" = ${params.id}
      `;

      // Update template
      await tx.$executeRaw`
        UPDATE email_templates 
        SET 
          name = ${name},
          type = ${type}::"EmailTemplateType",
          subject = ${subject},
          "htmlContent" = ${htmlContent},
          "textContent" = ${textContent || null},
          description = ${description || null},
          "isActive" = ${isActive ?? true},
          "updatedAt" = NOW()
        WHERE id = ${params.id}
      `;

      // Insert new variables
      for (const variable of variables) {
        await tx.$executeRaw`
          INSERT INTO email_template_variables ("templateId", name, description, required, "defaultValue")
          VALUES (${params.id}, ${variable.name}, ${variable.description || null}, ${variable.required || false}, ${variable.defaultValue || null})
        `;
      }

      // Return updated template
      const updatedTemplate = await tx.$queryRaw`
        SELECT 
          t.*,
          u.name as creator_name,
          u.email as creator_email,
          COALESCE(
            json_agg(
              json_build_object(
                'id', v.id,
                'name', v.name,
                'description', v.description,
                'required', v.required,
                'defaultValue', v."defaultValue"
              )
            ) FILTER (WHERE v.id IS NOT NULL), 
            '[]'::json
          ) as variables
        FROM email_templates t
        LEFT JOIN users u ON t."createdBy" = u.id
        LEFT JOIN email_template_variables v ON t.id = v."templateId"
        WHERE t.id = ${params.id}
        GROUP BY t.id, u.name, u.email
      `;

      return Array.isArray(updatedTemplate) ? updatedTemplate[0] : updatedTemplate;
    });

    return NextResponse.json({
      ...result,
      creator: result.creator_name ? {
        name: result.creator_name,
        email: result.creator_email
      } : null
    });
  } catch (error) {
    console.error('Error updating email template:', error);
    return NextResponse.json(
      { error: 'Failed to update email template' },
      { status: 500 }
    );
  }
}

// DELETE /api/email/templates/[id] - Delete email template
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // For now, allow access without authentication for testing
    // TODO: Add proper authentication when auth system is fully implemented

    // Check if template exists using raw SQL
    const template = await prisma.$queryRaw`
      SELECT id FROM email_templates WHERE id = ${params.id}
    `;

    if (!template || (Array.isArray(template) && template.length === 0)) {
      return NextResponse.json(
        { error: 'Template not found' },
        { status: 404 }
      );
    }

    // Delete template using raw SQL (cascading delete will handle variables)
    await prisma.$executeRaw`
      DELETE FROM email_templates WHERE id = ${params.id}
    `;

    return NextResponse.json({ message: 'Template deleted successfully' });
  } catch (error) {
    console.error('Error deleting email template:', error);
    return NextResponse.json(
      { error: 'Failed to delete email template' },
      { status: 500 }
    );
  }
}
