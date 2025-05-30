"use client"

import { useEffect, useState } from "react"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { useNavigate } from "react-router-dom"

const Appointment = () => {
  const navigate = useNavigate()
  const [showSuccessModal, setShowSuccessModal] = useState(false)
  const [showCalendar, setShowCalendar] = useState(false)
  const [selectedDate, setSelectedDate] = useState("06/05/2025")
  const [selectedTime, setSelectedTime] = useState("10:00 AM")
  const [currentMonth, setCurrentMonth] = useState(4) // May = 4 (0-indexed)
  const [currentYear, setCurrentYear] = useState(2025)
  const [selectedDay, setSelectedDay] = useState(6)
  const [selectedHour, setSelectedHour] = useState("10")
  const [selectedMinute, setSelectedMinute] = useState("00")
  const [selectedPeriod, setSelectedPeriod] = useState("AM")

  const months = [
    "Tháng 1",
    "Tháng 2",
    "Tháng 3",
    "Tháng 4",
    "Tháng 5",
    "Tháng 6",
    "Tháng 7",
    "Tháng 8",
    "Tháng 9",
    "Tháng 10",
    "Tháng 11",
    "Tháng 12",
  ]

  useEffect(() => {
    // Load appointment data from localStorage if available
    const storedData = localStorage.getItem("appointmentData")
    if (storedData) {
      const appointmentData = JSON.parse(storedData)
      setSelectedDate(appointmentData.date || "06/05/2025")
      setSelectedTime(appointmentData.time || "10:00 AM")
      setSelectedDay(parseInt(appointmentData.date.split("/")[0], 10))
      setSelectedHour(appointmentData.time.split(":")[0])
      setSelectedMinute(appointmentData.time.split(":")[1].split(" ")[0])
      setSelectedPeriod(appointmentData.time.split(" ")[1])
    }
  },[])


  const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate()
  const firstDayOfMonth = new Date(currentYear, currentMonth, 1).getDay()

  const handleSave = () => {
    // Save appointment data to localStorage
    const appointmentData = {
      doctor: "Nguyễn Thanh Hoài",
      date: selectedDate,
      time: selectedTime,
      patientId: "BN001",
      patientName: "Nguyễn Văn An",
    }
    localStorage.setItem("appointmentData", JSON.stringify(appointmentData))
    setShowSuccessModal(true)
  }

  const handleBack = () => {
    // Save current state before going back
    const appointmentData = {
      doctor: "Nguyễn Thanh Hoài",
      date: selectedDate,
      time: selectedTime,
      patientId: "BN001",
      patientName: "Nguyễn Văn An",
    }
    localStorage.setItem("appointmentData", JSON.stringify(appointmentData))
    navigate("/medical-record")
  }

  const handleDateClick = (day: number) => {
    setSelectedDay(day)
    const formattedDate = `${day.toString().padStart(2, "0")}/${(currentMonth + 1).toString().padStart(2, "0")}/${currentYear}`
    setSelectedDate(formattedDate)
  }

  const handleTimeChange = () => {
    const time = `${selectedHour}:${selectedMinute} ${selectedPeriod}`
    setSelectedTime(time)
    setShowCalendar(false)
  }

  const navigateMonth = (direction: number) => {
    if (direction === 1) {
      if (currentMonth === 11) {
        setCurrentMonth(0)
        setCurrentYear(currentYear + 1)
      } else {
        setCurrentMonth(currentMonth + 1)
      }
    } else {
      if (currentMonth === 0) {
        setCurrentMonth(11)
        setCurrentYear(currentYear - 1)
      } else {
        setCurrentMonth(currentMonth - 1)
      }
    }
  }

  const renderCalendarDays = () => {
    const days = []

    // Empty cells for days before the first day of the month
    for (let i = 0; i < firstDayOfMonth; i++) {
      const prevMonth = currentMonth === 0 ? 11 : currentMonth - 1
      const prevYear = currentMonth === 0 ? currentYear - 1 : currentYear
      const daysInPrevMonth = new Date(prevYear, prevMonth + 1, 0).getDate()
      const day = daysInPrevMonth - firstDayOfMonth + i + 1

      days.push(
        <button
          key={`prev-${day}`}
          className="w-8 h-8 text-gray-400 hover:bg-gray-100 rounded text-sm"
          onClick={() => {
            navigateMonth(-1)
            handleDateClick(day)
          }}
        >
          {day}
        </button>,
      )
    }

    // Days of the current month
    for (let day = 1; day <= daysInMonth; day++) {
      const isSelected = day === selectedDay && currentMonth === 4 && currentYear === 2025
      days.push(
        <button
          key={day}
          className={`w-8 h-8 rounded text-sm ${
            isSelected ? "bg-blue-500 text-white" : "text-gray-700 hover:bg-gray-100"
          }`}
          onClick={() => handleDateClick(day)}
        >
          {day}
        </button>,
      )
    }

    // Fill remaining cells with next month's days
    const totalCells = 42 // 6 rows × 7 days
    const remainingCells = totalCells - days.length
    for (let day = 1; day <= remainingCells; day++) {
      days.push(
        <button
          key={`next-${day}`}
          className="w-8 h-8 text-gray-400 hover:bg-gray-100 rounded text-sm"
          onClick={() => {
            navigateMonth(1)
            handleDateClick(day)
          }}
        >
          {day}
        </button>,
      )
    }

    return days
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
              <h3 className="text-xl font-medium text-blue-600 mb-6">Hẹn tái khám thành công!</h3>
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

      {/* Patient info section */}
      <section className="bg-white rounded-lg shadow-sm mb-6">
        <div className="bg-white text-black px-4 py-2 rounded-t-lg">
          <h2 className="font-semibold">THÔNG TIN HÀNH CHÍNH</h2>
        </div>
        <div className="p-4">
          <div className="grid grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">Mã bệnh nhân</label>
              <input
                className="w-full border border-gray-300 rounded px-3 py-2 bg-blue-100"
                defaultValue="BN001"
                readOnly
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Họ tên</label>
              <input
                className="w-full border border-gray-300 rounded px-3 py-2 bg-blue-50"
                defaultValue="Nguyễn Văn An"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Giới tính</label>
              <input className="w-full border border-gray-300 rounded px-3 py-2 bg-blue-50" defaultValue="Nam" />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Ngày sinh</label>
              <input className="w-full border border-gray-300 rounded px-3 py-2 bg-blue-50" defaultValue="27/07/1999" />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Mã số khám</label>
              <input
                className="w-full border border-gray-300 rounded px-3 py-2 bg-blue-100"
                defaultValue="SK001"
                readOnly
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Số điện thoại</label>
              <input className="w-full border border-gray-300 rounded px-3 py-2 bg-blue-50" defaultValue="0912345678" />
            </div>
            <div className="col-span-3">
              <label className="block text-sm font-medium mb-1">Địa chỉ</label>
              <input
                className="w-full border border-gray-300 rounded px-3 py-2 bg-blue-50"
                defaultValue="123 Đường Láng, Hà Nội"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Appointment info section */}
      <section className="bg-white rounded-lg shadow-sm mb-6">
        <div className="bg-white text-black px-4 py-2 rounded-t-lg">
          <h2 className="font-semibold">THÔNG TIN HẸN KHÁM</h2>
        </div>
        <div className="pl-85 p-8">
          <div className="grid grid-cols-2 gap-8 w-150">
            {/* Left side - Appointment fields */}
            <div className="space-y-8">
              {/* Doctor */}
              <div>
                <h3 className="text-lg font-medium text-gray-700 mb-4">Bác sĩ</h3>
                <div className="bg-white border border-gray-200 rounded-full px-6 py-3 shadow-sm">
                  <span className="text-lg text-gray-800">Nguyễn Thanh Hoài</span>
                </div>
              </div>

              {/* Date */}
              <div>
                <h3 className="text-lg font-medium text-gray-700 mb-4">Ngày khám</h3>
                <button
                  className="bg-white border border-gray-200 rounded-full px-6 py-3 shadow-sm hover:shadow-md transition-shadow w-full text-left"
                  onClick={() => setShowCalendar(!showCalendar)}
                >
                  <span className="text-lg text-gray-800">{selectedDate}</span>
                </button>
              </div>

              {/* Time */}
              <div>
                <h3 className="text-lg font-medium text-gray-700 mb-4">Giờ khám</h3>
                <div className="bg-white border border-gray-200 rounded-full px-6 py-3 shadow-sm">
                  <span className="text-lg text-gray-800">{selectedTime}</span>
                </div>
              </div>
            </div>

            {/* Right side - Calendar */}
            <div className="flex justify-center">
              {showCalendar && (
                <div className="bg-white border border-gray-200 rounded-lg shadow-lg p-6 w-full max-w-sm">
                  {/* Calendar header */}
                  <div className="flex items-center justify-between mb-4">
                    <button onClick={() => navigateMonth(-1)} className="p-1 hover:bg-gray-100 rounded">
                      <ChevronLeft size={16} />
                    </button>
                    <span className="font-medium">
                      {months[currentMonth]} {currentYear}
                    </span>
                    <button onClick={() => navigateMonth(1)} className="p-1 hover:bg-gray-100 rounded">
                      <ChevronRight size={16} />
                    </button>
                  </div>

                  {/* Calendar grid */}
                  <div className="grid grid-cols-7 gap-1 mb-4">
                    {["S", "M", "T", "W", "T", "F", "S"].map((day) => (
                      <div
                        key={day}
                        className="w-8 h-8 flex items-center justify-center text-sm font-medium text-gray-500"
                      >
                        {day}
                      </div>
                    ))}
                    {renderCalendarDays()}
                  </div>

                  {/* Time selection */}
                  <div className="flex items-center justify-center space-x-2 pt-4 border-t">
                    <select
                      value={selectedHour}
                      onChange={(e) => setSelectedHour(e.target.value)}
                      className="border border-gray-300 rounded px-2 py-1 text-sm bg-blue-50"
                    >
                      {Array.from({ length: 12 }, (_, i) => (
                        <option key={i + 1} value={(i + 1).toString().padStart(2, "0")}>
                          {(i + 1).toString().padStart(2, "0")}
                        </option>
                      ))}
                    </select>
                    <span>:</span>
                    <select
                      value={selectedMinute}
                      onChange={(e) => setSelectedMinute(e.target.value)}
                      className="border border-gray-300 rounded px-2 py-1 text-sm bg-blue-50"
                    >
                      {["00", "15", "30", "45"].map((minute) => (
                        <option key={minute} value={minute}>
                          {minute}
                        </option>
                      ))}
                    </select>
                    <select
                      value={selectedPeriod}
                      onChange={(e) => setSelectedPeriod(e.target.value)}
                      className="border border-gray-300 rounded px-2 py-1 text-sm bg-blue-50"
                    >
                      <option value="AM">AM</option>
                      <option value="PM">PM</option>
                    </select>
                    <button
                      onClick={handleTimeChange}
                      className="bg-blue-500 text-white px-3 py-1 rounded text-sm hover:bg-blue-600"
                    >
                      OK
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Pagination */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <button className="px-3 py-1 bg-gray-200 rounded-md hover:bg-gray-300">
            <ChevronLeft size={16} />
          </button>
          <span className="text-sm">Page 1 of 1</span>
          <button className="px-3 py-1 bg-blue-100 text-blue-600 rounded-md hover:bg-blue-200">
            <ChevronRight size={16} />
          </button>
        </div>
      </div>
    </div>
  )
}

export default Appointment
