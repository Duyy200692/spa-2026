import { initializeApp, getApps, getApp } from 'firebase/app';
import {
  getFirestore,
  collection,
  doc,
  setDoc,
  deleteDoc,
  onSnapshot,
  getDocs,
  writeBatch,
  Firestore
} from 'firebase/firestore';
import firebaseConfig from '../firebase-applet-config.json';
import {
  Customer,
  Staff,
  Service,
  Appointment,
  InventoryItem,
  AttendanceRecord,
  Promotion,
  Invoice,
  AppNotification
} from './types';
import {
  initialCustomers,
  initialStaff,
  initialServices,
  initialAppointments,
  initialInventory,
  initialAttendance,
  initialPromotions,
  initialInvoices,
  initialNotifications
} from './mockData';

// Initialize Firebase App
const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();

// Initialize Firestore
// If custom firestoreDatabaseId is provided in config, use it
export const db: Firestore = (firebaseConfig as any).firestoreDatabaseId
  ? getFirestore(app, (firebaseConfig as any).firestoreDatabaseId)
  : getFirestore(app);

export const FIREBASE_PROJECT_ID = firebaseConfig.projectId || 'spa2026-68441';

// Helper to remove undefined fields recursively to prevent Firestore errors
export function sanitizeForFirestore<T>(data: T): T {
  if (data === null || data === undefined) {
    return null as any;
  }
  if (Array.isArray(data)) {
    return data.map(item => sanitizeForFirestore(item)) as any;
  }
  if (typeof data === 'object' && !(data instanceof Date)) {
    const cleaned: any = {};
    for (const [key, value] of Object.entries(data)) {
      if (value !== undefined) {
        cleaned[key] = sanitizeForFirestore(value);
      }
    }
    return cleaned;
  }
  return data;
}

// Collection names constants
export const COLLECTIONS = {
  CUSTOMERS: 'customers',
  STAFF: 'staff',
  SERVICES: 'services',
  APPOINTMENTS: 'appointments',
  INVENTORY: 'inventory',
  ATTENDANCE: 'attendance',
  PROMOTIONS: 'promotions',
  INVOICES: 'invoices',
  NOTIFICATIONS: 'notifications',
} as const;

// Generic Firestore Realtime Subscription
export function subscribeToCollection<T extends { id: string }>(
  collectionName: string,
  onData: (items: T[]) => void,
  onError?: (err: Error) => void
) {
  try {
    const colRef = collection(db, collectionName);
    return onSnapshot(
      colRef,
      snapshot => {
        const items = snapshot.docs.map(doc => ({
          ...(doc.data() as T),
          id: doc.id,
        }));
        onData(items);
      },
      error => {
        console.error(`Firebase snapshot error on ${collectionName}:`, error);
        if (onError) onError(error);
      }
    );
  } catch (error: any) {
    console.error(`Failed to subscribe to ${collectionName}:`, error);
    if (onError) onError(error);
    return () => {};
  }
}

// Save or Update Single Document (Auto-sync to Firebase)
export async function syncDocToFirestore<T extends { id: string }>(
  collectionName: string,
  item: T
): Promise<void> {
  try {
    const sanitized = sanitizeForFirestore(item);
    const docRef = doc(db, collectionName, item.id);
    await setDoc(docRef, sanitized, { merge: true });
  } catch (error) {
    console.error(`Failed to sync document ${item.id} to ${collectionName}:`, error);
    throw error;
  }
}

// Delete Document from Firestore
export async function deleteDocFromFirestore(
  collectionName: string,
  id: string
): Promise<void> {
  try {
    const docRef = doc(db, collectionName, id);
    await deleteDoc(docRef);
  } catch (error) {
    console.error(`Failed to delete document ${id} from ${collectionName}:`, error);
    throw error;
  }
}

// Batch Upload / Seed Clean Mock Data into Firebase
export async function seedCleanDataToFirebase(onProgress?: (msg: string) => void): Promise<void> {
  try {
    onProgress?.('Đang kết nối Firestore...');

    const batch = writeBatch(db);

    // 1. Customers
    onProgress?.('Đang nạp dữ liệu khách hàng sạch...');
    initialCustomers.forEach(cust => {
      const ref = doc(db, COLLECTIONS.CUSTOMERS, cust.id);
      batch.set(ref, sanitizeForFirestore(cust));
    });

    // 2. Staff
    onProgress?.('Đang nạp dữ liệu nhân sự & thâm niên...');
    initialStaff.forEach(st => {
      const ref = doc(db, COLLECTIONS.STAFF, st.id);
      batch.set(ref, sanitizeForFirestore(st));
    });

    // 3. Services
    onProgress?.('Đang nạp bảng dịch vụ & định mức cost...');
    initialServices.forEach(srv => {
      const ref = doc(db, COLLECTIONS.SERVICES, srv.id);
      batch.set(ref, sanitizeForFirestore(srv));
    });

    // 4. Inventory
    onProgress?.('Đang nạp kho mỹ phẩm & vật tư...');
    initialInventory.forEach(inv => {
      const ref = doc(db, COLLECTIONS.INVENTORY, inv.id);
      batch.set(ref, sanitizeForFirestore(inv));
    });

    // 5. Appointments
    onProgress?.('Đang nạp lịch hẹn & ca điều trị...');
    initialAppointments.forEach(apt => {
      const ref = doc(db, COLLECTIONS.APPOINTMENTS, apt.id);
      batch.set(ref, sanitizeForFirestore(apt));
    });

    // 6. Attendance
    onProgress?.('Đang nạp nhật ký chấm công...');
    initialAttendance.forEach(att => {
      const ref = doc(db, COLLECTIONS.ATTENDANCE, att.id);
      batch.set(ref, sanitizeForFirestore(att));
    });

    // 7. Promotions
    onProgress?.('Đang nạp chương trình khuyến mãi...');
    initialPromotions.forEach(promo => {
      const ref = doc(db, COLLECTIONS.PROMOTIONS, promo.id);
      batch.set(ref, sanitizeForFirestore(promo));
    });

    // 8. Invoices
    onProgress?.('Đang nạp hóa đơn & doanh thu...');
    initialInvoices.forEach(inv => {
      const ref = doc(db, COLLECTIONS.INVOICES, inv.id);
      batch.set(ref, sanitizeForFirestore(inv));
    });

    // 9. Notifications
    onProgress?.('Đang nạp thông báo hệ thống...');
    initialNotifications.forEach(notif => {
      const ref = doc(db, COLLECTIONS.NOTIFICATIONS, notif.id);
      batch.set(ref, sanitizeForFirestore(notif));
    });

    await batch.commit();
    onProgress?.('Đã đồng bộ thành công toàn bộ dữ liệu sạch lên Firebase!');
  } catch (error) {
    console.error('Error seeding clean data to Firebase:', error);
    throw error;
  }
}

// Clear all data in all collections (For running completely clean/blank slate)
export async function clearAllCollectionsFromFirebase(onProgress?: (msg: string) => void): Promise<void> {
  const collectionNames = Object.values(COLLECTIONS);
  for (const colName of collectionNames) {
    onProgress?.(`Đang dọn dẹp bảng ${colName}...`);
    const colRef = collection(db, colName);
    const snap = await getDocs(colRef);
    const batch = writeBatch(db);
    snap.docs.forEach(d => {
      batch.delete(d.ref);
    });
    if (snap.docs.length > 0) {
      await batch.commit();
    }
  }
  onProgress?.('Đã dọn dẹp sạch toàn bộ cơ sở dữ liệu trên Firebase!');
}
