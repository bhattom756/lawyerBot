import { TestCase } from './types';

export const sampleCases: TestCase[] = [
  {
    id: 'roommate-food',
    title: 'The Great Food Theft',
    description: 'My roommate keeps eating my food without asking',
    category: 'Roommate Disputes',
    plaintiff: 'Responsible Roommate',
    defendant: 'Food-Taking Roommate',
    context: 'The plaintiff claims their roommate has been repeatedly taking their groceries and leftovers from the shared refrigerator without permission or compensation. This has happened multiple times over the past month, causing financial strain and frustration.',
    expectedOutcome: 'Compensation for food costs and agreement on kitchen rules'
  },
  {
    id: 'group-project',
    title: 'The Slacker Partner',
    description: 'My teammate pushed all the work on me for the group project',
    category: 'Academic Disputes',
    plaintiff: 'Hardworking Student',
    defendant: 'Absent Partner',
    context: 'The plaintiff alleges that their group project partner failed to contribute meaningfully to a major assignment worth 40% of the final grade. Despite multiple attempts to coordinate and divide work, the defendant was unresponsive and missed all agreed-upon deadlines.',
    expectedOutcome: 'Grade adjustment or partner reassignment'
  },
  {
    id: 'relationship-job',
    title: 'The Secret Application',
    description: "My boyfriend didn't tell me he applied for a job abroad",
    category: 'Relationship Disputes',
    plaintiff: 'Concerned Partner',
    defendant: 'Job-Seeking Partner',
    context: 'The plaintiff discovered that their partner of two years applied for and accepted a job in another country without discussing this major life decision. They feel betrayed and question the future of their relationship.',
    expectedOutcome: 'Open communication and relationship counseling'
  },
  {
    id: 'money-lending',
    title: 'The Unpaid Loan',
    description: 'My friend borrowed money and didn\'t return it',
    category: 'Financial Disputes',
    plaintiff: 'Generous Friend',
    defendant: 'Borrowing Friend',
    context: 'Six months ago, the plaintiff lent $500 to their close friend who claimed to have a family emergency. Despite multiple reminders and promises to pay back, the defendant has not returned the money and has become evasive about the topic.',
    expectedOutcome: 'Full repayment with possible payment plan'
  },
  {
    id: 'work-plagiarism',
    title: 'The Stolen Design',
    description: 'I think my coworker stole my design idea',
    category: 'Workplace Disputes',
    plaintiff: 'Creative Employee',
    defendant: 'Colleague',
    context: 'The plaintiff spent weeks developing a innovative design concept for a client presentation. They shared early drafts with their colleague for feedback, but the defendant later presented a nearly identical design as their own work to management, receiving credit and praise.',
    expectedOutcome: 'Recognition of original work and potential disciplinary action'
  }
];