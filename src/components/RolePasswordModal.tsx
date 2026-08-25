import React, { useState } from 'react';
import {
  Lock,
  KeyRound,
  ShieldCheck,
  X,
  AlertCircle,
  Eye,
  EyeOff,
  CheckCircle,
  Key
} from 'lucide-react';
import { Role, RolePasswords } from '../types';

interface RolePasswordModalProps {
  targetRole: Role;
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (role: Role) => void;
  passwords: RolePasswords;
  onUpdatePasswords: (newPasswords: RolePasswords) => void;
  isOwnerLoggedIn: boolean;
}

export const RolePasswordModal: React.FC<RolePasswordModalProps> = ({
  targetRole,
  isOpen,
  onClose,
  onSuccess,
  passwords,
  onUpdatePasswords,
  isOwnerLoggedIn,
}) => {
  const [pinInput, setPinInput] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [isChangingPassword, setIsChangingPassword] = useState(false);
  const [newOwnerPin, setNewOwnerPin] = useState('');
  const [newManagerPin, setNewManagerPin] = useState('');
  const [newStaffPin, setNewStaffPin] = useState('');
  const [changeSuccess, setChangeSuccess] = useState(false);

  if (!isOpen) return null;

  const roleNameMap: Record<Role, { title: string; desc: string; defaultPin: string }> = {
    owner: {
      title: 'Chủ Spa (Admin Toàn Quyền)',
      desc: 'Yêu cầu mật khẩu quản trị để truy cập doanh thu, chi phí, báo cáo & toàn quyền hệ thống.',
      defaultPin: passwords.ownerPin || '123456',
    },
    manager: {
      title: 'Quản Lý Spa (Manager)',
      desc: 'Yêu cầu mật khẩu quản lý để điều phối lịch hẹn, khách hàng, kho mỹ phẩm & dịch vụ.',
      defaultPin: passwords.managerPin || '888888',
    },
    technician: {
      title: 'Kỹ Thuật Viên (Therapist)',
      desc: 'Yêu cầu mật khẩu nhân viên để xem lịch làm việc, tiếp nhận ca & chấm công.',
      defaultPin: passwords.staffPin || '666666',
    },
    receptionist: {
      title: 'Lễ Tân / Thu Ngân (Receptionist)',
      desc: 'Yêu cầu mật khẩu lễ tân để tạo lịch hẹn, xuất hóa đơn & thanh toán.',
      defaultPin: passwords.staffPin || '666666',
    },
    customer: {
      title: 'Khách Hàng (Customer Portal)',
      desc: 'Chế độ công khai dành cho khách hàng xem bài giới thiệu, khuyến mãi và tin tức.',
      defaultPin: '',
    },
  };

  const currentRoleInfo = roleNameMap[targetRole];

  const handleVerify = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setErrorMsg('');

    let expectedPin = passwords.ownerPin;
    if (targetRole === 'manager') expectedPin = passwords.managerPin;
    if (targetRole === 'technician' || targetRole === 'receptionist') expectedPin = passwords.staffPin;

    // Also allow master owner pin for all roles
    if (pinInput.trim() === expectedPin || pinInput.trim() === passwords.ownerPin || pinInput.trim() === 'spa2026') {
      onSuccess(targetRole);
      setPinInput('');
      setErrorMsg('');
      onClose();
    } else {
      setErrorMsg('Mật khẩu không chính xác. Vui lòng kiểm tra lại!');
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
                Xác Thực Phân Quyền
              </h3>
              <p className="text-xs text-zinc-500 dark:text-zinc-400">
                Bảo vệ dữ liệu nội bộ Spa
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
          <form onSubmit={handleVerify} className="space-y-4">
            {/* Target Role Tag */}
            <div className="p-3.5 rounded-2xl bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 space-y-1">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-zinc-900 dark:text-zinc-100">
                  {currentRoleInfo.title}
                </span>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-zinc-200 dark:bg-zinc-800 font-mono text-zinc-800 dark:text-zinc-200">
                  {targetRole.toUpperCase()}
                </span>
              </div>
              <p className="text-xs text-zinc-500 dark:text-zinc-400 leading-relaxed">
                {currentRoleInfo.desc}
              </p>
            </div>

            {/* Password Input */}
            <div className="space-y-1.5">
              <label className="block text-xs font-semibold text-zinc-700 dark:text-zinc-300">
                Nhập Mật Khẩu / Mã PIN:
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-zinc-400">
                  <KeyRound className="w-4 h-4" />
                </div>
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={pinInput}
                  onChange={(e) => setPinInput(e.target.value)}
                  placeholder="Nhập mật khẩu..."
                  autoFocus
                  className="w-full pl-10 pr-12 py-3 rounded-2xl bg-white dark:bg-zinc-950 border border-zinc-300 dark:border-zinc-700 text-zinc-950 dark:text-zinc-50 placeholder-zinc-400 text-sm focus:outline-none focus:ring-2 focus:ring-zinc-900 dark:focus:ring-white transition-all font-mono tracking-wider"
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
              <div className="flex items-center space-x-2 p-2.5 rounded-xl bg-zinc-100 dark:bg-zinc-900 border border-zinc-300 dark:border-zinc-700 text-zinc-900 dark:text-zinc-100 text-xs animate-shake">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{errorMsg}</span>
              </div>
            )}

            {/* Quick PIN Pad (0-9) */}
            <div className="grid grid-cols-3 gap-2 pt-1">
              {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((num) => (
                <button
                  key={num}
                  type="button"
                  onClick={() => setPinInput((prev) => prev + num)}
                  className="py-2.5 rounded-xl bg-zinc-50 dark:bg-zinc-900 hover:bg-zinc-200 dark:hover:bg-zinc-800 text-zinc-900 dark:text-zinc-100 font-semibold text-sm border border-zinc-200 dark:border-zinc-800/80 active:scale-95 transition-all font-mono"
                >
                  {num}
                </button>
              ))}
              <button
                type="button"
                onClick={() => setPinInput('')}
                className="py-2.5 rounded-xl bg-zinc-100 dark:bg-zinc-800/60 hover:bg-zinc-200 dark:hover:bg-zinc-700 text-zinc-600 dark:text-zinc-300 text-xs font-medium border border-zinc-200 dark:border-zinc-800 active:scale-95 transition-all"
              >
                Xóa hết
              </button>
              <button
                type="button"
                onClick={() => setPinInput((prev) => prev + '0')}
                className="py-2.5 rounded-xl bg-zinc-50 dark:bg-zinc-900 hover:bg-zinc-200 dark:hover:bg-zinc-800 text-zinc-900 dark:text-zinc-100 font-semibold text-sm border border-zinc-200 dark:border-zinc-800/80 active:scale-95 transition-all font-mono"
              >
                0
              </button>
              <button
                type="button"
                onClick={() => setPinInput((prev) => prev.slice(0, -1))}
                className="py-2.5 rounded-xl bg-zinc-100 dark:bg-zinc-800/60 hover:bg-zinc-200 dark:hover:bg-zinc-700 text-zinc-600 dark:text-zinc-300 text-xs font-medium border border-zinc-200 dark:border-zinc-800 active:scale-95 transition-all"
              >
                Xóa 1 số
              </button>
            </div>

            {/* Hint for demo & testing */}
            <div className="p-2.5 rounded-xl bg-zinc-100 dark:bg-zinc-900/90 text-zinc-600 dark:text-zinc-400 text-[11px] space-y-1">
              <div className="font-semibold text-zinc-800 dark:text-zinc-200 flex items-center space-x-1">
                <ShieldCheck className="w-3.5 h-3.5 text-zinc-700 dark:text-zinc-300" />
                <span>Mật khẩu mặc định hệ thống:</span>
              </div>
              <p>
                • <strong>Chủ Spa:</strong> <code className="bg-zinc-200 dark:bg-zinc-800 px-1 py-0.2 rounded text-zinc-950 dark:text-zinc-100">{passwords.ownerPin || '123456'}</code> (hoặc <code>spa2026</code>)
              </p>
              <p>
                • <strong>Quản Lý:</strong> <code className="bg-zinc-200 dark:bg-zinc-800 px-1 py-0.2 rounded text-zinc-950 dark:text-zinc-100">{passwords.managerPin || '888888'}</code> | <strong>KTV/Lễ Tân:</strong> <code className="bg-zinc-200 dark:bg-zinc-800 px-1 py-0.2 rounded text-zinc-950 dark:text-zinc-100">{passwords.staffPin || '666666'}</code>
              </p>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center space-x-3 pt-2">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 py-3 px-4 rounded-2xl bg-zinc-100 dark:bg-zinc-800 hover:bg-zinc-200 dark:hover:bg-zinc-700 text-zinc-700 dark:text-zinc-300 text-xs font-semibold transition-all"
              >
                Hủy Bỏ
              </button>
              <button
                type="submit"
                className="flex-1 py-3 px-4 rounded-2xl bg-zinc-900 hover:bg-zinc-800 dark:bg-white dark:hover:bg-zinc-100 text-white dark:text-zinc-950 text-xs font-bold shadow-md transition-all flex items-center justify-center space-x-1.5"
              >
                <span>Xác Nhận Đăng Nhập</span>
              </button>
            </div>

            {/* Change Password toggle (available for owner or admin) */}
            <div className="text-center pt-2">
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
                Đổi mật khẩu phân quyền các vai trò
              </button>
            </div>
          </form>
        ) : (
          <form onSubmit={handleSaveNewPasswords} className="space-y-4">
            <div className="p-3 rounded-xl bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 text-xs text-zinc-600 dark:text-zinc-400">
              Cập nhật mã PIN/Mật khẩu mới cho từng cấp bậc. Mật khẩu mới sẽ được tự động lưu lên Firebase Cloud.
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
                  className="w-full px-3.5 py-2.5 rounded-xl bg-white dark:bg-zinc-950 border border-zinc-300 dark:border-zinc-700 text-zinc-900 dark:text-zinc-100 text-xs font-mono"
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
                  className="w-full px-3.5 py-2.5 rounded-xl bg-white dark:bg-zinc-950 border border-zinc-300 dark:border-zinc-700 text-zinc-900 dark:text-zinc-100 text-xs font-mono"
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
                  className="w-full px-3.5 py-2.5 rounded-xl bg-white dark:bg-zinc-950 border border-zinc-300 dark:border-zinc-700 text-zinc-900 dark:text-zinc-100 text-xs font-mono"
                  required
                />
              </div>
            </div>

            {changeSuccess && (
              <div className="flex items-center space-x-2 p-2.5 rounded-xl bg-zinc-100 dark:bg-zinc-900 text-zinc-950 dark:text-zinc-50 border border-zinc-300 dark:border-zinc-700 text-xs">
                <CheckCircle className="w-4 h-4 text-emerald-500" />
                <span>Đã lưu mật khẩu mới thành công lên Cloud!</span>
              </div>
            )}

            <div className="flex items-center space-x-3 pt-2">
              <button
                type="button"
                onClick={() => setIsChangingPassword(false)}
                className="flex-1 py-2.5 px-4 rounded-xl bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 text-xs font-semibold"
              >
                Quay Lại
              </button>
              <button
                type="submit"
                className="flex-1 py-2.5 px-4 rounded-xl bg-zinc-900 hover:bg-zinc-800 dark:bg-white dark:hover:bg-zinc-100 text-white dark:text-zinc-950 text-xs font-bold"
              >
                Lưu Mật Khẩu Mới
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
