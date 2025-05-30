export default function Sidebar() {
    return (
      <aside className="w-64 bg-white rounded-md">
        <div className="w-full p-2 pb-2">
          <div className="flex items-center justify-center pt-4">
            <div className="w-16 h-16 bg-blue-600 rounded-md flex items-center justify-center">
              <img src="/avatar.png"/>
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
            </div>
          </div>
          <div className="text-center text-lg mt-2 flex flex-wrap">
            <span className="font-bold text-blue-800 text-lg">PHÒNG KHÁM ĐA KHOA TÂM ĐỨC</span>
          </div>
        </div>
        <nav className="mt-4 pt-10">
          <ul className="text-lg font-bold">
            <li className="px-6 py-3 text-gray-600 hover:bg-gray-100">Quản lý ca khám</li>
            <li className="px-6 py-3">
                <div className="bg-[#16bbe5] text-[#2c4e6d] rounded-md py-2 pl-2 -ml-2 w-[60%] font-semibold flex items-center gap-2">
                    Khám bệnh
                </div>
            </li>
            <li className="px-6 py-3 text-gray-600 hover:bg-gray-100">Hồ sơ khám bệnh</li>
          </ul>
        </nav>
      </aside>
    )
  }
  