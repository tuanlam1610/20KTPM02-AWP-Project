// prisma/seed.ts

import { Prisma, PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcrypt';
import {} from '@prisma/client';
import { TotalGradeDto } from 'src/classes/dto/total-grade.dto';

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
      isActive: true,
    },
  });
  const class2 = await prisma.class.create({
    data: {
      name: '102 - Programming in C++',
      description: 'Learn how to use C++ to create real life applications',
      code: 'PICKSL',
      invitationLink: '$localhost:3000/invitation/PICKSL',
      isActive: true,
    },
  });
  const class3 = await prisma.class.create({
    data: {
      name: '103 - Advanced Programming',
      description:
        'High concept programming and practically development method',
      code: 'APDSQL',
      invitationLink: '$localhost:3000/invitation/APDSQL',
      isActive: true,
    },
  });
  const class4 = await prisma.class.create({
    data: {
      name: '100 - Introduction to University',
      description: 'Introduce you to the law and the layer of university',
      code: 'APDITU',
      invitationLink: '$localhost:3000/invitation/APDITU',
      isActive: true,
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
      email: 'admin@gmail.com',
      hash: hashPass,
      roles: ['admin'],
      dob: new Date('2002-12-06T23:00:00.000Z'),
      isEmailConfirm: true,
    },
  });
  const user1 = await prisma.user.create({
    data: {
      name: 'Truong Gia Huy',
      email: 'rexfury121@gmail.com',
      roles: ['student'],
      hash: hashPass,
      dob: new Date('2002-12-06T23:00:00.000Z'),
      isEmailConfirm: true,
    },
  });
  const user2 = await prisma.user.create({
    data: {
      name: 'Nguyen Ngoc Quang',
      email: 'nnquanglop96dt@gmail.com',
      roles: ['student'],
      hash: hashPass,
      dob: new Date('2002-12-06T23:00:00.000Z'),
      isEmailConfirm: false,
    },
  });
  const user22 = await prisma.user.create({
    data: {
      name: 'Nguyen Ngoc Quang',
      email: 'nnquang1792@gmail.com',
      roles: ['student'],
      hash: hashPass,
      dob: new Date('2002-12-06T23:00:00.000Z'),
      isEmailConfirm: false,
    },
  });
  const user3 = await prisma.user.create({
    data: {
      name: 'Ha Tuan Lam',
      email: 'tuanlam16102002@gmail.com',
      roles: ['student'],
      hash: hashPass,
      dob: new Date('2002-12-06T23:00:00.000Z'),
      isEmailConfirm: true,
    },
  });
  const user4 = await prisma.user.create({
    data: {
      name: 'Truong Ta Huy',
      email: 'tghuy201@clc.fitus.edu.vn',
      roles: ['student'],
      hash: hashPass,
      dob: new Date('2002-12-06T23:00:00.000Z'),
      isEmailConfirm: true,
    },
  });
  const userTeacher = await prisma.user.create({
    data: {
      name: 'Truong Gia Huy',
      email: 'giatruong0612@gmail.com',
      roles: ['teacher'],
      hash: hashPass,
      dob: new Date('2002-12-06T23:00:00.000Z'),
      isEmailConfirm: true,
    },
  });
  const userTeacher2 = await prisma.user.create({
    data: {
      name: 'Nguyen Ngoc Quang',
      email: 'nnquang20@clc.fitus.edu.vn',
      roles: ['teacher'],
      hash: hashPass,
      dob: new Date('2002-12-06T23:00:00.000Z'),
      isEmailConfirm: false,
    },
  });
  const userTeacher3 = await prisma.user.create({
    data: {
      name: 'Ha Tuan Lam',
      email: 'halam5051@gmail.com',
      roles: ['teacher'],
      hash: hashPass,
      dob: new Date('2002-12-06T23:00:00.000Z'),
      isEmailConfirm: true,
    },
  });
  const bannedUser = await prisma.user.create({
    data: {
      name: 'bannedDummy',
      email: 'banned@gmail.com',
      hash: hashPass,
      roles: ['student'],
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
      roles: ['student'],
      dob: new Date('2002-12-06T23:00:00.000Z'),
      isEmailConfirm: true,
      isLocked: true,
    },
  });
  const admin = await prisma.admin.create({
    data: {
      userId: user.id,
    },
  });
  const student = await prisma.student.create({
    data: {
      id: '20127040',
      userId: user1.id,
      name: 'Truong Gia Huy',
      classMember: {
        create: [
          {
            class: { connect: { id: class4.id } },
            totalGrade: 0, // Add more connections if needed
          },
        ],
      },
      classInvitationForStudent: {
        create: [
          {
            class: { connect: { id: class1.id } },
          },
          {
            class: { connect: { id: class2.id } }, // Add more connections if needed
          },
          {
            class: { connect: { id: class3.id } }, // Add more connections if needed
          },
        ],
      },
    },
  });
  const student4 = await prisma.student.create({
    data: {
      id: '20127041',
      userId: user4.id,
      name: 'Truong Ta Huy',
      classMember: {
        create: [
          {
            class: { connect: { id: class4.id } },
            totalGrade: 0, // Add more connections if needed
          },
        ],
      },
      classInvitationForStudent: {
        create: [
          {
            class: { connect: { id: class1.id } },
          },
          {
            class: { connect: { id: class2.id } }, // Add more connections if needed
          },
          {
            class: { connect: { id: class3.id } }, // Add more connections if needed
          },
        ],
      },
    },
  });
  const student1 = await prisma.student.create({
    data: {
      id: '20127296',
      userId: user2.id,
      name: 'Nguyen Ngoc Quang',
      classMember: {
        create: [
          {
            class: { connect: { id: class1.id } },
            totalGrade: 0,
          },
          {
            class: { connect: { id: class3.id } },
            totalGrade: 0, // Add more connections if needed
          },
          {
            class: { connect: { id: class4.id } },
            totalGrade: 0, // Add more connections if needed
          },
        ],
      },
      classInvitationForStudent: {
        create: {
          class: { connect: { id: class2.id } },
        },
      },
    },
  });
  const student3 = await prisma.student.create({
    data: {
      id: '20127297',
      userId: user3.id,
      name: 'Nguyen Ngoc Quang (Unmapped)',
      classMember: {
        create: [
          {
            class: { connect: { id: class1.id } },
            totalGrade: 0,
          },
          {
            class: { connect: { id: class3.id } },
            totalGrade: 0, // Add more connections if needed
          },
          {
            class: { connect: { id: class4.id } },
            totalGrade: 0, // Add more connections if needed
          },
        ],
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
      id: '20127677',
      name: 'Ha Tuan Lam',
      classMember: {
        create: [
          {
            class: { connect: { id: class1.id } },
            totalGrade: 0,
          },
          {
            class: { connect: { id: class2.id } },
            totalGrade: 0, // Add more connections if needed
          },
          {
            class: { connect: { id: class3.id } },
            totalGrade: 0, // Add more connections if needed
          },
        ],
      },
    },
  });
  const teacher1 = await prisma.teacher.create({
    data: {
      userId: userTeacher.id,
      name: 'Truong Gia Huy',
      classOwned: {
        connect: { id: class1.id },
      },
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
      name: 'Ha Tuan Lam',
      classTeacher: {
        create: [
          {
            class: { connect: { id: class1.id } },
          },
          {
            class: { connect: { id: class3.id } }, // Add more connections if needed
          },
          {
            class: { connect: { id: class4.id } }, // Add more connections if needed
          },
        ],
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
      name: 'Nguyen Ngoc Quang',
      classTeacher: {
        create: {
          class: { connect: { id: class1.id } },
        },
      },
      classInvitationForTeacher: {
        create: [
          {
            class: { connect: { id: class1.id } },
          },
          {
            class: { connect: { id: class3.id } }, // Add more connections if needed
          },
          {
            class: { connect: { id: class2.id } }, // Add more connections if needed
          },
        ],
      },
    },
  });
  const GradeComposition1 = await prisma.gradeComposition.create({
    data: {
      name: 'Assignment 1',
      percentage: 50,
      rank: 1,
      isFinalized: false,
      classId: class1.id,
    },
  });
  const GradeComposition2 = await prisma.gradeComposition.create({
    data: {
      name: 'Assignment 2',
      percentage: 50,
      rank: 2,
      isFinalized: false,
      classId: class1.id,
    },
  });
  await prisma.gradeComposition.createMany({
    data: [
      {
        name: 'Assignment 1',
        percentage: 20,
        rank: 1,
        isFinalized: false,
        classId: class2.id,
      },
      {
        name: 'Assignment 2',
        percentage: 20,
        rank: 2,
        isFinalized: false,
        classId: class2.id,
      },
      {
        name: 'Assignment 3',
        percentage: 50,
        rank: 3,
        isFinalized: false,
        classId: class2.id,
      },
      {
        name: 'Assignment 4',
        percentage: 10,
        rank: 4,
        isFinalized: false,
        classId: class2.id,
      },
    ],
  });
  const gcClass2 = await prisma.gradeComposition.findMany({
    where: {
      classId: class2.id,
    },
  });
  await prisma.studentGrade.createMany({
    data: [
      {
        studentId: student1.id,
        gradeCompositionId: gcClass2[0].id,
        grade: 0,
      },
      {
        studentId: student1.id,
        gradeCompositionId: gcClass2[1].id,
        grade: 0,
      },
      {
        studentId: student1.id,
        gradeCompositionId: gcClass2[2].id,
        grade: 0,
      },
      {
        studentId: student1.id,
        gradeCompositionId: gcClass2[3].id,
        grade: 0,
      },
    ],
    skipDuplicates: true,
  });

  const StudentGrade1 = await prisma.studentGrade.create({
    data: {
      student: { connect: { id: student1.id } },
      gradeComposition: { connect: { id: GradeComposition1.id } },
      grade: 0,
    },
  });
  const StudentGrade2 = await prisma.studentGrade.create({
    data: {
      student: { connect: { id: student1.id } },
      gradeComposition: { connect: { id: GradeComposition2.id } },
      grade: 0,
    },
  });
  const StudentGrade3 = await prisma.studentGrade.create({
    data: {
      student: { connect: { id: student2.id } },
      gradeComposition: { connect: { id: GradeComposition1.id } },
      grade: 0,
    },
  });
  const StudentGrade4 = await prisma.studentGrade.create({
    data: {
      student: { connect: { id: student2.id } },
      gradeComposition: { connect: { id: GradeComposition2.id } },
      grade: 0,
    },
  });
  await prisma.studentGrade.create({
    data: {
      student: { connect: { id: student.id } },
      gradeComposition: { connect: { id: GradeComposition1.id } },
      grade: 0,
    },
  });
  await prisma.studentGrade.create({
    data: {
      student: { connect: { id: student.id } },
      gradeComposition: { connect: { id: GradeComposition2.id } },
      grade: 0,
    },
  });
  const GradeReview = await prisma.gradeReview.create({
    data: {
      currentGrade: 0,
      expectedGrade: 10,
      finalGrade: 10,
      status: 'Accepted',
      explanation: 'I am a good student',
      student: { connect: { id: student1.id } },
      teacher: { connect: { id: teacher1.id } },
      class: { connect: { id: class1.id } },
      studentGrade: { connect: { id: StudentGrade1.id } },
    },
  });
  const GradeReview1 = await prisma.gradeReview.create({
    data: {
      currentGrade: 0,
      expectedGrade: 10,
      finalGrade: null,
      status: 'Open',
      explanation: 'I am a good student',
      student: { connect: { id: student1.id } },
      class: { connect: { id: class1.id } },
      studentGrade: { connect: { id: StudentGrade2.id } },
    },
  });
  const GradeReview2 = await prisma.gradeReview.create({
    data: {
      currentGrade: 0,
      expectedGrade: 10,
      finalGrade: 0,
      status: 'Denied',
      explanation: 'I am a good student',
      student: { connect: { id: student2.id } },
      class: { connect: { id: class1.id } },
      studentGrade: { connect: { id: StudentGrade3.id } },
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
