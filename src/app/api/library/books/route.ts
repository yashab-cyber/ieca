import { NextRequest, NextResponse } from 'next/server';
import { readdir, stat } from 'fs/promises';
import { join } from 'path';

interface Book {
  id: string;
  title: string;
  filename: string;
  path: string;
  category: string;
  subcategory?: string;
  size: number;
  lastModified: Date;
}

interface BookCategory {
  id: string;
  name: string;
  description: string;
  level: 'beginner' | 'intermediate' | 'advanced' | 'specialized';
  bookCount: number;
  subcategories: BookSubcategory[];
}

interface BookSubcategory {
  id: string;
  name: string;
  bookCount: number;
  books: Book[];
}

export async function GET(request: NextRequest) {
  try {
    const booksPath = join(process.cwd(), 'content', 'books', 'Hacking Books');
    
    // Define category mappings
    const categoryMappings = {
      '1)Hacking Begginer': {
        name: 'Hacking Beginner',
        description: 'Start your cybersecurity journey with fundamental concepts and basic techniques',
        level: 'beginner' as const
      },
      '2)Hacking Intermediate': {
        name: 'Hacking Intermediate',
        description: 'Advance your skills with intermediate concepts and practical applications',
        level: 'intermediate' as const
      },
      '3)Hacking Advance': {
        name: 'Hacking Advanced',
        description: 'Master advanced techniques and sophisticated attack methodologies',
        level: 'advanced' as const
      },
      'Bitcoin hacking': {
        name: 'Cryptocurrency Security',
        description: 'Learn about cryptocurrency security, blockchain vulnerabilities, and digital asset protection',
        level: 'specialized' as const
      },
      'Bug Bounty': {
        name: 'Bug Bounty Hunting',
        description: 'Master the art of finding and reporting security vulnerabilities for rewards',
        level: 'intermediate' as const
      },
      'Carding hacking': {
        name: 'Payment Card Security',
        description: 'Understand payment card security and protection mechanisms',
        level: 'specialized' as const
      },
      'Hacking Technology': {
        name: 'Technology Hacking',
        description: 'Explore security aspects of various technologies and platforms',
        level: 'intermediate' as const
      },
      'Hardware Hacking': {
        name: 'Hardware Security',
        description: 'Learn about physical security, hardware vulnerabilities, and IoT security',
        level: 'advanced' as const
      },
      'Raspberry pi hacking': {
        name: 'Raspberry Pi Security',
        description: 'Discover Raspberry Pi applications in cybersecurity and penetration testing',
        level: 'intermediate' as const
      },
      'networking': {
        name: 'Network Security',
        description: 'Master network protocols, security, and penetration testing techniques',
        level: 'intermediate' as const
      }
    };

    const categories: BookCategory[] = [];

    // Scan each category directory
    const categoryDirs = await readdir(booksPath, { withFileTypes: true });
    
    for (const categoryDir of categoryDirs) {
      if (!categoryDir.isDirectory()) continue;

      const categoryPath = join(booksPath, categoryDir.name);
      const categoryInfo = categoryMappings[categoryDir.name as keyof typeof categoryMappings];
      
      if (!categoryInfo) continue;

      const subcategories: BookSubcategory[] = [];
      let totalBooksInCategory = 0;

      try {
        const items = await readdir(categoryPath, { withFileTypes: true });

        for (const item of items) {
          const itemPath = join(categoryPath, item.name);

          if (item.isDirectory()) {
            // This is a subcategory
            const books = await scanBooksInDirectory(itemPath, categoryDir.name, item.name);
            subcategories.push({
              id: `${categoryDir.name}-${item.name}`.toLowerCase().replace(/[^a-z0-9]/g, '-'),
              name: item.name,
              bookCount: books.length,
              books
            });
            totalBooksInCategory += books.length;
          } else if (item.name.toLowerCase().endsWith('.pdf')) {
            // This is a direct PDF in the category root
            const book = await createBookFromFile(itemPath, categoryDir.name, item.name);
            if (book) {
              // Create a "General" subcategory for direct PDFs
              let generalSubcat = subcategories.find(s => s.id === `${categoryDir.name}-general`.toLowerCase().replace(/[^a-z0-9]/g, '-'));
              if (!generalSubcat) {
                generalSubcat = {
                  id: `${categoryDir.name}-general`.toLowerCase().replace(/[^a-z0-9]/g, '-'),
                  name: 'General',
                  bookCount: 0,
                  books: []
                };
                subcategories.push(generalSubcat);
              }
              generalSubcat.books.push(book);
              generalSubcat.bookCount++;
              totalBooksInCategory++;
            }
          }
        }

        categories.push({
          id: categoryDir.name.toLowerCase().replace(/[^a-z0-9]/g, '-'),
          name: categoryInfo.name,
          description: categoryInfo.description,
          level: categoryInfo.level,
          bookCount: totalBooksInCategory,
          subcategories
        });

      } catch (error) {
        console.error(`Error scanning category ${categoryDir.name}:`, error);
      }
    }

    return NextResponse.json({
      success: true,
      categories,
      totalBooks: categories.reduce((sum, cat) => sum + cat.bookCount, 0)
    });

  } catch (error) {
    console.error('Error scanning books:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to scan books directory' },
      { status: 500 }
    );
  }
}

async function scanBooksInDirectory(dirPath: string, category: string, subcategory: string): Promise<Book[]> {
  const books: Book[] = [];
  
  try {
    const files = await readdir(dirPath, { withFileTypes: true });
    
    for (const file of files) {
      if (file.isFile() && file.name.toLowerCase().endsWith('.pdf')) {
        const filePath = join(dirPath, file.name);
        const book = await createBookFromFile(filePath, category, file.name, subcategory);
        if (book) {
          books.push(book);
        }
      }
    }
  } catch (error) {
    console.error(`Error scanning directory ${dirPath}:`, error);
  }

  return books;
}

async function createBookFromFile(filePath: string, category: string, filename: string, subcategory?: string): Promise<Book | null> {
  try {
    const stats = await stat(filePath);
    const relativePath = filePath.replace(join(process.cwd(), 'content'), '');
    
    // Clean up the title
    let title = filename.replace('.pdf', '');
    title = title.replace(/^\d+_\d+\.pdf$/, 'Unnamed Document'); // Handle numbered files
    title = title.replace(/\( PDFDrive\.com \)$/, '').trim();
    title = title.replace(/_/g, ' ');
    
    // If title is still just numbers, try to make it more readable
    if (/^\d+$/.test(title)) {
      title = `Document ${title}`;
    }

    return {
      id: `${category}-${subcategory || 'general'}-${filename}`.toLowerCase().replace(/[^a-z0-9]/g, '-'),
      title,
      filename,
      path: relativePath,
      category,
      subcategory,
      size: stats.size,
      lastModified: stats.mtime
    };
  } catch (error) {
    console.error(`Error processing file ${filePath}:`, error);
    return null;
  }
}
