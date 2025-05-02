import Link from "next/link"
import PopularTags from "./PopularTags"
import Recommendations from "./Recommendations"
import Search from "./Search"

export default function RightBar() {
  return (
    <div className="pt-4 flex flex-col gap-4 sticky top-0 h-max">
      <Search />
      <Recommendations />
      <PopularTags />
      <div className="text-textGray text-sm flex gap-x-4 flex-wrap">
        <Link href="/">Terms of Services</Link>
        <Link href="/">Privacy Policy</Link>
        <Link href="/">Cookie policy</Link>
        <Link href="/">Accessibility</Link>
        <Link href="/">Ads info</Link>
        <span> © 2025 X</span>
      </div>
    </div>
  )
}
