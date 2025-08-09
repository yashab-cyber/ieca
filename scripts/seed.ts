import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Seeding database...');

  try {
    // Create admin user
    const adminPassword = await bcrypt.hash('@Ethicalhacker07', 12);
    
    const adminUser = await prisma.user.upsert({
      where: { email: 'yashabalam707@gmail.com' },
      update: {},
      create: {
        email: 'yashabalam707@gmail.com',
        password: adminPassword,
        name: 'Yashab Alam',
        phone: '+91-XXXXXXXXXX',
        linkedin: 'https://www.linkedin.com/in/yashab-alam',
        github: 'https://github.com/yashab-cyber',
        role: 'ADMIN',
        isActive: true,
        profile: {
          create: {
            bio: 'Founder & CEO of IECA, cybersecurity expert with years of experience in ethical hacking and digital security.',
            skills: ['Penetration Testing', 'Digital Forensics', 'Threat Intelligence', 'Incident Response'],
            experience: '10+ years in cybersecurity',
            location: 'India',
            website: 'https://www.zehrasec.com',
            isPublic: true,
            reputation: 1000,
            points: 1000,
            rank: 'Elite Hacker',
          },
        },
      },
      include: {
        profile: true,
      },
    });

    console.log('✅ Created admin user:', adminUser.email);

    // Create sample members
    const members = [
      {
        email: 'arjun.sharma@ieca.gov.in',
        name: 'Arjun Sharma',
        role: 'Chief Security Architect',
        skills: ['Cloud Security', 'Architecture', 'DevSecOps'],
        bio: 'Expert in cloud security architecture and DevSecOps practices.',
      },
      {
        email: 'priya.singh@ieca.gov.in',
        name: 'Priya Singh',
        role: 'Head of Threat Intelligence',
        skills: ['Threat Intel', 'OSINT', 'Malware Analysis'],
        bio: 'Specialist in threat intelligence and open source intelligence gathering.',
      },
      {
        email: 'vikram.rathore@ieca.gov.in',
        name: 'Vikram Rathore',
        role: 'Lead Penetration Tester',
        skills: ['Penetration Testing', 'Red Team', 'Vulnerability Assessment'],
        bio: 'Senior penetration tester with expertise in red team operations.',
      },
      {
        email: 'ananya.gupta@ieca.gov.in',
        name: 'Ananya Gupta',
        role: 'Cyber Forensics Expert',
        skills: ['Digital Forensics', 'Incident Response', 'Network Security'],
        bio: 'Digital forensics expert specializing in incident response and network security.',
      },
    ];

    for (const member of members) {
      const memberPassword = await bcrypt.hash('TempPassword123!', 12);
      
      await prisma.user.upsert({
        where: { email: member.email },
        update: {},
        create: {
          email: member.email,
          password: memberPassword,
          name: member.name,
          role: 'MEMBER',
          isActive: true,
          profile: {
            create: {
              bio: member.bio,
              skills: member.skills,
              isPublic: true,
              reputation: Math.floor(Math.random() * 500) + 100,
              points: Math.floor(Math.random() * 1000) + 200,
              rank: ['Senior', 'Expert', 'Advanced'][Math.floor(Math.random() * 3)],
            },
          },
        },
      });
    }

    console.log('✅ Created sample members');

    // Create sample resources
    const resources = [
      {
        title: 'Cybersecurity Fundamentals Guide',
        description: 'A comprehensive guide to cybersecurity basics for beginners.',
        content: 'This guide covers the essential concepts of cybersecurity...',
        category: 'Education',
        tags: ['cybersecurity', 'fundamentals', 'beginner'],
        authorName: 'IECA Team',
        difficulty: 'BEGINNER',
        status: 'PUBLISHED',
      },
      {
        title: 'Advanced Penetration Testing Techniques',
        description: 'In-depth techniques for professional penetration testing.',
        content: 'This resource covers advanced penetration testing methodologies...',
        category: 'Penetration Testing',
        tags: ['pentesting', 'advanced', 'red-team'],
        authorName: 'Vikram Rathore',
        difficulty: 'ADVANCED',
        status: 'PUBLISHED',
      },
      {
        title: 'Incident Response Playbook',
        description: 'Step-by-step guide for handling cybersecurity incidents.',
        content: 'This playbook provides structured approach to incident response...',
        category: 'Incident Response',
        tags: ['incident-response', 'playbook', 'forensics'],
        authorName: 'Ananya Gupta',
        difficulty: 'INTERMEDIATE',
        status: 'PUBLISHED',
      },
    ];

    for (const resource of resources) {
      await prisma.resource.create({
        data: {
          ...resource,
          difficulty: resource.difficulty as 'BEGINNER' | 'INTERMEDIATE' | 'ADVANCED',
          status: resource.status as 'DRAFT' | 'PUBLISHED' | 'ARCHIVED',
          views: Math.floor(Math.random() * 1000) + 50,
          downloads: Math.floor(Math.random() * 500) + 20,
          rating: Math.random() * 2 + 3, // 3-5 rating
        },
      });
    }

    console.log('✅ Created sample resources');

    // Create sample applications
    const applications = [
      {
        name: 'Rohan Verma',
        email: 'rohan.v@example.com',
        phone: '+91-9876543210',
        linkedin: 'https://linkedin.com/in/rohanverma',
        github: 'https://github.com/rohanverma',
        skills: ['Penetration Testing', 'Cloud Security'],
        statement: 'I am passionate about cybersecurity and want to contribute to protecting India\'s digital infrastructure. I have 3 years of experience in penetration testing and cloud security.',
        isIndianCitizen: true,
        status: 'PENDING',
      },
      {
        name: 'Aisha Khan',
        email: 'aisha.k@example.com',
        phone: '+91-9876543211',
        skills: ['Digital Forensics', 'Incident Response'],
        statement: 'As a digital forensics expert, I want to help IECA in investigating cyber crimes and building a safer digital environment for all Indians.',
        isIndianCitizen: true,
        status: 'UNDER_REVIEW',
      },
    ];

    for (const application of applications) {
      await prisma.application.create({
        data: {
          ...application,
          status: application.status as 'PENDING' | 'UNDER_REVIEW' | 'APPROVED' | 'REJECTED',
        },
      });
    }

    console.log('✅ Created sample applications');

    // Create sample notifications
    const notifications = [
      {
        title: 'Welcome to IECA Database',
        message: 'The database has been successfully set up with initial data.',
        type: 'SUCCESS',
        isGlobal: true,
      },
      {
        title: 'Security Alert',
        message: 'Please ensure all default passwords are changed before production deployment.',
        type: 'WARNING',
        isGlobal: true,
      },
    ];

    for (const notification of notifications) {
      await prisma.notification.create({
        data: {
          ...notification,
          type: notification.type as 'INFO' | 'SUCCESS' | 'WARNING' | 'ERROR',
        },
      });
    }

    console.log('✅ Created sample notifications');

    console.log('🎉 Database seeding completed successfully!');
    console.log('');
    console.log('📋 Created:');
    console.log('   - 1 Admin user (yashabalam707@gmail.com)');
    console.log('   - 4 Sample members');
    console.log('   - 3 Sample resources');
    console.log('   - 2 Sample applications');
    console.log('   - 2 Sample notifications');
    console.log('');
    console.log('🔐 Admin Login:');
    console.log('   Email: yashabalam707@gmail.com');
    console.log('   Password: @Ethicalhacker07');

  } catch (error) {
    console.error('❌ Error seeding database:', error);
    throw error;
  }
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
