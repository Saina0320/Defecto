import type { TeamMember } from '@/types/team';

// Initial demo roster: used before the database profiles load and by "Reset Data".
export const DEMO_TEAM: TeamMember[] = [
  { id: 'MGR-01', name: 'Elena Vance', role: 'Manager', email: 'elena.vance.demo@citi.internal', initials: 'EV', status: 'Active' },
  { id: 'ADM-01', name: 'System Administrator', role: 'Admin', email: 'admin.ops.demo@citi.internal', initials: 'SA', status: 'Active' },
  { id: 'ANL-01', name: 'Alex Morgan', role: 'Analyst', email: 'alex.morgan.demo@citi.internal', initials: 'AM', status: 'Active' },
  { id: 'ANL-02', name: 'Brian Chen', role: 'Analyst', email: 'brian.chen.demo@citi.internal', initials: 'BC', status: 'Active' },
  { id: 'ANL-03', name: 'Clara Oswald', role: 'Analyst', email: 'clara.oswald.demo@citi.internal', initials: 'CO', status: 'Active' },
  { id: 'ANL-04', name: 'David Kim', role: 'Analyst', email: 'david.kim.demo@citi.internal', initials: 'DK', status: 'Active' },
  { id: 'ANL-05', name: 'Emma Watson', role: 'Analyst', email: 'emma.watson.demo@citi.internal', initials: 'EW', status: 'Active' },
  { id: 'ANL-06', name: 'Farhan Malik', role: 'Analyst', email: 'farhan.malik.demo@citi.internal', initials: 'FM', status: 'Active' },
  { id: 'ANL-07', name: 'Grace Hopper', role: 'Analyst', email: 'grace.hopper.demo@citi.internal', initials: 'GH', status: 'Active' },
  { id: 'ANL-08', name: 'Henry Ford', role: 'Analyst', email: 'henry.ford.demo@citi.internal', initials: 'HF', status: 'Active' },
  { id: 'ANL-09', name: 'Iris West', role: 'Analyst', email: 'iris.west.demo@citi.internal', initials: 'IW', status: 'Active' },
  { id: 'ANL-10', name: 'James Wilson', role: 'Analyst', email: 'james.wilson.demo@citi.internal', initials: 'JW', status: 'Active' },
  { id: 'ANL-11', name: 'Karen Page', role: 'Analyst', email: 'karen.page.demo@citi.internal', initials: 'KP', status: 'Active' },
  { id: 'ANL-12', name: 'Lucas Scott', role: 'Analyst', email: 'lucas.scott.demo@citi.internal', initials: 'LS', status: 'Active' },
  { id: 'ANL-13', name: 'Maya Lin', role: 'Analyst', email: 'maya.lin.demo@citi.internal', initials: 'ML', status: 'Active' },
  { id: 'ANL-14', name: 'Nathan Drake', role: 'Analyst', email: 'nathan.drake.demo@citi.internal', initials: 'ND', status: 'Active' },
  { id: 'ANL-15', name: 'Olivia Pope', role: 'Analyst', email: 'olivia.pope.demo@citi.internal', initials: 'OP', status: 'Active' },
];
