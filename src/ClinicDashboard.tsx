import {  useRef, useState } from "react"
import { Search, Filter, Eye} from "lucide-react"
import { Input } from "./components/ui/input"
import { Button } from "./components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./components/ui/select"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "./components/ui/dialog"
import type { Patient, FilterCriteria } from "../types/patient"
import { useNavigate } from 'react-router-dom';

const initialPatients: Patient[] = [
  {
    id: "1",
    patientCode: "BN001", 
    name: "Nguyễn Văn An",
    department: "Nội tổng quát",
    examDate: "20/05/2025",
    orderNumber: 1,
    examType: "Khám mới",
  },
  {
    id: "2",
    patientCode: "BN002",
    name: "Trần Thị Bình",
    department: "Tai mũi họng",
    examDate: "20/05/2025",
    orderNumber: 2,
    examType: "Khám mới",
  },
  {
    id: "3",
    patientCode: "BN003",
    name: "Lê Minh Châu",
    department: "Da liễu",
    examDate: "20/05/2025",
    orderNumber: 3,
    examType: "Khám mới",
  },
  {
    id: "4",
    patientCode: "BN004",
    name: "Phạm Quốc Dũng",
    department: "Nội tổng quát",
    examDate: "20/05/2025",
    orderNumber: 4,
    examType: "Khám mới",
  },
  {
    id: "5",
    patientCode: "BN005",
    name: "Hoàng Thị E",
    department: "Da liễu",
    examDate: "20/05/2025",
    orderNumber: 5,
    examType: "Khám mới",
  },
]

export default function PatientList() {
  const [patients, setPatients] = useState<Patient[]>(initialPatients)
  const [searchTerm, setSearchTerm] = useState("")
  const [showAdvancedFilter, setShowAdvancedFilter] = useState(false)
  const [selectedPatient, setSelectedPatient] = useState<Patient | null>(null)
  const [showPatientDetail, setShowPatientDetail] = useState(false)
    const filterRef = useRef<HTMLDivElement | null>(null);
  const navigate = useNavigate()

  const [filters, setFilters] = useState<FilterCriteria>({
    name: "all",
    department: "all",
    patientCode: "all",
    examDate: "all",
  })
 

  const handleBasicSearch = (term: string) => {
    setSearchTerm(term)
    if (term === "") {
      setPatients(initialPatients)
    } else {
      const filtered = initialPatients.filter(
        (patient) =>
          patient.name.toLowerCase().includes(term.toLowerCase()) ||
          patient.patientCode.toLowerCase().includes(term.toLowerCase()),
      )
      setPatients(filtered)
    }
  }

  const handleAdvancedFilter = () => {
    let filtered = initialPatients

    if (filters.name && filters.name !== "all") {
      filtered = filtered.filter((patient) => patient.name.toLowerCase().includes(filters.name.toLowerCase()))
    }

    if (filters.department && filters.department !== "all") {
      filtered = filtered.filter((patient) => patient.department === filters.department)
    }

    if (filters.patientCode && filters.patientCode !== "all") {
      filtered = filtered.filter((patient) => patient.patientCode === filters.patientCode)
    }
    if (filters.examDate && filters.examDate !== "all") {
    const [fYear, fMonth, fDay] = filters.examDate.split("-")
    const selectedDate = new Date(+fYear, +fMonth - 1, +fDay)

    filtered = filtered.filter((patient) => {
    const [day, month, year] = patient.examDate.split("/")
    const examDate = new Date(+year, +month - 1, +day)
    return examDate.getTime() === selectedDate.getTime()
    })
 }

    setPatients(filtered)
    setShowAdvancedFilter(false)
  }

  const clearFilters = () => {
    setFilters({
      name: "all",
      department: "all",
      patientCode: "all",
      examDate: "all",
    })
    setPatients(initialPatients)
  }

  const handleViewPatient = (patient: Patient) => {
    setSelectedPatient(patient)
    setShowPatientDetail(true)
  }

  const handleCreateMedicalRecord = () => {
    navigate('/medical-record/')
    setShowPatientDetail(false)
  }

  const CustomSelect = ({
    label,
    value,
    onValueChange,
    options,
    placeholder,
  }: {
    label: string
    value: string
    onValueChange: (value: string) => void
    options: { value: string; label: string }[]
    placeholder?: string
  }) => (
    <div className="flex items-center border rounded-lg bg-white">
      <div className="px-3 py-2 text-sm font-medium text-gray-700 bg-gray-50 border-r min-w-[120px]">{label}</div>
      <Select value={value} onValueChange={onValueChange}>
        <SelectTrigger className="border-0 shadow-none focus:ring-0 flex-1">
          <SelectValue placeholder={placeholder} />
        </SelectTrigger>
        <SelectContent>
          {options.map((option) => (
            <SelectItem key={option.value} value={option.value}>
              {option.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  )

  return (
    <div className="p-6">
      <div className="bg-white rounded-lg shadow-sm border p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-lg font-medium text-gray-800">
            Danh sách bệnh nhân chờ khám
          </h2>
          <div className="flex items-center gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input
                placeholder="Tra cứu bệnh nhân"
                value={searchTerm}
                onChange={(e) => handleBasicSearch(e.target.value)}
                className="pl-10 w-80"
              />
            </div>
            <Button
              variant="outline"
              onClick={() => setShowAdvancedFilter(!showAdvancedFilter)}
              className="p-2 "
            >
              <Filter className="w-4 h-4 " />
            </Button>
          </div>
        </div>

        {showAdvancedFilter && (
        <>
          {/* Overlay mờ nền */}
           <div className="fixed inset-0 bg-black/5 backdrop-blur-sm z-10" 
           onClick={() => setShowAdvancedFilter(false)} />
          <div
            className="absolute  right-10 z-20 w-[60%] mb-6 p-4 bg-white border rounded-lg "
            ref={filterRef}
          >
            <div className="flex flex-col gap-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="flex flex-col gap-4">
                  <CustomSelect
                    label="Tên"
                    value={filters.name}
                    onValueChange={(value) =>
                      setFilters({ ...filters, name: value })
                    }
                    options={[
                      { value: "all", label: "Tất cả" },
                      { value: "Nguyễn Văn An", label: "Nguyễn Văn An" },
                      { value: "Trần Thị Bình", label: "Trần Thị Bình" },
                      { value: "Lê Minh Châu", label: "Lê Minh Châu" },
                      { value: "Phạm Quốc Dũng", label: "Phạm Quốc Dũng" },
                      { value: "Hoàng Thị E", label: "Hoàng Thị E" },
                    ]}
                  />

                  <CustomSelect
                    label="Chuyên khoa"
                    value={filters.department}
                    onValueChange={(value) =>
                      setFilters({ ...filters, department: value })
                    }
                    options={[
                      { value: "all", label: "Tất cả" },
                      { value: "Tai mũi họng", label: "Tai mũi họng" },
                      { value: "Nội tổng quát", label: "Nội tổng quát" },
                      { value: "Da liễu", label: "Da liễu" },
                    ]}
                  />
                </div>

                <div className="flex flex-col gap-4">
                  <div className="flex items-center gap-2">
                    <div className="flex-1">
                      <CustomSelect
                        label="Mã bệnh nhân"
                        value={filters.patientCode}
                        onValueChange={(value) =>
                          setFilters({ ...filters, patientCode: value })
                        }
                        options={[
                          { value: "all", label: "Tất cả" },
                          { value: "BN001", label: "BN001" },
                          { value: "BN002", label: "BN002" },
                          { value: "BN003", label: "BN003" },
                          { value: "BN004", label: "BN004" },
                          { value: "BN005", label: "BN005" },
                        ]}
                      />
                    </div>
                    <Button
                      onClick={clearFilters}
                      variant="outline"
                      className="px-6 h-10"
                    >
                      Xóa
                    </Button>
                  </div>

                  <div className="flex items-center justify-between gap-2">
                    <div className="flex flex-1 items-center border rounded-lg bg-white">
                      <div className="px-3 py-2 text-sm font-medium text-gray-700 bg-gray-50 border-r min-w-[120px]">
                        Ngày khám
                      </div>
                      <Input
                        type="date"
                        className="border-0 shadow-none focus:ring-0"
                        value={
                          filters.examDate === "all" ? "" : filters.examDate
                        }
                        onChange={(e) =>  
                          setFilters({ ...filters, examDate: e.target.value })
                        }
                      />
                    </div>

                    <Button
                      onClick={handleAdvancedFilter}
                      className="bg-blue-700 hover:bg-blue-600 text-white px-6 h-10"
                    >
                      Tìm
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </div></>
        )}

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b">
                <th className="text-left py-3 px-4 font-medium text-gray-600">
                  STT
                </th>
                <th className="text-left py-3 px-4 font-medium text-gray-600">
                  Mã bệnh nhân
                </th>
                <th className="text-left py-3 px-4 font-medium text-gray-600">
                  Tên bệnh nhân
                </th>
                <th className="text-left py-3 px-4 font-medium text-gray-600">
                  Chuyên khoa
                </th>
                <th className="text-left py-3 px-4 font-medium text-gray-600">
                  Ngày khám
                </th>
                <th className="text-left py-3 px-4 font-medium text-gray-600"></th>
              </tr>
            </thead>
            <tbody>
              {patients.map((patient, index) => (
                <tr key={patient.id} className="border-b hover:bg-gray-50">
                  <td className="py-3 px-4">{index + 1}</td>
                  <td className="py-3 px-4">{patient.patientCode}</td>
                  <td className="py-3 px-4">{patient.name}</td>
                  <td className="py-3 px-4">{patient.department}</td>
                  <td className="py-3 px-4">{patient.examDate}</td>
                  <td className="py-3 px-4">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleViewPatient(patient)}
                    >
                      <Eye className="w-4 h-4" />
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="flex justify-between items-center mt-4">
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" disabled>
              {"<"}
            </Button>
            <span className="text-sm text-gray-600">Page 1 of 1</span>
            <Button variant="outline" size="sm" disabled>
              {">"}
            </Button>
          </div>
          <div className="text-sm text-gray-600">
            Tổng hồ sơ: {patients.length}
          </div>
        </div>
      </div>

      {/* Patient Detail Modal */}
      <Dialog open={showPatientDetail} onOpenChange={setShowPatientDetail}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <div className="flex justify-between items-center">
              <DialogTitle className="text-lg font-bold">
                THÔNG TIN ĐĂNG KÝ KHÁM BỆNH
              </DialogTitle>
            </div>
          </DialogHeader>

          {selectedPatient && (
            <div className="space-y-4">
              <div>
                <span className="font-medium">Bệnh nhân: </span>
                <span className="uppercase">{selectedPatient.name}</span>
              </div>

              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="font-medium">Chuyên khoa</span>
                  <span className="bg-gray-100 px-3 py-1 rounded">
                    {selectedPatient.department}
                  </span>
                </div>

                <div className="flex justify-between">
                  <span className="font-medium">Ngày khám</span>
                  <span className="bg-gray-100 px-3 py-1 rounded">
                    {selectedPatient.examDate}
                  </span>
                </div>

                <div className="flex justify-between">
                  <span className="font-medium">Số thứ tự</span>
                  <span className="bg-gray-100 px-3 py-1 rounded">
                    {selectedPatient.orderNumber}
                  </span>
                </div>

                <div className="flex justify-between">
                  <span className="font-medium">Hình thức khám</span>
                  <span className="bg-gray-100 px-3 py-1 rounded">
                    {selectedPatient.examType}
                  </span>
                </div>
              </div>

              <div className="pt-4">
                <Button
                  onClick={handleCreateMedicalRecord}
                  className="w-full bg-blue-500 hover:bg-blue-600"
                >
                  Tạo bệnh án
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
