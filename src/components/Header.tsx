import { Button } from "./ui/button"

export default function Header() {
  return (
    <header className="flex justify-between items-center bg-gray-200 p-4 shadow-sm rounded-2xl h-20 gap-2">
      <h2 className="text-lg font-semibold px-2">KHÁM BỆNH</h2>
      <div className="flex items-center gap-3">
        <div className="flex items-center gap-2 text-lg">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="currentColor"
            className="w-6 h-6 text-gray-500"
            viewBox="0 0 24 24"
          >
            <path d="M12 12c2.761 0 5-2.239 5-5s-2.239-5-5-5-5 2.239-5 5 2.239 5 5 5zm0 2c-3.866 0-7 3.134-7 7h2c0-2.761 2.239-5 5-5s5 2.239 5 5h2c0-3.866-3.134-7-7-7z" />
          </svg>
          <span >Trần Văn Kiên</span>
        </div>
        <Button className="bg-blue-500 hover:bg-blue-600 text-white text-lg ml-10">Đăng xuất</Button>
      </div>
    </header>
  )
}
