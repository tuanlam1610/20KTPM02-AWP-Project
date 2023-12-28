// prisma/seed.ts

import { Prisma, PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcrypt';
import {} from '@prisma/client';

// initialize Prisma Client
const prisma = new PrismaClient();

async function main() {
  //TODO rework the seeding to use an import
  // ---- CREATE CLASS ----
  const class1 = await prisma.class.create({
    data: {
      name: '101 - Introduction to Programming',
      description:
        'Introduce you to the topic of programming and how to use it in real life',
      code: 'ITPJKI',
      invitationLink: '$localhost:3000/invitation/ITPJKI',
    },
  });
  const class2 = await prisma.class.create({
    data: {
      name: '102 - Programming in C++',
      description: 'Learn how to use C++ to create real life applications',
      code: 'PICKSL',
      invitationLink: '$localhost:3000/invitation/PICKSL',
    },
  });
  const class3 = await prisma.class.create({
    data: {
      name: '103 - Advanced Programming',
      description:
        'High concept programming and practically development method',
      code: 'APDSQL',
      invitationLink: '$localhost:3000/invitation/APDSQL',
    },
  });
  const hashData = (data: string) => {
    return bcrypt.hash(data, 10);
  };
  //-----USER------
  const pass = 123456;
  const hashPass = await hashData(pass.toString());
  const user = await prisma.user.create({
    data: {
      name: 'Truong Gia Huy',
      email: 'rexfury1211@gmail.com',
      hash: hashPass,
      dob: new Date('2002-12-06T23:00:00.000Z'),
      isEmailConfirm: true,
    },
  });
  const user1 = await prisma.user.create({
    data: {
      name: 'Truong Gia Huy',
      email: 'rexfury1212@gmail.com',
      hash: hashPass,
      dob: new Date('2002-12-06T23:00:00.000Z'),
      isEmailConfirm: true,
    },
  });
  const user2 = await prisma.user.create({
    data: {
      name: 'Nguyen Ngoc Quang',
      email: 'nnquanglop96dt@gmail.com',
      hash: hashPass,
      dob: new Date('2002-12-06T23:00:00.000Z'),
      isEmailConfirm: false,
    },
  });
  const user3 = await prisma.user.create({
    data: {
      name: 'Ha Tuan Lam',
      email: 'tuanlam16102002@gmail.com',
      hash: hashPass,
      dob: new Date('2002-12-06T23:00:00.000Z'),
      isEmailConfirm: true,
    },
  });
  const userTeacher = await prisma.user.create({
    data: {
      name: 'Truong Gia Huy Teacher',
      email: 'rexfury121TEACH@gmail.com',
      hash: hashPass,
      dob: new Date('2002-12-06T23:00:00.000Z'),
      isEmailConfirm: true,
    },
  });
  const userTeacher2 = await prisma.user.create({
    data: {
      name: 'Nguyen Ngoc Quang Teacher',
      email: 'TEACH@gmail.com',
      hash: hashPass,
      dob: new Date('2002-12-06T23:00:00.000Z'),
      isEmailConfirm: false,
    },
  });
  const userTeacher3 = await prisma.user.create({
    data: {
      name: 'Ha Tuan Lam Teacher',
      email: 'tuanlam16102002TEACH@gmail.com',
      hash: hashPass,
      dob: new Date('2002-12-06T23:00:00.000Z'),
      isEmailConfirm: true,
    },
  });
  const bannedUser = await prisma.user.create({
    data: {
      name: 'bannedDummy',
      email: 'bannedtuanlam16102002@gmail.com',
      hash: hashPass,
      dob: new Date('2002-12-06T23:00:00.000Z'),
      isEmailConfirm: true,
      isBanned: true,
    },
  });
  const lockedUser = await prisma.user.create({
    data: {
      name: 'lockedDummy',
      email: 'locked@gmail.com',
      hash: hashPass,
      dob: new Date('2002-12-06T23:00:00.000Z'),
      isEmailConfirm: true,
      isLocked: true,
    },
  });
  const admin = await prisma.admin.create({
    data: {
      userId: user1.id,
    },
  });
  const student1 = await prisma.student.create({
    data: {
      userId: user2.id,
      name: 'Nguyen Ngoc Quang',
      classMember: {
        create: {
          class: { connect: { id: class1.id } },
        },
      },
      classInvitationForStudent: {
        create: {
          class: { connect: { id: class2.id } },
        },
      },
    },
  });
  const student2 = await prisma.student.create({
    data: {
      userId: user3.id,
      name: 'Ha Tuan Lam',
      classMember: {
        create: {
          class: { connect: { id: class1.id } },
        },
      },
      classInvitationForStudent: {
        create: {
          class: { connect: { id: class2.id } },
        },
      },
    },
  });
  const teacher1 = await prisma.teacher.create({
    data: {
      userId: userTeacher.id,
      classTeacher: {
        create: {
          class: { connect: { id: class1.id } },
        },
      },
      classInvitationForTeacher: {
        create: {
          class: { connect: { id: class2.id } },
        },
      },
    },
  });
  const teacher2 = await prisma.teacher.create({
    data: {
      userId: userTeacher2.id,
      classTeacher: {
        create: {
          class: { connect: { id: class1.id } },
        },
      },
      classInvitationForTeacher: {
        create: {
          class: { connect: { id: class2.id } },
        },
      },
    },
  });
  const teacher3 = await prisma.teacher.create({
    data: {
      userId: userTeacher3.id,
      classTeacher: {
        create: {
          class: { connect: { id: class1.id } },
        },
      },
      classInvitationForTeacher: {
        create: {
          class: { connect: { id: class2.id } },
        },
      },
    },
  });
  const GradeComposition1 = await prisma.gradeComposition.create({
    data: {
      name: 'Assignment 1',
      percentage: 10,
      rank: 1,
      isFinalized: false,
      classId: class1.id,
    },
  });
  const GradeComposition2 = await prisma.gradeComposition.create({
    data: {
      name: 'Assignment 2',
      percentage: 10,
      rank: 2,
      isFinalized: false,
      classId: class1.id,
    },
  });
  const StudentGrade1 = await prisma.studentGrade.create({
    data: {
      student: { connect: { id: student1.id } },
      gradeComposition: { connect: { id: GradeComposition1.id } },
      grade: 5,
    },
  });
  const StudentGrade2 = await prisma.studentGrade.create({
    data: {
      student: { connect: { id: student1.id } },
      gradeComposition: { connect: { id: GradeComposition2.id } },
      grade: 5,
    },
  });
  const GradeReview = await prisma.gradeReview.create({
    data: {
      currentGrade: 5,
      expectedGrade: 10,
      finalGrade: 10,
      status: 'Approved',
      explanation: 'I am a good student',
      student: { connect: { id: student1.id } },
      teacher: { connect: { id: teacher1.id } },
      class: { connect: { id: class1.id } },
      studentGrade: { connect: { id: StudentGrade1.id } },
    },
  });
  const GradeReview1 = await prisma.gradeReview.create({
    data: {
      currentGrade: 5,
      expectedGrade: 10,
      finalGrade: null,
      status: 'Open',
      explanation: 'I am a good student',
      student: { connect: { id: student1.id } },
      class: { connect: { id: class1.id } },
      studentGrade: { connect: { id: StudentGrade2.id } },
    },
  });
  const comment = await prisma.comment.create({
    data: {
      content: 'This is a comment',
      gradeReviewId: GradeReview.id,
      userId: user1.id,
    },
  });
  const comment2 = await prisma.comment.create({
    data: {
      content: 'I love your implementation but it might be ai',
      gradeReviewId: GradeReview.id,
      userId: userTeacher.id,
    },
  });
  const comment3 = await prisma.comment.create({
    data: {
      content: 'I swear it not ai',
      gradeReviewId: GradeReview.id,
      userId: user1.id,
    },
  });
  // create two dummy articles
  // const post1 = await prisma.user.upsert({
  //   where: { email: 'rexfury121@gmail.com' },
  //   update: {},
  //   create: {
  //     name: 'Truong Gia Huy',
  //     email: 'rexfury121@gmail.com',
  //     hash: '123456',
  //     dob: new Date('2002-12-31T23:00:00.000Z'),
  //   },
  // });
  // const post2 = await prisma.user.upsert({
  //   where: { email: 'quangcui@gmail.com' },
  //   update: {},
  //   create: {
  //     name: 'Nguyen Ngoc Qua g',
  //     email: 'quangcui@gmail.com',
  //     hash: '123456',
  //     dob: new Date('2002-10-31T23:00:00.000Z'),
  //   },
  // });
  // console.log({ post1, post2 });
}

// execute the main function
main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    // close Prisma Client at the end
    await prisma.$disconnect();
  });
