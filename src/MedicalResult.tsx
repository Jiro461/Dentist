/* eslint-disable @typescript-eslint/no-explicit-any */
"use client"

import type React from "react"
import { useState, useRef, useEffect } from "react"
import { ChevronDown, Edit, Calendar, AlertTriangle } from "lucide-react"
import { useNavigate } from "react-router-dom"

const MedicalRecord = () => {
  // Add navigation
  const navigate = useNavigate()

  // State for form fields
  const [formData, setFormData] = useState({
    huongDieuTri: "Sử dụng phác đồ kháng sinh kết hợp với thuốc ức chế tiết acid (PPI) trong 10-14 ngày.",
  })

  // State for prescription data
  const [prescriptionData, setPrescriptionData] = useState<any>(null)

  // State for appointment data
  const [appointmentData, setAppointmentData] = useState<any>(null)

  // State for alert
  const [showAlert, setShowAlert] = useState(false)

  // State for success modal
  const [showSuccessModal, setShowSuccessModal] = useState(false)

  // Ref for scrolling to treatment direction field
  const huongDieuTriRef = useRef<HTMLTextAreaElement>(null)
// Add this function after the state declarations
// const reloadData = () => {
//     const savedPrescription = localStorage.getItem("prescriptionData")
//     if (savedPrescription) {
//       setPrescriptionData(JSON.parse(savedPrescription))
//     }

//     const savedAppointment = localStorage.getItem("appointmentData")
//     if (savedAppointment) {
//       setAppointmentData(JSON.parse(savedAppointment))
//     }
//   }
  // Load prescription and appointment data from localStorage on component mount
  useEffect(() => {
    const loadData = () => {
      const savedPrescription = localStorage.getItem("prescriptionData")
      if (savedPrescription) {
        setPrescriptionData(JSON.parse(savedPrescription))
      }

      const savedAppointment = localStorage.getItem("appointmentData")
      if (savedAppointment) {
        setAppointmentData(JSON.parse(savedAppointment))
      }
    }

    // Load data initially
    loadData()

    // Add event listener for when window gains focus (user comes back to tab)
    const handleFocus = () => {
      loadData()
    }

    window.addEventListener("focus", handleFocus)

    // Also listen for storage events (when localStorage changes in other tabs)
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === "prescriptionData" || e.key === "appointmentData") {
        loadData()
      }
    }

    window.addEventListener("storage", handleStorageChange)

    // Cleanup
    return () => {
      window.removeEventListener("focus", handleFocus)
      window.removeEventListener("storage", handleStorageChange)
    }
  }, [])

  // Handle form field changes
  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  // Handle prescription button click
  const handlePrescriptionClick = () => {
    // Validate required fields before proceeding
    if (!formData.huongDieuTri?.trim()) {
      setShowAlert(true)
      // Scroll to the treatment direction field
      setTimeout(() => {
        huongDieuTriRef.current?.focus()
      }, 100)
      return
    }

    // If validation passes, navigate to prescription page
    navigate("/prescription")
  }

  // Handle appointment button click
  const handleAppointmentClick = () => {
    // Validate required fields before proceeding
    if (!formData.huongDieuTri?.trim()) {
      setShowAlert(true)
      // Scroll to the treatment direction field
      setTimeout(() => {
        huongDieuTriRef.current?.focus()
      }, 100)
      return
    }

    // If validation passes, navigate to appointment page
    navigate("/appointment")
  }

  // Close alert
  const closeAlert = () => {
    setShowAlert(false)
  }

  // Handle save button click
  const handleSave = () => {
    // Validate required fields before saving
    if (!formData.huongDieuTri?.trim()) {
      setShowAlert(true)
      setTimeout(() => {
        huongDieuTriRef.current?.focus()
      }, 100)
      return
    }

    // If validation passes, show success modal
    setShowSuccessModal(true)
  }

  // Close success modal
  const closeSuccessModal = () => {
    setShowSuccessModal(false)
  }

  return (
    <div className="p-6 bg-gray-50 min-h-screen relative">
      {/* Alert popup */}
      {showAlert && (
        <div className="fixed inset-0 flex items-start justify-center pt-20 z-50">
          <div className="fixed inset-0 bg-black/20" onClick={closeAlert}></div>
          <div className="bg-red-200 rounded-lg shadow-lg p-4 z-10 flex items-center gap-3 max-w-md">
            <AlertTriangle className="text-yellow-500 h-8 w-8" />
            <div className="text-blue-600 font-medium text-lg">Bạn phải nhập đầy đủ thông tin!</div>
          </div>
        </div>
      )}

      {/* Success modal */}
      {showSuccessModal && (
        <div className="fixed inset-0 flex items-center justify-center z-50">
          <div className="fixed inset-0 bg-black/50" onClick={closeSuccessModal}></div>
          <div className="bg-white rounded-lg shadow-xl p-8 z-10 max-w-md mx-4">
            <div className="text-center">
              <div className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
                <svg className="w-8 h-8 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <h3 className="text-xl font-medium text-blue-600 mb-6">Lưu bệnh án thành công!</h3>
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
        <button className="flex items-center gap-1 text-gray-600 hover:text-gray-800" onClick={handleSave}>
          <span>📄</span> Lưu
        </button>
        <button className="flex items-center gap-1 text-gray-600 hover:text-gray-800">
          <span>🖨️</span> In
        </button>
        <button className="flex items-center gap-1 text-gray-600 hover:text-gray-800">
          <span>✕</span> Đóng
        </button>
      </div>

      <div className="grid grid-cols-4 gap-6">
        {/* Main content - spans 3 columns */}
        <div className="col-span-3 space-y-6">
          {/* THÔNG TIN HÀNH CHÍNH */}
          <section className="bg-white rounded-lg shadow-sm">
            <div className="bg-white text-black px-4 py-2 rounded-t-lg">
              <h2 className="font-semibold">THÔNG TIN HÀNH CHÍNH</h2>
            </div>
            <div className="p-4">
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Mã bệnh nhân</label>
                  <input
                    className="w-full border border-gray-300 rounded px-3 py-2 bg-white"
                    defaultValue="BN001"
                    readOnly
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Họ tên</label>
                  <input
                    className="w-full border border-gray-300 rounded px-3 py-2 bg-white"
                    defaultValue="Nguyễn Văn An"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Giới tính</label>
                  <input className="w-full border border-gray-300 rounded px-3 py-2 bg-white" defaultValue="Nam" />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Mã số khám</label>
                  <input
                    className="w-full border border-gray-300 rounded px-3 py-2 bg-white"
                    defaultValue="SK001"
                    readOnly
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Số điện thoại</label>
                  <input
                    className="w-full border border-gray-300 rounded px-3 py-2 bg-white"
                    defaultValue="0912345678"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Ngày sinh</label>
                  <input
                    className="w-full border border-gray-300 rounded px-3 py-2 bg-white"
                    defaultValue="27/07/1999"
                  />
                </div>
                <div className="col-span-3">
                  <label className="block text-sm font-medium mb-1">Địa chỉ</label>
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
              <h2 className="font-semibold">THÔNG TIN KHÁM BỆNH</h2>
            </div>
            <div className="p-4 space-y-4">
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Chuyên khoa</label>
                  <input
                    className="w-full border border-gray-300 rounded px-3 py-2 bg-white"
                    defaultValue="Nội tiêu hóa"
                    readOnly
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Ngày khám</label>
                  <input
                    className="w-full border border-gray-300 rounded px-3 py-2 bg-white"
                    defaultValue="20/05/2025"
                    readOnly
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Lý do đến khám</label>
                  <input
                    className="w-full border border-gray-300 rounded px-3 py-2 bg-blue-100"
                    defaultValue="--Không bắt buộc--"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Tiền sử bệnh</label>
                <input
                  className="w-full border border-gray-300 rounded px-3 py-2 bg-blue-100"
                  defaultValue="Viêm dạ dày"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Triệu chứng</label>
                <textarea
                  className="w-full border border-gray-300 rounded px-3 py-2 h-20 bg-blue-100"
                  defaultValue="Đau vùng thượng vị, ăn uống khó khăn, hay ói mửa"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">
                    Bệnh chính <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <select className="w-full border border-gray-300 rounded px-3 py-2 appearance-none bg-blue-100">
                      <option>Loét dạ dày</option>
                    </select>
                    <ChevronDown className="absolute right-3 top-3 h-4 w-4 text-gray-400" />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Mô tả tình trạng</label>
                  <input
                    className="w-full border border-gray-300 rounded px-3 py-2 bg-blue-100"
                    defaultValue="Loét dạ dày tá tràng nghi do NSAIDs."
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Bệnh phụ</label>
                  <div className="relative">
                    <select className="w-full border border-gray-300 rounded px-3 py-2 appearance-none bg-blue-100">
                      <option>Thiếu máu</option>
                    </select>
                    <ChevronDown className="absolute right-3 top-3 h-4 w-4 text-gray-400" />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Mô tả tình trạng</label>
                  <input
                    className="w-full border border-gray-300 rounded px-3 py-2 bg-blue-100"
                    placeholder="Không bắt buộc"
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
                  className={`w-full border ${!formData.huongDieuTri?.trim() && showAlert ? "border-red-500 ring-1 ring-red-500" : "border-gray-300"} bg-blue-100 rounded px-3 py-2 h-20`}
                  value={formData.huongDieuTri}
                  onChange={handleChange}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Kết quả khám</label>
                  <div className="relative">
                    <select className="w-full border border-gray-300 rounded px-3 py-2 appearance-none bg-blue-100">
                      <option>Đỡ</option>
                    </select>
                    <ChevronDown className="absolute right-3 top-3 h-4 w-4 text-gray-400" />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Ghi chú</label>
                  <input
                    className="w-full border border-gray-300 rounded px-3 py-2 bg-blue-100"
                    defaultValue="Không có"
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
              <h2 className="font-semibold">SINH HIỆU</h2>
            </div>
            <div className="p-4 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Cân nặng</span>
                <div className="flex items-center gap-2">
                  <input
                    className="w-16 border border-gray-300 rounded px-2 py-1 text-center bg-blue-100"
                    defaultValue="50"
                  />
                  <span className="text-sm text-gray-600">kg</span>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Chiều cao</span>
                <div className="flex items-center gap-2">
                  <input
                    className="w-16 border border-gray-300 rounded px-2 py-1 text-center bg-blue-100"
                    defaultValue="150"
                  />
                  <span className="text-sm text-gray-600">cm</span>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Huyết áp</span>
                <div className="flex items-center gap-2">
                  <input
                    className="w-20 border border-gray-300 rounded px-2 py-1 text-center bg-blue-100"
                    defaultValue="70/130"
                  />
                  <span className="text-sm text-gray-600">mmHg</span>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Nhịp tim</span>
                <div className="flex items-center gap-2">
                  <input
                    className="w-16 border border-gray-300 rounded px-2 py-1 text-center bg-blue-100"
                    defaultValue="75"
                  />
                  <span className="text-sm text-gray-600">lần/phút</span>
                </div>
              </div>
            </div>
          </section>

          {/* XỬ TRÍ */}
          <section className="bg-white rounded-lg shadow-sm">
            <div className="bg-white text-black px-4 py-2 rounded-t-lg">
              <h2 className="font-semibold">XỬ TRÍ</h2>
            </div>
            <div className="p-4 space-y-2">
              <button className="text-blue-600 hover:text-blue-800 underline text-sm" onClick={handlePrescriptionClick}>
                Kê đơn thuốc
              </button>
              <br />
              <button className="text-blue-600 hover:text-blue-800 underline text-sm" onClick={handleAppointmentClick}>
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
          <div className="bg-white text-black px-4 py-2 rounded-t-lg flex items-center justify-between">
            <h2 className="font-semibold">KÊ ĐƠN THUỐC</h2>
            <button className="cursor-pointer" onClick={handlePrescriptionClick}>
              <Edit className="h-4 w-4" />
            </button>
          </div>
          <div className="p-4">
            <table className="w-full">
              <thead>
                <tr className="bg-blue-500">
                  <th className="px-3 border-gray-300 py-2 text-left text-sm font-medium">STT</th>
                  <th className="px-3 border-gray-300 py-2 text-left text-sm font-medium">Thuốc</th>
                  <th className="px-3 border-gray-300 py-2 text-left text-sm font-medium">Đơn vị tính</th>
                  <th className="px-3 border-gray-300 py-2 text-left text-sm font-medium">Số lượng</th>
                  <th className="px-3 border-gray-300 py-2 text-left text-sm font-medium">Số ngày</th>
                </tr>
              </thead>
              <tbody>
                {prescriptionData?.medications?.map((med: any, index: number) => (
                  <tr key={med.id} className="border-b">
                    <td className="px-3 py-2 text-sm">{index + 1}</td>
                    <td className="px-3 py-2 text-sm">{med.name}</td>
                    <td className="px-3 py-2 text-sm">{med.unit}</td>
                    <td className="px-3 py-2 text-sm">{med.quantity}</td>
                    <td className="px-3 py-2 text-sm">{med.days}</td>
                  </tr>
                )) || (
                  <tr className="border-b">
                    <td className="px-3 py-2 text-sm">1</td>
                    <td className="px-3 py-2 text-sm">Omeprazole</td>
                    <td className="px-3 py-2 text-sm">viên</td>
                    <td className="px-3 py-2 text-sm">20</td>
                    <td className="px-3 py-2 text-sm">10</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </section>

        {/* HẸN TÁI KHÁM */}
        <section className="bg-white rounded-lg shadow-sm">
          <div className="bg-white text-black px-4 py-2 rounded-t-lg flex items-center justify-between">
            <h2 className="font-semibold">HẸN TÁI KHÁM</h2>
            <button className="cursor-pointer" onClick={handleAppointmentClick}>
              <Edit className="h-4 w-4" />
            </button>
          </div>
          <div className="p-4">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Ngày tái khám</span>
              {appointmentData ? (
                <div className="text-right">
                  <div className="text-sm font-medium">{appointmentData.date}</div>
                  <div className="text-xs text-gray-500">{appointmentData.time}</div>
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
  )
}

export default MedicalRecord
