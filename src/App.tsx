import React, { useState, useEffect } from 'react';
import {
  Role,
  UserRole,
  TabType,
  Language,
  Appointment,
  Customer,
  Service,
  InventoryItem,
  Staff,
  AttendanceRecord,
  Promotion,
  Invoice,
  AppNotification,
  SpaProfile,
  NewsArticle,
  RolePasswords
} from './types';
import {
  initialServices,
  initialInventory,
  initialCustomers,
  initialStaff,
  initialAppointments,
  initialAttendance,
  initialPromotions,
  initialInvoices,
  initialNotifications,
  initialSpaProfile,
  initialNewsArticles,
  initialRolePasswords
} from './mockData';
import { translations } from './i18n';
import { Navbar } from './components/Navbar';
import { Sidebar } from './components/Sidebar';
import { BottomNav } from './components/BottomNav';
import { DashboardView } from './components/DashboardView';
import { AnalyticsView } from './components/AnalyticsView';
import { CostCalculationView } from './components/CostCalculationView';
import { AppointmentsView } from './components/AppointmentsView';
import { CustomersView } from './components/CustomersView';
import { InventoryView } from './components/InventoryView';
import { StaffView } from './components/StaffView';
import { PromotionsView } from './components/PromotionsView';
import { ReportsView } from './components/ReportsView';
import { CustomerPortalView } from './components/CustomerPortalView';
import { B2BManagementView } from './components/B2BManagementView';
import { RolePasswordModal } from './components/RolePasswordModal';
import { CheckoutModal } from './components/CheckoutModal';
import { QuickBookingModal } from './components/QuickBookingModal';
import { FirebaseSyncModal } from './components/FirebaseSyncModal';
import { SpaProfileEditModal } from './components/SpaProfileEditModal';
import { B2BFullConfig, getStoredB2BConfig, saveStoredB2BConfig } from './data/b2bConfigData';
import {
  COLLECTIONS,
  subscribeToCollection,
  syncDocToFirestore,
  deleteDocFromFirestore,
  clearCollectionFromFirebase,
  seedCleanDataToFirebase
} from './firebase';

export default function App() {
  // Global Settings State
  const [lang, setLang] = useState<Language>('vi');
  const [isDarkMode, setIsDarkMode] = useState<boolean>(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('spa_theme', 'light');
      document.documentElement.classList.remove('dark');
    }
    return false;
  });

  // Current Role & Navigation
  const [currentRole, setCurrentRole] = useState<Role>('customer');
  const [activeTab, setActiveTab] = useState<TabType>('customer_intro');

  // Security Passwords
  const [rolePasswords, setRolePasswords] = useState<RolePasswords>(initialRolePasswords);
  const [isPasswordModalOpen, setIsPasswordModalOpen] = useState<boolean>(false);
  const [pendingTargetRole, setPendingTargetRole] = useState<Role>('owner');
  const [currentStaffUser, setCurrentStaffUser] = useState<Staff | null>(null);

  // Application Data States
  const [spaProfile, setSpaProfile] = useState<SpaProfile>(initialSpaProfile);
  const [newsArticles, setNewsArticles] = useState<NewsArticle[]>(initialNewsArticles);
  const [services, setServices] = useState<Service[]>(initialServices);
  const [inventory, setInventory] = useState<InventoryItem[]>(initialInventory);
  const [customers, setCustomers] = useState<Customer[]>(initialCustomers);
  const [staff, setStaff] = useState<Staff[]>(initialStaff);
  const [appointments, setAppointments] = useState<Appointment[]>(initialAppointments);
  const [attendance, setAttendance] = useState<AttendanceRecord[]>(initialAttendance);
  const [promotions, setPromotions] = useState<Promotion[]>(initialPromotions);
  const [invoices, setInvoices] = useState<Invoice[]>(initialInvoices);
  const [notifications, setNotifications] = useState<AppNotification[]>(initialNotifications);
  const [b2bConfig, setB2BConfig] = useState<B2BFullConfig>(getStoredB2BConfig);

  // Cloud & Firebase Sync States
  const [isFirebaseConnected, setIsFirebaseConnected] = useState<boolean>(true);
  const [isFirebaseSyncing, setIsFirebaseSyncing] = useState<boolean>(false);
  const [lastSyncedTime, setLastSyncedTime] = useState<Date | null>(new Date());
  const [showFirebaseModal, setShowFirebaseModal] = useState<boolean>(false);
  const [isEditSpaProfileOpen, setIsEditSpaProfileOpen] = useState<boolean>(false);

  // Modal States
  const [checkoutAppointment, setCheckoutAppointment] = useState<Appointment | null>(null);
  const [showCheckoutModal, setShowCheckoutModal] = useState<boolean>(false);
  const [showQuickBookingModal, setShowQuickBookingModal] = useState<boolean>(false);
  const [bookingInitialServiceId, setBookingInitialServiceId] = useState<string | undefined>(undefined);
  const [bookingInitialPromoCode, setBookingInitialPromoCode] = useState<string | undefined>(undefined);

  // Force Pure Light Mode Theme
  useEffect(() => {
    document.documentElement.classList.remove('dark');
    try {
      localStorage.setItem('spa_theme', 'light');
    } catch (e) {
      /* ignore */
    }
  }, [isDarkMode]);

  // Realtime Firebase Firestore Subscriptions & Auto Initial Sync
  useEffect(() => {
    let unsubs: (() => void)[] = [];
    try {
      // Subscribe to Customers
      unsubs.push(
        subscribeToCollection<Customer>(COLLECTIONS.CUSTOMERS, (items) => {
          if (Array.isArray(items)) {
            setCustomers(items);
            setLastSyncedTime(new Date());
          }
        })
      );

      // Subscribe to Staff
      unsubs.push(
        subscribeToCollection<Staff>(COLLECTIONS.STAFF, (items) => {
          if (Array.isArray(items)) {
            setStaff(items);
            setLastSyncedTime(new Date());
          }
        })
      );

      // Subscribe to Services
      unsubs.push(
        subscribeToCollection<Service>(COLLECTIONS.SERVICES, (items) => {
          if (Array.isArray(items)) {
            setServices(items);
            setLastSyncedTime(new Date());
          }
        })
      );

      // Subscribe to Appointments
      unsubs.push(
        subscribeToCollection<Appointment>(COLLECTIONS.APPOINTMENTS, (items) => {
          if (Array.isArray(items)) {
            setAppointments(items);
            setLastSyncedTime(new Date());
          }
        })
      );

      // Subscribe to Inventory
      unsubs.push(
        subscribeToCollection<InventoryItem>(COLLECTIONS.INVENTORY, (items) => {
          if (Array.isArray(items)) {
            setInventory(items);
            setLastSyncedTime(new Date());
          }
        })
      );

      // Subscribe to Attendance
      unsubs.push(
        subscribeToCollection<AttendanceRecord>(COLLECTIONS.ATTENDANCE, (items) => {
          if (Array.isArray(items)) {
            setAttendance(items);
            setLastSyncedTime(new Date());
          }
        })
      );

      // Subscribe to Promotions
      unsubs.push(
        subscribeToCollection<Promotion>(COLLECTIONS.PROMOTIONS, (items) => {
          if (Array.isArray(items)) {
            setPromotions(items);
            setLastSyncedTime(new Date());
          }
        })
      );

      // Subscribe to Invoices
      unsubs.push(
        subscribeToCollection<Invoice>(COLLECTIONS.INVOICES, (items) => {
          if (Array.isArray(items)) {
            setInvoices(items);
            setLastSyncedTime(new Date());
          }
        })
      );

      // Subscribe to Notifications
      unsubs.push(
        subscribeToCollection<AppNotification>(COLLECTIONS.NOTIFICATIONS, (items) => {
          if (Array.isArray(items)) {
            setNotifications(items);
            setLastSyncedTime(new Date());
          }
        })
      );

      // Subscribe to Spa Profile
      unsubs.push(
        subscribeToCollection<SpaProfile>(COLLECTIONS.SPA_PROFILE, (items) => {
          if (items && items.length > 0) {
            setSpaProfile(items[0]);
            setLastSyncedTime(new Date());
          }
        })
      );

      // Subscribe to News
      unsubs.push(
        subscribeToCollection<NewsArticle>(COLLECTIONS.NEWS, (items) => {
          if (items && items.length > 0) {
            setNewsArticles(items);
            setLastSyncedTime(new Date());
          }
        })
      );

      // Subscribe to System Settings (Passwords & B2B Configuration)
      unsubs.push(
        subscribeToCollection<any>(COLLECTIONS.SYSTEM, (items) => {
          const passDoc = items?.find((i) => i.id === 'passwords');
          if (passDoc) {
            setRolePasswords({
              ownerPin: passDoc.ownerPin || initialRolePasswords.ownerPin,
              managerPin: passDoc.managerPin || initialRolePasswords.managerPin,
              staffPin: passDoc.staffPin || initialRolePasswords.staffPin,
            });
          }

          const b2bDoc = items?.find((i) => i.id === 'b2b_config');
          if (b2bDoc) {
            setB2BConfig((prev) => ({
              ...prev,
              ...b2bDoc,
            }));
            saveStoredB2BConfig(b2bDoc);
          }

          setLastSyncedTime(new Date());
        })
      );
    } catch (err) {
      console.warn('Firebase listeners initialized with fallback:', err);
    }

    return () => {
      unsubs.forEach((unsub) => unsub?.());
    };
  }, []);

  // Helper to trigger background sync indicator and auto-update timestamp
  const trackSync = async (action: Promise<any>) => {
    setIsFirebaseSyncing(true);
    try {
      await action;
      setLastSyncedTime(new Date());
    } catch (err) {
      console.error('Firebase background sync error:', err);
    } finally {
      setIsFirebaseSyncing(false);
    }
  };

  // Appointment Actions
  const handleUpdateAppointmentStatus = (id: string, newStatus: Appointment['status']) => {
    let updatedApt: Appointment | null = null;
    setAppointments((prev) =>
      prev.map((apt) => {
        if (apt.id === id) {
          updatedApt = { ...apt, status: newStatus };
          return updatedApt;
        }
        return apt;
      })
    );
    if (updatedApt) {
      trackSync(syncDocToFirestore(COLLECTIONS.APPOINTMENTS, updatedApt));
    }
  };

  const handleOpenCheckout = (apt?: Appointment) => {
    setCheckoutAppointment(apt || null);
    setShowCheckoutModal(true);
  };

  const handleConfirmPayment = (newInvoice: Invoice) => {
    setInvoices((prev) => [newInvoice, ...prev]);
    trackSync(syncDocToFirestore(COLLECTIONS.INVOICES, newInvoice));

    // If payment was tied to an appointment, mark it completed and paid
    if (newInvoice.appointmentId) {
      let updatedApt: Appointment | null = null;
      setAppointments((prev) =>
        prev.map((apt) => {
          if (apt.id === newInvoice.appointmentId) {
            updatedApt = { ...apt, status: 'completed', paid: true };
            return updatedApt;
          }
          return apt;
        })
      );
      if (updatedApt) {
        trackSync(syncDocToFirestore(COLLECTIONS.APPOINTMENTS, updatedApt));
      }
    }

    // Award loyalty points and add to customer treatment history
    let updatedCust: Customer | null = null;
    setCustomers((prev) =>
      prev.map((c) => {
        if (c.id === newInvoice.customerId) {
          const pointsEarned = Math.floor(newInvoice.totalAmount / 10000);
          updatedCust = {
            ...c,
            totalSpent: c.totalSpent + newInvoice.totalAmount,
            loyaltyPoints: c.loyaltyPoints + pointsEarned,
            treatmentHistory: [
              {
                id: `th-${Date.now()}`,
                date: newInvoice.date.slice(0, 10),
                serviceName: newInvoice.items[0]?.serviceName || 'Dịch vụ Spa',
                technicianName: newInvoice.staffName,
                cost: newInvoice.totalAmount,
                notes: 'Hoàn thành buổi trị liệu xuất sắc.',
                skinCondition: 'Cải thiện rõ rệt, da đều màu và đủ ẩm.',
              },
              ...c.treatmentHistory,
            ],
          };
          return updatedCust;
        }
        return c;
      })
    );
    if (updatedCust) {
      trackSync(syncDocToFirestore(COLLECTIONS.CUSTOMERS, updatedCust));
    }

    // Increase staff commission and completed services count
    let updatedStaffMember: Staff | null = null;
    setStaff((prev) =>
      prev.map((st) => {
        if (st.id === newInvoice.staffId) {
          const commissionEarned = Math.round(
            newInvoice.subtotal * (st.commissionRate / 100) + (newInvoice.tipAmount || 0)
          );
          updatedStaffMember = {
            ...st,
            completedServicesCount: st.completedServicesCount + 1,
            monthlyCommission: st.monthlyCommission + commissionEarned,
          };
          return updatedStaffMember;
        }
        return st;
      })
    );
    if (updatedStaffMember) {
      trackSync(syncDocToFirestore(COLLECTIONS.STAFF, updatedStaffMember));
    }
  };

  const handleSaveServiceCost = (updatedService: Service) => {
    setServices((prev) =>
      prev.map((s) => (s.id === updatedService.id ? updatedService : s))
    );
    trackSync(syncDocToFirestore(COLLECTIONS.SERVICES, updatedService));
  };

  const handleAddCustomer = (newCustomer: Customer) => {
    setCustomers((prev) => [newCustomer, ...prev]);
    trackSync(syncDocToFirestore(COLLECTIONS.CUSTOMERS, newCustomer));
  };

  const handleUpdateCustomer = (updatedCustomer: Customer) => {
    setCustomers((prev) =>
      prev.map((c) => (c.id === updatedCustomer.id ? updatedCustomer : c))
    );
    trackSync(syncDocToFirestore(COLLECTIONS.CUSTOMERS, updatedCustomer));
  };

  const handleDeleteCustomer = (customerId: string) => {
    setCustomers((prev) => prev.filter((c) => c.id !== customerId));
    trackSync(deleteDocFromFirestore(COLLECTIONS.CUSTOMERS, customerId));
  };

  const handleClearAllCustomers = async () => {
    setCustomers([]);
    await clearCollectionFromFirebase(COLLECTIONS.CUSTOMERS);
  };

  const handleDeleteInvoice = (invoiceId: string) => {
    setInvoices((prev) => prev.filter((inv) => inv.id !== invoiceId));
    trackSync(deleteDocFromFirestore(COLLECTIONS.INVOICES, invoiceId));
  };

  const handleClearAllInvoices = async () => {
    setInvoices([]);
    await clearCollectionFromFirebase(COLLECTIONS.INVOICES);
  };

  const handleUpdateInventory = (updatedItem: InventoryItem) => {
    setInventory((prev) =>
      prev.map((item) => (item.id === updatedItem.id ? updatedItem : item))
    );
    trackSync(syncDocToFirestore(COLLECTIONS.INVENTORY, updatedItem));
  };

  const handleAddInventoryItem = (newItem: InventoryItem) => {
    setInventory((prev) => [newItem, ...prev]);
    trackSync(syncDocToFirestore(COLLECTIONS.INVENTORY, newItem));
  };

  const handleDeleteInventoryItem = (itemId: string) => {
    setInventory((prev) => prev.filter((item) => item.id !== itemId));
    trackSync(deleteDocFromFirestore(COLLECTIONS.INVENTORY, itemId));
  };

  const handleAddService = (newService: Service) => {
    setServices((prev) => [newService, ...prev]);
    trackSync(syncDocToFirestore(COLLECTIONS.SERVICES, newService));
  };

  const handleUpdateService = (updatedService: Service) => {
    setServices((prev) =>
      prev.map((s) => (s.id === updatedService.id ? updatedService : s))
    );
    trackSync(syncDocToFirestore(COLLECTIONS.SERVICES, updatedService));
  };

  const handleDeleteService = (serviceId: string) => {
    setServices((prev) => prev.filter((s) => s.id !== serviceId));
    trackSync(deleteDocFromFirestore(COLLECTIONS.SERVICES, serviceId));
  };

  const handleClockIn = (newRecord: AttendanceRecord) => {
    setAttendance((prev) => [newRecord, ...prev]);
    trackSync(syncDocToFirestore(COLLECTIONS.ATTENDANCE, newRecord));
  };

  const handleClockOut = (recordId: string) => {
    const now = new Date();
    const timeStr = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;
    let updatedAtt: AttendanceRecord | null = null;
    setAttendance((prev) =>
      prev.map((att) => {
        if (att.id === recordId) {
          updatedAtt = { ...att, clockOutTime: timeStr };
          return updatedAtt;
        }
        return att;
      })
    );
    if (updatedAtt) {
      trackSync(syncDocToFirestore(COLLECTIONS.ATTENDANCE, updatedAtt));
    }
  };

  const handleAddStaff = (newStaffMember: Staff) => {
    setStaff((prev) => [newStaffMember, ...prev]);
    trackSync(syncDocToFirestore(COLLECTIONS.STAFF, newStaffMember));
  };

  const handleUpdateStaff = (updatedStaff: Staff) => {
    setStaff((prev) =>
      prev.map((st) => (st.id === updatedStaff.id ? updatedStaff : st))
    );
    trackSync(syncDocToFirestore(COLLECTIONS.STAFF, updatedStaff));
  };

  const handleToggleStaffStatus = (
    staffId: string,
    newStatus: Staff['status'],
    resignationData?: { endDate: string; reason: string }
  ) => {
    let updatedMember: Staff | null = null;
    setStaff((prev) =>
      prev.map((st) => {
        if (st.id === staffId) {
          if (newStatus === 'resigned') {
            updatedMember = {
              ...st,
              status: 'resigned',
              loginDisabled: true, // Tự động khóa quyền đăng nhập vào hệ thống
              endDate: resignationData?.endDate || new Date().toISOString().slice(0, 10),
              resignationReason: resignationData?.reason || 'Thôi việc theo nguyện vọng cá nhân',
            };
          } else if (newStatus === 'active') {
            updatedMember = {
              ...st,
              status: 'active',
              loginDisabled: false, // Mở lại quyền đăng nhập
              endDate: undefined,
              resignationReason: undefined,
            };
          } else if (newStatus === 'inactive') {
            updatedMember = {
              ...st,
              status: 'inactive',
              loginDisabled: true, // Tạm khóa đăng nhập
            };
          } else {
            updatedMember = { ...st, status: newStatus };
          }
          return updatedMember;
        }
        return st;
      })
    );
    if (updatedMember) {
      trackSync(syncDocToFirestore(COLLECTIONS.STAFF, updatedMember));
    }
  };

  const handleAddPromotion = (newPromo: Promotion) => {
    setPromotions((prev) => [newPromo, ...prev]);
    trackSync(syncDocToFirestore(COLLECTIONS.PROMOTIONS, newPromo));
  };

  const handleUpdatePromotion = (updatedPromo: Promotion) => {
    setPromotions((prev) => prev.map((p) => (p.id === updatedPromo.id ? updatedPromo : p)));
    trackSync(syncDocToFirestore(COLLECTIONS.PROMOTIONS, updatedPromo));
  };

  const handleDeletePromotion = (promoId: string) => {
    setPromotions((prev) => prev.filter((p) => p.id !== promoId));
    trackSync(deleteDocFromFirestore(COLLECTIONS.PROMOTIONS, promoId));
  };

  const handleBroadcastNotification = (notif: AppNotification) => {
    setNotifications((prev) => [notif, ...prev]);
    trackSync(syncDocToFirestore(COLLECTIONS.NOTIFICATIONS, notif));
  };

  const handleMarkNotificationsRead = () => {
    setNotifications((prev) => {
      const updated = prev.map((n) => ({ ...n, read: true }));
      updated.forEach((n) => syncDocToFirestore(COLLECTIONS.NOTIFICATIONS, n));
      return updated;
    });
  };

  const handleSaveNewBooking = (newApt: Appointment) => {
    setAppointments((prev) => [newApt, ...prev]);
    trackSync(syncDocToFirestore(COLLECTIONS.APPOINTMENTS, newApt));
  };

  const handleUpdateAppointment = (updatedApt: Appointment) => {
    setAppointments((prev) =>
      prev.map((apt) => (apt.id === updatedApt.id ? updatedApt : apt))
    );
    trackSync(syncDocToFirestore(COLLECTIONS.APPOINTMENTS, updatedApt));
  };

  const handleSaveB2BConfig = async (newConfig: B2BFullConfig) => {
    setB2BConfig(newConfig);
    saveStoredB2BConfig(newConfig);
    trackSync(syncDocToFirestore(COLLECTIONS.SYSTEM, newConfig));
  };

  // Role Switching with Passwords / PIN Authentication & Personal Staff Login
  const handleRequestRoleChange = (targetRole: Role) => {
    if (targetRole === 'customer') {
      setCurrentRole('customer');
      setCurrentStaffUser(null);
      setActiveTab('customer_intro');
      return;
    }

    // Require PIN / Personal Login modal
    setPendingTargetRole(targetRole);
    setIsPasswordModalOpen(true);
  };

  const applyRoleChange = (verifiedRole: Role, loggedStaff?: Staff) => {
    setCurrentRole(verifiedRole);
    if (loggedStaff) {
      setCurrentStaffUser(loggedStaff);
    } else {
      // Find matching staff for the role if any
      const matching = staff.find((s) => s.role === verifiedRole && s.status !== 'resigned');
      if (matching && (verifiedRole === 'technician' || verifiedRole === 'receptionist')) {
        setCurrentStaffUser(matching);
      } else if (verifiedRole === 'owner') {
        setCurrentStaffUser(null);
      }
    }

    if (verifiedRole === 'owner' || verifiedRole === 'manager') {
      setActiveTab('dashboard');
    } else if (verifiedRole === 'technician') {
      setActiveTab('staff'); // Opens technician personal space & attendance
    } else if (verifiedRole === 'receptionist') {
      setActiveTab('appointments');
    } else {
      setActiveTab('customer_intro');
    }
  };

  const handleUpdateRolePasswords = (newPasswords: RolePasswords) => {
    setRolePasswords(newPasswords);
    trackSync(
      syncDocToFirestore(COLLECTIONS.SYSTEM, {
        id: 'passwords',
        ...newPasswords,
        updatedAt: new Date().toISOString(),
      })
    );
  };

  const handleSaveSpaProfile = async (updated: SpaProfile) => {
    setSpaProfile(updated);
    await trackSync(syncDocToFirestore(COLLECTIONS.SPA_PROFILE, updated));
  };

  // Determine which view to render based on activeTab and currentRole
  const isCustomerTab =
    currentRole === 'customer' ||
    ['customer_portal', 'customer_intro', 'customer_promotions', 'customer_services', 'customer_news'].includes(
      activeTab
    );

  const getCustomerSubTab = (): 'intro' | 'promotions' | 'services' | 'news' => {
    if (activeTab === 'customer_promotions') return 'promotions';
    if (activeTab === 'customer_services') return 'services';
    if (activeTab === 'customer_news') return 'news';
    return 'intro';
  };

  return (
    <div className="min-h-screen w-full bg-[#FAF9F6] text-slate-900 font-sans transition-colors duration-200 selection:bg-emerald-800 selection:text-white overflow-x-hidden">
      {/* Top Header Navigation - Rendered in Staff Management Mode */}
      {!isCustomerTab && (
        <Navbar
          currentRole={currentRole}
          lang={lang}
          isDarkMode={isDarkMode}
          activeTab={activeTab}
          notifications={notifications}
          passwords={rolePasswords}
          spaProfile={spaProfile}
          onRoleChange={handleRequestRoleChange}
          onLangToggle={() => setLang((prev) => (prev === 'vi' ? 'en' : 'vi'))}
          onDarkModeToggle={() => setIsDarkMode((prev) => !prev)}
          onTabSelect={setActiveTab}
          onOpenQuickBooking={() => setShowQuickBookingModal(true)}
          onOpenCheckout={() => handleOpenCheckout()}
          onOpenFirebaseSync={() => setShowFirebaseModal(true)}
          onOpenEditSpaProfile={() => setIsEditSpaProfileOpen(true)}
          isFirebaseSyncing={isFirebaseSyncing}
          onMarkNotificationsRead={handleMarkNotificationsRead}
        />
      )}

      {/* Main Layout Container */}
      {isCustomerTab ? (
        /* Full-Width Luxury Editorial Landing Page (Matching Image 1) */
        <main className="w-full min-h-screen overflow-x-hidden pb-20 lg:pb-0">
          <CustomerPortalView
            lang={lang}
            onLangChange={setLang}
            services={services}
            promotions={promotions}
            spaProfile={spaProfile}
            newsArticles={newsArticles}
            currentRole={currentRole}
            onOpenEditSpaProfile={() => setIsEditSpaProfileOpen(true)}
            onOpenStaffLogin={() => {
              setPendingTargetRole('owner');
              setIsPasswordModalOpen(true);
            }}
            onOpenBooking={(serviceId, promoCode) => {
              setBookingInitialServiceId(serviceId);
              setBookingInitialPromoCode(promoCode);
              setShowQuickBookingModal(true);
            }}
            activeCustomerSubTab={getCustomerSubTab()}
            b2bConfig={b2bConfig}
          />
        </main>
      ) : (
        /* Internal Spa Management Workspace with Sidebar & Dashboard */
        <div className="w-full max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 pt-4 sm:pt-6 pb-24 md:pb-8 flex gap-6 min-w-0 overflow-x-hidden">
          {/* Desktop Sidebar */}
          <div className="w-64 shrink-0 hidden md:block">
            <Sidebar
              currentRole={currentRole}
              activeTab={activeTab}
              lang={lang}
              onTabSelect={setActiveTab}
              onRequestStaffLogin={() => {
                setPendingTargetRole('owner');
                setIsPasswordModalOpen(true);
              }}
              onSwitchToCustomer={() => handleRequestRoleChange('customer')}
              onOpenEditSpaProfile={() => setIsEditSpaProfileOpen(true)}
            />
          </div>

          {/* Dynamic Main Workspace Area */}
          <main className="flex-1 min-w-0 w-full overflow-x-hidden">
            {activeTab === 'dashboard' && (
              <DashboardView
                appointments={appointments}
                customers={customers}
                services={services}
                inventory={inventory}
                staff={staff}
                invoices={invoices}
                currentRole={currentRole}
                lang={lang}
                onNavigate={setActiveTab}
                onOpenCheckout={handleOpenCheckout}
                onOpenQuickBooking={() => setShowQuickBookingModal(true)}
                onOpenEditSpaProfile={() => setIsEditSpaProfileOpen(true)}
                onUpdateAppointmentStatus={handleUpdateAppointmentStatus}
              />
            )}

            {!isCustomerTab && activeTab === 'analytics' && (
              <AnalyticsView
                appointments={appointments}
                customers={customers}
                services={services}
                staff={staff}
                lang={lang}
                currentRole={currentRole}
                onOpenPromotions={() => setActiveTab('promotions')}
                onOpenBookingModal={() => setShowQuickBookingModal(true)}
              />
            )}

          {!isCustomerTab && activeTab === 'cost_calculation' && (
            <CostCalculationView
              services={services}
              inventory={inventory}
              lang={lang}
              currentRole={currentRole}
              onAddService={handleAddService}
              onUpdateService={handleUpdateService}
              onDeleteService={handleDeleteService}
              onSaveServiceCost={handleSaveServiceCost}
            />
          )}

          {!isCustomerTab && activeTab === 'appointments' && (
            <AppointmentsView
              appointments={appointments}
              customers={customers}
              services={services}
              staff={staff}
              currentRole={currentRole}
              lang={lang}
              onOpenCheckout={handleOpenCheckout}
              onOpenQuickBooking={() => setShowQuickBookingModal(true)}
              onUpdateStatus={handleUpdateAppointmentStatus}
              onUpdateAppointment={handleUpdateAppointment}
            />
          )}

          {!isCustomerTab && activeTab === 'customers' && (
            <CustomersView
              customers={customers}
              lang={lang}
              currentRole={currentRole}
              onAddCustomer={handleAddCustomer}
              onUpdateCustomer={handleUpdateCustomer}
              onDeleteCustomer={handleDeleteCustomer}
              onClearAllCustomers={handleClearAllCustomers}
              onClearAllInvoices={handleClearAllInvoices}
            />
          )}

          {!isCustomerTab && activeTab === 'inventory' && (
            <InventoryView
              inventory={inventory}
              lang={lang}
              onUpdateInventory={handleUpdateInventory}
              onAddInventoryItem={handleAddInventoryItem}
              onDeleteInventoryItem={handleDeleteInventoryItem}
            />
          )}

          {!isCustomerTab && activeTab === 'staff' && (
            <StaffView
              staff={staff}
              attendance={attendance}
              appointments={appointments}
              services={services}
              lang={lang}
              currentRole={currentRole}
              currentStaffUser={currentStaffUser}
              initialSubTab={currentRole === 'technician' ? 'self_portal' : currentRole === 'receptionist' ? 'tours' : 'directory'}
              onClockIn={handleClockIn}
              onClockOut={handleClockOut}
              onAddStaff={handleAddStaff}
              onUpdateStaff={handleUpdateStaff}
              onToggleStaffStatus={handleToggleStaffStatus}
            />
          )}

          {!isCustomerTab && activeTab === 'timekeeping' && (
            <StaffView
              staff={staff}
              attendance={attendance}
              appointments={appointments}
              services={services}
              lang={lang}
              currentRole={currentRole}
              currentStaffUser={currentStaffUser}
              initialSubTab="timekeeping"
              onClockIn={handleClockIn}
              onClockOut={handleClockOut}
              onAddStaff={handleAddStaff}
              onUpdateStaff={handleUpdateStaff}
              onToggleStaffStatus={handleToggleStaffStatus}
            />
          )}

          {!isCustomerTab && activeTab === 'promotions' && (
            <PromotionsView
              promotions={promotions}
              customers={customers}
              lang={lang}
              onAddPromotion={handleAddPromotion}
              onUpdatePromotion={handleUpdatePromotion}
              onDeletePromotion={handleDeletePromotion}
              onBroadcastNotification={handleBroadcastNotification}
            />
          )}

          {!isCustomerTab && activeTab === 'reports' && (
            <ReportsView
              invoices={invoices}
              services={services}
              lang={lang}
              onDeleteInvoice={handleDeleteInvoice}
              onClearAllInvoices={handleClearAllInvoices}
            />
          )}

          {!isCustomerTab && activeTab === 'b2b_management' && (
            <B2BManagementView
              currentRole={currentRole}
              lang={lang}
              initialConfig={b2bConfig}
              onSaveConfig={handleSaveB2BConfig}
            />
          )}
          </main>
        </div>
      )}

      {/* Mobile Bottom Navigation Bar (For internal staff management) */}
      {!isCustomerTab && (
        <BottomNav
          currentRole={currentRole}
          activeTab={activeTab}
          lang={lang}
          onTabSelect={setActiveTab}
          appointmentBadgeCount={appointments.filter(a => a.date === '2026-08-25' && a.status !== 'completed' && a.status !== 'cancelled').length}
          lowStockCount={inventory.filter(i => i.stockSubUnits <= i.minThresholdSubUnits).length}
          onOpenQuickBooking={() => setShowQuickBookingModal(true)}
          onOpenCheckout={() => handleOpenCheckout()}
          onOpenEditSpaProfile={() => setIsEditSpaProfileOpen(true)}
          onOpenFirebaseSync={() => setShowFirebaseModal(true)}
          onSwitchToCustomer={() => handleRequestRoleChange('customer')}
          onRequestRoleSwitch={handleRequestRoleChange}
        />
      )}

      {/* Role PIN / Password & Personal Staff Login Modal */}
      <RolePasswordModal
        targetRole={pendingTargetRole}
        isOpen={isPasswordModalOpen}
        onClose={() => setIsPasswordModalOpen(false)}
        onSuccess={(verifiedRole, loggedStaff) => applyRoleChange(verifiedRole, loggedStaff)}
        passwords={rolePasswords}
        onUpdatePasswords={handleUpdateRolePasswords}
        isOwnerLoggedIn={currentRole === 'owner'}
        staffList={staff}
      />

      {/* Checkout & Multi-Payment Modal */}
      {showCheckoutModal && (
        <CheckoutModal
          initialAppointment={checkoutAppointment}
          customers={customers}
          services={services}
          staff={staff}
          promotions={promotions}
          lang={lang}
          onClose={() => {
            setShowCheckoutModal(false);
            setCheckoutAppointment(null);
          }}
          onConfirmPayment={handleConfirmPayment}
        />
      )}

      {/* Quick Booking Modal */}
      {showQuickBookingModal && (
        <QuickBookingModal
          customers={customers}
          services={services}
          staff={staff}
          lang={lang}
          initialServiceId={bookingInitialServiceId}
          initialPromoCode={bookingInitialPromoCode}
          onClose={() => {
            setShowQuickBookingModal(false);
            setBookingInitialServiceId(undefined);
            setBookingInitialPromoCode(undefined);
          }}
          onSaveBooking={handleSaveNewBooking}
        />
      )}

      {/* Firebase Cloud Sync Center Modal */}
      <FirebaseSyncModal
        isOpen={showFirebaseModal}
        onClose={() => setShowFirebaseModal(false)}
        lang={lang}
        customers={customers}
        staff={staff}
        services={services}
        appointments={appointments}
        inventory={inventory}
        attendance={attendance}
        promotions={promotions}
        invoices={invoices}
        spaProfile={spaProfile}
        newsArticles={newsArticles}
        isCloudConnected={isFirebaseConnected}
        isSyncing={isFirebaseSyncing}
        lastSyncedTime={lastSyncedTime}
        onRefreshData={() => {
          setServices([]);
          setAppointments([]);
          setInvoices([]);
          setCustomers([]);
          setInventory([]);
          setAttendance([]);
          setPromotions([]);
          setNotifications([]);
        }}
      />

      {/* Spa Profile, Address, Story & Logo Edit Modal */}
      <SpaProfileEditModal
        isOpen={isEditSpaProfileOpen}
        onClose={() => setIsEditSpaProfileOpen(false)}
        spaProfile={spaProfile}
        lang={lang}
        onSave={handleSaveSpaProfile}
      />
    </div>
  );
}
