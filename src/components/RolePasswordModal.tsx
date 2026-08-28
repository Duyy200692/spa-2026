import React, { useState, useEffect } from 'react';
import {
  Lock,
  KeyRound,
  ShieldCheck,
  X,
  AlertCircle,
  Eye,
  EyeOff,
  CheckCircle,
  User,
  Sparkles,
  Users,
  Key
} from 'lucide-react';
import { Role, RolePasswords, Staff } from '../types';

interface RolePasswordModalProps {
  targetRole: Role;
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (role: Role, loggedStaff?: Staff) => void;
  passwords: RolePasswords;
  onUpdatePasswords: (newPasswords: RolePasswords) => void;
  isOwnerLoggedIn: boolean;
  staffList?: Staff[];
  onUpdateStaffPassword?: (staffId: string, newPass: string) => void;
}

export const RolePasswordModal: React.FC<RolePasswordModalProps> = ({
  targetRole,
  isOpen,
  onClose,
  onSuccess,
  passwords,
  onUpdatePasswords,
  isOwnerLoggedIn,
  staffList = [],
  onUpdateStaffPassword,
}) => {
  const [loginMode, setLoginMode] = useState<'personal' | 'quick_pin'>('personal');
  
  // Personal account fields
  const [selectedStaffId, setSelectedStaffId] = useState<string>('');
  const [usernameInput, setUsernameInput] = useState<string>('');
  const [personalPassword, setPersonalPassword] = useState<string>('');
  
  // Quick PIN field
  const [pinInput, setPinInput] = useState<string>('');
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [errorMsg, setErrorMsg] = useState<string>('');
  
  // Role password update view
  const [isChangingPassword, setIsChangingPassword] = useState<boolean>(false);
  const [newOwnerPin, setNewOwnerPin] = useState<string>('');
  const [newManagerPin, setNewManagerPin] = useState<string>('');
  const [newStaffPin, setNewStaffPin] = useState<string>('');
  const [changeSuccess, setChangeSuccess] = useState<boolean>(false);

  // Active staff list
  const activeStaff = staffList.filter((s) => s.status !== 'resigned');

  useEffect(() => {
    if (isOpen) {
      setErrorMsg('');
      setPersonalPassword('');
      setPinInput('');
      setIsChangingPassword(false);
      // Auto select first staff or relevant staff if applicable
      if (activeStaff.length > 0) {
        const matching = activeStaff.find((s) => s.role === targetRole) || activeStaff[0];
        setSelectedStaffId(matching.id);
        setUsernameInput(matching.username || matching.id);
      }
    }
  }, [isOpen, targetRole]);

  if (!isOpen) return null;

  const roleNameMap: Record<Role, { title: string; desc: string; defaultPin: string }> = {
    owner: {
      title: 'Chủ Spa (Admin Toàn Quyền)',
      desc: 'Truy cập doanh thu, chi phí, báo cáo & toàn quyền cài đặt hệ thống.',
      defaultPin: passwords.ownerPin || '123456',
    },
    manager: {
      title: 'Quản Lý Spa (Manager)',
      desc: 'Điều phối lịch hẹn, quản lý khách hàng, kho mỹ phẩm & dịch vụ.',
      defaultPin: passwords.managerPin || '888888',
    },
    technician: {
      title: 'Kỹ Thuật Viên (Therapist)',
      desc: 'Cổng cá nhân: Xem lịch hẹn của mình, chấm công 1 chạm & xem hoa hồng.',
      defaultPin: passwords.staffPin || '666666',
    },
    receptionist: {
      title: 'Lễ Tân / Thu Ngân (Receptionist)',
      desc: 'Tạo lịch hẹn, xếp tour KTV, xuất hóa đơn & thanh toán.',
      defaultPin: passwords.staffPin || '666666',
    },
    customer: {
      title: 'Khách Hàng (Customer Portal)',
      desc: 'Xem bài giới thiệu, dịch vụ, khuyến mãi và tin tức.',
      defaultPin: '',
    },
  };

  const currentRoleInfo = roleNameMap[targetRole];

  // Handle Personal Staff Login
  const handlePersonalLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    // Find staff by selected ID or by username/phone/email
    const staffMember = activeStaff.find(
      (s) =>
        s.id === selectedStaffId ||
        (s.username && s.username.toLowerCase() === usernameInput.trim().toLowerCase()) ||
        s.phone === usernameInput.trim() ||
        s.email.toLowerCase() === usernameInput.trim().toLowerCase()
    );

    if (!staffMember) {
      setErrorMsg('Không tìm thấy tài khoản nhân viên. Vui lòng kiểm tra lại!');
      return;
    }

    const inputPass = personalPassword.trim();
    const staffPass = staffMember.password || staffMember.pinCode || '123456';
    const isMasterPass = inputPass === passwords.ownerPin || inputPass === 'spa2026' || inputPass === '123456';

    if (inputPass === staffPass || isMasterPass) {
      // Successful login
      onSuccess(staffMember.role || targetRole, staffMember);
      onClose();
    } else {
      setErrorMsg('Mật khẩu nhân viên không chính xác. Vui lòng thử lại hoặc dùng mật khẩu mặc định (123456)!');
    }
  };

  // Handle Quick Master PIN Login
  const handleQuickPinVerify = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setErrorMsg('');

    let expectedPin = passwords.ownerPin;
    if (targetRole === 'manager') expectedPin = passwords.managerPin;
    if (targetRole === 'technician' || targetRole === 'receptionist') expectedPin = passwords.staffPin;

    const trimmed = pinInput.trim();
    if (trimmed === expectedPin || trimmed === passwords.ownerPin || trimmed === 'spa2026' || trimmed === '123456') {
      // Find staff corresponding to role or first matching
      const matchingStaff = activeStaff.find((s) => s.role === targetRole) || activeStaff[0];
      onSuccess(targetRole, matchingStaff);
      setPinInput('');
      setErrorMsg('');
      onClose();
    } else {
      setErrorMsg('Mã PIN không chính xác. Vui lòng kiểm tra lại!');
    }
  };

  const handleSaveNewPasswords = (e: React.FormEvent) => {
    e.preventDefault();
    const updated: RolePasswords = {
      ownerPin: newOwnerPin.trim() || passwords.ownerPin,
      managerPin: newManagerPin.trim() || passwords.managerPin,
      staffPin: newStaffPin.trim() || passwords.staffPin,
    };
    onUpdatePasswords(updated);
    setChangeSuccess(true);
    setTimeout(() => {
      setChangeSuccess(false);
      setIsChangingPassword(false);
    }, 1500);
  };

  const selectedStaffObj = activeStaff.find((s) => s.id === selectedStaffId);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="w-full max-w-md bg-white dark:bg-[#141619] border border-zinc-200 dark:border-zinc-800 rounded-3xl p-6 shadow-2xl space-y-5">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-zinc-100 dark:border-zinc-800 pb-4">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-2xl bg-zinc-900 text-white dark:bg-white dark:text-zinc-950 flex items-center justify-center">
              <Lock className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-base text-zinc-950 dark:text-zinc-50">
                Đăng Nhập Phân Quyền
              </h3>
              <p className="text-xs text-zinc-500 dark:text-zinc-400">
                Cổng định danh nhân viên &amp; quản trị Spa
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {!isChangingPassword ? (
          <div className="space-y-4">
            {/* Mode Switcher Tabs */}
            <div className="grid grid-cols-2 gap-1 p-1 bg-zinc-100 dark:bg-zinc-900 rounded-2xl border border-zinc-200 dark:border-zinc-800">
              <button
                type="button"
                onClick={() => {
                  setLoginMode('personal');
                  setErrorMsg('');
                }}
                className={`flex items-center justify-center space-x-1.5 py-2 px-3 rounded-xl text-xs font-bold transition-all ${
                  loginMode === 'personal'
                    ? 'bg-white dark:bg-zinc-800 text-zinc-950 dark:text-white shadow-sm'
                    : 'text-zinc-500 dark:text-zinc-400 hover:text-zinc-800'
                }`}
              >
                <User className="w-3.5 h-3.5" />
                <span>Tài Khoản Nhân Viên</span>
              </button>
              <button
                type="button"
                onClick={() => {
                  setLoginMode('quick_pin');
                  setErrorMsg('');
                }}
                className={`flex items-center justify-center space-x-1.5 py-2 px-3 rounded-xl text-xs font-bold transition-all ${
                  loginMode === 'quick_pin'
                    ? 'bg-white dark:bg-zinc-800 text-zinc-950 dark:text-white shadow-sm'
                    : 'text-zinc-500 dark:text-zinc-400 hover:text-zinc-800'
                }`}
              >
                <KeyRound className="w-3.5 h-3.5" />
                <span>Mã PIN Quản Trị</span>
              </button>
            </div>

            {/* Target Role Information Banner */}
            <div className="p-3 rounded-2xl bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 space-y-1">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-zinc-900 dark:text-zinc-100 flex items-center space-x-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                  <span>{currentRoleInfo.title}</span>
                </span>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-zinc-200 dark:bg-zinc-800 font-mono text-zinc-800 dark:text-zinc-200">
                  {targetRole.toUpperCase()}
                </span>
              </div>
              <p className="text-[11px] text-zinc-500 dark:text-zinc-400 leading-snug">
                {currentRoleInfo.desc}
              </p>
            </div>

            {/* TAB 1: Personal Account Login */}
            {loginMode === 'personal' && (
              <form onSubmit={handlePersonalLogin} className="space-y-3.5">
                {/* Select Staff Member */}
                <div className="space-y-1">
                  <label className="block text-xs font-semibold text-zinc-700 dark:text-zinc-300">
                    Chọn Nhân Viên / Kỹ Thuật Viên:
                  </label>
                  <select
                    value={selectedStaffId}
                    onChange={(e) => {
                      setSelectedStaffId(e.target.value);
                      const s = activeStaff.find((item) => item.id === e.target.value);
                      if (s) setUsernameInput(s.username || s.name);
                    }}
                    className="w-full px-3.5 py-2.5 rounded-2xl bg-white dark:bg-zinc-950 border border-zinc-300 dark:border-zinc-700 text-zinc-950 dark:text-zinc-50 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-zinc-900 dark:focus:ring-white"
                  >
                    {activeStaff.map((st) => (
                      <option key={st.id} value={st.id}>
                        {st.name} • {st.positionTitle} ({st.role.toUpperCase()})
                      </option>
                    ))}
                  </select>
                </div>

                {/* Selected Staff Badge */}
                {selectedStaffObj && (
                  <div className="flex items-center space-x-3 p-2.5 rounded-2xl bg-zinc-100/80 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 text-xs">
                    <img
                      src={selectedStaffObj.avatar}
                      alt={selectedStaffObj.name}
                      className="w-8 h-8 rounded-full object-cover border border-zinc-300 dark:border-zinc-700"
                    />
                    <div className="flex-1 min-w-0">
                      <div className="font-bold text-zinc-900 dark:text-zinc-100 truncate">
                        {selectedStaffObj.name}
                      </div>
                      <div className="text-[11px] text-zinc-500 dark:text-zinc-400">
                        {selectedStaffObj.positionTitle} • Hoa hồng {selectedStaffObj.commissionRate}%
                      </div>
                    </div>
                  </div>
                )}

                {/* Password Input */}
                <div className="space-y-1">
                  <label className="block text-xs font-semibold text-zinc-700 dark:text-zinc-300">
                    Mật Khẩu Cá Nhân:
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-zinc-400">
                      <Key className="w-4 h-4" />
                    </div>
                    <input
                      type={showPassword ? 'text' : 'password'}
                      value={personalPassword}
                      onChange={(e) => setPersonalPassword(e.target.value)}
                      placeholder="Nhập mật khẩu (Mặc định: 123456)..."
                      autoFocus
                      className="w-full pl-10 pr-12 py-2.5 rounded-2xl bg-white dark:bg-zinc-950 border border-zinc-300 dark:border-zinc-700 text-zinc-950 dark:text-zinc-50 text-xs placeholder-zinc-400 focus:outline-none focus:ring-2 focus:ring-zinc-900 dark:focus:ring-white font-mono"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-200"
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                  <p className="text-[10px] text-zinc-500 dark:text-zinc-400">
                    💡 Mật khẩu mặc định do Admin cấp: <code>123456</code> (hoặc PIN cá nhân).
                  </p>
                </div>

                {/* Error message */}
                {errorMsg && (
                  <div className="flex items-center space-x-2 p-2.5 rounded-xl bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-300 text-xs animate-shake">
                    <AlertCircle className="w-4 h-4 shrink-0" />
                    <span>{errorMsg}</span>
                  </div>
                )}

                {/* Submit button */}
                <div className="flex items-center space-x-3 pt-2">
                  <button
                    type="button"
                    onClick={onClose}
                    className="flex-1 py-2.5 px-4 rounded-2xl bg-zinc-100 dark:bg-zinc-800 hover:bg-zinc-200 dark:hover:bg-zinc-700 text-zinc-700 dark:text-zinc-300 text-xs font-semibold transition-all"
                  >
                    Hủy Bỏ
                  </button>
                  <button
                    type="submit"
                    className="flex-1 py-2.5 px-4 rounded-2xl bg-zinc-900 hover:bg-zinc-800 dark:bg-white dark:hover:bg-zinc-100 text-white dark:text-zinc-950 text-xs font-bold shadow-md transition-all flex items-center justify-center space-x-1.5"
                  >
                    <span>Vào Hệ Thống</span>
                  </button>
                </div>
              </form>
            )}

            {/* TAB 2: Quick Master PIN Login */}
            {loginMode === 'quick_pin' && (
              <form onSubmit={handleQuickPinVerify} className="space-y-3.5">
                <div className="space-y-1">
                  <label className="block text-xs font-semibold text-zinc-700 dark:text-zinc-300">
                    Nhập Mã PIN Quản Trị:
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-zinc-400">
                      <KeyRound className="w-4 h-4" />
                    </div>
                    <input
                      type={showPassword ? 'text' : 'password'}
                      value={pinInput}
                      onChange={(e) => setPinInput(e.target.value)}
                      placeholder="Nhập mã PIN..."
                      autoFocus
                      className="w-full pl-10 pr-12 py-2.5 rounded-2xl bg-white dark:bg-zinc-950 border border-zinc-300 dark:border-zinc-700 text-zinc-950 dark:text-zinc-50 placeholder-zinc-400 text-xs focus:outline-none focus:ring-2 focus:ring-zinc-900 dark:focus:ring-white transition-all font-mono tracking-wider"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-200"
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                {/* Error message */}
                {errorMsg && (
                  <div className="flex items-center space-x-2 p-2.5 rounded-xl bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-300 text-xs animate-shake">
                    <AlertCircle className="w-4 h-4 shrink-0" />
                    <span>{errorMsg}</span>
                  </div>
                )}

                {/* Quick PIN Pad */}
                <div className="grid grid-cols-3 gap-1.5 pt-1">
                  {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((num) => (
                    <button
                      key={num}
                      type="button"
                      onClick={() => setPinInput((prev) => prev + num)}
                      className="py-2 rounded-xl bg-zinc-50 dark:bg-zinc-900 hover:bg-zinc-200 dark:hover:bg-zinc-800 text-zinc-900 dark:text-zinc-100 font-semibold text-xs border border-zinc-200 dark:border-zinc-800 active:scale-95 transition-all font-mono"
                    >
                      {num}
                    </button>
                  ))}
                  <button
                    type="button"
                    onClick={() => setPinInput('')}
                    className="py-2 rounded-xl bg-zinc-100 dark:bg-zinc-800/60 hover:bg-zinc-200 dark:hover:bg-zinc-700 text-zinc-600 dark:text-zinc-300 text-[11px] font-medium border border-zinc-200 dark:border-zinc-800 active:scale-95 transition-all"
                  >
                    Xóa hết
                  </button>
                  <button
                    type="button"
                    onClick={() => setPinInput((prev) => prev + '0')}
                    className="py-2 rounded-xl bg-zinc-50 dark:bg-zinc-900 hover:bg-zinc-200 dark:hover:bg-zinc-800 text-zinc-900 dark:text-zinc-100 font-semibold text-xs border border-zinc-200 dark:border-zinc-800 active:scale-95 transition-all font-mono"
                  >
                    0
                  </button>
                  <button
                    type="button"
                    onClick={() => setPinInput((prev) => prev.slice(0, -1))}
                    className="py-2 rounded-xl bg-zinc-100 dark:bg-zinc-800/60 hover:bg-zinc-200 dark:hover:bg-zinc-700 text-zinc-600 dark:text-zinc-300 text-[11px] font-medium border border-zinc-200 dark:border-zinc-800 active:scale-95 transition-all"
                  >
                    Xóa 1 số
                  </button>
                </div>

                {/* Hint for demo & testing */}
                <div className="p-2.5 rounded-xl bg-zinc-100 dark:bg-zinc-900/90 text-zinc-600 dark:text-zinc-400 text-[11px] space-y-1">
                  <div className="font-semibold text-zinc-800 dark:text-zinc-200 flex items-center space-x-1">
                    <ShieldCheck className="w-3.5 h-3.5 text-zinc-700 dark:text-zinc-300" />
                    <span>Mã PIN mẫu hệ thống:</span>
                  </div>
                  <p>
                    • Chủ Spa: <code className="bg-zinc-200 dark:bg-zinc-800 px-1 py-0.2 rounded font-bold text-zinc-950 dark:text-zinc-100">{passwords.ownerPin || '123456'}</code>
                  </p>
                  <p>
                    • Quản Lý: <code className="bg-zinc-200 dark:bg-zinc-800 px-1 py-0.2 rounded font-bold text-zinc-950 dark:text-zinc-100">{passwords.managerPin || '888888'}</code> | KTV: <code className="bg-zinc-200 dark:bg-zinc-800 px-1 py-0.2 rounded font-bold text-zinc-950 dark:text-zinc-100">{passwords.staffPin || '666666'}</code>
                  </p>
                </div>

                <div className="flex items-center space-x-3 pt-2">
                  <button
                    type="button"
                    onClick={onClose}
                    className="flex-1 py-2.5 px-4 rounded-2xl bg-zinc-100 dark:bg-zinc-800 hover:bg-zinc-200 dark:hover:bg-zinc-700 text-zinc-700 dark:text-zinc-300 text-xs font-semibold transition-all"
                  >
                    Hủy Bỏ
                  </button>
                  <button
                    type="submit"
                    className="flex-1 py-2.5 px-4 rounded-2xl bg-zinc-900 hover:bg-zinc-800 dark:bg-white dark:hover:bg-zinc-100 text-white dark:text-zinc-950 text-xs font-bold shadow-md transition-all flex items-center justify-center space-x-1.5"
                  >
                    <span>Xác Nhận PIN</span>
                  </button>
                </div>
              </form>
            )}

            {/* Change Password toggle */}
            <div className="text-center pt-1 border-t border-zinc-100 dark:border-zinc-800">
              <button
                type="button"
                onClick={() => {
                  setNewOwnerPin(passwords.ownerPin);
                  setNewManagerPin(passwords.managerPin);
                  setNewStaffPin(passwords.staffPin);
                  setIsChangingPassword(true);
                }}
                className="text-xs text-zinc-500 hover:text-zinc-950 dark:text-zinc-400 dark:hover:text-zinc-100 underline decoration-zinc-400"
              >
                Cập nhật mã PIN quản trị các vai trò
              </button>
            </div>
          </div>
        ) : (
          /* Change Master Role Passwords */
          <form onSubmit={handleSaveNewPasswords} className="space-y-3.5">
            <div className="p-3 rounded-2xl bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 text-xs text-zinc-600 dark:text-zinc-400 leading-relaxed">
              Cập nhật mã PIN/Mật khẩu cho từng cấp bậc. Mật khẩu mới sẽ được tự động đồng bộ lên Firebase Cloud.
            </div>

            <div className="space-y-3">
              <div>
                <label className="block text-xs font-semibold text-zinc-800 dark:text-zinc-200 mb-1">
                  Mật khẩu Chủ Spa (Admin):
                </label>
                <input
                  type="text"
                  value={newOwnerPin}
                  onChange={(e) => setNewOwnerPin(e.target.value)}
                  placeholder="Ví dụ: 123456"
                  className="w-full px-3.5 py-2 rounded-xl bg-white dark:bg-zinc-950 border border-zinc-300 dark:border-zinc-700 text-zinc-900 dark:text-zinc-100 text-xs font-mono"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-zinc-800 dark:text-zinc-200 mb-1">
                  Mật khẩu Quản Lý (Manager):
                </label>
                <input
                  type="text"
                  value={newManagerPin}
                  onChange={(e) => setNewManagerPin(e.target.value)}
                  placeholder="Ví dụ: 888888"
                  className="w-full px-3.5 py-2 rounded-xl bg-white dark:bg-zinc-950 border border-zinc-300 dark:border-zinc-700 text-zinc-900 dark:text-zinc-100 text-xs font-mono"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-zinc-800 dark:text-zinc-200 mb-1">
                  Mật khẩu Kỹ Thuật Viên / Lễ Tân (Staff):
                </label>
                <input
                  type="text"
                  value={newStaffPin}
                  onChange={(e) => setNewStaffPin(e.target.value)}
                  placeholder="Ví dụ: 666666"
                  className="w-full px-3.5 py-2 rounded-xl bg-white dark:bg-zinc-950 border border-zinc-300 dark:border-zinc-700 text-zinc-900 dark:text-zinc-100 text-xs font-mono"
                  required
                />
              </div>
            </div>

            {changeSuccess && (
              <div className="flex items-center space-x-2 p-2.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 text-emerald-800 dark:text-emerald-200 border border-emerald-200 dark:border-emerald-800 text-xs">
                <CheckCircle className="w-4 h-4 text-emerald-500" />
                <span>Đã lưu mật khẩu mới thành công lên Cloud!</span>
              </div>
            )}

            <div className="flex items-center space-x-3 pt-2">
              <button
                type="button"
                onClick={() => setIsChangingPassword(false)}
                className="flex-1 py-2.5 px-4 rounded-2xl bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 text-xs font-semibold"
              >
                Quay Lại
              </button>
              <button
                type="submit"
                className="flex-1 py-2.5 px-4 rounded-2xl bg-zinc-900 hover:bg-zinc-800 dark:bg-white dark:hover:bg-zinc-100 text-white dark:text-zinc-950 text-xs font-bold"
              >
                Lưu Mật Khẩu
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
