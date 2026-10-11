import { PrismaClient, Role, CourseFormat, CourseLevel, CourseStatus, OrderStatus, TransactionStatus, LiveSessionType, LiveSessionStatus, DiscountType, DoubtStatus, BannerTag } from '@prisma/client';
import * as argon2 from 'argon2';

const prisma = new PrismaClient();

async function main() {
  const existingUsers = await prisma.user.count();
  if (existingUsers > 0) {
    // Delete existing users/courses so we can re-seed idempotent
    await prisma.doubt.deleteMany();
    await prisma.attendance.deleteMany();
    await prisma.certificate.deleteMany();
    await prisma.transaction.deleteMany();
    await prisma.orderItem.deleteMany();
    await prisma.order.deleteMany();
    await prisma.enrollment.deleteMany();
    await prisma.lesson.deleteMany();
    await prisma.courseModule.deleteMany();
    await prisma.liveSession.deleteMany();
    await prisma.coupon.deleteMany();
    await prisma.course.deleteMany();
    await prisma.courseCategory.deleteMany();
    await prisma.user.deleteMany();
  }

  console.log('🌱 Seeding massive database...\n');

  // Clean existing data in dependency order
  await prisma.doubt.deleteMany();
  await prisma.attendance.deleteMany();
  await prisma.certificate.deleteMany();
  await prisma.transaction.deleteMany();
  await prisma.orderItem.deleteMany();
  await prisma.order.deleteMany();
  await prisma.enrollment.deleteMany();
  await prisma.lesson.deleteMany();
  await prisma.courseModule.deleteMany();
  await prisma.liveSession.deleteMany();
  await prisma.coupon.deleteMany();
  await prisma.course.deleteMany();
  await prisma.courseCategory.deleteMany();
  await prisma.user.deleteMany();

  const passwordHash = await argon2.hash('Password123!');

  // ---- Users ----
  const admin = await prisma.user.create({
    data: { email: 'admin@stocklearn.com', name: 'Admin User', phone: '+919876543000', password: passwordHash, role: Role.ADMIN },
  });

  const instructors = [];
  for (let i = 1; i <= 5; i++) {
    const email = i === 1 ? 'instructor@stocklearn.com' : `instructor${i}@stocklearn.com`;
    const inst = await prisma.user.create({
      data: { email, name: `Master Instructor ${i}`, phone: `+91987654310${i}`, password: passwordHash, role: Role.INSTRUCTOR },
    });
    instructors.push(inst);
  }

  const learners = [];
  for (let i = 1; i <= 20; i++) {
    const email = i === 1 ? 'learner@stocklearn.com' : `learner${i}@stocklearn.com`;
    const learner = await prisma.user.create({
      data: { email, name: `Learner Student ${i}`, phone: `+9198765432${i.toString().padStart(2, '0')}`, password: passwordHash, role: Role.LEARNER },
    });
    learners.push(learner);
  }

  // ---- Categories ----
  const categoriesData = [
    { slug: 'beginner', name: 'Beginner', sortOrder: 1 },
    { slug: 'indicators', name: 'Indicators', sortOrder: 2 },
    { slug: 'derivatives', name: 'Derivatives', sortOrder: 3 },
    { slug: 'nism-exam-prep', name: 'NISM Exam Prep', sortOrder: 4 },
  ];
  const categories = {};
  for (const c of categoriesData) {
    categories[c.slug] = await prisma.courseCategory.create({ data: c });
  }

  // ---- Courses ----
  const coursesData = [
    {
      categoryId: categories['beginner'].id,
      slug: 'master-trader-programme',
      title: 'Master Trader Programme',
      description: 'A structured, mentor-led learning experience that builds your understanding of technical and fundamental analysis—from reading price action and chart patterns to evaluating company financials, with a focus on analytical thinking, risk awareness, and disciplined decision-making.',
      pricePaise: 899900,
      compareAtPricePaise: 1499900,
      format: CourseFormat.SELF_PACED,
      level: CourseLevel.BEGINNER,
      language: 'English',
      status: CourseStatus.PUBLISHED,
      thumbnailUrl: '/brand/master-trader-programme.jpg',
      instructorName: 'Jayanta Sarkar',
      displayLearnerCount: 1500,
      skills: ['Price Action', 'Chart Patterns', 'Risk Management', 'Fundamental Analysis'],
      bannerTag: BannerTag.FEATURED,
    },
    {
      categoryId: categories['indicators'].id,
      slug: 'masterclass-indicators-strategies',
      title: 'Masterclass of Indicators & Strategies',
      description: 'Indicators and strategies masterclass. Learn RSI, Fibonacci analysis, pivot levels, Ichimoku, and indicator confluence with live examples.',
      pricePaise: 1499900,
      compareAtPricePaise: 1999900,
      format: CourseFormat.SELF_PACED,
      level: CourseLevel.INTERMEDIATE,
      language: 'English',
      status: CourseStatus.PUBLISHED,
      thumbnailUrl: 'https://images.unsplash.com/photo-1642790106117-e829e14a795f?w=600',
      instructorName: 'Jayanta Sarkar',
      displayLearnerCount: 1000,
      skills: ['RSI Strategies', 'Fibonacci Analysis', 'Pivot Levels', 'Ichimoku'],
      bannerTag: BannerTag.TRENDING,
    },
    {
      categoryId: categories['derivatives'].id,
      slug: 'mastery-derivatives-risk-management',
      title: 'Mastery in Derivatives Trading & Risk Management',
      description: 'Derivatives and risk management masterclass. Futures & options mechanics, Option Greeks, hedging strategies, and disciplined capital management.',
      pricePaise: 1799900,
      compareAtPricePaise: 2499900,
      format: CourseFormat.SELF_PACED,
      level: CourseLevel.ADVANCED,
      language: 'English',
      status: CourseStatus.PUBLISHED,
      thumbnailUrl: '/brand/mastery-derivatives.jpg',
      instructorName: 'Jayanta Sarkar',
      displayLearnerCount: 1000,
      skills: ['Futures & Options', 'Option Greeks', 'Hedging', 'Risk Management'],
      bannerTag: BannerTag.POPULAR,
    },
  ];

  const courses = [];
  for (const c of coursesData) {
    courses.push(await prisma.course.create({ data: c }));
  }

  // ---- Curriculums (Generated for ALL courses) ----
  const lessonTitles = ["Introduction", "Core Concepts", "Advanced Mechanics", "Practical Examples", "Common Pitfalls", "Q&A Review"];
  for (const course of courses) {
    const numModules = course.level === CourseLevel.BEGINNER ? 3 : (course.level === CourseLevel.INTERMEDIATE ? 5 : 7);
    for (let m = 1; m <= numModules; m++) {
      const createdModule = await prisma.courseModule.create({
        data: { title: `Module ${m}: ${course.title} Phase ${m}`, order: m, courseId: course.id },
      });
      const numLessons = 3 + Math.floor(Math.random() * 3); // 3 to 5 lessons
      for (let l = 1; l <= numLessons; l++) {
        await prisma.lesson.create({
          data: { 
            title: `${lessonTitles[l-1] || 'Topic'} ${l}`, 
            order: l, 
            durationSec: 300 + Math.floor(Math.random() * 900), // 5 to 20 mins
            moduleId: createdModule.id, 
            videoUrl: `https://cdn.stocklearn.demo/videos/${course.slug}/${m}-${l}.mp4` 
          },
        });
      }
    }
  }

  // ---- Enrollments, Orders, Transactions, Certificates ----
  // Give each learner 3 to 6 random courses
  for (const learner of learners) {
    const numEnrollments = Math.min(courses.length, 1 + Math.floor(Math.random() * 3));
    const shuffledCourses = [...courses].sort(() => 0.5 - Math.random());
    const enrolledCourses = shuffledCourses.slice(0, numEnrollments);

    for (const course of enrolledCourses) {
      // Create Order
      const isFailed = Math.random() < 0.1; // 10% chance of failed order
      const status = isFailed ? OrderStatus.PENDING : OrderStatus.COMPLETED;
      const order = await prisma.order.create({
        data: {
          userId: learner.id,
          totalPaise: course.pricePaise,
          discountPaise: 0,
          status,
          items: { create: [{ courseId: course.id, pricePaise: course.pricePaise }] },
        },
      });

      // Create Transaction
      await prisma.transaction.create({
        data: { 
          orderId: order.id, 
          amountPaise: course.pricePaise, 
          razorpayPaymentId: `pay_demo_${Math.random().toString(36).substring(7)}`, 
          razorpayOrderId: `order_demo_${Math.random().toString(36).substring(7)}`, 
          status: isFailed ? TransactionStatus.FAILED : TransactionStatus.SUCCESS 
        },
      });

      // If successful, create Enrollment
      if (!isFailed) {
        const progressPercent = Math.random() < 0.3 ? 0 : (Math.random() < 0.6 ? Math.floor(Math.random() * 99) + 1 : 100);
        await prisma.enrollment.create({
          data: { userId: learner.id, courseId: course.id, progressPercent },
        });

        if (progressPercent === 100) {
          await prisma.certificate.create({
            data: {
              userId: learner.id,
              courseId: course.id,
              url: `https://cdn.stocklearn.demo/certificates/${course.slug}-${learner.id}.pdf`,
            },
          });
        }
      }
    }
  }

  // ---- Live Sessions ----
  const now = new Date();
  
  // Create 20 past sessions, 10 upcoming, 2 ongoing (mixed CLASS and WEBINAR)
  const sessionTypes = [LiveSessionType.CLASS, LiveSessionType.WEBINAR];
  const allSessions = [];

  for (let i = 0; i < 32; i++) {
    const instructor = instructors[i % instructors.length];
    const course = i % 3 === 0 ? null : courses[i % courses.length]; // 1/3rd are public (webinars typically)
    const type = course ? LiveSessionType.CLASS : LiveSessionType.WEBINAR;
    
    let status = LiveSessionStatus.COMPLETED;
    let timeOffset = - (1 + Math.floor(Math.random() * 30)) * 24 * 60 * 60 * 1000; // 1 to 30 days ago

    if (i >= 20 && i < 30) {
      status = LiveSessionStatus.SCHEDULED;
      timeOffset = (1 + Math.floor(Math.random() * 30)) * 24 * 60 * 60 * 1000; // 1 to 30 days ahead
    } else if (i >= 30) {
      status = LiveSessionStatus.IN_PROGRESS;
      timeOffset = 0;
    }

    const session = await prisma.liveSession.create({
      data: {
        title: `${type === 'CLASS' ? 'Doubt Clearing' : 'Market Insights'}: Session ${i+1}`,
        type,
        status,
        schedule: new Date(now.getTime() + timeOffset),
        instructorId: instructor.id,
        courseId: course?.id || null,
        capacity: type === 'WEBINAR' ? 1000 : 50,
        recordingUrl: status === 'COMPLETED' ? `https://cdn.stocklearn.demo/recordings/session-${i}.mp4` : null,
      },
    });
    allSessions.push(session);
  }

  // ---- Attendances ----
  // Register random learners to random sessions
  for (const session of allSessions) {
    const numAttendees = 5 + Math.floor(Math.random() * 10);
    const sessionLearners = [...learners].sort(() => 0.5 - Math.random()).slice(0, numAttendees);
    
    for (const learner of sessionLearners) {
      await prisma.attendance.create({
        data: { 
          userId: learner.id, 
          liveSessionId: session.id, 
          registrationName: learner.name, 
          registrationEmail: learner.email, 
          registrationPhone: learner.phone,
          joinTime: session.status === 'COMPLETED' ? new Date(session.schedule.getTime() + 2 * 60 * 1000) : null,
          leaveTime: session.status === 'COMPLETED' ? new Date(session.schedule.getTime() + 60 * 60 * 1000) : null,
        },
      });
    }
  }

  // ---- Doubts ----
  for (const learner of learners) {
    const numDoubts = Math.floor(Math.random() * 5); // 0 to 4 doubts per learner
    for (let d = 0; d < numDoubts; d++) {
      const isAnswered = Math.random() > 0.5;
      await prisma.doubt.create({
        data: { 
          userId: learner.id, 
          question: `Can you explain concept ${d} from the recent lesson?`, 
          status: isAnswered ? DoubtStatus.ANSWERED : DoubtStatus.OPEN 
        },
      });
    }
  }

  // ---- Coupons ----
  await prisma.coupon.create({ data: { code: 'WELCOME50', discountType: DiscountType.PERCENTAGE, discountVal: 5000, validUntil: new Date(now.getTime() + 90 * 24 * 60 * 60 * 1000), usageLimit: 1000, usageCount: 42 }});
  await prisma.coupon.create({ data: { code: 'WINTERSALE', discountType: DiscountType.PERCENTAGE, discountVal: 2000, validUntil: new Date(now.getTime() + 15 * 24 * 60 * 60 * 1000), usageLimit: 500, usageCount: 150 }});
  await prisma.coupon.create({ data: { code: 'EXPIRED2024', discountType: DiscountType.FLAT, discountVal: 50000, validUntil: new Date('2024-12-31'), usageLimit: 500, usageCount: 387 }});
  await prisma.coupon.create({ data: { code: 'USEDMAX', discountType: DiscountType.PERCENTAGE, discountVal: 2500, validUntil: new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000), usageLimit: 10, usageCount: 10 }});

  console.log('✅ Massive seed complete!\n');
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  console.log('  Demo Account Credentials');
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  console.log('  LEARNER:    learner@stocklearn.com    / Password123!');
  console.log('  INSTRUCTOR: instructor@stocklearn.com / Password123!');
  console.log('  ADMIN:      admin@stocklearn.com      / Password123!');
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');
}

main()
  .catch((e) => {
    console.error('Seed failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
