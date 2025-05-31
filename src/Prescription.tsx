"use client"

import { useState, useEffect, useRef } from "react"
import { ChevronDown, X, Plus } from "lucide-react"
import { useNavigate } from "react-router-dom"
import { Button } from "./components/ui/button"
import { Input } from "./components/ui/input"

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

interface MedicineOption {
  id: string
  name: string
  unit: string
  stock: number
  expiryDate: string
}

// Mock medicine database
const medicineDatabase: MedicineOption[] = [
  { id: "1", name: "Paracetamol", unit: "Viên", stock: 5000, expiryDate: "2026-05-20" },
  { id: "2", name: "Amoxicillin", unit: "Viên", stock: 10000, expiryDate: "2026-05-20" },
  { id: "3", name: "Ibuprofen", unit: "Viên", stock: 8000, expiryDate: "2026-05-20" },
  { id: "4", name: "Cetirizine", unit: "Viên", stock: 6000, expiryDate: "2026-05-20" },
  { id: "5", name: "Omeprazole", unit: "Viên", stock: 12000, expiryDate: "2026-05-20" },
  { id: "6", name: "Salbutamol", unit: "Viên", stock: 7000, expiryDate: "2026-05-20" },
  { id: "7", name: "Vitamin C", unit: "Viên", stock: 3000, expiryDate: "2026-05-20" },
  { id: "8", name: "Prednisolone", unit: "Viên", stock: 9000, expiryDate: "2026-05-20" },
  { id: "9", name: "Metformin", unit: "Viên", stock: 10000, expiryDate: "2026-05-20" },
  { id: "10", name: "Atorvastatin", unit: "Viên", stock: 15000, expiryDate: "2026-05-20" },
];


export default function PrescriptionPage() {
  const navigate = useNavigate()
  const [showSuccessModal, setShowSuccessModal] = useState(false)
  const [expandedRow, setExpandedRow] = useState<number | null>(null)
  const [totalCost, setTotalCost] = useState(0)
  const [searchQuery, setSearchQuery] = useState<{ [key: number]: string }>({})
  const [showDropdown, setShowDropdown] = useState<{ [key: number]: boolean }>({})
  const [filteredMedicines, setFilteredMedicines] = useState<{ [key: number]: MedicineOption[] }>({})
  const dropdownRefs = useRef<{ [key: number]: HTMLDivElement | null }>({})

  // Initialize with one empty medication
  const [medications, setMedications] = useState<Medication[]>([
    {
      id: 1,
      name: "",
      unit: "",
      dosage: "",
      quantity: 0,
      days: 0,
      usage: "",
      instruction: "",
      stock: 0,
      expiryDate: "",
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
        setTotalCost(prescriptionData.totalCost || 0)
      }
    }
  }, [])

  // Handle click outside to close dropdown
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      Object.keys(dropdownRefs.current).forEach((key) => {
        const ref = dropdownRefs.current[Number.parseInt(key)]
        if (ref && !ref.contains(event.target as Node)) {
          setShowDropdown((prev) => ({ ...prev, [Number.parseInt(key)]: false }))
        }
      })
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  const handleSave = () => {
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
    if (medications.length === 1) {
      // If only one medication, reset it instead of deleting
      setMedications([
        {
          id: 1,
          name: "",
          unit: "",
          dosage: "",
          quantity: 0,
          days: 0,
          usage: "",
          instruction: "",
          stock: 0,
          expiryDate: "",
          expanded: false,
        },
      ])
    } else {
      setMedications(medications.filter((med) => med.id !== id))
    }

    // Recalculate total cost
    const remainingMeds = medications.filter((med) => med.id !== id)
    const newTotal = remainingMeds.reduce((sum, med) => sum + med.quantity * 1000, 0)
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
      expanded: false,
    }
    setMedications([...medications, newMedication])
  }

  const updateMedication = (id: number, field: keyof Medication, value: any): void => {
    setMedications(medications.map((med) => (med.id === id ? { ...med, [field]: value } : med)))

    // Recalculate total cost when quantity changes
    if (field === "quantity") {
      const updatedMeds = medications.map((med) => (med.id === id ? { ...med, [field]: value } : med))
      const newTotal = updatedMeds.reduce((sum, med) => sum + (med.quantity || 0) * 1000, 0)
      setTotalCost(newTotal)
    }
  }

  const handleMedicineSearch = (id: number, query: string): void => {
    setSearchQuery((prev) => ({ ...prev, [id]: query }))
    updateMedication(id, "name", query)

    if (query.length > 0) {
      const filtered: MedicineOption[] = medicineDatabase.filter((medicine) =>
        medicine.name.toLowerCase().includes(query.toLowerCase()),
      )
      setFilteredMedicines((prev) => ({ ...prev, [id]: filtered }))
      setShowDropdown((prev) => ({ ...prev, [id]: true }))
    } else {
      setShowDropdown((prev) => ({ ...prev, [id]: false }))
    }
  }

  const selectMedicine = (medicationId: number, medicine: MedicineOption): void => {
    setMedications((prevMedications) =>
      prevMedications.map((med) =>
        med.id === medicationId
          ? {
              ...med,
              name: medicine.name,
              unit: medicine.unit,
              stock: medicine.stock,
              expiryDate: medicine.expiryDate,
            }
          : med,
      ),
    )

    setSearchQuery((prev) => ({ ...prev, [medicationId]: medicine.name }))
    setShowDropdown((prev) => ({ ...prev, [medicationId]: false }))
  }

  const handleBack = () => {
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

  const handlePrint = () => {
    window.print()
  }

  const formatDate = (dateString: string): string => {
    if (!dateString) return ""
    const date = new Date(dateString)
    return date.toLocaleDateString("vi-VN")
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
              <Button
                onClick={() => setShowSuccessModal(false)}
                className="bg-blue-500 hover:bg-blue-600 text-white px-8 py-2 rounded font-medium"
              >
                Đóng
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Print controls */}
      <div className="flex justify-end mb-4 gap-2">
        <Button
          variant="ghost"
          className="flex items-center gap-1 text-gray-600 hover:text-gray-800"
          onClick={handleSave}
        >
          <span>📄</span> Lưu
        </Button>
        <Button
          variant="ghost"
          className="flex items-center gap-1 text-gray-600 hover:text-gray-800"
          onClick={handlePrint}
        >
          <span>🖨️</span> In
        </Button>
        <Button
          variant="ghost"
          className="flex items-center gap-1 text-gray-600 hover:text-gray-800"
          onClick={handleBack}
        >
          <span>✕</span> Đóng
        </Button>
      </div>

      {/* Patient info */}
      <div className="mb-6">
        <h2 className="text-lg font-medium mb-4">Mã bệnh nhân: BN001 - Họ tên: Nguyễn Văn An</h2>
      </div>

      {/* Prescription info */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div>
          <label htmlFor="prescription-id" className="block text-sm font-medium mb-1">
            Mã đơn thuốc
          </label>
          <Input id="prescription-id" className="w-full bg-gray-100 border-0" defaultValue="DT001" readOnly />
        </div>
        <div>
          <label htmlFor="prescription-date" className="block text-sm font-medium mb-1">
            Ngày kê đơn
          </label>
          <Input id="prescription-date" className="w-full bg-gray-100 border-0" defaultValue="20/05/2025" readOnly />
        </div>
        <div>
          <label htmlFor="doctor-name" className="block text-sm font-medium mb-1">
            Bác sĩ kê đơn
          </label>
          <Input id="doctor-name" className="w-full bg-blue-50 border-0" defaultValue="Trần Văn Kiên" />
        </div>
        <div>
          <label htmlFor="pharmacy-location" className="block text-sm font-medium mb-1">
            Nơi lĩnh thuốc
          </label>
          <Input id="pharmacy-location" className="w-full bg-blue-50 border-0" defaultValue="Quầy dược" />
        </div>
        <div>
          <label htmlFor="total-cost" className="block text-sm font-medium mb-1">
            Tổng chi phí
          </label>
          <Input id="total-cost" className="w-full border-0" value={totalCost.toLocaleString()} readOnly />
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
                        <div
                          className=" flex-1"
                          ref={(el) => {
                            dropdownRefs.current[med.id] = el
                          }}
                        >
                          <Input
                            className="w-full text-sm bg-white border-0"
                            value={searchQuery[med.id] || med.name}
                            onChange={(e) => handleMedicineSearch(med.id, e.target.value)}
                          />

                          {/* Medicine dropdown */}
                          {showDropdown[med.id] &&
                            filteredMedicines[med.id] &&
                            filteredMedicines[med.id].length > 0 && (
                              <div
                                className="absolute mt-1 z-50 bg-white border border-gray-500 rounded-lg shadow-lg"
                                style={{ width: "calc(50% - 2rem)", maxHeight: "300px", overflowY: "auto" }}
                              >
                                <div className="top-0 border-b border-gray-500 bg-black/6">
                                  <div className="grid grid-cols-4 text-sm font-medium text-gray-900">
                                    <div className="px-4 border-r font-semibold border-gray-500">Tên thuốc</div>
                                    <div className="px-4 border-r font-semibold border-gray-500">Đơn vị tính</div>
                                    <div className="px-4 border-r font-semibold border-gray-500">Tồn kho</div>
                                    <div className="px-4 font-semibold border-gray-500">Hạn dùng</div>
                                  </div>
                                </div>
                                {filteredMedicines[med.id].map((medicine, index) => (
                                  <div
                                    key={medicine.id}
                                    className={`grid grid-cols-4 text-sm hover:bg-blue-50 cursor-pointer ${index > 0 ? "border-t" : ""}`}
                                    onClick={() => selectMedicine(med.id, medicine)}
                                  >
                                    <div className="px-4 py-[1px] border-r">{medicine.name}</div>
                                    <div className="px-4 py-[1px] border-r">{medicine.unit}</div>
                                    <div className="px-4 py-[1px] border-r">{medicine.stock}</div>
                                    <div className="px-4 py-[1px]">{formatDate(medicine.expiryDate)}</div>
                                  </div>
                                ))}
                              </div>
                            )}
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-sm">
                      <Input className="w-full text-sm bg-gray-100 border-0" value={med.unit || ""} readOnly />
                    </td>
                    <td className="px-4 py-3 text-sm">
                      <Input
                        className="w-full text-sm bg-white border-0"
                        type="number"
                        value={med.quantity || ""}
                        onChange={(e) => updateMedication(med.id, "quantity", Number.parseInt(e.target.value) || 0)}
                      />
                    </td>
                    <td className="px-4 py-3 text-sm">
                      <Input
                        className="w-full text-sm bg-white border-0"
                        type="number"
                        value={med.days || ""}
                        onChange={(e) => updateMedication(med.id, "days", Number.parseInt(e.target.value) || 0)}
                      />
                    </td>
                    <td className="px-4 py-3 text-sm">
                      <Input
                        className="w-full text-sm bg-white border-0"
                        value={med.dosage}
                        onChange={(e) => updateMedication(med.id, "dosage", e.target.value)}
                      />
                    </td>
                    <td className="px-4 py-3 text-sm">
                      <Input
                        className="w-full text-sm bg-white border-0"
                        value={med.usage}
                        onChange={(e) => updateMedication(med.id, "usage", e.target.value)}
                      />
                    </td>
                    <td className="px-4 py-3 text-sm text-center">
                      <Button
                        variant="ghost"
                        size="sm"
                        className="p-0 h-auto text-gray-500 hover:text-red-500"
                        onClick={() => handleDelete(med.id)}
                      >
                        <X size={16} />
                      </Button>
                    </td>
                    <td className="px-4 py-3 text-sm text-center">
                      <Button
                        variant="ghost"
                        size="sm"
                        className="p-0 h-auto text-gray-500 hover:text-blue-500"
                        onClick={handleAdd}
                      >
                        <Plus size={16} />
                      </Button>
                    </td>
                  </tr>
                  {expandedRow === med.id && (
                    <tr className="bg-gray-50">
                      <td colSpan={9} className="px-4 py-3">
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 p-2">
                          <div>
                            <label htmlFor={`med-stock-${med.id}`} className="block text-xs font-medium mb-1">
                              Tồn kho
                            </label>
                            <Input
                              id={`med-stock-${med.id}`}
                              className="w-full text-sm bg-gray-100 border-0"
                              type="number"
                              value={med.stock || 0}
                              readOnly
                            />
                          </div>
                          <div>
                            <label htmlFor={`med-expiry-${med.id}`} className="block text-xs font-medium mb-1">
                              Hạn dùng
                            </label>
                            <Input
                              id={`med-expiry-${med.id}`}
                              className="w-full text-sm bg-gray-100 border-0"
                              type="date"
                              value={med.expiryDate}
                              readOnly
                            />
                          </div>
                          <div>
                            <label htmlFor={`med-instruction-${med.id}`} className="block text-xs font-medium mb-1">
                              Ghi chú
                            </label>
                            <Input
                              id={`med-instruction-${med.id}`}
                              className="w-full text-sm bg-white border-0"
                              value={med.instruction}
                              onChange={(e) => updateMedication(med.id, "instruction", e.target.value)}
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
          <Button variant="outline" size="sm" disabled>
            <ChevronDown className="rotate-90" size={16} />
          </Button>
          <span className="text-sm">Page 1 of 1</span>
          <Button variant="outline" size="sm" disabled>
            <ChevronDown className="rotate-[270deg]" size={16} />
          </Button>
        </div>
        <div className="text-sm text-gray-600">Tổng số thuốc: {medications.length}</div>
      </div>
    </div>
  )
}
