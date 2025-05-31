/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import type React from "react";
import { useState, useRef, useEffect, type JSX } from "react";
import { ChevronDown, Edit, Calendar, AlertTriangle } from "lucide-react";
import { useNavigate } from "react-router-dom";
import DiseaseSelect from "./handleinput";
import SymptomSelect from "./handleinput2";

const MedicalRecord = (): JSX.Element => {
  const underline =
    "relative text-xl after:content-[''] after:absolute after:left-[-15px] after:bottom-[-4px] after:h-[2px] after:w-[calc(100%+30px)] after:bg-gray-200";

  const navigate = useNavigate();

  // State cho các field cần lưu
  const [formData, setFormData] = useState({
    lyDoDenKham: "",
    tienSuBenh: "",
    trieuChung: "",
    benhChinh: "", // Giả định từ DiseaseSelect
    moTaTinhTrangChinh: "",
    benhPhu: "", // Giả định từ SymptomSelect
    moTaTinhTrangPhu: "",
    huongDieuTri: "",
    ketQuaKham: "Đỡ", // Giá trị mặc định của select
    ghiChu: "",
    canNang: "",
    chieuCao: "",
    huyetAp: "",
    nhipTim: "",
  });
  const [prescriptionData, setPrescriptionData] = useState<any>(null);
  const [appointmentData, setAppointmentData] = useState<any>(null);
  const [showAlert, setShowAlert] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const huongDieuTriRef = useRef<HTMLTextAreaElement>(null);

  // Tải dữ liệu từ localStorage khi component mount
  useEffect(() => {
    const loadData = () => {
      const savedPrescription = localStorage.getItem("prescriptionData");
      if (savedPrescription) {
        setPrescriptionData(JSON.parse(savedPrescription));
      }

      const savedAppointment = localStorage.getItem("appointmentData");
      if (savedAppointment) {
        setAppointmentData(JSON.parse(savedAppointment));
      }

      const savedFormData = localStorage.getItem("medicalRecordData");
      if (savedFormData) {
        setFormData(JSON.parse(savedFormData));
      }
    };

    loadData();

    const handleFocus = () => {
      loadData();
    };

    const handleStorageChange = (e: StorageEvent) => {
      if (
        e.key === "prescriptionData" ||
        e.key === "appointmentData" ||
        e.key === "medicalRecordData"
      ) {
        loadData();
      }
    };
    window.addEventListener("focus", handleFocus);
    window.addEventListener("storage", handleStorageChange);

    return () => {
      window.removeEventListener("focus", handleFocus);
      window.removeEventListener("storage", handleStorageChange);
    };
  }, []);

  // Xử lý thay đổi giá trị input/select/textarea
  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Xử lý nút "Kê đơn thuốc"
  const handlePrescriptionClick = () => {
    if (!formData.huongDieuTri?.trim()) {
      setShowAlert(true);
      setTimeout(() => {
        huongDieuTriRef.current?.focus();
      }, 100);
      return;
    }
    navigate("/prescription");
  };

  // Xử lý nút "Hẹn tái khám"
  const handleAppointmentClick = () => {
    if (!formData.huongDieuTri?.trim()) {
      setShowAlert(true);
      setTimeout(() => {
        huongDieuTriRef.current?.focus();
      }, 100);
      return;
    }
    navigate("/appointment");
  };

  // Đóng alert
  const closeAlert = () => {
    setShowAlert(false);
  };

  // Xử lý nút "Lưu"
  const handleSave = () => {
    if (!formData.huongDieuTri?.trim()) {
      setShowAlert(true);
      setTimeout(() => {
        huongDieuTriRef.current?.focus();
      }, 100);
      return;
    }

    // Lưu dữ liệu vào localStorage
    localStorage.setItem("medicalRecordData", JSON.stringify(formData));
    setShowSuccessModal(true);
  };

  // Đóng modal thành công
  const closeSuccessModal = () => {
    setShowSuccessModal(false);
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen relative">
      {/* Alert popup */}
      {showAlert && (
        <div className="fixed inset-0 flex items-start justify-center pt-20 z-50">
          <div className="fixed inset-0 bg-black/20" onClick={closeAlert}></div>
          <div className="bg-red-200 rounded-lg shadow-lg p-4 z-10 flex items-center gap-3 max-w-md">
            <AlertTriangle className="text-yellow-500 h-8 w-8" />
            <div className="text-blue-600 font-medium text-lg">
              Bạn phải nhập đầy đủ thông tin!
            </div>
          </div>
        </div>
      )}

      {/* Success modal */}
      {showSuccessModal && (
        <div className="fixed inset-0 flex items-center justify-center z-50">
          <div
            className="fixed inset-0 bg-black/50"
            onClick={closeSuccessModal}
          ></div>
          <div className="bg-white rounded-lg shadow-xl p-8 z-10 max-w-md mx-4">
            <div className="text-center">
              <div className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
                <svg
                  className="w-8 h-8 text-green-500"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M5 13l4 4L19 7"
                  />
                </svg>
              </div>
              <h3 className="text-xl font-medium text-blue-600 mb-6">
                Lưu bệnh án thành công!
              </h3>
              <button
                onClick={closeSuccessModal}
                className="bg-blue-1000 hover:bg-blue-600 text-white px-8 py-2 rounded font-medium"
              >
                Đóng
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Print controls */}
      <div className="flex justify-end mb-4 gap-2">
        <button
          className="flex items-center gap-1 text-gray-600 hover:text-gray-800"
          onClick={handleSave}
        >
          <span>📄</span> Lưu
        </button>
        <button className="flex items-center gap-1 text-gray-600 hover:text-gray-800">
          <span>🖨️</span> In
        </button>
        <button
          onClick={() => navigate("/")}
          className="flex items-center gap-1 text-gray-600 hover:text-gray-800"
        >
          <span>✕</span> Đóng
        </button>
      </div>

      <div className="grid grid-cols-4 gap-6">
        {/* Main content - spans 3 columns */}
        <div className="col-span-3 space-y-6">
          {/* THÔNG TIN HÀNH CHÍNH */}
          <section className="bg-white rounded-lg shadow-sm">
            <div className="bg-white text-black px-4 py-2 rounded-t-lg">
              <h2 className={`font-semibold ${underline}`}>
                THÔNG TIN HÀNH CHÍNH
              </h2>
            </div>
            <div className="p-4">
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">
                    Mã bệnh nhân
                  </label>
                  <input
                    className="w-full border border-gray-300 rounded px-3 py-2 bg-white"
                    defaultValue="BN001"
                    readOnly
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">
                    Họ tên
                  </label>
                  <input
                    className="w-full border border-gray-300 rounded px-3 py-2 bg-white"
                    defaultValue="Nguyễn Văn An"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">
                    Giới tính
                  </label>
                  <input
                    className="w-full border border-gray-300 rounded px-3 py-2 bg-white"
                    defaultValue="Nam"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">
                    Mã số khám
                  </label>
                  <input
                    className="w-full border border-gray-300 rounded px-3 py-2 bg-white"
                    defaultValue="SK001"
                    readOnly
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">
                    Số điện thoại
                  </label>
                  <input
                    className="w-full border border-gray-300 rounded px-3 py-2 bg-white"
                    defaultValue="0912345678"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">
                    Ngày sinh
                  </label>
                  <input
                    className="w-full border border-gray-300 rounded px-3 py-2 bg-white"
                    defaultValue="27/07/1999"
                  />
                </div>
                <div className="col-span-3">
                  <label className="block text-sm font-medium mb-1">
                    Địa chỉ
                  </label>
                  <input
                    className="w-full border border-gray-300 rounded px-3 py-2 bg-white"
                    defaultValue="123 Đường Láng, Hà Nội"
                  />
                </div>
              </div>
            </div>
          </section>

          {/* THÔNG TIN KHÁM BỆNH */}
          <section className="bg-white rounded-lg shadow-sm">
            <div className="bg-white text-black px-4 py-2 rounded-t-lg">
              <h2 className={`font-semibold ${underline}`}>
                THÔNG TIN KHÁM BỆNH
              </h2>
            </div>
            <div className="p-4 space-y-4">
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">
                    Chuyên khoa
                  </label>
                  <input
                    className="w-full border border-gray-300 rounded px-3 py-2 bg-white"
                    defaultValue="Nội tiêu hóa"
                    readOnly
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">
                    Ngày khám
                  </label>
                  <input
                    className="w-full border border-gray-300 rounded px-3 py-2 bg-white"
                    defaultValue="20/05/2025"
                    readOnly
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">
                    Lý do đến khám
                  </label>
                  <input
                    name="lyDoDenKham"
                    className="w-full border border-gray-300 rounded px-3 py-2 bg-blue-100"
                    value={formData.lyDoDenKham}
                    onChange={handleChange}
                  />
                </div>
                <div className="col-span-3">
                  <label className="block text-sm font-medium mb-1">
                    Tiền sử bệnh
                  </label>
                  <input
                    name="tienSuBenh"
                    className="w-full border border-gray-300 rounded px-3 py-2 bg-blue-100"
                    value={formData.tienSuBenh}
                    onChange={handleChange}
                  />
                </div>
                <div className="col-span-3">
                  <label className="block text-sm font-medium mb-1">
                    Triệu chứng
                  </label>
                  <textarea
                    name="trieuChung"
                    className="w-full border border-gray-300 rounded px-3 py-2 h-20 bg-blue-100"
                    value={formData.trieuChung}
                    onChange={handleChange}
                  />
                </div>
              </div>

              <div className="grid grid-cols-4 gap-4">
                <div className="col-span-1 relative">
                  <label className="block text-sm font-medium mb-1">
                    Bệnh chính <span className="text-red-500">*</span>
                  </label>
                  <div>
                    <DiseaseSelect
                      value={formData.benhChinh}
                      onChange={(value: string) =>
                        setFormData((prev) => ({ ...prev, benhChinh: value }))
                      }
                    />
                  </div>
                  <ChevronDown className="absolute right-3 top-10 h-4 w-4 text-gray-400" />
                </div>
                <div className="col-span-3">
                  <label className="block text-sm font-medium mb-1">
                    Mô tả tình trạng
                  </label>
                  <input
                    name="moTaTinhTrangChinh"
                    className="w-full border border-gray-300 rounded px-3 py-2 bg-blue-100"
                    value={formData.moTaTinhTrangChinh}
                    onChange={handleChange}
                  />
                </div>
              </div>

              <div className="grid grid-cols-4 gap-4">
                <div className="col-span-1 relative">
                  <label className="block text-sm font-medium mb-1">
                    Bệnh phụ
                  </label>
                  <div>
                    <SymptomSelect
                      value={formData.benhPhu}
                      onChange={(value: string) =>
                        setFormData((prev) => ({ ...prev, benhPhu: value }))
                      }
                    />
                  </div>
                  <ChevronDown className="absolute right-3 top-10 h-4 w-4 text-gray-400" />
                </div>
                <div className="col-span-3">
                  <label className="block text-sm font-medium mb-1">
                    Mô tả tình trạng
                  </label>
                  <input
                    name="moTaTinhTrangPhu"
                    className="w-full border border-gray-300 rounded px-3 py-2 bg-blue-100"
                    value={formData.moTaTinhTrangPhu}
                    onChange={handleChange}
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">
                  Hướng điều trị <span className="text-red-500">*</span>
                </label>
                <textarea
                  ref={huongDieuTriRef}
                  name="huongDieuTri"
                  className={`w-full border ${
                    !formData.huongDieuTri?.trim() && showAlert
                      ? "border-red-500 ring-1 ring-red-500"
                      : "border-gray-300"
                  } bg-blue-100 rounded px-3 py-2 h-20`}
                  value={formData.huongDieuTri}
                  onChange={handleChange}
                />
              </div>

              <div className="grid grid-cols-4 gap-4">
                <div className="col-span-1">
                  <label className="block text-sm font-medium mb-1">
                    Kết quả khám
                  </label>
                  <div className="relative">
                    <select
                      name="ketQuaKham"
                      className="w-full border border-gray-300 rounded px-3 py-2 appearance-none bg-blue-100"
                      value={formData.ketQuaKham}
                      onChange={handleChange}
                    >
                      <option>Đỡ</option>
                      <option>Không đỡ</option>
                      <option>Không rõ</option>
                      <option>Tệ hơn</option>
                    </select>
                    <ChevronDown className="absolute right-3 top-3 h-4 w-4 text-gray-400" />
                  </div>
                </div>
                <div className="col-span-3">
                  <label className="block text-sm font-medium mb-1">
                    Ghi chú
                  </label>
                  <input
                    name="ghiChu"
                    className="w-full border border-gray-300 rounded px-3 py-2 bg-blue-100"
                    value={formData.ghiChu}
                    onChange={handleChange}
                  />
                </div>
              </div>
            </div>
          </section>
        </div>

        {/* Right sidebar - spans 1 column */}
        <div className="space-y-6">
          {/* SINH HIỆU */}
          <section className="bg-white rounded-lg shadow-sm">
            <div className="bg-white text-black px-4 py-2 rounded-t-lg">
              <h2 className={`font-semibold ${underline}`}>SINH HIỆU</h2>
            </div>
            <div className="p-4 grid grid-cols-1 gap-4 grid-rows-4">
              <div className="w-full flex items-center justify-between">
                <span className="text-sm font-medium">Cân nặng</span>
                <div className="w-[60%] flex items-center gap-2 justify-end">
                  <input
                    name="canNang"
                    className="flex-1 w-16 border border-gray-300 rounded px-2 py-1 bg-blue-100"
                    value={formData.canNang}
                    onChange={handleChange}
                  />
                  <span className="text-sm text-gray-600 w-[25%]">kg</span>
                </div>
              </div>
              <div className="w-full flex items-center justify-between">
                <span className="text-sm font-medium">Chiều cao</span>
                <div className="w-[60%] flex items-center gap-2 justify-end">
                  <input
                    name="chieuCao"
                    className="flex-1 w-16 border border-gray-300 rounded px-2 py-1 bg-blue-100"
                    value={formData.chieuCao}
                    onChange={handleChange}
                  />
                  <span className="text-sm text-gray-600 w-[25%]">cm</span>
                </div>
              </div>
              <div className="w-full flex items-center justify-between">
                <span className="text-sm font-medium">Huyết áp</span>
                <div className="w-[60%] flex items-center gap-2 justify-end">
                  <input
                    name="huyetAp"
                    className="flex-1 w-16 border border-gray-300 rounded px-2 py-1 bg-blue-100"
                    value={formData.huyetAp}
                    onChange={handleChange}
                  />
                  <span className="text-sm text-gray-600 w-[25%]">mmHg</span>
                </div>
              </div>
              <div className="w-full flex items-center justify-between">
                <span className="text-sm font-medium">Nhịp tim</span>
                <div className="w-[60%] flex items-center gap-2 justify-end">
                  <input
                    name="nhipTim"
                    className="flex-1 w-16 border border-gray-300 rounded px-2 py-1 bg-blue-100"
                    value={formData.nhipTim}
                    onChange={handleChange}
                  />
                  <span className="text-sm text-gray-600 w-[25%]">
                    lần/phút
                  </span>
                </div>
              </div>
            </div>
          </section>

          {/* XỬ TRÍ */}
          <section className="bg-white rounded-lg shadow-sm">
            <div className="bg-white text-black px-4 py-2 rounded-t-lg">
              <h2 className={`font-semibold ${underline}`}>XỬ TRÍ</h2>
            </div>
            <div className="p-4 space-y-2">
              <button
                className="text-blue-600 hover:text-blue-800 text-sm font-semibold"
                onClick={handlePrescriptionClick}
              >
                Kê đơn thuốc
              </button>
              <br />
              <button
                className="text-blue-600 hover:text-blue-800 text-sm font-semibold"
                onClick={handleAppointmentClick}
              >
                Hẹn tái khám
              </button>
            </div>
          </section>
        </div>
      </div>

      {/* Bottom sections */}
      <div className="grid grid-cols-2 gap-6 mt-6">
        {/* KÊ ĐƠN THUỐC */}
        <section className="bg-white rounded-lg shadow-sm">
          <div className="relative text-xl after:content-[''] after:absolute after:left-[3px] after:bottom-[-4px] after:h-[2px] after:w-[calc(99%)] after:bg-gray-200 bg-white text-black px-4 py-2 rounded-t-lg flex items-center justify-between">
            <h2 className="font-semibold">KÊ ĐƠN THUỐC</h2>
            <button
              className="cursor-pointer"
              onClick={handlePrescriptionClick}
            >
              <Edit className="h-4 w-4" />
            </button>
          </div>
          <div className="p-4">
            <table className="w-full">
              <thead>
                <tr className="bg-blue-500 border-gray-300">
                  <th className="px-3 border-r-1 border-r-gray-400 py-2 text-left text-sm font-medium rounded-l-sm">
                    STT
                  </th>
                  <th className="px-3 border-r-1 border-r-gray-400 py-2 text-left text-sm font-medium">
                    Thuốc
                  </th>
                  <th className="px-3 border-r-1 border-r-gray-400 py-2 text-left text-sm font-medium">
                    Đơn vị tính
                  </th>
                  <th className="px-3 border-r-1 border-r-gray-400 py-2 text-left text-sm font-medium">
                    Số lượng
                  </th>
                  <th className="px-3 py-2 text-left text-sm font-medium rounded-r-sm">
                    Số ngày
                  </th>
                </tr>
              </thead>
              <tbody>
                {prescriptionData?.medications?.map(
                  (med: any, index: number) => (
                    <tr key={med.id} className="border-b">
                      <td className="px-3 py-2 text-sm">{index + 1}</td>
                      <td className="px-3 py-2 text-sm">{med.name}</td>
                      <td className="px-3 py-2 text-sm">{med.unit}</td>
                      <td className="px-3 py-2 text-sm">{med.quantity}</td>
                      <td className="px-3 py-2 text-sm">{med.days}</td>
                    </tr>
                  )
                ) || <tr></tr>}
              </tbody>
            </table>
          </div>
        </section>

        {/* HẸN TÁI KHÁM */}
        <section className="bg-white rounded-lg shadow-sm">
          <div className="relative text-xl after:content-[''] after:absolute after:left-[3px] after:bottom-[-4px] after:h-[2px] after:w-[calc(99%)] after:bg-gray-200 bg-white text-black px-4 py-2 rounded-t-lg flex items-center justify-between">
            <h2 className="font-semibold">HẸN TÁI KHÁM</h2>
            <button
              className="cursor-pointer"
              onClick={handleAppointmentClick}
            >
              <Edit className="h-4 w-4" />
            </button>
          </div>
          <div className="p-15">
            <div className="flex items-center justify-around h-30 bg-blue-100 rounded-[50px] p-5">
              <span className="text-2xl font-medium">Ngày tái khám</span>
              {appointmentData ? (
                <div className="text-right">
                  <div className="text-xl font-medium">
                    {appointmentData.date}
                  </div>
                  <div className="text-sm text-gray-500">
                    {appointmentData.time}
                  </div>
                </div>
              ) : (
                <button
                  className="bg-blue-1000 hover:bg-blue-600 text-white px-4 py-2 rounded text-sm flex items-center gap-2"
                  onClick={handleAppointmentClick}
                >
                  <Calendar className="h-4 w-4" />
                  Chọn ngày
                </button>
              )}
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};

export default MedicalRecord;