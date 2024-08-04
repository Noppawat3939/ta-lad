import { MainLayout } from "@/components";
import {
  Button,
  Card,
  CardBody,
  CardFooter,
  Image,
  Link,
} from "@nextui-org/react";
import { ChevronRight } from "lucide-react";
import { Metadata } from "next";
import { ReactNode } from "react";

export const metadata: Metadata = {
  title: "สมัครสมาชิกเพื่อเข้าสู่ระบบ",
};

interface IRegisterCard {
  role: string;
  image: string;
  label: ReactNode;
}

export default function RegistationPage() {
  const registerOptions: IRegisterCard[] = [
    {
      role: "seller-user",
      image: "/images/seller.png",
      label: (
        <p>
          {"ฉันกำลังมองหา"}
          <span className="text-[#FF731D] font-medium">{"ตลาด"}</span>
          {"ที่ดีสำหรับธุรกิจของฉัน"}
        </p>
      ),
    },
    {
      role: "end-user",
      image: "/images/user.png",
      label: (
        <p>
          {"ฉันกำลังมองหา"}
          <span className="text-[#FF731D] font-medium">{"สินค้า"}</span>
          {"ที่ดีมีคุณภาพสำหรับฉัน"}
        </p>
      ),
    },
  ];

  return (
    <MainLayout className="flex flex-col gap-4 px-4 items-center justify-center">
      <header>
        <h2 className="text-3xl font-semibold max-md:text-xl">
          {"สวัสดี คุณกำลังมองหาอะไรอยู่เหรอ ?"}
        </h2>
      </header>
      <section className="flex justify-center gap-5 w-full max-w-[900px] max-md:flex-col">
        {registerOptions.map((option) => (
          <RegisCard key={option.role} {...option} />
        ))}
      </section>
    </MainLayout>
  );
}

function RegisCard({ image, label, role }: IRegisterCard) {
  return (
    <Card className="w-full pb-2">
      <CardBody>
        <center>
          <Image
            src={image}
            loading="lazy"
            height={320}
            className="max-md:h-[240px] object-contain"
          />
        </center>
        <div className="flex justify-center">{label}</div>
      </CardBody>
      <CardFooter className="justify-center">
        <Button
          as={Link}
          href={`/registration/${role}`}
          className="hover:-translate-y-1"
          color={role === "seller-user" ? "secondary" : "primary"}
        >
          {"ไปกันเลย"}
          <ChevronRight className="w-4 h-4" />
        </Button>
      </CardFooter>
    </Card>
  );
}
