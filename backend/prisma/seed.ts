import { PrismaClient, Role, CourseFormat, CourseLevel, CourseStatus, OrderStatus, TransactionStatus, LiveSessionType, LiveSessionStatus, DiscountType, DoubtStatus } from '@prisma/client';
import * as argon2 from 'argon2';

const prisma = new PrismaClient();

async function main() {
  const existingUsers = await prisma.user.count();
  if (existingUsers > 0) {
    console.log('🌱 Database already seeded. Skipping massive seed to preserve data.\n');
    return;
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

  // ---- Courses ----
  const coursesData = [
    { slug: 'stock-market-basics', title: 'Stock Market Basics for Beginners', description: 'Learn the fundamentals of stock markets — what are equities, how exchanges work, reading stock tickers, and placing your first paper trade. No prior knowledge required.', pricePaise: 99900, format: CourseFormat.SELF_PACED, level: CourseLevel.BEGINNER, language: 'English', status: CourseStatus.PUBLISHED, thumbnailUrl: 'https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?w=600' },
    { slug: 'technical-analysis-masterclass', title: 'Technical Analysis Masterclass', description: 'Master candlestick patterns, support/resistance levels, moving averages, RSI, MACD, and Bollinger Bands. Build a systematic trading strategy using technical indicators.', pricePaise: 249900, format: CourseFormat.SELF_PACED, level: CourseLevel.INTERMEDIATE, language: 'English', status: CourseStatus.PUBLISHED, thumbnailUrl: 'https://images.unsplash.com/photo-1642790106117-e829e14a795f?w=600' },
    { slug: 'options-trading-strategies', title: 'Options Trading Strategies', description: 'From basic calls and puts to advanced spreads, straddles, and iron condors. Learn options Greeks (delta, gamma, theta, vega) and build hedging strategies.', pricePaise: 399900, format: CourseFormat.LIVE, level: CourseLevel.ADVANCED, language: 'English', status: CourseStatus.PUBLISHED, thumbnailUrl: 'https://images.unsplash.com/photo-1535320903710-d993d3d77d29?w=600' },
    { slug: 'fundamental-analysis-deep-dive', title: 'Fundamental Analysis Deep Dive', description: 'Learn to read balance sheets, income statements, and cash flow statements. Understand valuation ratios like P/E, P/B, EV/EBITDA, and DCF modeling.', pricePaise: 199900, format: CourseFormat.SELF_PACED, level: CourseLevel.INTERMEDIATE, language: 'English', status: CourseStatus.PUBLISHED, thumbnailUrl: 'https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=600' },
    { slug: 'intraday-trading-bootcamp', title: 'Intraday Trading Bootcamp', description: 'Scalping, momentum trading, and gap strategies for Indian markets. Learn order flow analysis, VWAP, and time-based entry/exit rules for NSE/BSE.', pricePaise: 349900, format: CourseFormat.LIVE, level: CourseLevel.ADVANCED, language: 'Hindi', status: CourseStatus.PUBLISHED, thumbnailUrl: 'https://images.unsplash.com/photo-1590283603385-17ffb3a7f29f?w=600' },
    { slug: 'mutual-funds-made-simple', title: 'Mutual Funds Made Simple', description: 'SIP vs lumpsum, direct vs regular plans, equity vs debt funds, ELSS for tax saving, and building a goal-based portfolio. Ideal for salaried professionals.', pricePaise: 49900, format: CourseFormat.SELF_PACED, level: CourseLevel.BEGINNER, language: 'English', status: CourseStatus.PUBLISHED, thumbnailUrl: 'https://images.unsplash.com/photo-1579532537598-459ecdaf39cc?w=600' },
    { slug: 'commodity-trading-essentials', title: 'Commodity Trading Essentials', description: 'Trade gold, silver, crude oil, and agricultural commodities on MCX. Understand contango, backwardation, and seasonal commodity cycles.', pricePaise: 149900, format: CourseFormat.SELF_PACED, level: CourseLevel.INTERMEDIATE, language: 'English', status: CourseStatus.PUBLISHED, thumbnailUrl: 'https://images.unsplash.com/photo-1624365168968-f283d506c6b6?w=600' },
    { slug: 'forex-trading-for-india', title: 'Forex Trading for Indian Traders', description: 'USD/INR, EUR/INR currency pairs, RBI regulations, carry trade basics, and risk management for forex trading within Indian regulatory framework.', pricePaise: 179900, format: CourseFormat.SELF_PACED, level: CourseLevel.INTERMEDIATE, language: 'English', status: CourseStatus.PUBLISHED, thumbnailUrl: 'https://images.unsplash.com/photo-1526304640581-d334cdbbf45e?w=600' },
    { slug: 'ipo-investing-guide', title: 'IPO Investing Guide', description: 'How to evaluate IPOs, read DRHP documents, grey market premium analysis, and allocation strategies. Real case studies from recent Indian IPOs.', pricePaise: 79900, format: CourseFormat.SELF_PACED, level: CourseLevel.BEGINNER, language: 'Hindi', status: CourseStatus.PUBLISHED, thumbnailUrl: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=600' },
    { slug: 'portfolio-management-pro', title: 'Portfolio Management Pro Bundle', description: 'Complete bundle: asset allocation, rebalancing, risk-adjusted returns (Sharpe, Sortino), and tax-loss harvesting for the serious retail investor.', pricePaise: 599900, format: CourseFormat.BUNDLE, level: CourseLevel.ADVANCED, language: 'English', status: CourseStatus.PUBLISHED, thumbnailUrl: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=600' },
    { slug: 'crypto-trading-basics', title: 'Crypto Trading Basics', description: 'Understand blockchain, wallets, CEX vs DEX, and trading Bitcoin, Ethereum, and Altcoins safely.', pricePaise: 129900, format: CourseFormat.SELF_PACED, level: CourseLevel.BEGINNER, language: 'English', status: CourseStatus.PUBLISHED, thumbnailUrl: 'https://images.unsplash.com/photo-1518546305927-5a555bb7020d?w=600' },
    { slug: 'algorithmic-trading-python', title: 'Algorithmic Trading with Python', description: 'Automate your trading strategies using Python, Pandas, and broker APIs. Requires basic programming knowledge.', pricePaise: 899900, format: CourseFormat.LIVE, level: CourseLevel.ADVANCED, language: 'English', status: CourseStatus.PUBLISHED, thumbnailUrl: 'https://images.unsplash.com/photo-1555949963-ff9fe0c870eb?w=600' },
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
    const numEnrollments = 3 + Math.floor(Math.random() * 4);
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
