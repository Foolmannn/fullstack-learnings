import Image from "next/image";
import Upload from "./components/ImageUpload";
export default function Home() {


  return (
    <div className="flex flex-col flex-1 items-center justify-center bg-white font-sans dark:bg-black">
<Upload />
    </div>
  );
}
