"use client";

import React, { useState, useEffect, useMemo } from 'react';
import { getDefects } from "@/services/defects";
import { createClient } from '@/lib/supabase/client';
import {
  CheckCircle2,
  Clock,
  Filter,
  Plus,
  Search,
  Users,
  BarChart3,
  FileText,
  ShieldAlert,
  ChevronRight,
  Download,
  RefreshCw,
  X,
  Check,
  Eye,
  UserCheck,
  Layers,
  FileCheck,
  Bell,
  ShieldCheck,
  Building2,
  UploadCloud,
  FileSearch,
  Paperclip,
  FolderArchive,
  ArrowRight,
  CheckCheck,
  Lock,
  Unlock,
  Shield,
  Edit3,
  User as UserIcon,
  Copy,
  Trash2,
  Percent,
  Sun,
  Moon,
  AlertTriangle,
  RotateCcw
} from 'lucide-react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid
} from 'recharts';

// --- CITI BRAND SVG LOGO ---
const CitiLogo = ({ className = "h-7" }) => (
  <svg 
    viewBox="0 0 125 80" 
    className={className} 
    fill="none" 
    xmlns="http://www.w3.org/2000/svg"
  >
    <path 
      d="M38.4 64.21l-.21.21c-3.45 3.51-7.44 5.37-11.55 5.37-8.58 0-14.81-6.43-14.81-15.31 0-8.87 6.23-15.32 14.81-15.32 4.11 0 8.1 1.87 11.55 5.39l.21.21 5.52-6.67-.15-.18C39.19 32.48 33.68 29.84 26.91 29.84c-6.79 0-13 2.29-17.48 6.41C4.57 40.71 2 47.01 2 54.46c0 7.46 2.57 13.77 7.43 18.23C13.9 76.83 20.12 79.1 26.91 79.1c6.77 0 12.28-2.63 16.86-8.06l.15-.17-5.52-6.67z" 
      fill="#003B70" 
    />
    <path d="M49.49 78.21h9.75V30.62h-9.75v47.59z" fill="#003B70" />
    <path 
      d="M97.43 67.86c-2.6 1.59-5.02 2.38-7.2 2.38-3.15 0-4.57-1.66-4.57-5.36V39.63h9.93v-8.96h-9.93V15.86l-9.55 5.11v9.7h-8.25v8.96h8.25v26.86c0 7.32 4.33 12.32 10.8 12.45 4.4.08 7.05-1.23 8.66-2.18l.09-.07 2.35-9.18-.58.35z" 
      fill="#003B70" 
    />
    <path d="M105.5 78.21h9.75V30.62h-9.75v47.59z" fill="#003B70" />
    <path 
      d="M121.09 22.18C112.17 9.54 97.35 2 82.27 2c-15.07 0-29.89 7.54-38.8 20.18l-.46.65h11.24l.12-.13C62.02 14.8 72 10.63 82.27 10.63c10.27 0 20.25 4.17 27.91 12.07l.13.13h11.23l-.45-.65z" 
      fill="#E21836" 
    />
  </svg>
);

// --- GLOBAL STORAGE KEYS (SHARED SINGLE STORE FOR ALL ROLES) ---
const STORAGE_KEYS = {
  DEFECTS: 'kyc_defect_hub_shared_defects_v5',
  USERS: 'kyc_defect_hub_shared_users_v5',
  TAB: 'kyc_defect_hub_shared_tab_v5',
  USER_ID: 'kyc_defect_hub_shared_user_id_v5',
  DARK_MODE: 'kyc_defect_hub_shared_dark_mode_v5'
};

// Safe storage engine: strictly preserves empty collections [] and avoids resetting on refresh
const storage = {
  get: (key, fallback) => {
    try {
      if (typeof window !== 'undefined' && window.localStorage) {
        const item = window.localStorage.getItem(key);
        // Only return fallback when the key has never been initialized
        if (item !== null && item !== undefined && item !== '') {
          return JSON.parse(item);
        }
      }
    } catch (e) {
      // Graceful fallback for sandboxed iframe environments
    }
    return fallback;
  },
  set: (key, value) => {
    try {
      if (typeof window !== 'undefined' && window.localStorage) {
        window.localStorage.setItem(key, JSON.stringify(value));
      }
    } catch (e) {
      // Graceful fallback
    }
  }
};

// --- INITIAL DEMO TEAM ROSTER ---
const INITIAL_DEMO_USERS = [
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

// --- DYNAMIC CATEGORIES BY CASE TYPE ---
const CATEGORY_DEFINITIONS = {
  Individual: {
    CORE: [
      'CIP',
      'Client Profile',
      'Risk',
      'SOW',
      'Periodic Review',
      'Members',
      'AML & Sanctions Screening'
    ],
    APPENDIX: [
      'US Tab',
      'Product Profile',
      'Periodic Review',
      'Transaction Review',
      'HRAC',
      'HRPU'
    ]
  },
  Entity: {
    CORE: [
      'CIP',
      'Client Profile',
      'Risk',
      'SOW',
      'Members',
      'AML & Sanctions Screening'
    ],
    APPENDIX: [
      'US Tab',
      'Product Profile',
      'Periodic Review',
      'Transaction Review',
      'HRAC',
      'HRPU'
    ]
  }
};

// Format 16-digit CCID with visual spacing without mutating underlying value
const formatCcidDisplay = (rawCcid) => {
  if (!rawCcid) return '';
  const clean = String(rawCcid).replace(/\D/g, '');
  if (clean.length === 16) {
    return `${clean.slice(0, 4)} ${clean.slice(4, 8)} ${clean.slice(8, 12)} ${clean.slice(12, 16)}`;
  }
  return String(rawCcid);
};

// --- INITIAL FICTIONAL DEFECT RECORDS ---
const INITIAL_DEFECTS = [
  {
    ccid: '1004884019283741',
    kycid: 'KYC-992018471920',
    caseType: 'Entity',
    ownerId: 'ANL-01',
    analystName: 'Alex Morgan',
    dateCreated: '2026-09-21',
    explanation: 'Initial registry filing for Apex Global Holdings S.A. required verification of beneficial ownership structure and source of wealth corroboration.',
    selectedCategories: [
      { section: 'CORE', name: 'CIP' },
      { section: 'CORE', name: 'Members' },
      { section: 'APPENDIX', name: 'US Tab' }
    ],
    qcFile: {
      id: 'QC-DOC-01',
      name: 'QC_Findings_Report_Apex_Entity.pdf',
      size: '1.4 MB',
      uploadDate: '2026-09-22 09:30'
    },
    finalZipFile: {
      id: 'ZIP-DOC-01',
      name: 'Apex_Global_Final_KYC_Completed_Pack.zip',
      size: '6.8 MB',
      uploadDate: '2026-09-22 10:15'
    },
    resolution: {
      comment: 'Retrieved certified certificate of incumbency and updated W-8BEN-E treaty certification.',
      correctiveAction: 'Updated CitiKYC case profile and refreshed KIWI screening index.',
      resolvedBy: 'Alex Morgan',
      resolutionDate: '2026-09-23',
      evidenceFiles: [
        { id: 'RES-EV-01', name: 'Certified_Incumbency_Apex_2026.pdf', size: '2.1 MB' }
      ]
    },
    readReceipts: [
      { userId: 'MGR-01', userName: 'Elena Vance', role: 'Manager', readAt: '2026-09-23 08:30' },
      { userId: 'ANL-01', userName: 'Alex Morgan', role: 'Analyst', readAt: '2026-09-21 10:15' },
      { userId: 'ANL-02', userName: 'Brian Chen', role: 'Analyst', readAt: '2026-09-22 14:10' },
      { userId: 'ANL-03', userName: 'Clara Oswald', role: 'Analyst', readAt: '2026-09-23 09:45' }
    ]
  },
  {
    ccid: '2004884028192034',
    kycid: 'KYC-992028371921',
    caseType: 'Individual',
    ownerId: 'ANL-03',
    analystName: 'Clara Oswald',
    dateCreated: '2026-09-20',
    explanation: 'High Net Worth client individual onboarding with complex international investment accounts across multi-jurisdictional booking centers.',
    selectedCategories: [
      { section: 'CORE', name: 'Client Profile' },
      { section: 'CORE', name: 'SOW' },
      { section: 'CORE', name: 'Periodic Review' },
      { section: 'APPENDIX', name: 'Product Profile' }
    ],
    qcFile: {
      id: 'QC-DOC-02',
      name: 'QC_Findings_Checklist_Horizon_IND.pdf',
      size: '890 KB',
      uploadDate: '2026-09-21 11:00'
    },
    finalZipFile: null,
    resolution: {
      comment: 'Reconciled banking statements confirming source of wealth and finalized risk assessment matrix.',
      correctiveAction: 'Attached verified notarized identity documents and SOW validation memo.',
      resolvedBy: 'Clara Oswald',
      resolutionDate: '2026-09-22',
      evidenceFiles: [
        { id: 'RES-EV-02', name: 'SOW_Corroboration_BankStatement.pdf', size: '3.4 MB' }
      ]
    },
    readReceipts: [
      { userId: 'MGR-01', userName: 'Elena Vance', role: 'Manager', readAt: '2026-09-21 09:00' },
      { userId: 'ANL-03', userName: 'Clara Oswald', role: 'Analyst', readAt: '2026-09-20 11:05' },
      { userId: 'ANL-04', userName: 'David Kim', role: 'Analyst', readAt: '2026-09-21 16:20' },
      { userId: 'ANL-05', userName: 'Emma Watson', role: 'Analyst', readAt: '2026-09-22 11:15' }
    ]
  },
  {
    ccid: '3004884037182930',
    kycid: 'KYC-992037281922',
    caseType: 'Entity',
    ownerId: 'ANL-05',
    analystName: 'Emma Watson',
    dateCreated: '2026-09-19',
    explanation: 'Cross-border trading entity requiring enhanced due diligence and corporate group structuring clarification.',
    selectedCategories: [
      { section: 'CORE', name: 'Risk' },
      { section: 'CORE', name: 'AML & Sanctions Screening' },
      { section: 'APPENDIX', name: 'Transaction Review' },
      { section: 'APPENDIX', name: 'HRAC' }
    ],
    qcFile: {
      id: 'QC-DOC-03',
      name: 'Checker_QC_Finding_Discrepancy_Sheet.pdf',
      size: '1.7 MB',
      uploadDate: '2026-09-20 14:00'
    },
    finalZipFile: {
      id: 'ZIP-DOC-03',
      name: 'TradingCorp_Complete_Dossier_2026.zip',
      size: '8.1 MB',
      uploadDate: '2026-09-20 15:00'
    },
    resolution: {
      comment: 'Completed negative news screening disposition note and attached compliance review sign-off.',
      correctiveAction: 'Updated transactional profile expected volumes in CitiKYC system.',
      resolvedBy: 'Emma Watson',
      resolutionDate: '2026-09-21',
      evidenceFiles: []
    },
    readReceipts: [
      { userId: 'MGR-01', userName: 'Elena Vance', role: 'Manager', readAt: '2026-09-20 09:10' },
      { userId: 'ANL-05', userName: 'Emma Watson', role: 'Analyst', readAt: '2026-09-19 14:25' }
    ]
  },
  {
    ccid: '4004884046192837',
    kycid: 'KYC-992046191923',
    caseType: 'Individual',
    ownerId: 'ANL-07',
    analystName: 'Grace Hopper',
    dateCreated: '2026-09-18',
    explanation: 'Periodic review for private banking individual account holder with offshore investment vehicles.',
    selectedCategories: [
      { section: 'CORE', name: 'CIP' },
      { section: 'APPENDIX', name: 'Periodic Review' },
      { section: 'APPENDIX', name: 'HRPU' }
    ],
    qcFile: {
      id: 'QC-DOC-04',
      name: 'QC_Audit_Note_Grace_Hopper_Case.pdf',
      size: '620 KB',
      uploadDate: '2026-09-19 10:00'
    },
    finalZipFile: null,
    resolution: {
      comment: 'Refreshed government photo identification and residential address verification.',
      correctiveAction: 'Uploaded high-definition ID scan with optical checksum validation.',
      resolvedBy: 'Grace Hopper',
      resolutionDate: '2026-09-22',
      evidenceFiles: [
        { id: 'RES-EV-04', name: 'HighRes_Passport_Verified.pdf', size: '2.8 MB' }
      ]
    },
    readReceipts: [
      { userId: 'MGR-01', userName: 'Elena Vance', role: 'Manager', readAt: '2026-09-19 10:00' },
      { userId: 'ANL-07', userName: 'Grace Hopper', role: 'Analyst', readAt: '2026-09-18 09:35' },
      { userId: 'ANL-01', userName: 'Alex Morgan', role: 'Analyst', readAt: '2026-09-20 08:45' },
      { userId: 'ANL-08', userName: 'Henry Ford', role: 'Analyst', readAt: '2026-09-21 11:20' }
    ]
  },
  {
    ccid: '5004884055182938',
    kycid: 'KYC-992055181924',
    caseType: 'Entity',
    ownerId: 'ANL-09',
    analystName: 'Iris West',
    dateCreated: '2026-09-14',
    explanation: 'Institutional asset manager corporate entity onboarding with multiple authorized signatories.',
    selectedCategories: [
      { section: 'CORE', name: 'CIP' },
      { section: 'CORE', name: 'Members' },
      { section: 'APPENDIX', name: 'Product Profile' }
    ],
    qcFile: {
      id: 'QC-DOC-05',
      name: 'QC_Findings_Checklist_AssetMgr_Signed.pdf',
      size: '1.1 MB',
      uploadDate: '2026-09-15 11:00'
    },
    finalZipFile: {
      id: 'ZIP-DOC-05',
      name: 'AssetManager_Full_Entity_Archive.zip',
      size: '5.5 MB',
      uploadDate: '2026-09-15 11:45'
    },
    resolution: {
      comment: 'Obtained dual-signatory corporate board delegation of authority and registry certificate.',
      correctiveAction: 'Updated signatory mandate matrix in core CitiKYC environment.',
      resolvedBy: 'Iris West',
      resolutionDate: '2026-09-17',
      evidenceFiles: [
        { id: 'RES-EV-05', name: 'Board_Resolution_Delegation_DualSigned.pdf', size: '1.9 MB' }
      ]
    },
    readReceipts: INITIAL_DEMO_USERS.filter(u => u.role !== 'Admin').map(m => ({
      userId: m.id,
      userName: m.name,
      role: m.role,
      readAt: '2026-09-18 10:00'
    }))
  }
];

export default function KycDefectDashboard() {
    const supabase = createClient();
  // Theme State: Persisted globally
  const [darkMode, setDarkMode] = useState(() => {
    return storage.get(STORAGE_KEYS.DARK_MODE, false);
  });

  // Navigation state: Pure React component state (prevents URL hash/browser 404 on refresh)
  const [activeTab, setActiveTab] = useState(() => {
    const saved = storage.get(STORAGE_KEYS.TAB, 'overview');
    const validTabs = ['overview', 'defects', 'new-defect', 'evidence', 'team'];
    return validTabs.includes(saved) ? saved : 'overview';
  });

  // Active persona ID: Persisted in localStorage (Shared prototype state)
const [currentUserId, setCurrentUserId] = useState(null);

  
  // Team Roster State: Persisted in localStorage
  const [teamUsers, setTeamUsers] = useState(() => {
  return storage.get(STORAGE_KEYS.USERS, INITIAL_DEMO_USERS);
});

useEffect(() => {
  async function loadProfiles() {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('active', true)
      .order('first_name');

    if (error) {
      console.error('Error loading profiles:', error);
      return;
    }

const mappedUsers = (data || []).map((p) => ({
  id: p.id,
  name: `${p.first_name} ${p.last_name}`,
  first_name: p.first_name,
  last_name: p.last_name,
  soe_id: p.soe_id,
  role:
    p.role === 'admin'
      ? 'Admin'
      : p.role === 'manager'
        ? 'Manager'
        : 'Analyst',
  email: p.soe_id,
  status: p.active ? 'Active' : 'Inactive',
  active: p.active,
  initials: `${p.first_name?.[0] || ''}${p.last_name?.[0] || ''}`.toUpperCase(),
}));

setTeamUsers(mappedUsers);
  }

  loadProfiles();
}, []);
  

  // Master Defects Registry State: Single shared state across all roles (Strictly preserves [] empty list)
  const [defectsList, setDefectsList] = useState([]);

useEffect(() => {
  let cancelled = false;

  async function loadDefects() {
    try {
      const data = await getDefects();

      if (!cancelled) {
        setDefectsList(data);
      }
    } catch (error) {
      console.error("Error loading defects:", error);
    }
  }

  loadDefects();

  return () => {
    cancelled = true;
  };
}, []);

  // Synchronize state changes to localStorage immediately on any update
  useEffect(() => {
    storage.set(STORAGE_KEYS.DARK_MODE, darkMode);
  }, [darkMode]);

  useEffect(() => {
    storage.set(STORAGE_KEYS.TAB, activeTab);
  }, [activeTab]);

  useEffect(() => {
    storage.set(STORAGE_KEYS.USER_ID, currentUserId);
  }, [currentUserId]);

  useEffect(() => {
    storage.set(STORAGE_KEYS.USERS, teamUsers);
  }, [teamUsers]);


  // Safe Navigation Handler
  const handleTabChange = (tabId) => {
    const validTabs = ['overview', 'defects', 'new-defect', 'evidence', 'team'];
    const target = validTabs.includes(tabId) ? tabId : 'overview';
    setActiveTab(target);
  };

  // User Roster Modals & State
  const [newAnalystName, setNewAnalystName] = useState('');
  const [newAnalystEmail, setNewAnalystEmail] = useState('');
  const [isAddUserModalOpen, setIsAddUserModalOpen] = useState(false);

  // Search State
  const [searchQuery, setSearchQuery] = useState('');
  
  // Selection & Drawer States
  const [selectedDefect, setSelectedDefect] = useState(null);
  const [isDetailDrawerOpen, setIsDetailDrawerOpen] = useState(false);
  const [isReadMatrixOpen, setIsReadMatrixOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState(null);
  const [notificationOpen, setNotificationOpen] = useState(false);

  // Edit / Delete Ownership State
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingDefect, setEditingDefect] = useState(null);
  const [originalCcidRef, setOriginalCcidRef] = useState('');
  const [deleteConfirmDefect, setDeleteConfirmDefect] = useState(null);

  // Filters State for Registry
  const [caseTypeFilter, setCaseTypeFilter] = useState('ALL');
  const [analystFilter, setAnalystFilter] = useState('ALL');
  const [categoryFilter, setCategoryFilter] = useState('ALL');

  // New Defect Workflow State (3 Steps)
  const [wizardStep, setWizardStep] = useState(1);
  const [formCaseType, setFormCaseType] = useState('Individual');
  const [formCcid, setFormCcid] = useState('');
  const [formKycid, setFormKycid] = useState('');
  const [formAnalyst, setFormAnalyst] = useState('');
  const [formDate, setFormDate] = useState(new Date().toISOString().substring(0, 10));
  const [formExplanation, setFormExplanation] = useState('');
  const [formSelectedCategories, setFormSelectedCategories] = useState([]);

  // Step 2 Upload Drafts
  const [qcFileName, setQcFileName] = useState('');
  const [uploadedQcFile, setUploadedQcFile] = useState(null);
  const [finalZipName, setFinalZipName] = useState('');
  const [uploadedFinalZip, setUploadedFinalZip] = useState(null);

  // Step 3 Resolution Drafts
  const [resComment, setResComment] = useState('');
  const [resCorrectiveAction, setResCorrectiveAction] = useState('');
  const [resResolvedBy, setResResolvedBy] = useState('');
  const [resDate, setResDate] = useState(new Date().toISOString().substring(0, 10));
  const [resEvidenceName, setResEvidenceName] = useState('');
  const [resEvidenceFiles, setResEvidenceFiles] = useState([]);

  // Safety Check: If a selected defect is deleted or no longer exists, clear selection state gracefully
  useEffect(() => {
    if (selectedDefect) {
      const exists = (defectsList || []).some(d => d && d.ccid === selectedDefect.ccid);
      if (!exists) {
        setSelectedDefect(null);
        setIsDetailDrawerOpen(false);
        setIsEditModalOpen(false);
      }
    }
  }, [defectsList, selectedDefect]);

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  const copyToClipboard = (text, label) => {
    if (typeof navigator !== 'undefined' && navigator.clipboard) {
      navigator.clipboard.writeText(text);
    }
    showToast(`Copied ${label || 'value'}: ${text}`);
  };


const currentUser = useMemo(() => {
  const list = Array.isArray(teamUsers) ? teamUsers : [];

  return (
    list.find((m) => m && m.id === currentUserId) ||
    list[0] ||
    {
      id: '',
      name: 'Loading...',
      first_name: 'Loading',
      last_name: '',
      role: 'Analyst',
      soe_id: '',
      status: 'Active',
      active: true,
      initials: 'LO',
    }
  );
}, [currentUserId, teamUsers]);

useEffect(() => {
  if (currentUser?.name && currentUser.name !== 'Loading...') {
    setFormAnalyst(currentUser.name);
    setResResolvedBy(currentUser.name);
  }
}, [currentUser]);

const handleSelectUser = (userId) => {
  setCurrentUserId(userId);

  const u = (teamUsers || []).find(
    (m) => m && m.id === userId
  );

  if (u) {
    showToast(
      `Switched active persona to: ${u.first_name} ${u.last_name} (${u.role})`
    );
  }
};

  // --- ROSTER MANAGEMENT (MANAGER & ADMIN) ---
  const handleAddAnalyst = (e) => {
    e.preventDefault();
    if (!newAnalystName || !newAnalystEmail) {
      alert('Please provide Analyst name and email.');
      return;
    }
    const currentAnalysts = (teamUsers || []).filter(u => u && u.role === 'analyst');
    const nextNum = currentAnalysts.length + 1;
    const formattedId = `ANL-${nextNum < 10 ? '0' + nextNum : nextNum}`;
    const initials = newAnalystName.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase();

    const newMember = {
      id: formattedId,
      name: newAnalystName.trim(),
      role: 'Analyst',
      email: newAnalystEmail.trim(),
      initials: initials || 'AN',
      status: 'Active'
    };

    setTeamUsers(prev => {
      const next = [...(Array.isArray(prev) ? prev : []), newMember];
      storage.set(STORAGE_KEYS.USERS, next);
      return next;
    });
    setNewAnalystName('');
    setNewAnalystEmail('');
    setIsAddUserModalOpen(false);
    showToast(`Added ${newMember.name} (${newMember.id}) to Analyst roster.`);
  };

  const handleRemoveAnalyst = (targetUser) => {
    if (!targetUser || targetUser.role !== 'Analyst') {
      alert('Only Analyst team members can be decommissioned from roster.');
      return;
    }
    const confirmed = window.confirm(
      `Are you sure you want to remove ${targetUser.name} from the active team roster?\n\nHistorical defects and activity created by ${targetUser.name} will be preserved for audit history.`
    );
    if (!confirmed) return;

    setTeamUsers(prev => {
      const next = (Array.isArray(prev) ? prev : []).map(u => u.id === targetUser.id ? { ...u, status: 'Decommissioned' } : u);
      storage.set(STORAGE_KEYS.USERS, next);
      return next;
    });
    showToast(`${targetUser.name} removed from active roster. Historical records preserved.`);
  };

  // --- OVERVIEW METRICS (SAFE WITH EMPTY LIST) ---
  const overviewMetrics = useMemo(() => {
    const list = Array.isArray(defectsList) ? defectsList : [];
    const total = list.length;
    const individualCount = list.filter(d => d && d.caseType === 'Individual').length;
    const entityCount = list.filter(d => d && d.caseType === 'Entity').length;
    return { total, individualCount, entityCount };
  }, [defectsList]);

  // --- ANALYST ACTIVITY VISUALIZATION DATA ---
  const analystActivityData = useMemo(() => {
    const list = Array.isArray(defectsList) ? defectsList : [];
    const users = Array.isArray(teamUsers) ? teamUsers : [];
    const activityMap = {};
    users.filter(u => u && u.role === 'Analyst').forEach(a => {
      const shortName = a.name ? a.name.split(' ')[0] : a.id;
      activityMap[a.name] = { name: shortName, fullName: a.name, defectsLogged: 0 };
    });
    list.forEach(d => {
      if (d && d.analystName && activityMap[d.analystName]) {
        activityMap[d.analystName].defectsLogged++;
      }
    });
    return Object.values(activityMap);
  }, [defectsList, teamUsers]);

  // --- ADMIN TEAM ACKNOWLEDGMENT PERCENTAGE ---
  const teamAcknowledgmentRate = useMemo(() => {
    const list = Array.isArray(defectsList) ? defectsList : [];
    if (list.length === 0) return 0;
    const users = Array.isArray(teamUsers) ? teamUsers : [];
    const activeTeamCount = users.filter(u => u && u.status === 'Active' && u.role !== 'Admin').length || 1;
    let totalReads = 0;
    let totalPossibleReads = list.length * activeTeamCount;
    list.forEach(d => {
      totalReads += (d && Array.isArray(d.readReceipts)) ? d.readReceipts.length : 0;
    });
    if (totalPossibleReads === 0) return 0;
    return Math.min(100, Math.round((totalReads / totalPossibleReads) * 100));
  }, [defectsList, teamUsers]);

  // --- FILTERED DEFECTS LIST ---
  const filteredDefects = useMemo(() => {
    const list = Array.isArray(defectsList) ? defectsList : [];
    return list.filter(item => {
      if (!item) return false;
      const q = (searchQuery || '').toLowerCase().trim();
      const ccidStr = (item.ccid || '').toLowerCase();
      const kycidStr = (item.kycid || '').toLowerCase();
      const analystStr = (item.analystName || '').toLowerCase();
      const expStr = (item.explanation || '').toLowerCase();
      const catMatch = Array.isArray(item.selectedCategories) && item.selectedCategories.some(c => c && c.name && c.name.toLowerCase().includes(q));

      const matchSearch = !q || ccidStr.includes(q) || kycidStr.includes(q) || analystStr.includes(q) || expStr.includes(q) || catMatch;
      const matchType = caseTypeFilter === 'ALL' || item.caseType === caseTypeFilter;
      const matchAnalyst = analystFilter === 'ALL' || item.analystName === analystFilter;
      const matchCat = categoryFilter === 'ALL' || (Array.isArray(item.selectedCategories) && item.selectedCategories.some(c => c && c.name === categoryFilter));

      return matchSearch && matchType && matchAnalyst && matchCat;
    });
  }, [defectsList, searchQuery, caseTypeFilter, analystFilter, categoryFilter]);

  // --- DYNAMIC EVIDENCE VAULT DERIVED FROM ACTIVE DEFECTS ---
  const allEvidenceFiles = useMemo(() => {
    const list = [];
    const defects = Array.isArray(defectsList) ? defectsList : [];
    defects.forEach(d => {
      if (!d) return;
      if (d.qcFile && d.qcFile.name) {
        list.push({
          id: d.qcFile.id || `QC-${d.ccid}`,
          ccid: d.ccid,
          fileName: d.qcFile.name,
          fileType: 'QC Findings File',
          size: d.qcFile.size || '1.4 MB',
          uploadedBy: 'QC Checker',
          date: d.qcFile.uploadDate || d.dateCreated || '2026-09-22',
          tag: 'qc'
        });
      }
      if (d.finalZipFile && d.finalZipFile.name) {
        list.push({
          id: d.finalZipFile.id || `ZIP-${d.ccid}`,
          ccid: d.ccid,
          fileName: d.finalZipFile.name,
          fileType: 'Final Case ZIP',
          size: d.finalZipFile.size || '6.5 MB',
          uploadedBy: d.analystName || 'Analyst',
          date: d.finalZipFile.uploadDate || d.dateCreated || '2026-09-22',
          tag: 'zip'
        });
      }
      if (d.resolution && Array.isArray(d.resolution.evidenceFiles)) {
        d.resolution.evidenceFiles.forEach((f, idx) => {
          if (f && f.name) {
            list.push({
              id: f.id || `RES-${d.ccid}-${idx}`,
              ccid: d.ccid,
              fileName: f.name,
              fileType: 'Resolution Evidence',
              size: f.size || '2.0 MB',
              uploadedBy: d.resolution.resolvedBy || d.analystName || 'Analyst',
              date: d.resolution.resolutionDate || d.dateCreated || '2026-09-23',
              tag: 'res'
            });
          }
        });
      }
    });
    return list;
  }, [defectsList]);

  // --- CATEGORY SELECTION TOGGLE ---
  const toggleCategorySelection = (section, catName) => {
    setFormSelectedCategories(prev => {
      const list = Array.isArray(prev) ? prev : [];
      const exists = list.some(c => c && c.section === section && c.name === catName);
      if (exists) {
        return list.filter(c => !(c.section === section && c.name === catName));
      } else {
        return [...list, { section, name: catName }];
      }
    });
  };

  const isCategorySelected = (section, catName) => {
    return Array.isArray(formSelectedCategories) && formSelectedCategories.some(c => c && c.section === section && c.name === catName);
  };

  // --- EDIT MODAL CATEGORY TOGGLE ---
  const toggleEditCategorySelection = (section, catName) => {
    if (!editingDefect) return;
    const currentCats = Array.isArray(editingDefect.selectedCategories) ? editingDefect.selectedCategories : [];
    const exists = currentCats.some(c => c && c.section === section && c.name === catName);
    let updatedCats;
    if (exists) {
      updatedCats = currentCats.filter(c => !(c.section === section && c.name === catName));
    } else {
      updatedCats = [...currentCats, { section, name: catName }];
    }
    setEditingDefect({ ...editingDefect, selectedCategories: updatedCats });
  };

  const isEditCategorySelected = (section, catName) => {
    if (!editingDefect || !Array.isArray(editingDefect.selectedCategories)) return false;
    return editingDefect.selectedCategories.some(c => c && c.section === section && c.name === catName);
  };

  // --- READ STATUS TOGGLE ---
  const handleToggleRead = (targetCcid) => {
    const timestamp = new Date().toISOString().replace('T', ' ').substring(0, 16);
    setDefectsList(prev => {
      const list = Array.isArray(prev) ? prev : [];
      const next = list.map(d => {
        if (d && d.ccid === targetCcid) {
          const receipts = Array.isArray(d.readReceipts) ? d.readReceipts : [];
          const alreadyRead = receipts.some(r => r && r.userId === currentUserId);
          let newReceipts;
          if (alreadyRead) {
            newReceipts = receipts.filter(r => r && r.userId !== currentUserId);
            showToast(`Defect (${d.ccid}) marked as Unread for ${currentUser.name}`);
          } else {
            newReceipts = [
              ...receipts,
              { userId: currentUserId, userName: currentUser.name, role: currentUser.role, readAt: timestamp }
            ];
            showToast(`Defect (${d.ccid}) marked as Read by ${currentUser.name}`);
          }
          return { ...d, readReceipts: newReceipts };
        }
        return d;
      });
      storage.set(STORAGE_KEYS.DEFECTS, next);
      return next;
    });

    if (selectedDefect && selectedDefect.ccid === targetCcid) {
      setSelectedDefect(prev => {
        if (!prev) return null;
        const receipts = Array.isArray(prev.readReceipts) ? prev.readReceipts : [];
        const alreadyRead = receipts.some(r => r && r.userId === currentUserId);
        let newReceipts;
        if (alreadyRead) {
          newReceipts = receipts.filter(r => r && r.userId !== currentUserId);
        } else {
          newReceipts = [
            ...receipts,
            { userId: currentUserId, userName: currentUser.name, role: currentUser.role, readAt: timestamp }
          ];
        }
        return { ...prev, readReceipts: newReceipts };
      });
    }
  };

  // --- OWNER EDIT SAVE HANDLER ---
  const handleOpenEditModal = (defect, e) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    if (!defect) return;
    if (currentUser.role === 'Analyst' && defect.ownerId !== currentUser.id) {
      alert('Permission Denied: You can only edit defects created by yourself.');
      return;
    }
    setOriginalCcidRef(defect.ccid);
    setEditingDefect({
      ...defect,
      resolution: {
        ...(defect.resolution || {}),
        evidenceFiles: [...((defect.resolution && defect.resolution.evidenceFiles) || [])]
      },
      selectedCategories: [...(defect.selectedCategories || [])]
    });
    setIsEditModalOpen(true);
  };

  const handleSaveDefectEdit = (e) => {
    if (e && e.preventDefault) e.preventDefault();
    if (!editingDefect) return;

    const lookupKey = originalCcidRef || editingDefect.ccid;
    const cleanCcid = String(editingDefect.ccid || '').replace(/\D/g, '').slice(0, 16);

    const updatedDefect = {
      ...editingDefect,
      ccid: cleanCcid || editingDefect.ccid,
      kycid: editingDefect.kycid ? editingDefect.kycid.trim() : '',
      explanation: editingDefect.explanation ? editingDefect.explanation.trim() : '',
      caseType: editingDefect.caseType || 'Individual',
      resolution: {
        ...(editingDefect.resolution || {}),
        correctiveAction: (editingDefect.resolution?.correctiveAction || '').trim(),
        comment: (editingDefect.resolution?.comment || '').trim()
      }
    };

    setDefectsList(prev => {
      const list = Array.isArray(prev) ? prev : [];
      const next = list.map(d => (d && d.ccid === lookupKey ? updatedDefect : d));
      storage.set(STORAGE_KEYS.DEFECTS, next);
      return next;
    });
    
    if (selectedDefect && selectedDefect.ccid === lookupKey) {
      setSelectedDefect(updatedDefect);
    }

    setIsEditModalOpen(false);
    setEditingDefect(null);
    setOriginalCcidRef('');
    showToast('Defect updated successfully.');
  };

  const handleDeleteDefect = (defect, e) => {
    if (e) e.stopPropagation();
    if (!defect) return;
    if (currentUser.role === 'Analyst' && defect.ownerId !== currentUser.id) {
      alert('Permission Denied: You can only delete defects created by yourself.');
      return;
    }
    setDeleteConfirmDefect(defect);
  };

  const confirmDeleteDefect = () => {
    if (!deleteConfirmDefect) return;
    const targetCcid = deleteConfirmDefect.ccid;
    setDefectsList(prev => {
      const list = Array.isArray(prev) ? prev : [];
      const next = list.filter(d => d && d.ccid !== targetCcid);
      storage.set(STORAGE_KEYS.DEFECTS, next);
      return next;
    });
    if (selectedDefect && selectedDefect.ccid === targetCcid) {
      setIsDetailDrawerOpen(false);
      setSelectedDefect(null);
    }
    setDeleteConfirmDefect(null);
    showToast(`Defect (${targetCcid}) deleted from registry.`);
  };

  const handleCcidChange = (e) => {
    const val = e.target.value.replace(/\D/g, '').slice(0, 16);
    setFormCcid(val);
  };

  const handleKycidChange = (e) => {
    let val = e.target.value.trim();
    if (val.startsWith('KYC-KYC-')) {
      val = val.replace(/^KYC-KYC-/, 'KYC-');
    }
    setFormKycid(val);
  };

  const handleFinalSubmitDefect = async (e) => {
    e.preventDefault();
    if (!formCcid || formCcid.length !== 16) {
      alert('Please enter a valid 16-digit CCID numeric identifier.');
      setWizardStep(1);
      return;
    }
    if (!formKycid) {
      alert('Please provide the KYCID as it appears in KIWI.');
      setWizardStep(1);
      return;
    }
    if (!formExplanation) {
      alert('Please provide the defect explanation/context.');
      setWizardStep(1);
      return;
    }
    if (!uploadedQcFile) {
      alert('Please attach the QC Findings File from the Checker in Step 2.');
      setWizardStep(2);
      return;
    }

    const timeFull = new Date().toISOString().replace('T', ' ').substring(0, 16);

    const analystName = formAnalyst || currentUser?.name || '';

    const newDefectRecord = {
      ccid: formCcid,
      kycid: formKycid,
      caseType: formCaseType,
      ownerId: currentUser.id,
      analystName: analystName,
      dateCreated: formDate,
      explanation: formExplanation,
      selectedCategories: formSelectedCategories,
      qcFile: uploadedQcFile,
      finalZipFile: uploadedFinalZip || null,
      resolution: {
        comment: resComment || 'Resolution verified and recorded post QC approval.',
        correctiveAction: resCorrectiveAction || 'Corrective file updates completed.',
        resolvedBy: resResolvedBy || formAnalyst,
        resolutionDate: resDate,
        evidenceFiles: resEvidenceFiles
      },
      readReceipts: [
        { userId: currentUser.id, userName: currentUser.name, role: currentUser.role, readAt: timeFull }
      ]
    };

const { data: analystProfile, error: analystError } = await supabase
  .from('profiles')
  .select('id, first_name, last_name')
  .eq('first_name', analystName.split(' ')[0])
  .eq('last_name', analystName.split(' ').slice(1).join(' '))
  .single();

if (analystError || !analystProfile) {
  console.error('Error finding analyst:', analystError);
  alert(`No se encontró el analista "${analystName}" en Supabase.`);
  return;
}

const { data: insertedDefect, error } = await supabase
  .from('defects')
  .insert({
    ccid: formCcid,
    kycid: formKycid,
    case_type: formCaseType.toLowerCase(),
    analyst_id: analystProfile.id,
    analyst_context: formExplanation,
    status: 'draft',
  })
  .select()
  .single();

if (error) {
  console.error('Error creating defect:', error);
  alert(`Error guardando el defecto:\n${error.message}`);
  return;
}

const savedDefect = {
  ...newDefectRecord,
  id: insertedDefect.id,
  status: insertedDefect.status,
};

setDefectsList(prev => {
  const list = Array.isArray(prev) ? prev : [];
  return [savedDefect, ...list];
});

    showToast(`Defect (${newDefectRecord.ccid} / ${newDefectRecord.kycid}) successfully logged into registry!`);

    setFormCcid('');
    setFormKycid('');
    setFormExplanation('');
    setFormSelectedCategories([]);
    setUploadedQcFile(null);
    setUploadedFinalZip(null);
    setResComment('');
    setResCorrectiveAction('');
    setResEvidenceFiles([]);
    setWizardStep(1);
    handleTabChange('defects');
  };

  // Reset to default dataset for demo tester convenience
  const handleResetDemoData = () => {
    const ok = window.confirm('Reset defect registry and team roster back to initial prototype defaults?');
    if (ok) {
      setDefectsList(INITIAL_DEFECTS);
      setTeamUsers(INITIAL_DEMO_USERS);
      storage.set(STORAGE_KEYS.DEFECTS, INITIAL_DEFECTS);
      storage.set(STORAGE_KEYS.USERS, INITIAL_DEMO_USERS);
      setSelectedDefect(null);
      setIsDetailDrawerOpen(false);
      showToast('Reset to default prototype dataset.');
    }
  };

  // Dynamic Theme Styling Tokens
  const themeClasses = {
    appBg: darkMode ? 'bg-[#0B132B] text-[#F1F5F9]' : 'bg-[#F8F9FA] text-[#212529]',
    sidebarBg: darkMode ? 'bg-[#0A192F] border-r border-[#1E293B] shadow-[6px_0_30px_rgba(0,0,0,0.5)]' : 'bg-[#002D72] border-r border-[#001E4D]/80 shadow-[4px_0_24px_-2px_rgba(0,45,114,0.35)]',
    sidebarHeader: darkMode ? 'bg-[#071324] border-white/10' : 'bg-[#00245E] border-white/10',
    headerBg: darkMode ? 'bg-[#111E38] border-[#1E2E4A]' : 'bg-white border-[#E9ECEF]',
    headerText: darkMode ? 'text-white' : 'text-[#212529]',
    cardBg: darkMode ? 'bg-[#111E38] border-[#1E2E4A] shadow-md' : 'bg-white border-[#E9ECEF] shadow-sm',
    tableHeaderBg: darkMode ? 'bg-[#0F1A30] border-[#1E2E4A]' : 'bg-[#F1F3F5] border-[#E9ECEF]',
    tableRowHover: darkMode ? 'hover:bg-[#162746]/60' : 'hover:bg-blue-50/40',
    tableBorder: darkMode ? 'divide-[#1E2E4A] border-[#1E2E4A]' : 'divide-neutral-100 border-[#E9ECEF]',
    innerBoxBg: darkMode ? 'bg-[#0B1426] border-[#1E2E4A]' : 'bg-neutral-50 border-neutral-200',
    inputBg: darkMode ? 'bg-[#0B1426] border-[#2A3F66] text-white placeholder:text-neutral-500' : 'bg-[#F8F9FA] border-[#DEE2E6] text-neutral-800',
    mutedText: darkMode ? 'text-[#94A3B8]' : 'text-neutral-500',
    headingText: darkMode ? 'text-white' : 'text-neutral-900',
    cyanTagText: darkMode ? 'text-[#38BDF8]' : 'text-[#0056B3]',
    modalBg: darkMode ? 'bg-[#111E38] border-[#1E2E4A] text-white' : 'bg-white border-neutral-200 text-neutral-900',
    badgeMuted: darkMode ? 'bg-[#1E293B] text-slate-300 border-[#334155]' : 'bg-neutral-100 text-neutral-700 border-neutral-200'
  };

  // --- REFINED LIGHT MODE & DARK MODE BADGE STYLING HELPERS ---
  const getCaseTypeBadgeClass = (type) => {
    if (type === 'Individual') {
      return darkMode
        ? 'bg-purple-950/40 text-purple-300 border border-purple-800/60 font-medium'
        : 'bg-purple-100 text-purple-900 border border-purple-300 font-semibold shadow-2xs';
    }
    return darkMode
      ? 'bg-emerald-950/40 text-emerald-300 border border-emerald-800/60 font-medium'
      : 'bg-emerald-100 text-emerald-950 border border-emerald-300 font-semibold shadow-2xs';
  };

  const getCategoryBadgeClass = (section) => {
    if (section === 'CORE') {
      return darkMode
        ? 'bg-blue-950/40 text-blue-300 border border-blue-800/60 font-normal'
        : 'bg-[#EBF3FC] text-[#002D72] border border-[#B9D5F7] font-medium shadow-2xs';
    }
    return darkMode
      ? 'bg-slate-800/50 text-slate-300 border border-slate-700 font-normal'
      : 'bg-[#F1F5F9] text-[#1E293B] border border-[#CBD5E1] font-medium shadow-2xs';
  };

  const getReadButtonClass = (isReadByMe) => {
    if (isReadByMe) {
      return darkMode
        ? 'bg-emerald-950/50 text-emerald-300 border border-emerald-800/80 font-semibold'
        : 'bg-[#059669] text-white border border-[#047857] font-bold shadow-xs hover:bg-[#047857]';
    }
    return darkMode
      ? 'bg-[#1E293B] text-slate-300 border border-[#334155] hover:bg-neutral-800 font-medium'
      : 'bg-white text-[#1E293B] hover:bg-[#F1F5F9] border border-[#94A3B8] font-semibold shadow-2xs';
  };

  const getDocTypeBadgeClass = (docType) => {
    if (docType === 'qc') {
      return darkMode
        ? 'bg-red-950/40 text-red-300 border border-red-800/60 font-medium'
        : 'bg-red-100 text-red-950 border border-red-300 font-semibold shadow-2xs';
    }
    if (docType === 'zip') {
      return darkMode
        ? 'bg-amber-950/40 text-amber-300 border border-amber-800/60 font-medium'
        : 'bg-amber-100 text-amber-950 border border-amber-300 font-semibold shadow-2xs';
    }
    return darkMode
      ? 'bg-blue-950/40 text-blue-300 border border-blue-800/60 font-medium'
      : 'bg-blue-100 text-[#002D72] border border-blue-300 font-semibold shadow-2xs';
  };

  return (
    <div className={`flex h-screen ${themeClasses.appBg} font-sans overflow-hidden antialiased transition-colors duration-200`}>
      
      {/* ============================================================ */}
      {/* 1. SIDEBAR NAVIGATION                                       */}
      {/* ============================================================ */}
      <aside className={`w-64 ${themeClasses.sidebarBg} text-white flex flex-col justify-between z-20 flex-shrink-0 transition-all duration-200`}>
        <div>
          {/* Logo & Header */}
          <div className={`p-5 border-b ${themeClasses.sidebarHeader} flex items-center justify-between`}>
            <div className="flex items-center gap-3">
              <div className="bg-white p-1.5 rounded shadow-sm flex items-center justify-center">
                <CitiLogo className="h-6 w-auto" />
              </div>
              <div>
                <h1 className="font-bold text-sm tracking-wide text-white leading-tight">KYC DEFECT HUB</h1>
                <p className="text-[10px] text-blue-200 tracking-wider uppercase font-semibold">Quality Management</p>
              </div>
            </div>
          </div>

          {/* Active Persona Banner */}
          <div className="mx-3 my-3 p-3 rounded bg-white/5 border border-white/10 shadow-inner">
            <div className="flex items-center justify-between text-xs text-blue-200 mb-1">
              <span className="flex items-center gap-1.5 font-medium">
                {currentUser?.role === 'Admin' ? (
                  <Shield className="w-3.5 h-3.5 text-amber-400" />
                ) : currentUser?.role === 'Manager' ? (
                  <ShieldCheck className="w-3.5 h-3.5 text-purple-300" />
                ) : (
                  <UserCheck className="w-3.5 h-3.5 text-blue-300" />
                )}
                Role: {currentUser.role}
              </span>
              <span className="bg-white/10 text-white text-[10px] px-1.5 py-0.5 rounded font-mono">
                {currentUser.role === 'Analyst' ? 'Analyst View' : 'Supervisory View'}
              </span>
            </div>
            <div className="text-[11px] text-blue-300/80 flex justify-between pt-1 border-t border-white/5">
              <span className="truncate max-w-[120px]">{currentUser.name}</span>
              <span className="font-mono text-[10px]">
            ({currentUser.role.charAt(0).toUpperCase() + currentUser.role.slice(1)})
            </span>
            </div>
          </div>

          {/* Navigation Links with safe tab switcher */}
          <nav className="px-3 space-y-1">
            {[
              { id: 'overview', label: 'Overview', icon: BarChart3, badge: null },
              { id: 'defects', label: 'Defects Registry', icon: ShieldAlert, badge: defectsList.length },
              { id: 'new-defect', label: 'New Defect', icon: Plus, badge: '3-Step Form', badgeColor: 'bg-[#E21836] text-white' },
              { id: 'evidence', label: 'Evidence Vault', icon: FileCheck, badge: `${allEvidenceFiles.length} files` },
              { id: 'team', label: 'Team & Roster', icon: Users, badge: `${(teamUsers || []).filter(u => u && u.status === 'Active' && u.role === 'Analyst').length} Analysts` },
            ].map(item => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => handleTabChange(item.id)}
                  className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-md text-xs font-medium transition-all duration-150 cursor-pointer ${
                    isActive
                      ? 'bg-[#003EA4] text-white shadow-md font-semibold border-l-4 border-white'
                      : 'text-blue-100/80 hover:bg-white/10 hover:text-white'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-blue-300'}`} />
                    <span>{item.label}</span>
                  </div>
                  {item.badge && (
                    <span className={`text-[10px] px-2 py-0.5 rounded-full font-semibold ${item.badgeColor || 'bg-white/15 text-blue-100'}`}>
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>
        </div>

        {/* Persona Switcher & User Profile */}
        <div className={`p-3 border-t ${themeClasses.sidebarHeader}`}>
          <div className="text-[11px] text-blue-300 uppercase tracking-wider font-semibold mb-2 px-1 flex items-center justify-between">
            <span>Simulate User Persona:</span>
            <button
              onClick={handleResetDemoData}
              className="text-[10px] text-blue-200 hover:text-white underline cursor-pointer"
              title="Reset state to initial prototype data"
            >
              Reset Data
            </button>
          </div>

          <select
  value={currentUserId ?? ''}
  onChange={(e) => handleSelectUser(e.target.value)}
  className="w-full mb-3 p-1.5 bg-[#00245E] text-white border border-blue-400/30 rounded text-xs"
>
<optgroup label="Management & Admin" className="bg-[#00245E] text-white">
  {(teamUsers || [])
    .filter(u => u && u.active && (u.role === 'Manager' || u.role === 'Admin'))
    .map(user => (
      <option key={user.id} value={user.id}>
        {user.name} ({user.soe_id})
      </option>
    ))}
</optgroup>

            <optgroup label="Active Analysts (Record Owners)" className="bg-[#00245E] text-white">
              {(teamUsers || []).filter(u => u && u.role === 'Analyst' && u.status === 'Active').map(anl => (
                <option key={anl.id} value={anl.id}>
                  {anl.name} ({anl.soe_id})
                </option>
              ))}
            </optgroup>
          </select>

          <div className="flex items-center gap-3 pt-2 border-t border-white/10">
            <div className="w-8 h-8 rounded-full bg-[#003EA4] border border-blue-300 flex items-center justify-center font-bold text-xs text-white shadow-xs">
              {currentUser.initials}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs font-semibold text-white truncate">
                {currentUser.name}
              </p>
              <p className="text-[10px] text-blue-300 truncate">
                {currentUser.role === 'Manager' ? 'Quality Lead (Supervisory)' : currentUser.role === 'Admin' ? 'Administrator' : 'KYC Analyst (Owner Permissions)'}
              </p>
            </div>
          </div>
        </div>
      </aside>

      {/* ============================================================ */}
      {/* 2. MAIN CONTENT AREA                                         */}
      {/* ============================================================ */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        
        {/* Top Header Bar */}
        <header className={`h-16 ${themeClasses.headerBg} border-b px-6 flex items-center justify-between shadow-sm z-10 transition-colors duration-200`}>
          <div className="flex items-center gap-4">
            <h2 className={`text-lg font-bold ${themeClasses.headerText} tracking-tight capitalize`}>
              {activeTab === 'new-defect' ? 'New Defect Workflow' : activeTab.replace('-', ' ')}
            </h2>
            <span className="text-neutral-300 dark:text-neutral-700">|</span>
            <span className={`text-xs ${themeClasses.mutedText} font-medium`}>
              CCID (16 Digits) & KYCID (with KYC- prefix) • Shared Global Persistence
            </span>
          </div>

          <div className="flex items-center gap-3">
            {/* Global Search Input */}
            <div className="relative w-56 lg:w-64">
              <Search className="w-4 h-4 absolute left-3 top-2.5 text-neutral-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search CCID, KYCID, Analyst, Category..."
                className={`w-full pl-9 pr-3 py-1.5 text-xs ${themeClasses.inputBg} rounded-md focus:outline-none focus:border-[#003EA4]`}
              />
              {searchQuery && (
                <button onClick={() => setSearchQuery('')} className="absolute right-2.5 top-2.5 text-neutral-400 hover:text-neutral-600">
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>

            {/* Quick Log Defect Action */}
            <button
              onClick={() => handleTabChange('new-defect')}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-[#003EA4] hover:bg-[#002D72] text-white text-xs font-semibold rounded shadow-sm transition cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Log Defect</span>
            </button>

            {/* LIGHT / DARK MODE TOGGLE */}
            <button
              onClick={() => {
                setDarkMode(!darkMode);
                showToast(`Switched to ${!darkMode ? 'Dark' : 'Light'} Mode`);
              }}
              className={`p-2 rounded-md border flex items-center gap-1.5 transition-all text-xs font-semibold cursor-pointer ${
                darkMode
                  ? 'bg-[#1E2E4A] border-[#2A3F66] text-amber-300 hover:bg-[#253759]'
                  : 'bg-white border-[#DEE2E6] text-neutral-700 hover:bg-neutral-100'
              }`}
              title={darkMode ? "Switch to Light Mode" : "Switch to Dark Mode"}
              aria-label="Toggle Theme"
            >
              {darkMode ? (
                <>
                  <Sun className="w-4 h-4 text-amber-400" />
                  <span className="hidden lg:inline text-slate-200">Light</span>
                </>
              ) : (
                <>
                  <Moon className="w-4 h-4 text-[#003EA4]" />
                  <span className="hidden lg:inline text-neutral-700">Dark</span>
                </>
              )}
            </button>

            {/* Notification Bell */}
            <div className="relative">
              <button
                onClick={() => setNotificationOpen(!notificationOpen)}
                className={`p-2 ${themeClasses.mutedText} hover:text-neutral-800 dark:hover:text-white rounded-md hover:bg-neutral-100 dark:hover:bg-white/5 relative cursor-pointer`}
                aria-label="Notifications"
              >
                <Bell className="w-4 h-4" />
                <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full ring-2 ring-white dark:ring-neutral-900"></span>
              </button>

              {notificationOpen && (
                <div className={`absolute right-0 mt-2 w-80 ${darkMode ? 'bg-[#111E38] border-[#1E2E4A] text-white' : 'bg-white border-neutral-200 text-[#1E293B] shadow-2xl'} rounded-lg p-3 z-50 text-xs border`}>
                  <div className={`flex justify-between items-center pb-2 border-b ${darkMode ? 'border-neutral-700' : 'border-neutral-200'} font-bold`}>
                    <span className={darkMode ? 'text-white' : 'text-[#002D72]'}>Defect Workflow Notifications</span>
                    <span className={`text-[10px] ${darkMode ? 'text-blue-300 bg-blue-900/50' : 'text-[#003EA4] bg-blue-100'} px-1.5 py-0.5 rounded font-mono font-bold`}>Shared State</span>
                  </div>
                  <div className="space-y-2 py-2">
                    <div className={`p-2.5 rounded border-l-4 border-[#003EA4] ${darkMode ? 'bg-[#0B1426]' : 'bg-[#F0F7FF]'}`}>
                      <p className={`font-bold text-[11px] ${darkMode ? 'text-blue-200' : 'text-[#002D72]'}`}>
                        Shared Unified Persistence
                      </p>
                      <p className={`text-[11px] mt-0.5 ${darkMode ? 'text-slate-300' : 'text-[#334155]'}`}>
                        CRUD operations made under any role are preserved and shared synchronously across Analyst, Manager, and Admin.
                      </p>
                    </div>

                    <div className={`p-2.5 rounded border-l-4 border-amber-500 ${darkMode ? 'bg-[#0B1426]' : 'bg-[#FFFBEB]'}`}>
                      <p className={`font-bold text-[11px] ${darkMode ? 'text-amber-300' : 'text-[#92400E]'}`}>
                        Zero Defect Resilience
                      </p>
                      <p className={`text-[11px] mt-0.5 ${darkMode ? 'text-slate-300' : 'text-[#334155]'}`}>
                        An empty registry list is safely preserved across browser reloads without causing navigation faults.
                      </p>
                    </div>
                  </div>
                  <button 
                    onClick={() => setNotificationOpen(false)}
                    className={`w-full text-center text-[10px] font-semibold pt-1 border-t cursor-pointer ${darkMode ? 'border-neutral-700 text-neutral-400 hover:text-white' : 'border-neutral-200 text-neutral-600 hover:text-neutral-900'}`}
                  >
                    Close
                  </button>
                </div>
              )}
            </div>

            {/* Persona Badge */}
            <div className="flex items-center gap-1.5 pl-2 border-l border-neutral-200 dark:border-neutral-700 text-xs">
              <span className={themeClasses.mutedText}>User:</span>
              <span className={`font-bold px-2 py-0.5 rounded border ${
                currentUser.role === 'Admin'
                  ? darkMode 
                    ? 'bg-amber-950/40 text-amber-300 border-amber-800' 
                    : 'bg-amber-100 text-amber-950 border-amber-300 shadow-2xs'
                  : currentUser.role === 'Manager'
                  ? darkMode 
                    ? 'bg-purple-950/40 text-purple-300 border-purple-800' 
                    : 'bg-purple-100 text-purple-950 border-purple-300 shadow-2xs'
                  : darkMode 
                    ? 'bg-blue-950/40 text-blue-300 border-blue-800' 
                    : 'bg-[#EBF3FC] text-[#002D72] border-[#B9D5F7] shadow-2xs'
              }`}>
                {currentUser.name} ({currentUser.role})
              </span>
            </div>
          </div>
        </header>

        {/* Global Toast Alert */}
        {toastMessage && (
          <div className="bg-[#002D72] text-white px-4 py-2 flex items-center justify-between text-xs font-medium shadow-md">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              <span>{toastMessage}</span>
            </div>
            <button onClick={() => setToastMessage(null)} className="text-blue-200 hover:text-white">
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        )}

        {/* ============================================================ */}
        {/* MAIN BODY SCROLLABLE VIEW                                   */}
        {/* ============================================================ */}
        <main className="flex-1 overflow-y-auto p-6 space-y-6">

          {/* ========================================================== */}
          {/* TAB 1: SIMPLIFIED OVERVIEW                                 */}
          {/* ========================================================== */}
          {activeTab === 'overview' && (
            <div className="space-y-6">
              
              {/* Executive Header Banner */}
              <div className={`${themeClasses.cardBg} p-5 rounded-lg border flex flex-col md:flex-row md:items-center justify-between gap-4`}>
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="bg-[#003EA4] text-white text-[10px] font-bold px-2 py-0.5 rounded">
                      KYC Defect Management
                    </span>
                    <span className={`text-xs ${themeClasses.mutedText} font-medium`}>Post-QC Approved Case Defect Repository</span>
                  </div>
                  <h3 className={`text-lg font-bold ${themeClasses.headingText}`}>Quality Defect Overview & Case Volume</h3>
                  <p className={`text-xs ${themeClasses.mutedText} mt-0.5 max-w-3xl`}>
                    Defects logged after analyst completion and QC approval across Individual and Entity KYC client portfolios.
                  </p>
                </div>

                <div className="flex items-center gap-2 flex-shrink-0">
                  <button
                    onClick={() => handleTabChange('new-defect')}
                    className="px-3.5 py-2 bg-[#003EA4] hover:bg-[#002D72] text-white text-xs font-bold rounded shadow transition flex items-center gap-1.5 cursor-pointer"
                  >
                    <Plus className="w-4 h-4" />
                    <span>Enter New Defect</span>
                  </button>
                  <button
                    onClick={() => handleTabChange('defects')}
                    className={`px-3.5 py-2 border ${darkMode ? 'border-neutral-700 text-neutral-300 hover:bg-neutral-800' : 'border-neutral-300 text-neutral-700 hover:bg-neutral-50'} text-xs font-semibold rounded transition cursor-pointer`}
                  >
                    Defects Registry ({defectsList.length})
                  </button>
                </div>
              </div>

              {/* 3 SIMPLIFIED CORE METRICS */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                
                {/* 1. Total Defects */}
                <div className={`${themeClasses.cardBg} p-5 rounded-lg border hover:shadow transition`}>
                  <div className={`flex items-center justify-between ${themeClasses.mutedText} text-xs font-semibold mb-2`}>
                    <span>Total Defects</span>
                    <span className="p-1.5 bg-blue-50 dark:bg-blue-900/40 text-[#003EA4] dark:text-blue-300 rounded"><Layers className="w-4 h-4" /></span>
                  </div>
                  <div className={`text-3xl font-bold ${themeClasses.headingText}`}>{overviewMetrics.total}</div>
                  <div className={`text-[11px] ${themeClasses.mutedText} mt-1`}>Total QC defect records in system</div>
                </div>

                {/* 2. Individual Cases */}
                <div className={`${themeClasses.cardBg} p-5 rounded-lg border hover:shadow transition`}>
                  <div className={`flex items-center justify-between ${themeClasses.mutedText} text-xs font-semibold mb-2`}>
                    <span>Individual Cases</span>
                    <span className="p-1.5 bg-purple-50 dark:bg-purple-900/40 text-purple-700 dark:text-purple-300 rounded"><UserIcon className="w-4 h-4" /></span>
                  </div>
                  <div className="text-3xl font-bold text-purple-600 dark:text-purple-400">{overviewMetrics.individualCount}</div>
                  <div className={`text-[11px] ${themeClasses.mutedText} mt-1`}>Individual client KYC reviews</div>
                </div>

                {/* 3. Entity Cases */}
                <div className={`${themeClasses.cardBg} p-5 rounded-lg border hover:shadow transition`}>
                  <div className={`flex items-center justify-between ${themeClasses.mutedText} text-xs font-semibold mb-2`}>
                    <span>Entity Cases</span>
                    <span className="p-1.5 bg-emerald-50 dark:bg-emerald-900/40 text-emerald-700 dark:text-emerald-300 rounded"><Building2 className="w-4 h-4" /></span>
                  </div>
                  <div className="text-3xl font-bold text-emerald-600 dark:text-emerald-400">{overviewMetrics.entityCount}</div>
                  <div className={`text-[11px] ${themeClasses.mutedText} mt-1`}>Corporate & institutional entity reviews</div>
                </div>

              </div>

              {/* ANALYST ACTIVITY VISUALIZATION (MANAGER & ADMIN ONLY) */}
              {(currentUser.role === 'Manager' || currentUser.role === 'Admin') ? (
                <div className={`${themeClasses.cardBg} p-5 rounded-lg border space-y-4`}>
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="flex items-center gap-2">
                        <h4 className={`font-bold text-sm ${themeClasses.headingText}`}>ANALYST ACTIVITY BREAKDOWN</h4>
                        <span className="bg-purple-100 dark:bg-purple-950/60 text-purple-800 dark:text-purple-300 text-[10px] px-2 py-0.5 rounded font-bold uppercase">
                          {currentUser.role} View
                        </span>
                      </div>
                      <p className={`text-xs ${themeClasses.mutedText} mt-0.5`}>Defect recording activity distribution per team analyst</p>
                    </div>
                  </div>

                  <div className="h-56 w-full">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={analystActivityData.slice(0, 10)} margin={{ top: 10, right: 10, left: -20, bottom: 20 }}>
                        <CartesianGrid strokeDasharray="3 3" stroke={darkMode ? '#1E2E4A' : '#F1F3F5'} />
                        <XAxis dataKey="name" tick={{ fontSize: 10, fill: darkMode ? '#94A3B8' : '#64748B' }} angle={-20} textAnchor="end" interval={0} />
                        <YAxis tick={{ fontSize: 11, fill: darkMode ? '#94A3B8' : '#64748B' }} />
                        <Tooltip contentStyle={{ backgroundColor: darkMode ? '#0F1A30' : '#FFFFFF', borderColor: darkMode ? '#1E2E4A' : '#E9ECEF', color: darkMode ? '#FFF' : '#000', fontSize: '11px', borderRadius: '4px' }} />
                        <Bar dataKey="defectsLogged" name="Defects Handled" fill="#003EA4" radius={[4, 4, 0, 0]} />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>

                  {/* ADMIN PERCENTAGE INDICATOR */}
                  {currentUser.role === 'Admin' && (
                    <div className={`pt-3 border-t ${darkMode ? 'border-[#1E2E4A] bg-[#0B1426]/60' : 'border-[#E9ECEF] bg-blue-50/40'} p-3 rounded-md flex items-center justify-between`}>
                      <div className="flex items-center gap-2">
                        <div className="w-7 h-7 rounded-full bg-[#003EA4] text-white flex items-center justify-center font-bold text-xs">
                          <Percent className="w-3.5 h-3.5 text-white" />
                        </div>
                        <div>
                          <span className={`text-[11px] font-bold ${themeClasses.cyanTagText} tracking-wider uppercase block`}>
                            TEAM ACKNOWLEDGMENT
                          </span>
                          <span className={`text-[10px] ${themeClasses.mutedText}`}>
                            Overall percentage of team members who have acknowledged/read defects
                          </span>
                        </div>
                      </div>
                      <div className={`flex items-baseline gap-1 ${darkMode ? 'bg-[#111E38] border-[#1E2E4A]' : 'bg-white border-blue-200'} px-3 py-1 rounded border shadow-2xs`}>
                        <span className={`text-lg font-bold ${themeClasses.cyanTagText} font-mono`}>{teamAcknowledgmentRate}%</span>
                        <span className={`text-[10px] font-semibold ${themeClasses.mutedText}`}>Acknowledged</span>
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <div className={`${darkMode ? 'bg-blue-950/20 border-blue-900/40' : 'bg-blue-50/50 border-blue-100'} p-4 rounded-lg border text-xs ${themeClasses.mutedText} flex items-center gap-2`}>
                  <ShieldCheck className="w-4 h-4 text-[#003EA4] dark:text-blue-400 flex-shrink-0" />
                  <span>
                    Analyst view active: Showing case metrics for registered defects. Team workload overview is reserved for management.
                  </span>
                </div>
              )}

              {/* RECENT DEFECTS TABLE (SAFE ZERO LIST EMPTY STATE) */}
              <div className={`${themeClasses.cardBg} rounded-lg border overflow-hidden`}>
                <div className={`p-4 ${themeClasses.tableHeaderBg} border-b flex items-center justify-between`}>
                  <div className="flex items-center gap-2">
                    <ShieldAlert className="w-4 h-4 text-[#003EA4] dark:text-blue-400" />
                    <h4 className={`font-bold text-xs uppercase tracking-wider ${themeClasses.headingText}`}>Recent Completed KYC Defects</h4>
                  </div>
                  <button 
                    onClick={() => handleTabChange('defects')}
                    className={`text-xs font-semibold ${themeClasses.cyanTagText} hover:underline flex items-center gap-1 cursor-pointer`}
                  >
                    <span>View all {defectsList.length} in registry</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </button>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead className={`${themeClasses.tableHeaderBg} border-b`}>
                      <tr>
                        <th className={`p-3 ${themeClasses.cyanTagText} font-bold uppercase tracking-wider text-[11px]`}>CCID</th>
                        <th className={`p-3 ${themeClasses.cyanTagText} font-bold uppercase tracking-wider text-[11px]`}>KYCID</th>
                        <th className={`p-3 ${themeClasses.cyanTagText} font-bold uppercase tracking-wider text-[11px]`}>Case Type</th>
                        <th className={`p-3 ${themeClasses.cyanTagText} font-bold uppercase tracking-wider text-[11px]`}>Analyst</th>
                        <th className={`p-3 ${themeClasses.cyanTagText} font-bold uppercase tracking-wider text-[11px]`}>Core / Appendix Areas</th>
                        <th className={`p-3 ${themeClasses.cyanTagText} font-bold uppercase tracking-wider text-[11px]`}>QC Findings</th>
                        <th className={`p-3 ${themeClasses.cyanTagText} font-bold uppercase tracking-wider text-[11px]`}>Final ZIP</th>
                        <th className={`p-3 ${themeClasses.cyanTagText} font-bold uppercase tracking-wider text-[11px]`}>Read Status</th>
                        <th className={`p-3 text-right ${themeClasses.cyanTagText} font-bold uppercase tracking-wider text-[11px]`}>Actions</th>
                      </tr>
                    </thead>
                    <tbody className={themeClasses.tableBorder}>
                      {defectsList.length === 0 ? (
                        <tr>
                          <td colSpan="9" className={`text-center py-10 ${themeClasses.mutedText}`}>
                            <FileSearch className="w-8 h-8 mx-auto mb-2 opacity-50" />
                            <p className="font-semibold text-xs">No defects found in registry.</p>
                            <button
                              onClick={() => handleTabChange('new-defect')}
                              className="mt-2 px-3.5 py-1.5 bg-[#003EA4] hover:bg-[#002D72] text-white text-[11px] rounded font-semibold cursor-pointer shadow-xs"
                            >
                              Log First Defect
                            </button>
                          </td>
                        </tr>
                      ) : (
                        defectsList.slice(0, 5).map(defect => {
                          const isReadByMe = (defect.readReceipts || []).some(r => r && r.userId === currentUserId);
                          const isOwner = defect.ownerId === currentUser.id;
                          const canEdit = currentUser.role === 'Admin' || currentUser.role === 'Manager' || isOwner;
                          const canDelete = currentUser.role === 'Admin' || currentUser.role === 'Manager' || isOwner;

                          return (
                            <tr key={defect.id} className={`${themeClasses.tableRowHover} transition`}>
                              <td className="p-3">
                                <div className="flex items-center gap-1 font-mono font-bold text-[#003EA4] dark:text-blue-400 text-xs">
                                  <span>{formatCcidDisplay(defect.ccid)}</span>
                                  <button
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      copyToClipboard(defect.ccid, 'CCID');
                                    }}
                                    className="p-0.5 text-neutral-400 hover:text-[#003EA4] dark:hover:text-blue-300 rounded cursor-pointer"
                                    title="Copy 16-digit CCID"
                                  >
                                    <Copy className="w-3 h-3" />
                                  </button>
                                </div>
                              </td>
                              <td className="p-3">
                                <div className={`flex items-center gap-1 font-mono ${themeClasses.headingText} font-semibold text-xs`}>
                                  <span>{defect.kycid}</span>
                                  <button
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      copyToClipboard(defect.kycid, 'KYCID');
                                    }}
                                    className="p-0.5 text-neutral-400 hover:text-[#003EA4] dark:hover:text-blue-300 rounded cursor-pointer"
                                    title="Copy KYCID (including KYC-)"
                                  >
                                    <Copy className="w-3 h-3" />
                                  </button>
                                </div>
                              </td>
                              <td className="p-3">
                                <span className={`inline-flex items-center px-2 py-0.5 rounded text-[10px] tracking-wide ${getCaseTypeBadgeClass(defect.caseType)}`}>
                                  {defect.caseType}
                                </span>
                              </td>
                              <td className={`p-3 ${themeClasses.headingText} font-medium`}>
                                <span>{defect.analystName}</span>
                                {isOwner && (
                                  <span className={`ml-1 text-[9px] px-1.5 py-0.2 rounded font-bold ${darkMode ? 'bg-blue-900/60 text-blue-300' : 'bg-blue-100 text-[#002D72]'}`}>YOU</span>
                                )}
                              </td>
                              <td className="p-3">
                                <div className="flex flex-wrap gap-1 max-w-xs">
                                  {(defect.selectedCategories || []).map((c, i) => (
                                    <span key={i} className={`inline-flex items-center px-1.5 py-0.5 rounded text-[10px] tracking-tight ${getCategoryBadgeClass(c.section)}`}>
                                      <span className="opacity-75 font-semibold mr-1">{c.section}:</span>
                                      {c.name}
                                    </span>
                                  ))}
                                </div>
                              </td>
                              <td className="p-3">
                                <div className="inline-flex items-center gap-1 max-w-[140px]" title={defect.qcFile?.name}>
                                  <span className={`inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[10px] truncate ${getDocTypeBadgeClass('qc')}`}>
                                    <FileText className="w-3 h-3 text-red-600 dark:text-red-400 flex-shrink-0" />
                                    <span className="truncate">{defect.qcFile?.name}</span>
                                  </span>
                                </div>
                              </td>
                              <td className="p-3">
                                {defect.finalZipFile ? (
                                  <div className="inline-flex items-center gap-1 max-w-[140px]" title={defect.finalZipFile?.name}>
                                    <span className={`inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[10px] truncate ${getDocTypeBadgeClass('zip')}`}>
                                      <FolderArchive className="w-3 h-3 text-amber-700 dark:text-amber-400 flex-shrink-0" />
                                      <span className="truncate">{defect.finalZipFile?.name}</span>
                                    </span>
                                  </div>
                                ) : (
                                  <span className={`text-[11px] ${themeClasses.mutedText} italic`}>None attached</span>
                                )}
                              </td>
                              <td className="p-3">
                                <button
                                  onClick={() => handleToggleRead(defect.ccid)}
                                  className={`flex items-center gap-1.5 px-2.5 py-1 rounded text-[10px] transition cursor-pointer ${getReadButtonClass(isReadByMe)}`}
                                  title={isReadByMe ? "Click to mark Unread" : "Click to mark Read"}
                                >
                                  {isReadByMe ? <CheckCheck className="w-3.5 h-3.5 text-white dark:text-emerald-400" /> : <Eye className="w-3.5 h-3.5 text-slate-600 dark:text-neutral-400" />}
                                  <span>{isReadByMe ? 'Acknowledged' : 'Mark Read'}</span>
                                  {(currentUser.role === 'Manager' || currentUser.role === 'Admin') && (
                                    <span className={`text-[9px] font-mono ${isReadByMe ? 'text-emerald-100 dark:text-emerald-300' : 'text-slate-500 dark:text-neutral-400'}`}>
                                      ({(defect.readReceipts || []).length}/16)
                                    </span>
                                  )}
                                </button>
                              </td>
                              <td className="p-3 text-right">
                                <div className="flex items-center justify-end gap-1">
                                  {canEdit && (
                                    <button
                                      onClick={(e) => handleOpenEditModal(defect, e)}
                                      className="p-1 text-neutral-500 hover:text-[#003EA4] dark:hover:text-blue-300 hover:bg-blue-50 dark:hover:bg-blue-950/40 rounded cursor-pointer"
                                      title="Edit Defect Record"
                                    >
                                      <Edit3 className="w-3.5 h-3.5 text-[#003EA4] dark:text-blue-400" />
                                    </button>
                                  )}
                                  {canDelete && (
                                    <button
                                      onClick={(e) => handleDeleteDefect(defect, e)}
                                      className="p-1 text-neutral-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-950/40 rounded cursor-pointer"
                                      title="Delete Defect"
                                    >
                                      <Trash2 className="w-3.5 h-3.5 text-red-500" />
                                    </button>
                                  )}
                                  <button
                                    onClick={() => {
                                      setSelectedDefect(defect);
                                      setIsDetailDrawerOpen(true);
                                    }}
                                    className="px-2 py-1 bg-[#003EA4] hover:bg-[#002D72] text-white text-[11px] font-semibold rounded shadow-2xs ml-1 cursor-pointer"
                                  >
                                    Open
                                  </button>
                                </div>
                              </td>
                            </tr>
                          );
                        })
                      )}
                    </tbody>
                  </table>
                </div>
              </div>

            </div>
          )}

          {/* ========================================================== */}
          {/* TAB 2: DEFECTS REGISTRY (SAFE WITH ZERO DEFECTS)          */}
          {/* ========================================================== */}
          {activeTab === 'defects' && (
            <div className="space-y-4">
              
              {/* Filter Panel */}
              <div className={`${themeClasses.cardBg} p-4 rounded-lg border space-y-3`}>
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
                  <div className={`flex items-center gap-2 text-xs font-bold ${themeClasses.headingText} uppercase tracking-wider`}>
                    <Filter className="w-4 h-4 text-[#003EA4] dark:text-blue-400" />
                    <span>Filter KYC Defects Registry</span>
                    <span className={`${themeClasses.mutedText} font-normal`}>({filteredDefects.length} of {defectsList.length} records matching)</span>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => {
                        setCaseTypeFilter('ALL');
                        setAnalystFilter('ALL');
                        setCategoryFilter('ALL');
                        setSearchQuery('');
                      }}
                      className={`px-2.5 py-1 text-xs ${themeClasses.mutedText} hover:text-neutral-900 dark:hover:text-white rounded flex items-center gap-1 border cursor-pointer ${darkMode ? 'border-neutral-700 bg-neutral-800' : 'border-neutral-200 bg-white'}`}
                    >
                      <RefreshCw className="w-3 h-3" /> Reset Filters
                    </button>
                    <button
                      onClick={() => showToast('Exported filtered defects registry to CSV')}
                      className={`px-2.5 py-1 text-xs ${darkMode ? 'bg-blue-950/40 border-blue-800 text-blue-300' : 'bg-white border-[#003EA4] text-[#003EA4]'} border hover:bg-blue-50 dark:hover:bg-blue-900/40 rounded font-semibold flex items-center gap-1 cursor-pointer`}
                    >
                      <Download className="w-3 h-3" /> Export View
                    </button>
                  </div>
                </div>

                <div className={`grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2 border-t ${darkMode ? 'border-[#1E2E4A]' : 'border-neutral-100'} text-xs`}>
                  <div>
                    <label className={`block text-[11px] font-semibold ${themeClasses.cyanTagText} mb-1`}>Case Type</label>
                    <select
                      value={caseTypeFilter}
                      onChange={(e) => setCaseTypeFilter(e.target.value)}
                      className={`w-full p-2 ${themeClasses.inputBg} rounded focus:border-[#003EA4] focus:outline-none cursor-pointer`}
                    >
                      <option value="ALL">All Case Types (Individual & Entity)</option>
                      <option value="Individual">Individual</option>
                      <option value="Entity">Entity</option>
                    </select>
                  </div>

                  <div>
                    <label className={`block text-[11px] font-semibold ${themeClasses.cyanTagText} mb-1`}>Assigned Analyst</label>
                    <select
                      value={analystFilter}
                      onChange={(e) => setAnalystFilter(e.target.value)}
                      className={`w-full p-2 ${themeClasses.inputBg} rounded focus:border-[#003EA4] focus:outline-none cursor-pointer`}
                    >
                      <option value="ALL">All Analysts</option>
                      {(teamUsers || []).filter(m => m && m.role === 'Analyst').map(a => (
                        <option key={a.id} value={a.name}>{a.name} ({a.status})</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className={`block text-[11px] font-semibold ${themeClasses.cyanTagText} mb-1`}>Category Area</label>
                    <select
                      value={categoryFilter}
                      onChange={(e) => setCategoryFilter(e.target.value)}
                      className={`w-full p-2 ${themeClasses.inputBg} rounded focus:border-[#003EA4] focus:outline-none cursor-pointer`}
                    >
                      <option value="ALL">All Categories</option>
                      <optgroup label="CORE Categories">
                        <option value="CIP">CIP</option>
                        <option value="Client Profile">Client Profile</option>
                        <option value="Risk">Risk</option>
                        <option value="SOW">SOW</option>
                        <option value="Periodic Review">Periodic Review</option>
                        <option value="Members">Members</option>
                        <option value="AML & Sanctions Screening">AML & Sanctions Screening</option>
                      </optgroup>
                      <optgroup label="APPENDIX Categories">
                        <option value="US Tab">US Tab</option>
                        <option value="Product Profile">Product Profile</option>
                        <option value="Transaction Review">Transaction Review</option>
                        <option value="HRAC">HRAC</option>
                        <option value="HRPU">HRPU</option>
                      </optgroup>
                    </select>
                  </div>
                </div>
              </div>

              {/* Full Registry Table */}
              <div className={`${themeClasses.cardBg} rounded-lg border overflow-hidden`}>
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead className={`${themeClasses.tableHeaderBg} border-b`}>
                      <tr>
                        <th className={`p-3 ${themeClasses.cyanTagText} font-bold uppercase tracking-wider text-[11px]`}>CCID</th>
                        <th className={`p-3 ${themeClasses.cyanTagText} font-bold uppercase tracking-wider text-[11px]`}>KYCID</th>
                        <th className={`p-3 ${themeClasses.cyanTagText} font-bold uppercase tracking-wider text-[11px]`}>Case Type</th>
                        <th className={`p-3 ${themeClasses.cyanTagText} font-bold uppercase tracking-wider text-[11px]`}>Analyst</th>
                        <th className={`p-3 ${themeClasses.cyanTagText} font-bold uppercase tracking-wider text-[11px]`}>Date</th>
                        <th className={`p-3 ${themeClasses.cyanTagText} font-bold uppercase tracking-wider text-[11px]`}>Involved Categories</th>
                        <th className={`p-3 ${themeClasses.cyanTagText} font-bold uppercase tracking-wider text-[11px]`}>QC Findings</th>
                        <th className={`p-3 ${themeClasses.cyanTagText} font-bold uppercase tracking-wider text-[11px]`}>Final Case ZIP</th>
                        <th className={`p-3 ${themeClasses.cyanTagText} font-bold uppercase tracking-wider text-[11px]`}>Read Status</th>
                        <th className={`p-3 text-right ${themeClasses.cyanTagText} font-bold uppercase tracking-wider text-[11px]`}>Actions</th>
                      </tr>
                    </thead>
                    <tbody className={themeClasses.tableBorder}>
                      {filteredDefects.length === 0 ? (
                        <tr>
                          <td colSpan="10" className={`text-center py-14 ${themeClasses.mutedText}`}>
                            <FileSearch className="w-10 h-10 mx-auto mb-2 opacity-40 text-[#003EA4] dark:text-blue-400" />
                            <p className={`font-bold text-sm ${themeClasses.headingText}`}>No defects found in registry</p>
                            <p className="text-xs mt-1">There are currently no recorded defects matching this view.</p>
                            <button
                              onClick={() => handleTabChange('new-defect')}
                              className="mt-3 px-4 py-2 bg-[#003EA4] hover:bg-[#002D72] text-white text-xs rounded-md font-semibold cursor-pointer shadow-xs"
                            >
                              + Enter New Defect
                            </button>
                          </td>
                        </tr>
                      ) : (
                        filteredDefects.map((defect, index) => {
                          const isReadByMe = (defect.readReceipts || []).some(r => r && r.userId === currentUserId);
                          const isOwner = defect.ownerId === currentUser.id;
                          const canEdit = currentUser.role === 'Admin' || currentUser.role === 'Manager' || isOwner;
                          const canDelete = currentUser.role === 'Admin' || currentUser.role === 'Manager' || isOwner;

                          return (
                            <tr
  key={defect.id || `${defect.ccid}-${defect.kycid}-${index}`}
                              onClick={() => {
                                setSelectedDefect(defect);
                                setIsDetailDrawerOpen(true);
                              }}
                              className={`${themeClasses.tableRowHover} cursor-pointer transition`}
                            >
                              <td className="p-3">
                                <div className="flex items-center gap-1 font-mono font-bold text-[#003EA4] dark:text-blue-400 text-xs">
                                  <span>{formatCcidDisplay(defect.ccid)}</span>
                                  <button
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      copyToClipboard(defect.ccid, 'CCID');
                                    }}
                                    className="p-0.5 text-neutral-400 hover:text-[#003EA4] dark:hover:text-blue-300 rounded cursor-pointer"
                                    title="Copy 16-digit CCID"
                                  >
                                    <Copy className="w-3 h-3" />
                                  </button>
                                </div>
                              </td>
                              <td className="p-3">
                                <div className={`flex items-center gap-1 font-mono ${themeClasses.headingText} font-semibold text-xs`}>
                                  <span>{defect.kycid}</span>
                                  <button
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      copyToClipboard(defect.kycid, 'KYCID');
                                    }}
                                    className="p-0.5 text-neutral-400 hover:text-[#003EA4] dark:hover:text-blue-300 rounded cursor-pointer"
                                    title="Copy KYCID (including KYC-)"
                                  >
                                    <Copy className="w-3 h-3" />
                                  </button>
                                </div>
                              </td>
                              <td className="p-3">
                                <span className={`inline-flex items-center px-2 py-0.5 rounded text-[10px] tracking-wide ${getCaseTypeBadgeClass(defect.caseType)}`}>
                                  {defect.caseType}
                                </span>
                              </td>
                              <td className={`p-3 ${themeClasses.headingText} font-medium`}>
                                <span>{defect.analystName}</span>
                                {isOwner && (
                                  <span className={`ml-1 text-[9px] px-1.5 py-0.2 rounded font-bold ${darkMode ? 'bg-blue-900/60 text-blue-300' : 'bg-blue-100 text-[#002D72]'}`}>YOU</span>
                                )}
                              </td>
                              <td className={`p-3 font-mono ${themeClasses.mutedText}`}>{defect.dateCreated}</td>
                              <td className="p-3">
                                <div className="flex flex-wrap gap-1 max-w-xs">
                                  {(defect.selectedCategories || []).map((c, idx) => (
                                    <span key={idx} className={`inline-flex items-center px-1.5 py-0.5 rounded text-[10px] tracking-tight ${getCategoryBadgeClass(c.section)}`}>
                                      <span className="opacity-75 font-semibold mr-1">{c.section}:</span>
                                      {c.name}
                                    </span>
                                  ))}
                                </div>
                              </td>
                              <td className="p-3">
                                <div className="inline-flex items-center gap-1 max-w-[140px]" title={defect.qcFile?.name}>
                                  <span className={`inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[10px] truncate ${getDocTypeBadgeClass('qc')}`}>
                                    <FileText className="w-3 h-3 text-red-600 dark:text-red-400 flex-shrink-0" />
                                    <span className="truncate">{defect.qcFile?.name}</span>
                                  </span>
                                </div>
                              </td>
                              <td className="p-3">
                                {defect.finalZipFile ? (
                                  <div className="inline-flex items-center gap-1 max-w-[140px]" title={defect.finalZipFile?.name}>
                                    <span className={`inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[10px] truncate ${getDocTypeBadgeClass('zip')}`}>
                                      <FolderArchive className="w-3 h-3 text-amber-700 dark:text-amber-400 flex-shrink-0" />
                                      <span className="truncate">{defect.finalZipFile?.name}</span>
                                    </span>
                                  </div>
                                ) : (
                                  <span className={`text-[11px] ${themeClasses.mutedText} italic`}>None attached</span>
                                )}
                              </td>
                              <td className="p-3" onClick={(e) => e.stopPropagation()}>
                                <button
                                  onClick={() => handleToggleRead(defect.ccid)}
                                  className={`flex items-center gap-1.5 px-2.5 py-1 rounded text-[10px] transition cursor-pointer ${getReadButtonClass(isReadByMe)}`}
                                  title={isReadByMe ? "Click to mark Unread" : "Click to mark Read"}
                                >
                                  {isReadByMe ? <CheckCheck className="w-3.5 h-3.5 text-white dark:text-emerald-400" /> : <Eye className="w-3.5 h-3.5 text-slate-600 dark:text-neutral-400" />}
                                  <span>{isReadByMe ? 'Acknowledged' : 'Mark Read'}</span>
                                  {(currentUser.role === 'Manager' || currentUser.role === 'Admin') && (
                                    <span className={`text-[9px] font-mono ${isReadByMe ? 'text-emerald-100 dark:text-emerald-300' : 'text-slate-500 dark:text-neutral-400'}`}>
                                      ({(defect.readReceipts || []).length}/16)
                                    </span>
                                  )}
                                </button>
                              </td>
                              <td className="p-3 text-right" onClick={(e) => e.stopPropagation()}>
                                <div className="flex items-center justify-end gap-1">
                                  {canEdit && (
                                    <button
                                      onClick={(e) => handleOpenEditModal(defect, e)}
                                      className="p-1 text-neutral-500 hover:text-[#003EA4] dark:hover:text-blue-300 hover:bg-blue-50 dark:hover:bg-blue-950/40 rounded cursor-pointer"
                                      title="Edit Defect Record"
                                    >
                                      <Edit3 className="w-3.5 h-3.5 text-[#003EA4] dark:text-blue-400" />
                                    </button>
                                  )}
                                  {canDelete && (
                                    <button
                                      onClick={(e) => handleDeleteDefect(defect, e)}
                                      className="p-1 text-neutral-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-950/40 rounded cursor-pointer"
                                      title="Delete Defect"
                                    >
                                      <Trash2 className="w-3.5 h-3.5 text-red-500" />
                                    </button>
                                  )}
                                  <button
                                    onClick={() => {
                                      setSelectedDefect(defect);
                                      setIsDetailDrawerOpen(true);
                                    }}
                                    className="px-2 py-1 bg-[#003EA4] hover:bg-[#002D72] text-white text-[11px] font-semibold rounded shadow-2xs ml-1 cursor-pointer"
                                  >
                                    Open
                                  </button>
                                </div>
                              </td>
                            </tr>
                          );
                        })
                      )}
                    </tbody>
                  </table>
                </div>

                {/* Table Footer */}
                <div className={`p-3 ${themeClasses.tableHeaderBg} border-t flex items-center justify-between text-xs ${themeClasses.mutedText}`}>
                  <span>Displaying {filteredDefects.length} of {defectsList.length} defect records</span>
                  <span className="font-mono text-[11px]">CCID (16 Digits) & KYCID (with KYC-)</span>
                </div>
              </div>

            </div>
          )}

          {/* ========================================================== */}
          {/* TAB 3: NEW DEFECT WORKFLOW (EXACTLY 3 STEPS)              */}
          {/* ========================================================== */}
          {activeTab === 'new-defect' && (
            <div className={`max-w-4xl mx-auto ${themeClasses.cardBg} rounded-lg border overflow-hidden`}>
              
              {/* Wizard Top Header */}
              <div className="p-5 bg-gradient-to-r from-[#003EA4] to-[#002D72] text-white flex items-center justify-between">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="bg-white/20 text-white font-mono text-xs px-2 py-0.5 rounded font-bold">
                      KYC Defect Intake Workflow
                    </span>
                    <span className="text-xs text-blue-200">Post-QC Case Logging</span>
                  </div>
                  <h3 className="text-base font-bold flex items-center gap-2">
                    <Plus className="w-5 h-5 text-blue-200" />
                    New KYC Defect Intake
                  </h3>
                  <p className="text-xs text-blue-100 mt-0.5">
                    Step 1 (Enter Defect) → Step 2 (QC Findings & Final ZIP) → Step 3 (Resolution & Review)
                  </p>
                </div>
                <div className="text-right">
                  <span className="text-[10px] uppercase tracking-wider text-blue-200 block font-semibold">Workflow Step</span>
                  <span className="text-xl font-bold text-white">{wizardStep} of 3</span>
                </div>
              </div>

              {/* 3 Step Navigation Indicator */}
              <div className={`grid grid-cols-3 ${themeClasses.tableHeaderBg} border-b text-xs font-semibold ${themeClasses.mutedText}`}>
                {[
                  { step: 1, label: 'Step 1 — Enter Defect', desc: 'CCID (16 Digits), KYCID, Case Type & Categories' },
                  { step: 2, label: 'Step 2 — QC Findings & Final ZIP', desc: 'Checker findings file & optional ZIP attachment' },
                  { step: 3, label: 'Step 3 — Resolution & Review', desc: 'Corrective action, comments & final review' },
                ].map(item => (
                  <button
                    key={item.step}
                    type="button"
                    onClick={() => setWizardStep(item.step)}
                    className={`p-3.5 text-left border-r cursor-pointer ${darkMode ? 'border-[#1E2E4A]' : 'border-[#E9ECEF]'} transition ${
                      wizardStep === item.step
                        ? `${darkMode ? 'bg-[#162746] text-blue-300 border-b-2 border-b-[#38BDF8]' : 'bg-white border-b-2 border-b-[#003EA4] text-[#003EA4]'} shadow-xs font-bold`
                        : `hover:bg-neutral-100 dark:hover:bg-white/5 font-medium ${themeClasses.mutedText}`
                    }`}
                  >
                    <div className="text-[12px]">{item.label}</div>
                    <div className={`text-[10px] ${themeClasses.mutedText} font-normal truncate`}>{item.desc}</div>
                  </button>
                ))}
              </div>

              <div className="p-6 space-y-6 text-xs">
                
                {/* STEP 1 — ENTER DEFECT */}
                {wizardStep === 1 && (
                  <div className="space-y-5">
                    <div>
                      <h4 className={`font-bold uppercase tracking-wider text-[11px] mb-2 ${themeClasses.cyanTagText} flex items-center gap-1.5`}>
                        <Building2 className="w-4 h-4" /> 1. Primary Case Identifiers
                      </h4>
                      
                      <div className={`grid grid-cols-1 md:grid-cols-2 gap-4 ${darkMode ? 'bg-[#0B1426]/70 border-[#1E2E4A]' : 'bg-blue-50/40 border-blue-100'} p-4 rounded-lg border`}>
                        <div>
                          <div className="flex items-center justify-between mb-1">
                            <label className={`font-semibold ${themeClasses.headingText}`}>
                              CCID (16-Digit Numeric ID) *
                            </label>
                            <span className={`text-[10px] ${themeClasses.mutedText} font-mono`}>
                              {formCcid.length}/16 digits
                            </span>
                          </div>
                          <input
                            type="text"
                            required
                            maxLength={16}
                            placeholder="e.g. 1234567890123456"
                            value={formCcid}
                            onChange={handleCcidChange}
                            className={`w-full p-2.5 ${themeClasses.inputBg} rounded focus:border-[#003EA4] focus:outline-none font-mono font-bold text-xs tracking-wider`}
                          />
                          <p className={`text-[10px] ${themeClasses.mutedText} mt-1`}>
                            Stored exactly as entered (numeric only). No prefix added.
                          </p>
                        </div>

                        <div>
                          <div className="flex items-center justify-between mb-1">
                            <label className={`font-semibold ${themeClasses.headingText}`}>
                              KYCID (from KIWI with KYC- prefix) *
                            </label>
                            <span className={`text-[10px] ${themeClasses.mutedText} font-mono`}>
                              As provided in KIWI
                            </span>
                          </div>
                          <input
                            type="text"
                            required
                            placeholder="e.g. KYC-123456789012"
                            value={formKycid}
                            onChange={handleKycidChange}
                            className={`w-full p-2.5 ${themeClasses.inputBg} rounded focus:border-[#003EA4] focus:outline-none font-mono font-bold text-xs`}
                          />
                          <p className={`text-[10px] ${themeClasses.mutedText} mt-1`}>
                            Preserved exactly as provided in KIWI (includes KYC-).
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className={`grid grid-cols-1 md:grid-cols-3 gap-4 pt-2 border-t ${darkMode ? 'border-[#1E2E4A]' : 'border-neutral-100'}`}>
                      <div>
                        <label className={`block font-semibold ${themeClasses.headingText} mb-1`}>
                          Case Type *
                        </label>
                        <div className="grid grid-cols-2 gap-2">
                          {['Individual', 'Entity'].map(type => (
                            <button
                              key={type}
                              type="button"
                              onClick={() => {
                                setFormCaseType(type);
                                setFormSelectedCategories([]);
                              }}
                              className={`py-2 px-3 rounded font-bold text-xs border text-center transition cursor-pointer ${
                                formCaseType === type
                                  ? 'bg-[#003EA4] text-white border-[#003EA4] shadow-xs'
                                  : `${darkMode ? 'bg-[#0B1426] text-neutral-300 border-neutral-700 hover:bg-[#1E2E4A]' : 'bg-white text-neutral-700 border-[#DEE2E6] hover:bg-neutral-50'}`
                              }`}
                            >
                              {type}
                            </button>
                          ))}
                        </div>
                      </div>

                      <div>
                        <label className={`block font-semibold ${themeClasses.headingText} mb-1`}>
                          Analyst *
                        </label>
                        <select
                          value={formAnalyst}
                          onChange={(e) => setFormAnalyst(e.target.value)}
                          className={`w-full p-2.5 ${themeClasses.inputBg} rounded focus:border-[#003EA4] focus:outline-none font-medium cursor-pointer`}
                        >
                          {(teamUsers || []).filter(u => u && u.role === 'Analyst' && u.status === 'Active').map(a => (
                            <option key={a.id} value={a.name}>{a.name}</option>
                          ))}
                        </select>
                      </div>

                      <div>
                        <label className={`block font-semibold ${themeClasses.headingText} mb-1`}>
                          Date *
                        </label>
                        <input
                          type="date"
                          value={formDate}
                          onChange={(e) => setFormDate(e.target.value)}
                          className={`w-full p-2.5 ${themeClasses.inputBg} rounded focus:border-[#003EA4] focus:outline-none font-mono cursor-pointer`}
                        />
                      </div>
                    </div>

                    <div className={`pt-2 border-t ${darkMode ? 'border-[#1E2E4A]' : 'border-neutral-100'}`}>
                      <label className={`block font-semibold ${themeClasses.headingText} mb-1`}>
                        Defect Explanation / Case Context *
                      </label>
                      <textarea
                        rows="3"
                        required
                        placeholder="Provide clear background context of the case and the identified deficiency..."
                        value={formExplanation}
                        onChange={(e) => setFormExplanation(e.target.value)}
                        className={`w-full p-2.5 ${themeClasses.inputBg} rounded focus:border-[#003EA4] focus:outline-none text-xs`}
                      ></textarea>
                    </div>

                    <div className={`pt-2 border-t ${darkMode ? 'border-[#1E2E4A]' : 'border-neutral-100'} space-y-3`}>
                      <div className="flex items-center justify-between">
                        <div>
                          <h4 className={`font-bold uppercase tracking-wider text-[11px] ${themeClasses.cyanTagText}`}>
                            Categories / Areas Involved ({formCaseType} Specific)
                          </h4>
                          <p className={`text-[11px] ${themeClasses.mutedText}`}>
                            Multi-select options. Periodic Review is maintained distinctly in CORE and APPENDIX.
                          </p>
                        </div>
                        <span className={`text-[11px] font-semibold ${darkMode ? 'bg-blue-950/60 text-blue-300 border-blue-800' : 'bg-[#EBF3FC] text-[#002D72] border-[#B9D5F7]'} px-2 py-0.5 rounded border`}>
                          {formSelectedCategories.length} areas selected
                        </span>
                      </div>

                      {/* CORE Categories Box */}
                      <div className={`p-3.5 ${themeClasses.innerBoxBg} rounded-lg border`}>
                        <div className={`flex items-center gap-2 mb-2 pb-1.5 border-b ${darkMode ? 'border-[#1E2E4A]' : 'border-neutral-200'}`}>
                          <span className="bg-[#003EA4] text-white text-[10px] font-bold px-2 py-0.5 rounded uppercase">
                            CORE
                          </span>
                          <span className={`text-[11px] font-semibold ${themeClasses.headingText}`}>
                            Core Case KYC Areas
                          </span>
                        </div>
                        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2">
                          {(CATEGORY_DEFINITIONS[formCaseType]?.CORE || []).map(cat => {
                            const isSelected = isCategorySelected('CORE', cat);
                            return (
                              <button
                                key={`core-${cat}`}
                                type="button"
                                onClick={() => toggleCategorySelection('CORE', cat)}
                                className={`p-2 rounded text-left text-xs border transition flex items-center justify-between cursor-pointer ${
                                  isSelected
                                    ? 'bg-[#003EA4] text-white border-[#003EA4] font-bold shadow-xs'
                                    : `${darkMode ? 'bg-[#111E38] text-neutral-300 border-neutral-700 hover:bg-[#1E2E4A]' : 'bg-white text-neutral-700 border-neutral-200 hover:bg-blue-50/50'}`
                                }`}
                              >
                                <span className="truncate">{cat}</span>
                                {isSelected ? (
                                  <Check className="w-3.5 h-3.5 text-white flex-shrink-0" />
                                ) : (
                                  <div className={`w-3.5 h-3.5 border ${darkMode ? 'border-neutral-600' : 'border-neutral-300'} rounded flex-shrink-0`} />
                                )}
                              </button>
                            );
                          })}
                        </div>
                      </div>

                      {/* APPENDIX Categories Box */}
                      <div className={`p-3.5 ${themeClasses.innerBoxBg} rounded-lg border`}>
                        <div className={`flex items-center gap-2 mb-2 pb-1.5 border-b ${darkMode ? 'border-[#1E2E4A]' : 'border-neutral-200'}`}>
                          <span className="bg-neutral-700 text-white text-[10px] font-bold px-2 py-0.5 rounded uppercase">
                            APPENDIX
                          </span>
                          <span className={`text-[11px] font-semibold ${themeClasses.headingText}`}>
                            Appendix & Supplemental Areas
                          </span>
                        </div>
                        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2">
                          {(CATEGORY_DEFINITIONS[formCaseType]?.APPENDIX || []).map(cat => {
                            const isSelected = isCategorySelected('APPENDIX', cat);
                            return (
                              <button
                                key={`appendix-${cat}`}
                                type="button"
                                onClick={() => toggleCategorySelection('APPENDIX', cat)}
                                className={`p-2 rounded text-left text-xs border transition flex items-center justify-between cursor-pointer ${
                                  isSelected
                                    ? 'bg-neutral-800 dark:bg-neutral-700 text-white border-neutral-800 font-bold shadow-xs'
                                    : `${darkMode ? 'bg-[#111E38] text-neutral-300 border-neutral-700 hover:bg-[#1E2E4A]' : 'bg-white text-neutral-700 border-neutral-200 hover:bg-neutral-100'}`
                                }`}
                              >
                                <span className="truncate">{cat}</span>
                                {isSelected ? (
                                  <Check className="w-3.5 h-3.5 text-white flex-shrink-0" />
                                ) : (
                                  <div className={`w-3.5 h-3.5 border ${darkMode ? 'border-neutral-600' : 'border-neutral-300'} rounded flex-shrink-0`} />
                                )}
                              </button>
                            );
                          })}
                        </div>
                      </div>

                    </div>

                    <div className={`flex justify-end pt-4 border-t ${darkMode ? 'border-[#1E2E4A]' : 'border-neutral-200'}`}>
                      <button
                        type="button"
                        onClick={() => {
                          if (!formCcid || formCcid.length !== 16) {
                            alert('Please enter a full 16-digit CCID numeric identifier.');
                            return;
                          }
                          if (!formKycid) {
                            alert('Please enter the KYCID with its KYC- prefix.');
                            return;
                          }
                          if (!formExplanation) {
                            alert('Please provide a defect explanation/context.');
                            return;
                          }
                          setWizardStep(2);
                        }}
                        className="px-5 py-2.5 bg-[#003EA4] hover:bg-[#002D72] text-white font-bold rounded flex items-center gap-2 shadow transition cursor-pointer"
                      >
                        <span>Proceed to Step 2 (QC Findings & Final ZIP)</span>
                        <ArrowRight className="w-4 h-4" />
                      </button>
                    </div>

                  </div>
                )}

                {/* STEP 2 — QC FINDINGS & FINAL ZIP */}
                {wizardStep === 2 && (
                  <div className="space-y-6">
                    <div>
                      <h4 className={`font-bold uppercase tracking-wider text-[11px] mb-1 ${themeClasses.cyanTagText} flex items-center gap-1.5`}>
                        <FileCheck className="w-4 h-4" /> Step 2: Checker QC Findings & Final Case ZIP
                      </h4>
                      <p className={`text-[11px] ${themeClasses.mutedText}`}>
                        Upload the findings file provided by the Checker. The final case ZIP attachment is optional.
                      </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      
                      {/* Area 1: QC Findings File (Required) */}
                      <div className={`${themeClasses.innerBoxBg} p-4 rounded-lg border flex flex-col justify-between`}>
                        <div>
                          <div className={`flex items-center gap-2 mb-2 pb-2 border-b ${darkMode ? 'border-neutral-700' : 'border-neutral-200'}`}>
                            <span className="p-1.5 bg-red-100 text-red-700 rounded"><FileText className="w-4 h-4" /></span>
                            <div>
                              <h5 className={`font-bold text-xs ${themeClasses.headingText}`}>QC Findings *</h5>
                              <p className={`text-[10px] ${themeClasses.mutedText}`}>Checker findings file provided by QC</p>
                            </div>
                          </div>

                          {uploadedQcFile ? (
                            <div className={`p-3 ${themeClasses.cardBg} rounded border border-emerald-300 shadow-xs mb-3 flex items-center justify-between`}>
                              <div className="flex items-center gap-2">
                                <FileText className="w-5 h-5 text-red-600 flex-shrink-0" />
                                <div>
                                  <span className={`font-bold ${themeClasses.headingText} block truncate max-w-[180px]`}>{uploadedQcFile.name}</span>
                                  <span className={`text-[10px] ${themeClasses.mutedText}`}>{uploadedQcFile.size} • Uploaded</span>
                                </div>
                              </div>
                              <button
                                type="button"
                                onClick={() => setUploadedQcFile(null)}
                                className="text-red-500 hover:text-red-700 p-1 cursor-pointer"
                                title="Remove file"
                              >
                                <X className="w-4 h-4" />
                              </button>
                            </div>
                          ) : (
                            <div className={`border-2 border-dashed ${darkMode ? 'border-red-900/50 bg-[#0B1426]' : 'border-red-300/60 bg-white'} p-4 rounded-lg text-center space-y-2 mb-3`}>
                              <UploadCloud className="w-6 h-6 mx-auto text-red-600" />
                              <p className={`font-semibold ${themeClasses.headingText} text-xs`}>Upload Checker Findings File</p>
                              <p className={`text-[10px] ${themeClasses.mutedText}`}>PDF, DOCX, or scan file provided by QC Checker</p>
                              
                              <div className="pt-2 flex gap-1.5">
                                <input
                                  type="text"
                                  placeholder="e.g. QC_Findings_Report.pdf"
                                  value={qcFileName}
                                  onChange={(e) => setQcFileName(e.target.value)}
                                  className={`flex-1 p-1.5 ${themeClasses.inputBg} rounded text-xs focus:outline-none`}
                                />
                                <button
                                  type="button"
                                  onClick={() => {
                                    if (!qcFileName) return alert('Enter a file name');
                                    setUploadedQcFile({
                                      id: `QC-${Date.now().toString().slice(-4)}`,
                                      name: qcFileName.includes('.') ? qcFileName : `${qcFileName}.pdf`,
                                      size: `${(Math.random() * 2 + 0.8).toFixed(1)} MB`,
                                      uploadDate: new Date().toISOString().replace('T', ' ').substring(0, 16)
                                    });
                                    setQcFileName('');
                                    showToast('Attached Checker QC Findings file.');
                                  }}
                                  className="px-3 py-1.5 bg-red-600 hover:bg-red-700 text-white font-bold rounded text-xs cursor-pointer"
                                >
                                  Attach
                                </button>
                              </div>
                            </div>
                          )}
                        </div>

                        <div className="text-[10px] font-medium">
                          Status: {uploadedQcFile ? <span className="text-emerald-600 dark:text-emerald-400 font-bold">✓ Attached</span> : <span className="text-red-600">Required file</span>}
                        </div>
                      </div>

                      {/* Area 2: Final ZIP (OPTIONAL) */}
                      <div className={`${themeClasses.innerBoxBg} p-4 rounded-lg border flex flex-col justify-between`}>
                        <div>
                          <div className={`flex items-center gap-2 mb-2 pb-2 border-b ${darkMode ? 'border-neutral-700' : 'border-neutral-200'}`}>
                            <span className="p-1.5 bg-amber-100 text-amber-700 rounded"><FolderArchive className="w-4 h-4" /></span>
                            <div>
                              <div className="flex items-center gap-1.5">
                                <h5 className={`font-bold text-xs ${themeClasses.headingText}`}>Final ZIP</h5>
                                <span className="text-[9px] bg-neutral-200 dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300 px-1.5 py-0.2 rounded font-semibold uppercase">
                                  Optional
                                </span>
                              </div>
                              <p className={`text-[10px] ${themeClasses.mutedText}`}>Optional ZIP attachment for completed case pack</p>
                            </div>
                          </div>

                          {uploadedFinalZip ? (
                            <div className={`p-3 ${themeClasses.cardBg} rounded border border-emerald-300 shadow-xs mb-3 flex items-center justify-between`}>
                              <div className="flex items-center gap-2">
                                <FolderArchive className="w-5 h-5 text-amber-600 flex-shrink-0" />
                                <div>
                                  <span className={`font-bold ${themeClasses.headingText} block truncate max-w-[180px]`}>{uploadedFinalZip.name}</span>
                                  <span className={`text-[10px] ${themeClasses.mutedText}`}>{uploadedFinalZip.size} • ZIP Archive</span>
                                </div>
                              </div>
                              <button
                                type="button"
                                onClick={() => setUploadedFinalZip(null)}
                                className="text-red-500 hover:text-red-700 p-1 cursor-pointer"
                                title="Remove ZIP"
                              >
                                <X className="w-4 h-4" />
                              </button>
                            </div>
                          ) : (
                            <div className={`border-2 border-dashed ${darkMode ? 'border-neutral-700 bg-[#0B1426]' : 'border-neutral-300 bg-white'} p-4 rounded-lg text-center space-y-2 mb-3`}>
                              <UploadCloud className="w-6 h-6 mx-auto text-neutral-400" />
                              <p className={`font-semibold ${themeClasses.headingText} text-xs`}>Optional Final Case ZIP</p>
                              <p className={`text-[10px] ${themeClasses.mutedText}`}>Attach complete dossier archive if available</p>
                              
                              <div className="pt-2 flex gap-1.5">
                                <input
                                  type="text"
                                  placeholder="e.g. Case_Package_Final.zip"
                                  value={finalZipName}
                                  onChange={(e) => setFinalZipName(e.target.value)}
                                  className={`flex-1 p-1.5 ${themeClasses.inputBg} rounded text-xs focus:outline-none`}
                                />
                                <button
                                  type="button"
                                  onClick={() => {
                                    if (!finalZipName) return;
                                    setUploadedFinalZip({
                                      id: `ZIP-${Date.now().toString().slice(-4)}`,
                                      name: finalZipName.endsWith('.zip') ? finalZipName : `${finalZipName}.zip`,
                                      size: `${(Math.random() * 5 + 3.0).toFixed(1)} MB`,
                                      uploadDate: new Date().toISOString().replace('T', ' ').substring(0, 16)
                                    });
                                    setFinalZipName('');
                                    showToast('Attached Optional Final Case ZIP file.');
                                  }}
                                  className="px-3 py-1.5 bg-neutral-800 dark:bg-neutral-700 hover:bg-neutral-900 text-white font-bold rounded text-xs cursor-pointer"
                                >
                                  Attach
                                </button>
                              </div>
                            </div>
                          )}
                        </div>

                        <div className={`text-[10px] ${themeClasses.mutedText} italic`}>
                          Optional: You may proceed to Step 3 without uploading a ZIP file.
                        </div>
                      </div>

                    </div>

                    {/* Step 2 Footer Navigation */}
                    <div className={`flex justify-between pt-4 border-t ${darkMode ? 'border-[#1E2E4A]' : 'border-neutral-200'}`}>
                      <button
                        type="button"
                        onClick={() => setWizardStep(1)}
                        className={`px-4 py-2 border ${darkMode ? 'border-neutral-700 text-neutral-300 hover:bg-neutral-800' : 'border-neutral-300 text-neutral-600 hover:bg-neutral-50'} rounded font-semibold cursor-pointer`}
                      >
                        Back to Step 1
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          if (!uploadedQcFile) {
                            alert('Please upload the QC Findings file before proceeding.');
                            return;
                          }
                          setWizardStep(3);
                        }}
                        className="px-5 py-2.5 bg-[#003EA4] hover:bg-[#002D72] text-white font-bold rounded flex items-center gap-2 shadow transition cursor-pointer"
                      >
                        <span>Proceed to Step 3 (Resolution & Review)</span>
                        <ArrowRight className="w-4 h-4" />
                      </button>
                    </div>

                  </div>
                )}

                {/* STEP 3 — RESOLUTION & REVIEW */}
                {wizardStep === 3 && (
                  <div className="space-y-6">
                    <div>
                      <h4 className={`font-bold uppercase tracking-wider text-[11px] mb-1 ${themeClasses.cyanTagText} flex items-center gap-1.5`}>
                        <CheckCircle2 className="w-4 h-4 text-emerald-600" /> Step 3: Resolution Information & Final Review
                      </h4>
                      <p className={`text-[11px] ${themeClasses.mutedText}`}>
                        Record corrective remediation action taken and verify defect details before adding to the permanent registry.
                      </p>
                    </div>

                    {/* Resolution Details Form */}
                    <div className={`p-4 ${themeClasses.innerBoxBg} rounded-lg border space-y-4`}>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className={`block font-semibold ${themeClasses.headingText} mb-1`}>
                            Corrective Action Taken *
                          </label>
                          <input
                            type="text"
                            required
                            placeholder="e.g. Obtained certified registry certificate and refreshed profile"
                            value={resCorrectiveAction}
                            onChange={(e) => setResCorrectiveAction(e.target.value)}
                            className={`w-full p-2.5 ${themeClasses.inputBg} rounded focus:border-[#003EA4] focus:outline-none text-xs font-medium`}
                          />
                        </div>
                        <div className="grid grid-cols-2 gap-2">
                          <div>
                            <label className={`block font-semibold ${themeClasses.headingText} mb-1`}>Resolved By</label>
                            <select
                              value={resResolvedBy}
                              onChange={(e) => setResResolvedBy(e.target.value)}
                              className={`w-full p-2.5 ${themeClasses.inputBg} rounded focus:border-[#003EA4] focus:outline-none text-xs cursor-pointer`}
                            >
                              {(teamUsers || []).map(u => (
                                <option key={u.id} value={u.name}>{u.name}</option>
                              ))}
                            </select>
                          </div>
                          <div>
                            <label className={`block font-semibold ${themeClasses.headingText} mb-1`}>Resolution Date</label>
                            <input
                              type="date"
                              value={resDate}
                              onChange={(e) => setResDate(e.target.value)}
                              className={`w-full p-2.5 ${themeClasses.inputBg} rounded focus:border-[#003EA4] focus:outline-none text-xs font-mono cursor-pointer`}
                            />
                          </div>
                        </div>
                      </div>

                      <div>
                        <label className={`block font-semibold ${themeClasses.headingText} mb-1`}>
                          Resolution Comment / Detailed Explanation *
                        </label>
                        <textarea
                          rows="3"
                          required
                          placeholder="Explain how the defect was resolved and validated..."
                          value={resComment}
                          onChange={(e) => setResComment(e.target.value)}
                          className={`w-full p-2.5 ${themeClasses.inputBg} rounded focus:border-[#003EA4] focus:outline-none text-xs`}
                        ></textarea>
                      </div>

                      {/* Optional Resolution Evidence */}
                      <div className={`pt-2 border-t ${darkMode ? 'border-neutral-700' : 'border-neutral-200'}`}>
                        <label className={`block font-semibold ${themeClasses.headingText} mb-1`}>
                          Optional Resolution Evidence (Supporting Docs)
                        </label>
                        <div className="flex gap-2 mb-2">
                          <input
                            type="text"
                            placeholder="File name (e.g. Updated_Certificate_Incumbency.pdf)"
                            value={resEvidenceName}
                            onChange={(e) => setResEvidenceName(e.target.value)}
                            className={`flex-1 p-2 ${themeClasses.inputBg} rounded text-xs focus:outline-none`}
                          />
                          <button
                            type="button"
                            onClick={() => {
                              if (!resEvidenceName) return;
                              setResEvidenceFiles([
                                ...resEvidenceFiles,
                                {
                                  id: `RES-${Date.now().toString().slice(-4)}`,
                                  name: resEvidenceName.includes('.') ? resEvidenceName : `${resEvidenceName}.pdf`,
                                  size: `${(Math.random() * 2 + 1.0).toFixed(1)} MB`
                                }
                              ]);
                              setResEvidenceName('');
                              showToast('Added resolution evidence file.');
                            }}
                            className={`px-3 py-2 ${darkMode ? 'bg-neutral-800 text-neutral-200' : 'bg-neutral-200 text-neutral-800'} hover:opacity-90 font-semibold rounded text-xs cursor-pointer`}
                          >
                            + Add File
                          </button>
                        </div>

                        {resEvidenceFiles.length > 0 && (
                          <div className="space-y-1">
                            {resEvidenceFiles.map((f, i) => (
                              <div key={i} className={`flex items-center justify-between p-2 ${themeClasses.cardBg} rounded border ${darkMode ? 'border-neutral-700' : 'border-neutral-200'} text-xs`}>
                                <span className={`font-semibold ${themeClasses.headingText} flex items-center gap-1.5`}>
                                  <FileText className="w-3.5 h-3.5 text-blue-600" /> {f.name} ({f.size})
                                </span>
                                <button
                                  type="button"
                                  onClick={() => setResEvidenceFiles(resEvidenceFiles.filter((_, idx) => idx !== i))}
                                  className="text-red-500 hover:text-red-700 cursor-pointer"
                                >
                                  <X className="w-3.5 h-3.5" />
                                </button>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Final Review & Confirmation Summary Box */}
                    <div className={`p-4 rounded-lg border space-y-3 ${darkMode ? 'bg-[#0B1426] border-[#1E2E4A]' : 'bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200'}`}>
                      <div className="flex items-center justify-between">
                        <span className={`font-bold text-xs ${themeClasses.cyanTagText} uppercase tracking-wider flex items-center gap-1.5`}>
                          <CheckCheck className="w-4 h-4" /> Final Review & Confirmation
                        </span>
                        <span className={`text-[11px] font-mono ${themeClasses.mutedText}`}>
                          CCID: <strong className={themeClasses.headingText}>{formCcid || 'N/A'}</strong> | KYCID: <strong className={themeClasses.headingText}>{formKycid || 'N/A'}</strong>
                        </span>
                      </div>

                      <div className={`grid grid-cols-2 sm:grid-cols-4 gap-3 text-[11px] pt-2 border-t ${darkMode ? 'border-[#1E2E4A]' : 'border-blue-200/60'}`}>
                        <div>
                          <span className={`${themeClasses.mutedText} block`}>Case Type:</span>
                          <span className={`font-bold ${themeClasses.headingText}`}>{formCaseType}</span>
                        </div>
                        <div>
                          <span className={`${themeClasses.mutedText} block`}>Analyst:</span>
                          <span className={`font-bold ${themeClasses.headingText}`}>{formAnalyst}</span>
                        </div>
                        <div>
                          <span className={`${themeClasses.mutedText} block`}>QC File:</span>
                          <span className={`font-bold ${themeClasses.headingText} truncate block`}>{uploadedQcFile?.name || 'Attached'}</span>
                        </div>
                        <div>
                          <span className={`${themeClasses.mutedText} block`}>Final ZIP:</span>
                          <span className={`font-bold ${themeClasses.headingText} truncate block`}>{uploadedFinalZip?.name || 'None (Optional)'}</span>
                        </div>
                      </div>

                      <div className={`pt-2 border-t ${darkMode ? 'border-[#1E2E4A]' : 'border-blue-200/60'} text-[11px]`}>
                        <span className={`${themeClasses.mutedText} block mb-1`}>Selected Categories ({formSelectedCategories.length}):</span>
                        <div className="flex flex-wrap gap-1">
                          {formSelectedCategories.map((c, idx) => (
                            <span key={idx} className={`px-1.5 py-0.5 rounded text-[10px] ${getCategoryBadgeClass(c.section)}`}>
                              {c.section}: {c.name}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>

                    {/* Final Action Submission */}
                    <div className={`flex justify-between pt-4 border-t ${darkMode ? 'border-[#1E2E4A]' : 'border-neutral-200'}`}>
                      <button
                        type="button"
                        onClick={() => setWizardStep(2)}
                        className={`px-4 py-2 border ${darkMode ? 'border-neutral-700 text-neutral-300 hover:bg-neutral-800' : 'border-neutral-300 text-neutral-600 hover:bg-neutral-50'} rounded font-semibold cursor-pointer`}
                      >
                        Back to Step 2
                      </button>
                      <button
                        type="button"
                        onClick={handleFinalSubmitDefect}
                        className="px-6 py-2.5 bg-[#003EA4] hover:bg-[#002D72] text-white font-bold rounded flex items-center gap-2 shadow-md transition cursor-pointer"
                      >
                        <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                        <span>Complete & Submit Defect Record</span>
                      </button>
                    </div>

                  </div>
                )}

              </div>
            </div>
          )}

          {/* ========================================================== */}
          {/* TAB 4: EVIDENCE VAULT                                      */}
          {/* ========================================================== */}
          {activeTab === 'evidence' && (
            <div className="space-y-4">
              <div className={`${themeClasses.cardBg} p-5 rounded-lg border flex flex-col md:flex-row md:items-center justify-between gap-4`}>
                <div>
                  <h3 className={`font-bold text-sm ${themeClasses.headingText} flex items-center gap-2`}>
                    <FileCheck className="w-4 h-4 text-[#003EA4] dark:text-blue-400" />
                    Evidence & Findings Document Vault
                  </h3>
                  <p className={`text-xs ${themeClasses.mutedText} mt-0.5`}>
                    Centralized repository for Checker findings files, completed case ZIP archives, and resolution documents.
                  </p>
                </div>
                <button
                  onClick={() => showToast('Simulated Document Upload')}
                  className="px-3.5 py-1.5 bg-[#003EA4] hover:bg-[#002D72] text-white text-xs font-semibold rounded shadow-sm flex items-center gap-1.5 cursor-pointer"
                >
                  <UploadCloud className="w-4 h-4" />
                  <span>Upload Document</span>
                </button>
              </div>

              {/* Evidence Table */}
              <div className={`${themeClasses.cardBg} rounded-lg border overflow-hidden`}>
                <table className="w-full text-left text-xs">
                  <thead className={`${themeClasses.tableHeaderBg} border-b`}>
                    <tr>
                      <th className={`p-3 ${themeClasses.cyanTagText} font-bold uppercase tracking-wider text-[11px]`}>File ID</th>
                      <th className={`p-3 ${themeClasses.cyanTagText} font-bold uppercase tracking-wider text-[11px]`}>File Name</th>
                      <th className={`p-3 ${themeClasses.cyanTagText} font-bold uppercase tracking-wider text-[11px]`}>Document Type</th>
                      <th className={`p-3 ${themeClasses.cyanTagText} font-bold uppercase tracking-wider text-[11px]`}>Linked CCID</th>
                      <th className={`p-3 ${themeClasses.cyanTagText} font-bold uppercase tracking-wider text-[11px]`}>Uploaded By</th>
                      <th className={`p-3 ${themeClasses.cyanTagText} font-bold uppercase tracking-wider text-[11px]`}>Date</th>
                      <th className={`p-3 text-right ${themeClasses.cyanTagText} font-bold uppercase tracking-wider text-[11px]`}>Actions</th>
                    </tr>
                  </thead>
                  <tbody className={themeClasses.tableBorder}>
                    {allEvidenceFiles.length === 0 ? (
                      <tr>
                        <td colSpan="7" className={`text-center py-12 ${themeClasses.mutedText}`}>
                          <FolderArchive className="w-8 h-8 mx-auto mb-2 opacity-40 text-neutral-400" />
                          <p className="font-semibold text-xs">No evidence documents currently stored in vault.</p>
                        </td>
                      </tr>
                    ) : (
                      allEvidenceFiles.map((file, idx) => (
                        <tr key={idx} className={`${themeClasses.tableRowHover} transition`}>
                          <td className="p-3 font-mono font-bold text-[#003EA4] dark:text-blue-400">{file.id}</td>
                          <td className="p-3">
                            <div className={`font-semibold ${themeClasses.headingText} flex items-center gap-1.5`}>
                              <FileText className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
                              {file.fileName}
                            </div>
                            <div className={`text-[10px] ${themeClasses.mutedText}`}>{file.size}</div>
                          </td>
                          <td className="p-3">
                            <span className={`inline-flex items-center px-1.5 py-0.5 rounded text-[10px] ${getDocTypeBadgeClass(file.tag)}`}>
                              {file.fileType}
                            </span>
                          </td>
                          <td className="p-3 font-mono font-semibold text-xs text-[#003EA4] dark:text-blue-400">{formatCcidDisplay(file.ccid)}</td>
                          <td className={`p-3 ${themeClasses.headingText}`}>{file.uploadedBy}</td>
                          <td className={`p-3 ${themeClasses.mutedText} font-mono text-[11px]`}>{file.date}</td>
                          <td className="p-3 text-right">
                            <button
                              onClick={() => showToast(`Downloading ${file.fileName}`)}
                              className="p-1 text-neutral-500 hover:text-[#003EA4] dark:hover:text-blue-300 rounded cursor-pointer"
                              title="Download File"
                            >
                              <Download className="w-4 h-4" />
                            </button>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* ========================================================== */}
          {/* TAB 5: TEAM & ROSTER                                       */}
          {/* ========================================================== */}
          {activeTab === 'team' && (
            <div className="space-y-6">
              
              {/* Header */}
              <div className={`${themeClasses.cardBg} p-5 rounded-lg border flex flex-col md:flex-row md:items-center justify-between gap-4`}>
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="bg-[#003EA4] text-white text-[10px] font-bold px-2 py-0.5 rounded">
                      KYC Operations Team
                    </span>
                    <span className={`text-xs ${themeClasses.mutedText}`}>1 QA Manager • {(teamUsers || []).filter(u => u && u.status === 'Active' && u.role === 'Analyst').length} Active Analysts</span>
                  </div>
                  <h3 className={`text-base font-bold ${themeClasses.headingText}`}>Team Capacity & Analyst Management</h3>
                  <p className={`text-xs ${themeClasses.mutedText} mt-0.5`}>
                    View team roster and manage active members. Historical activity remains preserved when analysts are decommissioned.
                  </p>
                </div>
                
                {/* Manager/Admin Add Analyst Button */}
                {(currentUser.role === 'Manager' || currentUser.role === 'Admin') && (
                  <button
                    onClick={() => setIsAddUserModalOpen(true)}
                    className="px-3.5 py-1.5 bg-[#003EA4] hover:bg-[#002D72] text-white text-xs font-semibold rounded shadow-sm flex items-center gap-1.5 cursor-pointer"
                  >
                    <UserPlus className="w-4 h-4" />
                    <span>Add New Analyst</span>
                  </button>
                )}
              </div>

              {/* Roster Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {(teamUsers || []).map(member => {
                  const defectCount = (defectsList || []).filter(d => d && d.analystName === member.name).length;
                  const isDecommissioned = member.status === 'Decommissioned';

                  return (
                    <div key={member.id} className={`${themeClasses.cardBg} p-4 rounded-lg border hover:shadow transition flex flex-col justify-between ${isDecommissioned ? 'opacity-60 border-dashed' : ''}`}>
                      <div>
                        <div className="flex items-start justify-between mb-2">
                          <div className="flex items-center gap-2.5">
                            <div className="w-9 h-9 rounded-full bg-blue-100 dark:bg-blue-900 text-[#003EA4] dark:text-blue-200 font-bold text-xs flex items-center justify-center border border-blue-200 dark:border-blue-800">
                              {member.initials}
                            </div>
                            <div>
                              <h5 className={`font-bold text-xs ${themeClasses.headingText}`}>{member.name}</h5>
                              <span className={`text-[10px] ${themeClasses.mutedText} font-mono`}>{member.id} • {member.role}</span>
                            </div>
                          </div>
                          <span className={`text-[10px] px-2 py-0.5 rounded-full font-semibold ${
                            isDecommissioned 
                              ? 'bg-neutral-200 text-neutral-600 dark:bg-neutral-800 dark:text-neutral-400' 
                              : 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800'
                          }`}>
                            {member.status}
                          </span>
                        </div>

                        <div className={`p-2 rounded text-[11px] mb-3 ${darkMode ? 'bg-[#0B1426]' : 'bg-neutral-50'} text-neutral-600 dark:text-neutral-300`}>
                          <span className={`${themeClasses.mutedText}`}>Email: </span>
                          <span className="font-mono">{member.email}</span>
                        </div>
                      </div>

                      <div className={`pt-2 border-t ${darkMode ? 'border-[#1E2E4A]' : 'border-neutral-100'} flex items-center justify-between text-xs`}>
                        <span className={`${themeClasses.mutedText}`}>
                          Handled Defects: <strong className={themeClasses.headingText}>{defectCount}</strong>
                        </span>

                        {/* Remove button for Manager/Admin on active analysts */}
                        {(currentUser.role === 'Manager' || currentUser.role === 'Admin') && member.role === 'Analyst' && !isDecommissioned && (
                          <button
                            onClick={() => handleRemoveAnalyst(member)}
                            className="text-red-500 hover:text-red-700 text-[11px] font-semibold hover:underline cursor-pointer"
                          >
                            Decommission
                          </button>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>

            </div>
          )}

        </main>
      </div>

      {/* ============================================================ */}
      {/* 3. DEFECT DETAIL DRAWER                                      */}
      {/* ============================================================ */}
      {isDetailDrawerOpen && selectedDefect && (
        <div className="fixed inset-0 z-50 flex justify-end bg-black/50 backdrop-blur-xs transition-opacity">
          <div className={`w-full max-w-xl ${themeClasses.cardBg} h-full shadow-2xl flex flex-col justify-between overflow-y-auto animate-in slide-in-from-right duration-200 border-l ${darkMode ? 'border-[#1E2E4A]' : 'border-neutral-200'}`}>
            
            {/* Drawer Header */}
            <div>
              <div className="p-5 bg-[#002D72] text-white flex items-center justify-between">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-mono text-xs bg-white/20 px-2 py-0.5 rounded font-bold">
                      CCID: {formatCcidDisplay(selectedDefect.ccid)}
                    </span>
                    <span className={`text-[10px] px-2 py-0.5 rounded font-semibold ${getCaseTypeBadgeClass(selectedDefect.caseType)}`}>
                      {selectedDefect.caseType}
                    </span>
                  </div>
                  <h3 className="text-base font-bold text-white font-mono">{selectedDefect.kycid}</h3>
                  <p className="text-xs text-blue-200 font-medium">Logged by {selectedDefect.analystName} on {selectedDefect.dateCreated}</p>
                </div>
                <button
                  onClick={() => setIsDetailDrawerOpen(false)}
                  className="p-1.5 text-blue-200 hover:text-white hover:bg-white/10 rounded-full cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Drawer Body Content */}
              <div className="p-6 space-y-5 text-xs">
                
                {/* 1. Analyst Context Section */}
                <div>
                  <h4 className={`font-bold uppercase tracking-wider text-[11px] mb-1.5 ${themeClasses.cyanTagText}`}>
                    1. Analyst Explanation & Case Context
                  </h4>
                  <div className={`p-3 rounded border ${darkMode ? 'bg-[#0B1426] border-[#1E2E4A]' : 'bg-blue-50/40 border-blue-100'}`}>
                    <p className={`text-xs ${themeClasses.headingText} leading-relaxed`}>{selectedDefect.explanation}</p>
                  </div>
                </div>

                {/* Categories Breakdown */}
                <div>
                  <h4 className={`font-bold uppercase tracking-wider text-[11px] mb-1.5 ${themeClasses.cyanTagText}`}>
                    Selected Involved Areas
                  </h4>
                  <div className="flex flex-wrap gap-1.5">
                    {(selectedDefect.selectedCategories || []).map((c, i) => (
                      <span key={i} className={`inline-flex items-center px-2 py-0.5 rounded text-[11px] ${getCategoryBadgeClass(c.section)}`}>
                        <span className="opacity-75 font-semibold mr-1">{c.section}:</span>
                        {c.name}
                      </span>
                    ))}
                  </div>
                </div>

                {/* 2. QC Findings File Section */}
                <div>
                  <h4 className={`font-bold uppercase tracking-wider text-[11px] mb-1.5 ${themeClasses.cyanTagText}`}>
                    2. QC Findings Document (from Checker)
                  </h4>
                  {selectedDefect.qcFile ? (
                    <div className={`p-3 rounded border ${darkMode ? 'bg-[#0B1426] border-[#1E2E4A]' : 'bg-neutral-50 border-neutral-200'} flex items-center justify-between`}>
                      <div className="flex items-center gap-2">
                        <FileText className="w-5 h-5 text-red-500 flex-shrink-0" />
                        <div>
                          <span className={`font-bold text-xs ${themeClasses.headingText} block`}>{selectedDefect.qcFile.name}</span>
                          <span className={`text-[10px] ${themeClasses.mutedText}`}>{selectedDefect.qcFile.size} • Uploaded {selectedDefect.qcFile.uploadDate || selectedDefect.dateCreated}</span>
                        </div>
                      </div>
                      <button
                        onClick={() => showToast(`Downloading ${selectedDefect.qcFile.name}`)}
                        className="p-1.5 text-neutral-500 hover:text-[#003EA4] rounded cursor-pointer"
                        title="Download QC Findings"
                      >
                        <Download className="w-4 h-4" />
                      </button>
                    </div>
                  ) : (
                    <p className={`text-[11px] ${themeClasses.mutedText} italic`}>No QC findings file attached.</p>
                  )}
                </div>

                {/* Final Case ZIP Section */}
                <div>
                  <h4 className={`font-bold uppercase tracking-wider text-[11px] mb-1.5 ${themeClasses.cyanTagText}`}>
                    Final Case Package ZIP
                  </h4>
                  {selectedDefect.finalZipFile ? (
                    <div className={`p-3 rounded border ${darkMode ? 'bg-[#0B1426] border-[#1E2E4A]' : 'bg-neutral-50 border-neutral-200'} flex items-center justify-between`}>
                      <div className="flex items-center gap-2">
                        <FolderArchive className="w-5 h-5 text-amber-500 flex-shrink-0" />
                        <div>
                          <span className={`font-bold text-xs ${themeClasses.headingText} block`}>{selectedDefect.finalZipFile.name}</span>
                          <span className={`text-[10px] ${themeClasses.mutedText}`}>{selectedDefect.finalZipFile.size} • ZIP Archive</span>
                        </div>
                      </div>
                      <button
                        onClick={() => showToast(`Downloading ${selectedDefect.finalZipFile.name}`)}
                        className="p-1.5 text-neutral-500 hover:text-[#003EA4] rounded cursor-pointer"
                        title="Download ZIP"
                      >
                        <Download className="w-4 h-4" />
                      </button>
                    </div>
                  ) : (
                    <p className={`text-[11px] ${themeClasses.mutedText} italic`}>Optional final ZIP was not attached for this record.</p>
                  )}
                </div>

                {/* 3. Resolution Section */}
                <div>
                  <h4 className={`font-bold uppercase tracking-wider text-[11px] mb-1.5 ${themeClasses.cyanTagText}`}>
                    3. Resolution & Corrective Action
                  </h4>
                  <div className={`p-3 rounded border space-y-2 ${darkMode ? 'bg-[#0B1426] border-[#1E2E4A]' : 'bg-neutral-50 border-neutral-200'}`}>
                    <div>
                      <span className={`font-semibold ${themeClasses.mutedText} block text-[10px] uppercase`}>Corrective Action:</span>
                      <p className={`text-xs ${themeClasses.headingText}`}>{selectedDefect.resolution?.correctiveAction || 'None specified'}</p>
                    </div>
                    <div>
                      <span className={`font-semibold ${themeClasses.mutedText} block text-[10px] uppercase`}>Resolution Comment:</span>
                      <p className={`text-xs ${themeClasses.headingText}`}>{selectedDefect.resolution?.comment || 'None specified'}</p>
                    </div>
                    <div className="flex justify-between pt-1 border-t border-neutral-200 dark:border-neutral-700 text-[10px]">
                      <span className={themeClasses.mutedText}>Resolved By: <strong className={themeClasses.headingText}>{selectedDefect.resolution?.resolvedBy || selectedDefect.analystName}</strong></span>
                      <span className={themeClasses.mutedText}>Date: <strong className={themeClasses.headingText}>{selectedDefect.resolution?.resolutionDate || selectedDefect.dateCreated}</strong></span>
                    </div>
                  </div>
                </div>

                {/* 4. Read & Acknowledgment Status Section */}
                <div>
                  <h4 className={`font-bold uppercase tracking-wider text-[11px] mb-1.5 ${themeClasses.cyanTagText}`}>
                    4. Read & Acknowledgment Status
                  </h4>

                  {/* Analyst view: sees only own state */}
                  {currentUser.role === 'Analyst' && (
                    <div className={`p-3 rounded border flex items-center justify-between ${darkMode ? 'bg-[#0B1426] border-[#1E2E4A]' : 'bg-neutral-50 border-neutral-200'}`}>
                      <div>
                        <span className={`text-[10px] ${themeClasses.mutedText} block`}>Your Status</span>
                        <span className="font-bold text-xs">
                          {(selectedDefect.readReceipts || []).some(r => r && r.userId === currentUserId) ? (
                            <span className="text-emerald-600 dark:text-emerald-400 flex items-center gap-1 font-bold">
                              <CheckCircle2 className="w-3.5 h-3.5" /> Acknowledged by You
                            </span>
                          ) : (
                            <span className="text-amber-600 dark:text-amber-400 flex items-center gap-1">
                              <Clock className="w-3.5 h-3.5" /> Unread / Pending Your Review
                            </span>
                          )}
                        </span>
                      </div>
                      <button
                        onClick={() => handleToggleRead(selectedDefect.ccid)}
                        className={`px-3 py-1.5 rounded text-xs cursor-pointer ${getReadButtonClass((selectedDefect.readReceipts || []).some(r => r && r.userId === currentUserId))}`}
                      >
                        {(selectedDefect.readReceipts || []).some(r => r && r.userId === currentUserId) ? 'Mark Unread' : 'Mark as Read'}
                      </button>
                    </div>
                  )}

                  {/* Manager & Admin view: sees team breakdown */}
                  {(currentUser.role === 'Manager' || currentUser.role === 'Admin') && (
                    <div className={`p-3 rounded border space-y-2 ${darkMode ? 'bg-[#0B1426] border-[#1E2E4A]' : 'bg-neutral-50 border-neutral-200'}`}>
                      <div className="flex items-center justify-between">
                        <span className={`text-[11px] font-semibold ${themeClasses.headingText}`}>
                          Team Acknowledged: <strong className="text-[#003EA4] dark:text-blue-400">{(selectedDefect.readReceipts || []).length} of 16</strong>
                        </span>
                        <button
                          onClick={() => setIsReadMatrixOpen(true)}
                          className="text-[11px] text-[#003EA4] dark:text-blue-400 font-bold hover:underline cursor-pointer"
                        >
                          View Full Matrix
                        </button>
                      </div>

                      <div className="max-h-32 overflow-y-auto space-y-1 pr-1">
                        {(selectedDefect.readReceipts || []).map((r, i) => (
                          <div key={i} className={`flex items-center justify-between text-[10px] p-1.5 rounded ${darkMode ? 'bg-[#111E38]' : 'bg-white'}`}>
                            <span className={`font-semibold ${themeClasses.headingText}`}>{r.userName} ({r.role})</span>
                            <span className={`${themeClasses.mutedText} font-mono`}>{r.readAt}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

              </div>
            </div>

            {/* Drawer Footer Actions */}
            <div className={`p-4 ${themeClasses.headerBg} border-t flex items-center justify-between`}>
              <div className="flex items-center gap-2">
                {(currentUser.role === 'Admin' || currentUser.role === 'Manager' || selectedDefect.ownerId === currentUser.id) && (
                  <>
                    <button
                      onClick={(e) => handleOpenEditModal(selectedDefect, e)}
                      className="px-3 py-1.5 bg-[#003EA4] hover:bg-[#002D72] text-white text-xs font-semibold rounded flex items-center gap-1.5 cursor-pointer shadow-xs"
                    >
                      <Edit3 className="w-3.5 h-3.5" />
                      <span>Edit Defect</span>
                    </button>
                    <button
                      onClick={(e) => handleDeleteDefect(selectedDefect, e)}
                      className="px-3 py-1.5 bg-red-600 hover:bg-red-700 text-white text-xs font-semibold rounded flex items-center gap-1.5 cursor-pointer shadow-xs"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                      <span>Delete</span>
                    </button>
                  </>
                )}
              </div>

              <button
                onClick={() => setIsDetailDrawerOpen(false)}
                className={`px-4 py-1.5 border ${darkMode ? 'border-neutral-700 text-neutral-300 hover:bg-neutral-800' : 'border-neutral-300 text-neutral-700 hover:bg-neutral-100'} rounded text-xs font-semibold cursor-pointer`}
              >
                Close Drawer
              </button>
            </div>

          </div>
        </div>
      )}

      {/* ============================================================ */}
      {/* 4. OWNER EDIT MODAL (REACTIVE & RELIABLE SAVE)               */}
      {/* ============================================================ */}
      {isEditModalOpen && editingDefect && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4">
          <div className={`w-full max-w-2xl ${themeClasses.cardBg} rounded-lg shadow-2xl border ${darkMode ? 'border-[#1E2E4A]' : 'border-neutral-200'} overflow-hidden animate-in zoom-in-95 duration-150`}>
            
            <div className="p-4 bg-[#002D72] text-white flex items-center justify-between">
              <div>
                <h3 className="font-bold text-sm flex items-center gap-1.5">
                  <Edit3 className="w-4 h-4 text-blue-300" />
                  Edit Defect Record (Owner Management)
                </h3>
                <p className="text-[10px] text-blue-200">
                  Editing CCID: {editingDefect.ccid} | Owner: {editingDefect.analystName}
                </p>
              </div>
              <button
                onClick={() => setIsEditModalOpen(false)}
                className="p-1 text-blue-200 hover:text-white rounded cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveDefectEdit} className="p-5 space-y-4 text-xs">
              
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className={`block font-semibold ${themeClasses.headingText} mb-1`}>CCID (16-Digits)</label>
                  <input
                    type="text"
                    maxLength={16}
                    value={editingDefect.ccid}
                    onChange={(e) => setEditingDefect({ ...editingDefect, ccid: e.target.value.replace(/\D/g, '').slice(0, 16) })}
                    className={`w-full p-2 ${themeClasses.inputBg} rounded font-mono font-bold text-xs`}
                  />
                </div>
                <div>
                  <label className={`block font-semibold ${themeClasses.headingText} mb-1`}>KYCID</label>
                  <input
                    type="text"
                    value={editingDefect.kycid}
                    onChange={(e) => setEditingDefect({ ...editingDefect, kycid: e.target.value })}
                    className={`w-full p-2 ${themeClasses.inputBg} rounded font-mono font-bold text-xs`}
                  />
                </div>
              </div>

              <div>
                <label className={`block font-semibold ${themeClasses.headingText} mb-1`}>Case Type</label>
                <div className="grid grid-cols-2 gap-2">
                  {['Individual', 'Entity'].map(type => (
                    <button
                      key={type}
                      type="button"
                      onClick={() => setEditingDefect({ ...editingDefect, caseType: type })}
                      className={`py-1.5 px-3 rounded font-bold text-xs border text-center transition cursor-pointer ${
                        editingDefect.caseType === type
                          ? 'bg-[#003EA4] text-white border-[#003EA4]'
                          : `${darkMode ? 'bg-[#0B1426] text-neutral-300 border-neutral-700' : 'bg-white text-neutral-700 border-neutral-300'}`
                      }`}
                    >
                      {type}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className={`block font-semibold ${themeClasses.headingText} mb-1`}>Defect Explanation / Context</label>
                <textarea
                  rows="3"
                  value={editingDefect.explanation}
                  onChange={(e) => setEditingDefect({ ...editingDefect, explanation: e.target.value })}
                  className={`w-full p-2 ${themeClasses.inputBg} rounded text-xs`}
                ></textarea>
              </div>

              <div>
                <label className={`block font-semibold ${themeClasses.headingText} mb-1`}>Categories / Areas Involved</label>
                <div className={`p-2.5 rounded border max-h-32 overflow-y-auto space-y-2 ${darkMode ? 'bg-[#0B1426] border-[#1E2E4A]' : 'bg-neutral-50 border-neutral-200'}`}>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-1.5">
                    {((CATEGORY_DEFINITIONS[editingDefect.caseType || 'Individual']?.CORE || []).map(cat => {
                      const isSel = isEditCategorySelected('CORE', cat);
                      return (
                        <button
                          key={`core-${cat}`}
                          type="button"
                          onClick={() => toggleEditCategorySelection('CORE', cat)}
                          className={`p-1.5 rounded text-left text-[11px] border flex items-center justify-between cursor-pointer ${
                            isSel ? 'bg-[#003EA4] text-white border-[#003EA4] font-bold' : `${darkMode ? 'bg-[#111E38] text-neutral-300 border-neutral-700' : 'bg-white text-neutral-700 border-neutral-300'}`
                          }`}
                        >
                          <span className="truncate">CORE: {cat}</span>
                          {isSel && <Check className="w-3 h-3 flex-shrink-0" />}
                        </button>
                      );
                    }))}
                    {((CATEGORY_DEFINITIONS[editingDefect.caseType || 'Individual']?.APPENDIX || []).map(cat => {
                      const isSel = isEditCategorySelected('APPENDIX', cat);
                      return (
                        <button
                          key={`app-${cat}`}
                          type="button"
                          onClick={() => toggleEditCategorySelection('APPENDIX', cat)}
                          className={`p-1.5 rounded text-left text-[11px] border flex items-center justify-between cursor-pointer ${
                            isSel ? 'bg-neutral-800 text-white border-neutral-800 font-bold' : `${darkMode ? 'bg-[#111E38] text-neutral-300 border-neutral-700' : 'bg-white text-neutral-700 border-neutral-300'}`
                          }`}
                        >
                          <span className="truncate">APP: {cat}</span>
                          {isSel && <Check className="w-3 h-3 flex-shrink-0" />}
                        </button>
                      );
                    }))}
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className={`block font-semibold ${themeClasses.headingText} mb-1`}>Corrective Action</label>
                  <input
                    type="text"
                    value={editingDefect.resolution?.correctiveAction || ''}
                    onChange={(e) => setEditingDefect({
                      ...editingDefect,
                      resolution: { ...editingDefect.resolution, correctiveAction: e.target.value }
                    })}
                    className={`w-full p-2 ${themeClasses.inputBg} rounded text-xs`}
                  />
                </div>
                <div>
                  <label className={`block font-semibold ${themeClasses.headingText} mb-1`}>Resolution Comment</label>
                  <input
                    type="text"
                    value={editingDefect.resolution?.comment || ''}
                    onChange={(e) => setEditingDefect({
                      ...editingDefect,
                      resolution: { ...editingDefect.resolution, comment: e.target.value }
                    })}
                    className={`w-full p-2 ${themeClasses.inputBg} rounded text-xs`}
                  />
                </div>
              </div>

              <div className={`flex justify-end gap-2 pt-3 border-t ${darkMode ? 'border-[#1E2E4A]' : 'border-neutral-200'}`}>
                <button
                  type="button"
                  onClick={() => setIsEditModalOpen(false)}
                  className={`px-4 py-2 border ${darkMode ? 'border-neutral-700 text-neutral-300 hover:bg-neutral-800' : 'border-neutral-300 text-neutral-700 hover:bg-neutral-100'} rounded font-semibold cursor-pointer`}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-[#003EA4] hover:bg-[#002D72] text-white font-bold rounded flex items-center gap-1.5 shadow cursor-pointer"
                >
                  <Save className="w-4 h-4" />
                  <span>Save Changes</span>
                </button>
              </div>

            </form>

          </div>
        </div>
      )}

      {/* ============================================================ */}
      {/* 5. DELETE CONFIRMATION MODAL                                 */}
      {/* ============================================================ */}
      {deleteConfirmDefect && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4">
          <div className={`w-full max-w-md ${themeClasses.cardBg} rounded-lg shadow-2xl border p-5 space-y-4 ${darkMode ? 'border-[#1E2E4A]' : 'border-neutral-200'}`}>
            <div className="flex items-center gap-3 text-red-600">
              <AlertTriangle className="w-6 h-6 flex-shrink-0" />
              <h4 className={`font-bold text-sm ${themeClasses.headingText}`}>Confirm Defect Deletion</h4>
            </div>
            <p className={`text-xs ${themeClasses.mutedText}`}>
              Are you sure you want to delete defect <strong className={themeClasses.headingText}>{deleteConfirmDefect.ccid}</strong> ({deleteConfirmDefect.kycid})? 
              This action will permanently remove it from the shared registry.
            </p>
            <div className="flex justify-end gap-2 pt-2 border-t border-neutral-200 dark:border-neutral-700">
              <button
                type="button"
                onClick={() => setDeleteConfirmDefect(null)}
                className={`px-3 py-1.5 border ${darkMode ? 'border-neutral-700 text-neutral-300' : 'border-neutral-300 text-neutral-700'} rounded text-xs font-semibold cursor-pointer`}
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={confirmDeleteDefect}
                className="px-4 py-1.5 bg-red-600 hover:bg-red-700 text-white font-bold rounded text-xs cursor-pointer shadow-xs"
              >
                Confirm Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ============================================================ */}
      {/* 6. ADD ANALYST MODAL (MANAGER & ADMIN)                       */}
      {/* ============================================================ */}
      {isAddUserModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4">
          <div className={`w-full max-w-md ${themeClasses.cardBg} rounded-lg shadow-2xl border p-5 space-y-4 ${darkMode ? 'border-[#1E2E4A]' : 'border-neutral-200'}`}>
            <div className="flex items-center justify-between pb-2 border-b border-neutral-200 dark:border-neutral-700">
              <h4 className={`font-bold text-sm ${themeClasses.headingText} flex items-center gap-2`}>
                <UserPlus className="w-4 h-4 text-[#003EA4] dark:text-blue-400" />
                Add Analyst to Roster
              </h4>
              <button onClick={() => setIsAddUserModalOpen(false)} className="text-neutral-400 hover:text-neutral-600 cursor-pointer">
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleAddAnalyst} className="space-y-3 text-xs">
              <div>
                <label className={`block font-semibold ${themeClasses.headingText} mb-1`}>Analyst Full Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Jordan Hayes"
                  value={newAnalystName}
                  onChange={(e) => setNewAnalystName(e.target.value)}
                  className={`w-full p-2 ${themeClasses.inputBg} rounded text-xs`}
                />
              </div>
              <div>
                <label className={`block font-semibold ${themeClasses.headingText} mb-1`}>Citi Email Address *</label>
                <input
                  type="email"
                  required
                  placeholder="e.g. jordan.hayes.demo@citi.internal"
                  value={newAnalystEmail}
                  onChange={(e) => setNewAnalystEmail(e.target.value)}
                  className={`w-full p-2 ${themeClasses.inputBg} rounded text-xs`}
                />
              </div>
              <div className="flex justify-end gap-2 pt-2 border-t border-neutral-200 dark:border-neutral-700">
                <button
                  type="button"
                  onClick={() => setIsAddUserModalOpen(false)}
                  className={`px-3 py-1.5 border ${darkMode ? 'border-neutral-700 text-neutral-300' : 'border-neutral-300 text-neutral-700'} rounded text-xs font-semibold cursor-pointer`}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 bg-[#003EA4] hover:bg-[#002D72] text-white font-bold rounded text-xs cursor-pointer shadow-xs"
                >
                  Add Analyst
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ============================================================ */}
      {/* 7. READ MATRIX MODAL (MANAGER & ADMIN)                       */}
      {/* ============================================================ */}
      {isReadMatrixOpen && selectedDefect && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4">
          <div className={`w-full max-w-xl ${themeClasses.cardBg} rounded-lg shadow-2xl border p-5 space-y-4 ${darkMode ? 'border-[#1E2E4A]' : 'border-neutral-200'}`}>
            <div className="flex items-center justify-between pb-2 border-b border-neutral-200 dark:border-neutral-700">
              <h4 className={`font-bold text-sm ${themeClasses.headingText}`}>
                Team Acknowledgment Matrix: CCID {formatCcidDisplay(selectedDefect.ccid)}
              </h4>
              <button onClick={() => setIsReadMatrixOpen(false)} className="text-neutral-400 hover:text-neutral-600 cursor-pointer">
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="max-h-72 overflow-y-auto space-y-1.5 pr-1 text-xs">
              {(teamUsers || []).filter(u => u && u.status === 'Active' && u.role !== 'Admin').map(user => {
                const receipt = (selectedDefect.readReceipts || []).find(r => r && r.userId === user.id);
                return (
                  <div key={user.id} className={`flex items-center justify-between p-2 rounded ${darkMode ? 'bg-[#0B1426]' : 'bg-neutral-50'}`}>
                    <div>
                      <span className={`font-semibold ${themeClasses.headingText}`}>{user.name}</span>
                      <span className={`text-[10px] ${themeClasses.mutedText} font-mono ml-1`}>({user.id})</span>
                    </div>
                    {receipt ? (
                      <span className="text-emerald-600 dark:text-emerald-400 font-mono text-[10px] flex items-center gap-1 font-semibold">
                        <CheckCheck className="w-3.5 h-3.5" /> {receipt.readAt}
                      </span>
                    ) : (
                      <span className="text-amber-600 dark:text-amber-400 font-mono text-[10px]">
                        Unread / Pending
                      </span>
                    )}
                  </div>
                );
              })}
            </div>

            <div className="flex justify-end pt-2 border-t border-neutral-200 dark:border-neutral-700">
              <button
                type="button"
                onClick={() => setIsReadMatrixOpen(false)}
                className={`px-4 py-1.5 bg-[#003EA4] text-white rounded text-xs font-semibold cursor-pointer`}
              >
                Done
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}