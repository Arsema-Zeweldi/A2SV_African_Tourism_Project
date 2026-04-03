const FooterSimple = () => {
  return (
    <footer className="mt-auto bg-[#faf8f5] py-8 relative z-10 w-full overflow-hidden before:absolute before:inset-x-0 before:top-0 before:h-px before:bg-linear-to-r before:from-transparent before:via-[#e7dfd6] before:to-transparent">
      <div className="mx-auto px-6 text-center">
        <p className="text-[13px] font-medium text-[#a27f72]">
          &copy; {new Date().getFullYear()} Amona. All rights reserved.
        </p>
      </div>
    </footer>
  )
}

export default FooterSimple
