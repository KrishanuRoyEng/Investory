import { PrismaClient, Role, CourseFormat, CourseLevel, CourseStatus, OrderStatus, TransactionStatus, LiveSessionType, LiveSessionStatus, DiscountType, DoubtStatus } from '@prisma/client';
import * as argon2 from 'argon2';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Seeding database...\n');

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
  const learner = await prisma.user.create({
    data: { email: 'learner@stocklearn.com', name: 'Rahul Sharma', phone: '+919876543210', password: passwordHash, role: Role.LEARNER },
  });
  const instructor = await prisma.user.create({
    data: { email: 'instructor@stocklearn.com', name: 'Priya Kapoor', phone: '+919876543211', password: passwordHash, role: Role.INSTRUCTOR },
  });
  const admin = await prisma.user.create({
    data: { email: 'admin@stocklearn.com', name: 'Admin User', phone: '+919876543212', password: passwordHash, role: Role.ADMIN },
  });

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
  ];

  const courses = await Promise.all(
    coursesData.map(c => prisma.course.create({ data: c }))
  );

  // ---- Curriculum for 3 courses ----
  const curriculumData = [
    {
      courseIndex: 0, // Stock Market Basics
      modules: [
        { title: 'Introduction to Stock Markets', order: 1, lessons: [
          { title: 'What is a Stock Market?', order: 1, durationSec: 720 },
          { title: 'How Stock Exchanges Work (NSE, BSE)', order: 2, durationSec: 900 },
          { title: 'Types of Market Participants', order: 3, durationSec: 600 },
        ]},
        { title: 'Understanding Stocks', order: 2, lessons: [
          { title: 'Reading a Stock Ticker', order: 1, durationSec: 480 },
          { title: 'Market Cap, Volume, and Price', order: 2, durationSec: 660 },
          { title: 'Bull vs Bear Markets', order: 3, durationSec: 540 },
        ]},
        { title: 'Your First Trade', order: 3, lessons: [
          { title: 'Opening a Demat Account', order: 1, durationSec: 420 },
          { title: 'Paper Trading Walkthrough', order: 2, durationSec: 900 },
          { title: 'Common Beginner Mistakes', order: 3, durationSec: 600 },
        ]},
      ],
    },
    {
      courseIndex: 1, // Technical Analysis
      modules: [
        { title: 'Chart Types & Timeframes', order: 1, lessons: [
          { title: 'Line, Bar, and Candlestick Charts', order: 1, durationSec: 780 },
          { title: 'Choosing the Right Timeframe', order: 2, durationSec: 540 },
        ]},
        { title: 'Candlestick Patterns', order: 2, lessons: [
          { title: 'Doji, Hammer, and Shooting Star', order: 1, durationSec: 900 },
          { title: 'Engulfing and Harami Patterns', order: 2, durationSec: 720 },
          { title: 'Morning & Evening Star', order: 3, durationSec: 660 },
        ]},
        { title: 'Technical Indicators', order: 3, lessons: [
          { title: 'Moving Averages (SMA, EMA)', order: 1, durationSec: 840 },
          { title: 'RSI and MACD', order: 2, durationSec: 960 },
          { title: 'Bollinger Bands', order: 3, durationSec: 720 },
        ]},
        { title: 'Building a Trading System', order: 4, lessons: [
          { title: 'Entry, Exit, and Stop Loss Rules', order: 1, durationSec: 1080 },
          { title: 'Backtesting Your Strategy', order: 2, durationSec: 900 },
        ]},
      ],
    },
    {
      courseIndex: 2, // Options Trading
      modules: [
        { title: 'Options Fundamentals', order: 1, lessons: [
          { title: 'What Are Options? Calls vs Puts', order: 1, durationSec: 720 },
          { title: 'Strike Price, Premium, and Expiry', order: 2, durationSec: 600 },
          { title: 'Intrinsic vs Time Value', order: 3, durationSec: 540 },
        ]},
        { title: 'The Greeks', order: 2, lessons: [
          { title: 'Delta and Gamma', order: 1, durationSec: 900 },
          { title: 'Theta (Time Decay)', order: 2, durationSec: 720 },
          { title: 'Vega and Implied Volatility', order: 3, durationSec: 840 },
        ]},
        { title: 'Advanced Strategies', order: 3, lessons: [
          { title: 'Bull Call Spread', order: 1, durationSec: 780 },
          { title: 'Iron Condor', order: 2, durationSec: 960 },
          { title: 'Straddle and Strangle', order: 3, durationSec: 840 },
          { title: 'Hedging a Stock Portfolio', order: 4, durationSec: 720 },
        ]},
      ],
    },
  ];

  for (const curriculum of curriculumData) {
    const courseId = courses[curriculum.courseIndex].id;
    for (const mod of curriculum.modules) {
      const createdModule = await prisma.courseModule.create({
        data: { title: mod.title, order: mod.order, courseId },
      });
      for (const lesson of mod.lessons) {
        await prisma.lesson.create({
          data: { title: lesson.title, order: lesson.order, durationSec: lesson.durationSec, moduleId: createdModule.id, videoUrl: `https://cdn.stocklearn.demo/videos/${courses[curriculum.courseIndex].slug}/${lesson.order}.mp4` },
        });
      }
    }
  }

  // ---- Enrollments (Learner enrolled in 3 courses with varying progress) ----
  const enrollments = await Promise.all([
    prisma.enrollment.create({ data: { userId: learner.id, courseId: courses[0].id, progressPercent: 100 } }),
    prisma.enrollment.create({ data: { userId: learner.id, courseId: courses[1].id, progressPercent: 62 } }),
    prisma.enrollment.create({ data: { userId: learner.id, courseId: courses[2].id, progressPercent: 15 } }),
  ]);

  // ---- Orders & Transactions ----
  const order1 = await prisma.order.create({
    data: {
      userId: learner.id,
      totalPaise: 99900,
      discountPaise: 0,
      status: OrderStatus.COMPLETED,
      items: { create: [{ courseId: courses[0].id, pricePaise: 99900 }] },
    },
  });
  await prisma.transaction.create({
    data: { orderId: order1.id, amountPaise: 99900, razorpayPaymentId: 'pay_demo001', razorpayOrderId: 'order_demo001', status: TransactionStatus.SUCCESS },
  });

  const order2 = await prisma.order.create({
    data: {
      userId: learner.id,
      totalPaise: 249900,
      discountPaise: 0,
      status: OrderStatus.COMPLETED,
      items: { create: [{ courseId: courses[1].id, pricePaise: 249900 }] },
    },
  });
  await prisma.transaction.create({
    data: { orderId: order2.id, amountPaise: 249900, razorpayPaymentId: 'pay_demo002', razorpayOrderId: 'order_demo002', status: TransactionStatus.SUCCESS },
  });

  const order3 = await prisma.order.create({
    data: {
      userId: learner.id,
      totalPaise: 399900,
      discountPaise: 0,
      status: OrderStatus.COMPLETED,
      items: { create: [{ courseId: courses[2].id, pricePaise: 399900 }] },
    },
  });
  await prisma.transaction.create({
    data: { orderId: order3.id, amountPaise: 399900, razorpayPaymentId: 'pay_demo003', razorpayOrderId: 'order_demo003', status: TransactionStatus.SUCCESS },
  });

  // ---- Certificate (for completed course) ----
  await prisma.certificate.create({
    data: {
      userId: learner.id,
      courseId: courses[0].id,
      url: 'https://cdn.stocklearn.demo/certificates/stock-market-basics-rahul.pdf',
    },
  });

  // ---- Live Sessions (owned by instructor) ----
  const now = new Date();
  const pastSession = await prisma.liveSession.create({
    data: {
      title: 'Doubt Clearing: Candlestick Patterns',
      type: LiveSessionType.CLASS,
      status: LiveSessionStatus.COMPLETED,
      schedule: new Date(now.getTime() - 3 * 24 * 60 * 60 * 1000), // 3 days ago
      instructorId: instructor.id,
      courseId: courses[1].id,
      capacity: 50,
      recordingUrl: 'https://cdn.stocklearn.demo/recordings/candlestick-doubt-clearing.mp4',
    },
  });

  const upcomingSession = await prisma.liveSession.create({
    data: {
      title: 'Live Q&A: Options Greeks Deep Dive',
      type: LiveSessionType.CLASS,
      status: LiveSessionStatus.SCHEDULED,
      schedule: new Date(now.getTime() + 2 * 24 * 60 * 60 * 1000), // 2 days from now
      instructorId: instructor.id,
      courseId: courses[2].id,
      capacity: 30,
    },
  });

  const soonSession = await prisma.liveSession.create({
    data: {
      title: 'Market Analysis: Pre-Budget Session',
      type: LiveSessionType.CLASS,
      status: LiveSessionStatus.SCHEDULED,
      schedule: new Date(now.getTime() + 30 * 60 * 1000), // 30 minutes from now
      instructorId: instructor.id,
      courseId: courses[0].id,
      capacity: 100,
    },
  });

  // Register learner for sessions
  await prisma.attendance.create({
    data: { userId: learner.id, liveSessionId: pastSession.id, registrationName: learner.name, registrationEmail: learner.email, registrationPhone: learner.phone, joinTime: new Date(pastSession.schedule.getTime() + 2 * 60 * 1000), leaveTime: new Date(pastSession.schedule.getTime() + 60 * 60 * 1000) },
  });
  await prisma.attendance.create({
    data: { userId: learner.id, liveSessionId: upcomingSession.id, registrationName: learner.name, registrationEmail: learner.email, registrationPhone: learner.phone },
  });
  await prisma.attendance.create({
    data: { userId: learner.id, liveSessionId: soonSession.id, registrationName: learner.name, registrationEmail: learner.email, registrationPhone: learner.phone },
  });

  // ---- Webinar ----
  const webinar = await prisma.liveSession.create({
    data: {
      title: 'Budget 2026: Impact on Indian Markets',
      type: LiveSessionType.WEBINAR,
      status: LiveSessionStatus.SCHEDULED,
      schedule: new Date(now.getTime() + 5 * 24 * 60 * 60 * 1000), // 5 days from now
      instructorId: instructor.id,
      courseId: null, // Public webinar
      capacity: 500,
    },
  });

  const exclusiveWebinar = await prisma.liveSession.create({
    data: {
      title: 'Advanced Options: Weekly Expiry Strategies',
      type: LiveSessionType.WEBINAR,
      status: LiveSessionStatus.SCHEDULED,
      schedule: new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000),
      instructorId: instructor.id,
      courseId: courses[2].id, // Exclusive to Options course enrollees
      capacity: 100,
    },
  });

  // Register learner for webinar
  await prisma.attendance.create({
    data: { userId: learner.id, liveSessionId: webinar.id, registrationName: learner.name, registrationEmail: learner.email, registrationPhone: learner.phone },
  });

  // ---- Doubts ----
  await prisma.doubt.create({
    data: { userId: learner.id, liveSessionId: pastSession.id, question: 'Can you explain the difference between a Doji and a Spinning Top?', status: DoubtStatus.ANSWERED },
  });
  await prisma.doubt.create({
    data: { userId: learner.id, liveSessionId: upcomingSession.id, question: 'How does gamma risk increase near expiry?', status: DoubtStatus.OPEN },
  });

  // ---- Coupons ----
  await prisma.coupon.create({
    data: { code: 'WELCOME50', discountType: DiscountType.PERCENTAGE, discountVal: 5000, validUntil: new Date(now.getTime() + 90 * 24 * 60 * 60 * 1000), usageLimit: 1000, usageCount: 42 },
  });
  await prisma.coupon.create({
    data: { code: 'EXPIRED2024', discountType: DiscountType.FLAT, discountVal: 50000, validUntil: new Date('2024-12-31'), usageLimit: 500, usageCount: 387 },
  });
  await prisma.coupon.create({
    data: { code: 'USEDMAX', discountType: DiscountType.PERCENTAGE, discountVal: 2500, validUntil: new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000), usageLimit: 10, usageCount: 10 },
  });

  console.log('✅ Seed complete!\n');
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
