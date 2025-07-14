
interface Props {
    OpenDropdownMenu: (e: React.MouseEvent<HTMLButtonElement>) => void
}

const DropdownButton = ({OpenDropdownMenu} : Props) => {
  return (
    <div>
      <div className="absolute top-4 right-4 font-fredoka z-20" style={{WebkitTextStroke: "1px #FFAA00"}}>
            <button className="w-[193px] h-[52px] hover:bg-onparOrange border-[3px] border-onparOrange bg-onparLightYellow rounded-2xl p-5 text-l" onClick={OpenDropdownMenu}>
                <span className="relative bottom-[6px]">Menu</span>
            </button>
        </div>
    </div>
  )
}

export default DropdownButton
