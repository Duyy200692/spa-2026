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
  AppNotification
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
  initialNotifications
} from './mockData';
import { translations } from './i18n';
import { Navbar } from './components/Navbar';
import { Sidebar } from './components/Sidebar';
import { BottomNav } from './components/BottomNav';
import { DashboardView } from './components/DashboardView';
import { CostCalculationView } from './components/CostCalculationView';
import { AppointmentsView } from './components/AppointmentsView';
import { CustomersView } from './components/CustomersView';
import { InventoryView } from './components/InventoryView';
import { StaffView } from './components/StaffView';
import { PromotionsView } from './components/PromotionsView';
import { ReportsView } from './components/ReportsView';
import { CheckoutModal } from './components/CheckoutModal';
import { QuickBookingModal } from './components/QuickBookingModal';
import { FirebaseSyncModal } from './components/FirebaseSyncModal';
import {
  COLLECTIONS,
  subscribeToCollection,
  syncDocToFirestore,
  deleteDocFromFirestore,
  seedCleanDataToFirebase
} from './firebase';

export default function App() {
  // Global Settings State
  const [lang, setLang] = useState<Language>('vi');
  const [isDarkMode, setIsDarkMode] = useState<boolean>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('spa_theme');
      if (saved) return saved === 'dark';
      return window.matchMedia('(prefers-color-scheme: dark)').matches;
    }
    return false;
  });
  const [currentRole, setCurrentRole] = useState<UserRole>('owner');
  const [activeTab, setActiveTab] = useState<TabType>('dashboard');

  // Application Data States
  const [services, setServices] = useState<Service[]>(initialServices);
  const [inventory, setInventory] = useState<InventoryItem[]>(initialInventory);
  const [customers, setCustomers] = useState<Customer[]>(initialCustomers);
  const [staff, setStaff] = useState<Staff[]>(initialStaff);
  const [appointments, setAppointments] = useState<Appointment[]>(initialAppointments);
  const [attendance, setAttendance] = useState<AttendanceRecord[]>(initialAttendance);
  const [promotions, setPromotions] = useState<Promotion[]>(initialPromotions);
  const [invoices, setInvoices] = useState<Invoice[]>(initialInvoices);
  const [notifications, setNotifications] = useState<AppNotification[]>(initialNotifications);

  // Cloud & Firebase Sync States
  const [isFirebaseConnected, setIsFirebaseConnected] = useState<boolean>(true);
  const [isFirebaseSyncing, setIsFirebaseSyncing] = useState<boolean>(false);
  const [lastSyncedTime, setLastSyncedTime] = useState<Date | null>(new Date());
  const [showFirebaseModal, setShowFirebaseModal] = useState<boolean>(false);

  // Modal States
  const [checkoutAppointment, setCheckoutAppointment] = useState<Appointment | null>(null);
  const [showCheckoutModal, setShowCheckoutModal] = useState<boolean>(false);
  const [showQuickBookingModal, setShowQuickBookingModal] = useState<boolean>(false);

  // Dark Mode Sync & Local Persistence
  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
      try {
        localStorage.setItem('spa_theme', 'dark');
      } catch (e) {
        /* ignore */
      }
    } else {
      document.documentElement.classList.remove('dark');
      try {
        localStorage.setItem('spa_theme', 'light');
      } catch (e) {
        /* ignore */
      }
    }
  }, [isDarkMode]);

  // Realtime Firebase Firestore Subscriptions
  useEffect(() => {
    let unsubs: (() => void)[] = [];
    try {
      // Subscribe to Customers
      unsubs.push(
        subscribeToCollection<Customer>(COLLECTIONS.CUSTOMERS, items => {
          if (items && items.length > 0) {
            setCustomers(items);
            setLastSyncedTime(new Date());
          }
        })
      );

      // Subscribe to Staff
      unsubs.push(
        subscribeToCollection<Staff>(COLLECTIONS.STAFF, items => {
          if (items && items.length > 0) {
            setStaff(items);
            setLastSyncedTime(new Date());
          }
        })
      );

      // Subscribe to Services
      unsubs.push(
        subscribeToCollection<Service>(COLLECTIONS.SERVICES, items => {
          if (items && items.length > 0) {
            setServices(items);
            setLastSyncedTime(new Date());
          }
        })
      );

      // Subscribe to Appointments
      unsubs.push(
        subscribeToCollection<Appointment>(COLLECTIONS.APPOINTMENTS, items => {
          if (items && items.length > 0) {
            setAppointments(items);
            setLastSyncedTime(new Date());
          }
        })
      );

      // Subscribe to Inventory
      unsubs.push(
        subscribeToCollection<InventoryItem>(COLLECTIONS.INVENTORY, items => {
          if (items && items.length > 0) {
            setInventory(items);
            setLastSyncedTime(new Date());
          }
        })
      );

      // Subscribe to Attendance
      unsubs.push(
        subscribeToCollection<AttendanceRecord>(COLLECTIONS.ATTENDANCE, items => {
          if (items && items.length > 0) {
            setAttendance(items);
            setLastSyncedTime(new Date());
          }
        })
      );

      // Subscribe to Promotions
      unsubs.push(
        subscribeToCollection<Promotion>(COLLECTIONS.PROMOTIONS, items => {
          if (items && items.length > 0) {
            setPromotions(items);
            setLastSyncedTime(new Date());
          }
        })
      );

      // Subscribe to Invoices
      unsubs.push(
        subscribeToCollection<Invoice>(COLLECTIONS.INVOICES, items => {
          if (items && items.length > 0) {
            setInvoices(items);
            setLastSyncedTime(new Date());
          }
        })
      );

      // Subscribe to Notifications
      unsubs.push(
        subscribeToCollection<AppNotification>(COLLECTIONS.NOTIFICATIONS, items => {
          if (items && items.length > 0) {
            setNotifications(items);
            setLastSyncedTime(new Date());
          }
        })
      );
    } catch (err) {
      console.warn('Firebase listeners initialized with fallback:', err);
    }

    return () => {
      unsubs.forEach(unsub => unsub?.());
    };
  }, []);

  // Helper to trigger background sync indicator
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
    setAppointments(prev =>
      prev.map(apt => {
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
    setInvoices(prev => [newInvoice, ...prev]);
    trackSync(syncDocToFirestore(COLLECTIONS.INVOICES, newInvoice));

    // If payment was tied to an appointment, mark it completed and paid
    if (newInvoice.appointmentId) {
      let updatedApt: Appointment | null = null;
      setAppointments(prev =>
        prev.map(apt => {
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
    setCustomers(prev =>
      prev.map(c => {
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
    setStaff(prev =>
      prev.map(st => {
        if (st.id === newInvoice.staffId) {
          const commissionEarned = Math.round(
            (newInvoice.subtotal * (st.commissionRate / 100)) + (newInvoice.tipAmount || 0)
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
    setServices(prev =>
      prev.map(s => (s.id === updatedService.id ? updatedService : s))
    );
    trackSync(syncDocToFirestore(COLLECTIONS.SERVICES, updatedService));
  };

  const handleAddCustomer = (newCustomer: Customer) => {
    setCustomers(prev => [newCustomer, ...prev]);
    trackSync(syncDocToFirestore(COLLECTIONS.CUSTOMERS, newCustomer));
  };

  const handleUpdateCustomer = (updatedCustomer: Customer) => {
    setCustomers(prev =>
      prev.map(c => (c.id === updatedCustomer.id ? updatedCustomer : c))
    );
    trackSync(syncDocToFirestore(COLLECTIONS.CUSTOMERS, updatedCustomer));
  };

  const handleUpdateInventory = (updatedItem: InventoryItem) => {
    setInventory(prev =>
      prev.map(item => (item.id === updatedItem.id ? updatedItem : item))
    );
    trackSync(syncDocToFirestore(COLLECTIONS.INVENTORY, updatedItem));
  };

  const handleAddInventoryItem = (newItem: InventoryItem) => {
    setInventory(prev => [newItem, ...prev]);
    trackSync(syncDocToFirestore(COLLECTIONS.INVENTORY, newItem));
  };

  const handleDeleteInventoryItem = (itemId: string) => {
    setInventory(prev => prev.filter(item => item.id !== itemId));
    trackSync(deleteDocFromFirestore(COLLECTIONS.INVENTORY, itemId));
  };

  const handleAddService = (newService: Service) => {
    setServices(prev => [newService, ...prev]);
    trackSync(syncDocToFirestore(COLLECTIONS.SERVICES, newService));
  };

  const handleUpdateService = (updatedService: Service) => {
    setServices(prev =>
      prev.map(s => (s.id === updatedService.id ? updatedService : s))
    );
    trackSync(syncDocToFirestore(COLLECTIONS.SERVICES, updatedService));
  };

  const handleClockIn = (newRecord: AttendanceRecord) => {
    setAttendance(prev => [newRecord, ...prev]);
    trackSync(syncDocToFirestore(COLLECTIONS.ATTENDANCE, newRecord));
  };

  const handleClockOut = (recordId: string) => {
    const now = new Date();
    const timeStr = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;
    let updatedAtt: AttendanceRecord | null = null;
    setAttendance(prev =>
      prev.map(att => {
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
    setStaff(prev => [newStaffMember, ...prev]);
    trackSync(syncDocToFirestore(COLLECTIONS.STAFF, newStaffMember));
  };

  const handleUpdateStaff = (updatedStaff: Staff) => {
    setStaff(prev =>
      prev.map(st => (st.id === updatedStaff.id ? updatedStaff : st))
    );
    trackSync(syncDocToFirestore(COLLECTIONS.STAFF, updatedStaff));
  };

  const handleToggleStaffStatus = (staffId: string, newStatus: Staff['status'], resignationData?: { endDate: string; reason: string }) => {
    let updatedMember: Staff | null = null;
    setStaff(prev =>
      prev.map(st => {
        if (st.id === staffId) {
          if (newStatus === 'resigned') {
            updatedMember = {
              ...st,
              status: 'resigned',
              endDate: resignationData?.endDate || new Date().toISOString().slice(0, 10),
              resignationReason: resignationData?.reason || 'Thôi việc theo nguyện vọng cá nhân',
            };
          } else if (newStatus === 'active') {
            updatedMember = {
              ...st,
              status: 'active',
              endDate: undefined,
              resignationReason: undefined,
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
    setPromotions(prev => [newPromo, ...prev]);
    trackSync(syncDocToFirestore(COLLECTIONS.PROMOTIONS, newPromo));
  };

  const handleBroadcastNotification = (notif: AppNotification) => {
    setNotifications(prev => [notif, ...prev]);
    trackSync(syncDocToFirestore(COLLECTIONS.NOTIFICATIONS, notif));
  };

  const handleMarkNotificationsRead = () => {
    setNotifications(prev => {
      const updated = prev.map(n => ({ ...n, read: true }));
      updated.forEach(n => syncDocToFirestore(COLLECTIONS.NOTIFICATIONS, n));
      return updated;
    });
  };

  const handleSaveNewBooking = (newApt: Appointment) => {
    setAppointments(prev => [newApt, ...prev]);
    trackSync(syncDocToFirestore(COLLECTIONS.APPOINTMENTS, newApt));
  };

  const handleUpdateAppointment = (updatedApt: Appointment) => {
    setAppointments(prev =>
      prev.map(apt => (apt.id === updatedApt.id ? updatedApt : apt))
    );
    trackSync(syncDocToFirestore(COLLECTIONS.APPOINTMENTS, updatedApt));
  };

  const handleRoleChange = (newRole: Role) => {
    setCurrentRole(newRole);
    if (newRole === 'technician') {
      const allowedForTech: TabType[] = ['appointments', 'timekeeping', 'promotions'];
      if (!allowedForTech.includes(activeTab)) {
        setActiveTab('appointments');
      }
    } else if (newRole === 'receptionist') {
      const allowedForReception: TabType[] = ['appointments', 'timekeeping', 'promotions', 'staff'];
      if (!allowedForReception.includes(activeTab)) {
        setActiveTab('appointments');
      }
    }
  };

  return (
    <div className="min-h-screen bg-[#F5F7F4] dark:bg-[#121412] text-[#1C211B] dark:text-[#E0E2DF] font-sans transition-colors duration-200 selection:bg-[#8BA888]/40 selection:text-[#1C211B] dark:selection:text-[#E0E2DF]">
      {/* Top Fixed Header Navigation */}
      <Navbar
        currentRole={currentRole}
        lang={lang}
        isDarkMode={isDarkMode}
        activeTab={activeTab}
        notifications={notifications}
        onRoleChange={handleRoleChange}
        onLangToggle={() => setLang(prev => (prev === 'vi' ? 'en' : 'vi'))}
        onDarkModeToggle={() => setIsDarkMode(prev => !prev)}
        onTabSelect={setActiveTab}
        onOpenQuickBooking={() => setShowQuickBookingModal(true)}
        onOpenCheckout={() => handleOpenCheckout()}
        onOpenFirebaseSync={() => setShowFirebaseModal(true)}
        isFirebaseSyncing={isFirebaseSyncing}
        onMarkNotificationsRead={handleMarkNotificationsRead}
      />

      {/* Main Layout Container */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-20 md:pb-8 flex gap-6">
        {/* Desktop Sidebar (Left side, Role-based filtered) */}
        <div className="w-64 shrink-0 hidden md:block">
          <Sidebar
            currentRole={currentRole}
            activeTab={activeTab}
            lang={lang}
            onTabSelect={setActiveTab}
          />
        </div>

        {/* Dynamic Main Workspace Area */}
        <main className="flex-1 min-w-0">
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
              onUpdateAppointmentStatus={handleUpdateAppointmentStatus}
            />
          )}

          {activeTab === 'cost_calculation' && (
            <CostCalculationView
              services={services}
              inventory={inventory}
              lang={lang}
              onAddService={handleAddService}
              onUpdateService={handleUpdateService}
              onSaveServiceCost={handleSaveServiceCost}
            />
          )}

          {activeTab === 'appointments' && (
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

          {activeTab === 'customers' && (
            <CustomersView
              customers={customers}
              lang={lang}
              onAddCustomer={handleAddCustomer}
              onUpdateCustomer={handleUpdateCustomer}
            />
          )}

          {activeTab === 'inventory' && (
            <InventoryView
              inventory={inventory}
              lang={lang}
              onUpdateInventory={handleUpdateInventory}
              onAddInventoryItem={handleAddInventoryItem}
              onDeleteInventoryItem={handleDeleteInventoryItem}
            />
          )}

          {activeTab === 'staff' && (
            <StaffView
              staff={staff}
              attendance={attendance}
              lang={lang}
              currentRole={currentRole}
              initialSubTab={currentRole === 'receptionist' ? 'tours' : 'directory'}
              onClockIn={handleClockIn}
              onClockOut={handleClockOut}
              onAddStaff={handleAddStaff}
              onUpdateStaff={handleUpdateStaff}
              onToggleStaffStatus={handleToggleStaffStatus}
            />
          )}

          {activeTab === 'timekeeping' && (
            <StaffView
              staff={staff}
              attendance={attendance}
              lang={lang}
              currentRole={currentRole}
              initialSubTab="timekeeping"
              onClockIn={handleClockIn}
              onClockOut={handleClockOut}
              onAddStaff={handleAddStaff}
              onUpdateStaff={handleUpdateStaff}
              onToggleStaffStatus={handleToggleStaffStatus}
            />
          )}

          {activeTab === 'promotions' && (
            <PromotionsView
              promotions={promotions}
              customers={customers}
              lang={lang}
              onAddPromotion={handleAddPromotion}
              onBroadcastNotification={handleBroadcastNotification}
            />
          )}

          {activeTab === 'reports' && (
            <ReportsView
              invoices={invoices}
              services={services}
              lang={lang}
            />
          )}
        </main>
      </div>

      {/* Mobile Bottom Navigation Bar */}
      <BottomNav
        currentRole={currentRole}
        activeTab={activeTab}
        lang={lang}
        onTabSelect={setActiveTab}
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
          onClose={() => setShowQuickBookingModal(false)}
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
        isCloudConnected={isFirebaseConnected}
        isSyncing={isFirebaseSyncing}
        lastSyncedTime={lastSyncedTime}
      />
    </div>
  );
}

