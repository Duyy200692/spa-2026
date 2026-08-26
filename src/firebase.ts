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
  AppNotification,
  SpaProfile,
  NewsArticle,
  RolePasswords
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
  initialNotifications,
  initialSpaProfile,
  initialNewsArticles,
  initialRolePasswords
} from './mockData';

// Initialize Firebase App
const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();

// Initialize Firestore
// If custom firestoreDatabaseId is provided in config, use it
export const db: Firestore = (firebaseConfig as any).firestoreDatabaseId
  ? getFirestore(app, (firebaseConfig as any).firestoreDatabaseId)
  : getFirestore(app);

export const FIREBASE_PROJECT_ID = (firebaseConfig as any).projectId || 'gen-lang-client-0057677543';
export const FIRESTORE_DATABASE_ID = (firebaseConfig as any).firestoreDatabaseId || 'ai-studio-spamasterhthngqu-ed792d51-a46c-4eb0-b9b6-eb636c943fec';
export const RTDB_BASE_URL = `https://${FIREBASE_PROJECT_ID}-default-rtdb.asia-southeast1.firebasedatabase.app`;

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

// Sync to Realtime Database REST API in background
export async function syncToRealtimeDatabase(path: string, data: any): Promise<void> {
  try {
    const cleanData = sanitizeForFirestore(data);
    const url = `${RTDB_BASE_URL}/${path}.json`;
    await fetch(url, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(cleanData),
    }).catch(err => {
      console.warn(`[RTDB Sync Note] Non-blocking push to RTDB (${path}):`, err);
    });
  } catch (err) {
    // Non-blocking catch
  }
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
  SPA_PROFILE: 'spa_profile',
  NEWS: 'news',
  SYSTEM: 'system_settings',
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

// Save or Update Single Document (Auto-sync to Firebase Firestore & RTDB)
export async function syncDocToFirestore<T extends { id: string }>(
  collectionName: string,
  item: T
): Promise<void> {
  try {
    const sanitized = sanitizeForFirestore(item);
    const docRef = doc(db, collectionName, item.id);
    await setDoc(docRef, sanitized, { merge: true });

    // Also mirror to Realtime Database endpoint automatically
    syncToRealtimeDatabase(`${collectionName}/${item.id}`, sanitized);
  } catch (error) {
    console.error(`Failed to sync document ${item.id} to ${collectionName}:`, error);
    throw error;
  }
}

// Delete Document from Firestore & RTDB
export async function deleteDocFromFirestore(
  collectionName: string,
  id: string
): Promise<void> {
  try {
    const docRef = doc(db, collectionName, id);
    await deleteDoc(docRef);

    // Also delete from Realtime Database endpoint
    try {
      fetch(`${RTDB_BASE_URL}/${collectionName}/${id}.json`, { method: 'DELETE' }).catch(() => {});
    } catch (_) {}
  } catch (error) {
    console.error(`Failed to delete document ${id} from ${collectionName}:`, error);
    throw error;
  }
}

// Clear single specific collection from Firestore and RTDB
export async function clearCollectionFromFirebase(
  collectionName: string,
  onProgress?: (msg: string) => void
): Promise<void> {
  try {
    onProgress?.(`Đang xóa toàn bộ dữ liệu trong bảng ${collectionName}...`);
    const colRef = collection(db, collectionName);
    const snap = await getDocs(colRef);
    if (snap.docs.length > 0) {
      const batch = writeBatch(db);
      snap.docs.forEach(d => {
        batch.delete(d.ref);
      });
      await batch.commit();
    }
    // Also delete the RTDB node
    try {
      fetch(`${RTDB_BASE_URL}/${collectionName}.json`, { method: 'DELETE' }).catch(() => {});
    } catch (_) {}
    onProgress?.(`Đã làm sạch bảng ${collectionName} thành công!`);
  } catch (error) {
    console.error(`Failed to clear collection ${collectionName}:`, error);
    throw error;
  }
}

// Batch Upload / Seed Clean Mock Data into Firebase (Firestore & RTDB)
export async function seedCleanDataToFirebase(onProgress?: (msg: string) => void): Promise<void> {
  try {
    onProgress?.('Đang kết nối Firestore & Realtime Database...');

    const batch = writeBatch(db);
    const rtdbPayload: Record<string, any> = {};

    // 1. Customers
    onProgress?.('Đang nạp dữ liệu khách hàng sạch...');
    rtdbPayload.customers = {};
    initialCustomers.forEach(cust => {
      const ref = doc(db, COLLECTIONS.CUSTOMERS, cust.id);
      const clean = sanitizeForFirestore(cust);
      batch.set(ref, clean);
      rtdbPayload.customers[cust.id] = clean;
    });

    // 2. Staff
    onProgress?.('Đang nạp dữ liệu nhân sự & thâm niên...');
    rtdbPayload.staff = {};
    initialStaff.forEach(st => {
      const ref = doc(db, COLLECTIONS.STAFF, st.id);
      const clean = sanitizeForFirestore(st);
      batch.set(ref, clean);
      rtdbPayload.staff[st.id] = clean;
    });

    // 3. Services
    onProgress?.('Đang nạp bảng dịch vụ & định mức cost...');
    rtdbPayload.services = {};
    initialServices.forEach(srv => {
      const ref = doc(db, COLLECTIONS.SERVICES, srv.id);
      const clean = sanitizeForFirestore(srv);
      batch.set(ref, clean);
      rtdbPayload.services[srv.id] = clean;
    });

    // 4. Inventory
    onProgress?.('Đang nạp kho mỹ phẩm & vật tư...');
    rtdbPayload.inventory = {};
    initialInventory.forEach(inv => {
      const ref = doc(db, COLLECTIONS.INVENTORY, inv.id);
      const clean = sanitizeForFirestore(inv);
      batch.set(ref, clean);
      rtdbPayload.inventory[inv.id] = clean;
    });

    // 5. Appointments
    onProgress?.('Đang nạp lịch hẹn & ca điều trị...');
    rtdbPayload.appointments = {};
    initialAppointments.forEach(apt => {
      const ref = doc(db, COLLECTIONS.APPOINTMENTS, apt.id);
      const clean = sanitizeForFirestore(apt);
      batch.set(ref, clean);
      rtdbPayload.appointments[apt.id] = clean;
    });

    // 6. Attendance
    onProgress?.('Đang nạp nhật ký chấm công...');
    rtdbPayload.attendance = {};
    initialAttendance.forEach(att => {
      const ref = doc(db, COLLECTIONS.ATTENDANCE, att.id);
      const clean = sanitizeForFirestore(att);
      batch.set(ref, clean);
      rtdbPayload.attendance[att.id] = clean;
    });

    // 7. Promotions
    onProgress?.('Đang nạp chương trình khuyến mãi...');
    rtdbPayload.promotions = {};
    initialPromotions.forEach(promo => {
      const ref = doc(db, COLLECTIONS.PROMOTIONS, promo.id);
      const clean = sanitizeForFirestore(promo);
      batch.set(ref, clean);
      rtdbPayload.promotions[promo.id] = clean;
    });

    // 8. Invoices
    onProgress?.('Đang nạp hóa đơn & doanh thu...');
    rtdbPayload.invoices = {};
    initialInvoices.forEach(inv => {
      const ref = doc(db, COLLECTIONS.INVOICES, inv.id);
      const clean = sanitizeForFirestore(inv);
      batch.set(ref, clean);
      rtdbPayload.invoices[inv.id] = clean;
    });

    // 9. Notifications
    onProgress?.('Đang nạp thông báo hệ thống...');
    rtdbPayload.notifications = {};
    initialNotifications.forEach(notif => {
      const ref = doc(db, COLLECTIONS.NOTIFICATIONS, notif.id);
      const clean = sanitizeForFirestore(notif);
      batch.set(ref, clean);
      rtdbPayload.notifications[notif.id] = clean;
    });

    // 10. Spa Profile
    onProgress?.('Đang nạp bài giới thiệu spa...');
    const spaClean = sanitizeForFirestore(initialSpaProfile);
    const spaRef = doc(db, COLLECTIONS.SPA_PROFILE, initialSpaProfile.id);
    batch.set(spaRef, spaClean);
    rtdbPayload.spa_profile = { [initialSpaProfile.id]: spaClean };

    // 11. News Articles
    onProgress?.('Đang nạp tin tức & cẩm nang...');
    rtdbPayload.news = {};
    initialNewsArticles.forEach(art => {
      const ref = doc(db, COLLECTIONS.NEWS, art.id);
      const clean = sanitizeForFirestore(art);
      batch.set(ref, clean);
      rtdbPayload.news[art.id] = clean;
    });

    // 12. System Passwords
    onProgress?.('Đang thiết lập mật khẩu phân quyền bảo mật...');
    const pwClean = sanitizeForFirestore(initialRolePasswords);
    const pwRef = doc(db, COLLECTIONS.SYSTEM, 'passwords');
    batch.set(pwRef, pwClean);
    rtdbPayload.system_settings = { passwords: pwClean };

    // Commit to Firestore
    await batch.commit();

    // Also push entire schema to Realtime Database endpoint
    onProgress?.('Đang đồng bộ Realtime Database...');
    await syncToRealtimeDatabase('', rtdbPayload);

    onProgress?.('Đã đồng bộ thành công toàn bộ dữ liệu sạch lên Firebase & RTDB!');
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
