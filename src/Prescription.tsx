"use client"

import { useState, useEffect } from "react"
import { ChevronDown, ChevronUp, X, Plus } from "lucide-react"
import { useNavigate } from "react-router-dom"

interface Medication {
  id: number
  name: string
  unit: string
  dosage: string
  quantity: number
  days: number
  usage: string
  instruction: string
  stock?: number
  expiryDate?: string
  expanded?: boolean
}

const Prescription = () => {
  const navigate = useNavigate()
  const [showSuccessModal, setShowSuccessModal] = useState(false)
  const [expandedRow, setExpandedRow] = useState<number | null>(null)
  const [totalCost, setTotalCost] = useState(50000)

  const [medications, setMedications] = useState<Medication[]>([
    {
      id: 1,
      name: "Paracetamol",
      unit: "Viên 500mg",
      dosage: "Sáng 1 chiều 1",
      quantity: 20,
      days: 5,
      usage: "Uống ngay khi sốt",
      instruction: "",
      stock: 10000,
      expiryDate: "18/09/2026",
      expanded: false,
    },
    {
      id: 2,
      name: "Ibuprofen",
      unit: "Viên 200 mg",
      dosage: "Sáng 1 chiều 1",
      quantity: 20,
      days: 5,
      usage: "Uống sau khi ăn",
      instruction: "",
      stock: 8500,
      expiryDate: "15/12/2025",
      expanded: false,
    },
  ])

  // Load prescription data from localStorage on component mount
  useEffect(() => {
    const savedPrescription = localStorage.getItem("prescriptionData")
    if (savedPrescription) {
      const prescriptionData = JSON.parse(savedPrescription)
      if (prescriptionData.medications && prescriptionData.medications.length > 0) {
        setMedications(prescriptionData.medications)
        setTotalCost(prescriptionData.totalCost || 50000)
      }
    }
  }, [])

  const toggleExpand = (id: number) => {
    if (expandedRow === id) {
      setExpandedRow(null)
    } else {
      setExpandedRow(id)
    }
  }

  const handleSave = () => {
    // Save prescription data to localStorage to sync with medical record
    const prescriptionData = {
      medications,
      totalCost,
      prescriptionId: "DT001",
      date: "20/05/2025",
      doctor: "Trần Văn Kiên",
    }
    localStorage.setItem("prescriptionData", JSON.stringify(prescriptionData))
    setShowSuccessModal(true)
  }

  const handleDelete = (id: number) => {
    setMedications(medications.filter((med) => med.id !== id))
    // Recalculate total cost
    const remainingMeds = medications.filter((med) => med.id !== id)
    const newTotal = remainingMeds.reduce((sum, med) => sum + med.quantity * 1000, 0) // Assuming 1000 VND per unit
    setTotalCost(newTotal)
  }

  const handleAdd = () => {
    const newId = medications.length > 0 ? Math.max(...medications.map((m) => m.id)) + 1 : 1
    const newMedication = {
      id: newId,
      name: "",
      unit: "",
      dosage: "",
      quantity: 0,
      days: 0,
      usage: "",
      instruction: "",
      stock: 0,
      expiryDate: "",
      expanded: true,
    }
    setMedications([...medications, newMedication])
    setExpandedRow(newId)
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const updateMedication = (id: number, field: string, value: any) => {
    setMedications(medications.map((med) => (med.id === id ? { ...med, [field]: value } : med)))

    // Recalculate total cost when quantity changes
    if (field === "quantity") {
      const updatedMeds = medications.map((med) => (med.id === id ? { ...med, [field]: value } : med))
      const newTotal = updatedMeds.reduce((sum, med) => sum + med.quantity * 1000, 0)
      setTotalCost(newTotal)
    }
  }

  const handleBack = () => {
    // Save current state before going back
    const prescriptionData = {
      medications,
      totalCost,
      prescriptionId: "DT001",
      date: "20/05/2025",
      doctor: "Trần Văn Kiên",
    }
    localStorage.setItem("prescriptionData", JSON.stringify(prescriptionData))
    navigate("/medical-record")
  }

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      {/* Success modal */}
      {showSuccessModal && (
        <div className="fixed inset-0 flex items-center justify-center z-50">
          <div className="fixed inset-0 bg-black/50" onClick={() => setShowSuccessModal(false)}></div>
          <div className="bg-white rounded-lg shadow-xl p-8 z-10 max-w-md mx-4">
            <div className="text-center">
              <div className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
                <svg className="w-8 h-8 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <h3 className="text-xl font-medium text-blue-600 mb-6">Lưu đơn thuốc thành công!</h3>
              <button
                onClick={() => setShowSuccessModal(false)}
                className="bg-blue-500 hover:bg-blue-600 text-white px-8 py-2 rounded font-medium"
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
        <button className="flex items-center gap-1 text-gray-600 hover:text-gray-800" onClick={handleBack}>
          <span>✕</span> Đóng
        </button>
      </div>

      {/* Patient info */}
      <div className="mb-6">
        <h2 className="text-lg font-medium mb-4">Mã bệnh nhân: BN001 - Họ tên: Nguyễn Văn An</h2>
      </div>

      {/* Prescription info */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        <div>
          <label className="block text-sm font-medium mb-1">Mã đơn thuốc</label>
          <input
            className="w-full border border-gray-300 rounded px-3 py-2 bg-gray-100"
            defaultValue="DT001"
            readOnly
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Ngày kê đơn</label>
          <input
            className="w-full border border-gray-300 rounded px-3 py-2 bg-gray-100"
            defaultValue="20/05/2025"
            readOnly
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Bác sĩ kê đơn</label>
          <input
            className="w-full border border-gray-300 rounded px-3 py-2 bg-blue-50"
            defaultValue="Trần Văn Kiên"
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Nơi lĩnh thuốc</label>
          <input className="w-full border border-gray-300 rounded px-3 py-2 bg-blue-50" defaultValue="Quầy dược" />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Tổng chi phí</label>
          <input
            className="w-full border border-gray-300 rounded px-3 py-2"
            value={totalCost.toLocaleString()}
            readOnly
          />
        </div>
      </div>

      {/* Medications table */}
      <div className="bg-white rounded-lg shadow-sm mb-6">
        <div className="px-4 py-3 border-b">
          <h2 className="font-semibold">THÔNG TIN THUỐC</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-gray-50 text-left">
                <th className="px-4 py-3 text-sm font-medium text-gray-600 w-12">STT</th>
                <th className="px-4 py-3 text-sm font-medium text-gray-600">Tên thuốc</th>
                <th className="px-4 py-3 text-sm font-medium text-gray-600">Đơn vị tính</th>
                <th className="px-4 py-3 text-sm font-medium text-gray-600 w-20">Số lượng</th>
                <th className="px-4 py-3 text-sm font-medium text-gray-600 w-20">Số ngày</th>
                <th className="px-4 py-3 text-sm font-medium text-gray-600">Liều dùng</th>
                <th className="px-4 py-3 text-sm font-medium text-gray-600">Cách dùng</th>
                <th className="px-4 py-3 text-sm font-medium text-gray-600 w-16 text-center">Huỷ</th>
                <th className="px-4 py-3 text-sm font-medium text-gray-600 w-16 text-center">Thêm</th>
              </tr>
            </thead>
            <tbody>
              {medications.map((med, index) => (
                <>
                  <tr key={med.id} className="border-t">
                    <td className="px-4 py-3 text-sm">{index + 1}</td>
                    <td className="px-4 py-3 text-sm">
                      <div className="flex items-center">
                        {med.name || "Chưa chọn thuốc"}
                        <button className="ml-2 text-gray-500 hover:text-gray-700" onClick={() => toggleExpand(med.id)}>
                          {expandedRow === med.id ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                        </button>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-sm">{med.unit}</td>
                    <td className="px-4 py-3 text-sm">{med.quantity}</td>
                    <td className="px-4 py-3 text-sm">{med.days}</td>
                    <td className="px-4 py-3 text-sm">{med.dosage}</td>
                    <td className="px-4 py-3 text-sm">{med.usage}</td>
                    <td className="px-4 py-3 text-sm text-center">
                      <button className="text-gray-500 hover:text-red-500" onClick={() => handleDelete(med.id)}>
                        <X size={16} />
                      </button>
                    </td>
                    <td className="px-4 py-3 text-sm text-center">
                      <button className="text-gray-500 hover:text-blue-500" onClick={handleAdd}>
                        <Plus size={16} />
                      </button>
                    </td>
                  </tr>
                  {expandedRow === med.id && (
                    <tr className="bg-gray-50">
                      <td colSpan={9} className="px-4 py-3">
                        <div className="grid grid-cols-4 gap-4 p-2">
                          <div>
                            <label className="block text-xs font-medium mb-1">Tên thuốc</label>
                            <input
                              className="w-full border border-gray-300 rounded px-2 py-1 text-sm bg-blue-50"
                              value={med.name}
                              onChange={(e) => updateMedication(med.id, "name", e.target.value)}
                              placeholder="Nhập tên thuốc"
                            />
                          </div>
                          <div>
                            <label className="block text-xs font-medium mb-1">Đơn vị tính</label>
                            <input
                              className="w-full border border-gray-300 rounded px-2 py-1 text-sm bg-blue-50"
                              value={med.unit}
                              onChange={(e) => updateMedication(med.id, "unit", e.target.value)}
                              placeholder="VD: Viên, Gói, Chai"
                            />
                          </div>
                          <div>
                            <label className="block text-xs font-medium mb-1">Tồn kho</label>
                            <input
                              className="w-full border border-gray-300 rounded px-2 py-1 text-sm bg-gray-100"
                              type="number"
                              value={med.stock || 0}
                              readOnly
                              onChange={(e) => updateMedication(med.id, "stock", Number.parseInt(e.target.value) || 0)}
                            />
                          </div>
                          <div>
                            <label className="block text-xs font-medium mb-1">Hạn dùng</label>
                            <input
                              className="w-full border border-gray-300 rounded px-2 py-1 text-sm bg-gray-100"
                              type="date"
                              value={med.expiryDate}
                              readOnly
                              onChange={(e) => updateMedication(med.id, "expiryDate", e.target.value)}
                            />
                          </div>
                          <div>
                            <label className="block text-xs font-medium mb-1">Số lượng</label>
                            <input
                              className="w-full border border-gray-300 rounded px-2 py-1 text-sm bg-blue-50"
                              type="number"
                              value={med.quantity}
                              onChange={(e) =>
                                updateMedication(med.id, "quantity", Number.parseInt(e.target.value) || 0)
                              }
                            />
                          </div>
                          <div>
                            <label className="block text-xs font-medium mb-1">Số ngày</label>
                            <input
                              className="w-full border border-gray-300 rounded px-2 py-1 text-sm bg-blue-50"
                              type="number"
                              value={med.days}
                              onChange={(e) => updateMedication(med.id, "days", Number.parseInt(e.target.value) || 0)}
                            />
                          </div>
                          <div>
                            <label className="block text-xs font-medium mb-1">Liều dùng</label>
                            <input
                              className="w-full border border-gray-300 rounded px-2 py-1 text-sm bg-blue-50"
                              value={med.dosage}
                              onChange={(e) => updateMedication(med.id, "dosage", e.target.value)}
                              placeholder="VD: Sáng 1 chiều 1"
                            />
                          </div>
                          <div>
                            <label className="block text-xs font-medium mb-1">Cách dùng</label>
                            <input
                              className="w-full border border-gray-300 rounded px-2 py-1 text-sm bg-blue-50"
                              value={med.usage}
                              onChange={(e) => updateMedication(med.id, "usage", e.target.value)}
                              placeholder="VD: Uống sau khi ăn"
                            />
                          </div>
                        </div>
                      </td>
                    </tr>
                  )}
                </>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Pagination */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <button className="px-3 py-1 bg-gray-200 rounded-md hover:bg-gray-300">
            <ChevronDown className="rotate-90" size={16} />
          </button>
          <span className="text-sm">Page 1 of 1</span>
          <button className="px-3 py-1 bg-blue-100 text-blue-600 rounded-md hover:bg-blue-200">
            <ChevronDown className="rotate-270" size={16} />
          </button>
        </div>
      </div>
    </div>
  )
}

export default Prescription
