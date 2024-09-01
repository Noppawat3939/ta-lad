"use client";

import {
  CustomTable,
  InsertProductForm,
  Modal,
  SidebarLayout,
} from "@/components";
import { RegexImgFile, isEmpty, parseCSV } from "@/lib";
import {
  Button,
  Card,
  CardBody,
  CardHeader,
  Input,
  Tab,
  Tabs,
} from "@nextui-org/react";
import { useMutation } from "@tanstack/react-query";
import axios from "axios";
import { FileInput, Link, Upload } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { type ReactNode, useRef, useState, useEffect, Suspense } from "react";
import * as xlsx from "xlsx";

interface IUploadData {
  product_name: string;
  product_image: ReactNode;
  product_price: number | string;
  stock_amount: number | string;
}

type IRawDUploadData = Record<keyof IUploadData, string>;

type InsertMethod = "google_sheet" | "csv" | "form";

const GOOGLE_SHEET_TEST_URL =
  "https://docs.google.com/spreadsheets/d/10q7cJqt8F3ce-OsAcP5vmXjhLOnYq19yWiwYWmYD30U/pub?output=csv";

function ProductInsert() {
  const router = useRouter();
  const search = useSearchParams();
  const searchMethod = search.get("method");

  const inputRef = useRef<HTMLInputElement>(null);

  const [insertMethod, setInsertMethod] = useState<InsertMethod>("form");
  const [googleSheetUrl, setGoogleSheetUrl] = useState("");
  const [uploading, setUploading] = useState(false);
  const [uploadData, setUploadData] = useState<IUploadData[]>([]);

  const fetchGoogleSheetMutation = useMutation({
    mutationFn: async () => await axios.get<string>(googleSheetUrl),
    onSuccess: ({ data: rawData }) => {
      const parsed = parseCSV<IRawDUploadData[]>(rawData);
      if (!isEmpty(parsed)) {
        if (validateImageRawData(parsed)) {
          setUploadData(mappingUploadDataDto(parsed));
        }

        setGoogleSheetUrl("");
      }
    },
  });

  useEffect(() => {
    if (searchMethod) {
      setInsertMethod(searchMethod as InsertMethod);
    }
  }, []);

  const replaceUrl = (q = "") =>
    router.replace(`/business/products/insert${q}`, { scroll: false });

  const validateImageRawData = (rawData: IRawDUploadData[]) => {
    const isValid = rawData
      .map((item) => item?.product_image)
      ?.every((img) => RegexImgFile.test(img));

    return isValid;
  };

  const mappingUploadDataDto = (rawData: IRawDUploadData[]) => {
    const mapped = rawData.map((item) => ({
      ...item,
      product_image: (
        <picture>
          <img alt="product_image" src={item.product_image} width={100} />
        </picture>
      ),
    }));

    return mapped;
  };

  const handleUploadCsv = (file: File) => {
    setUploading(true);

    try {
      const reader = new FileReader();

      reader.onload = ({ target }) => {
        const workBook = xlsx.read(target?.result, {
          type: "binary",
        });
        const sheetName = workBook.SheetNames[0];
        const sheet = workBook.Sheets[sheetName];
        const sheetData: IRawDUploadData[] = xlsx.utils.sheet_to_json(sheet);

        if (validateImageRawData(sheetData)) {
          mappingUploadDataDto(sheetData);

          setUploadData(mappingUploadDataDto(sheetData));
        }
      };

      reader.readAsBinaryString(file as unknown as Blob);
    } catch (err) {
      console.error(err);
    } finally {
      setUploading(false);
    }
  };

  const handleImportDataGoogleSheet = () => {
    if (!isEmpty(uploadData)) {
      setUploadData([]);
    }

    fetchGoogleSheetMutation.mutate();
  };

  const injectSubMenu = {
    key: "products",
    children: [
      {
        key: "insert",
        label: "Insert",
      },
    ],
  };

  const renderLinkGoogleSheetCard = () => {
    const howtoPublishUrl = [
      "เปิดไฟล์ Google sheet ที่ต้องการ",
      "คลิก File (มุมซ้ายด้านบน) > Share > Publish to web",
      "แท็ป Link เลือก Entrie document",
      "แท็ป Embeded เลือก Comma-separated values (.csv)",
      "คัดลอกลิงก์ และวางลงช่อง (ด้านล่าง)",
    ];

    return (
      <Card shadow="none" radius="sm" className="border-2 border-slate-50">
        <CardHeader>
          <div className="flex flex-col space-y-1">
            <h3 className="text-xl">
              {"นำเข้าข้อมูลจาก Google Sheet อย่างไร?"}
            </h3>
            <small>
              <span className="text-red-500 mr-1">*</span>
              {"ต้องเป็นลิงก์ที่เปิดสาธารณะ (Publish to web) แล้วเท่านั้น"}
            </small>
          </div>
        </CardHeader>
        <CardBody>
          <div className="flex flex-col space-y-1 mb-2">
            {howtoPublishUrl.map((content, i) => (
              <li className="text-sm list-decimal" key={`howto-publish-${i}`}>
                {content}
              </li>
            ))}
          </div>
          <div className="flex space-x-5">
            <Input
              value={googleSheetUrl}
              onChange={({ target: { value } }) => setGoogleSheetUrl(value)}
              placeholder="https://docs.google.com/spreadsheets/xxxxxxxxxxxxxxxxxxx"
            />
            <Button
              isLoading={fetchGoogleSheetMutation.isPending}
              onClick={handleImportDataGoogleSheet}
              isDisabled={!googleSheetUrl}
              color="secondary"
            >
              {"Save"}
            </Button>
          </div>
        </CardBody>
      </Card>
    );
  };

  const renderCsvUploadCard = () => {
    return (
      <Card shadow="none" radius="sm" className="border-2 border-slate-50">
        <CardHeader>
          <div className="flex flex-col space-y-1">
            <h3 className="text-xl">{"เลือกไฟล์ที่ต้องการอัพโหลด"}</h3>
            <small>
              <span className="text-red-500 mr-1">*</span>
              {"ต้องเป็นไฟล์ที่มีนามสกุล .csv เท่านั้น"}
            </small>
          </div>
        </CardHeader>
        <CardBody>
          <div>
            <Button
              isLoading={uploading}
              className="w-fit"
              onClick={() => inputRef.current?.click()}
            >
              {"Upload file"}
            </Button>
          </div>
          <Input
            ref={inputRef}
            className="hidden"
            type="file"
            accept=".csv"
            onChange={({ target: { files } }) => {
              const file = files?.[0];

              if (file) {
                handleUploadCsv(file);
              }
            }}
          />
        </CardBody>
      </Card>
    );
  };

  const insertTabs = [
    {
      key: "form",
      icon: FileInput,
      label: "Insert Form",
      children: <InsertProductForm />,
    },
    {
      key: "csv",
      icon: Upload,
      label: "Upload csv file",
      children: renderCsvUploadCard(),
    },
    {
      key: "google_sheet",
      icon: Link,
      label: "Link google sheet",
      children: renderLinkGoogleSheetCard(),
    },
  ];

  return (
    <SidebarLayout
      classNames={{ contentLayout: "px-4 py-3" }}
      activeSubMenuKey="insert"
      injectSubMenu={injectSubMenu}
    >
      <section className="px-3 mb-2">
        <h1 className="text-2xl text-slate-900 font-semibold">
          {"Insert Product"}
        </h1>
      </section>
      <Tabs
        onSelectionChange={(selected) => {
          setInsertMethod(selected as InsertMethod);
          replaceUrl(`?method=${selected}`);
        }}
        selectedKey={insertMethod}
        color={"secondary"}
      >
        {insertTabs.map((tab) => (
          <Tab
            key={tab.key}
            title={
              <div className="flex items-center space-x-2">
                <tab.icon className="w-4 h-4" />
                <span>{tab.label}</span>
              </div>
            }
          >
            {tab.children}
          </Tab>
        ))}
      </Tabs>
      <section className="border-2 border-slate-50 p-3 rounded-lg hidden">
        <CustomTable
          classNames={{
            wrapper: "max-h-[calc(100vh_-_320px)]",
            tBodyRow: "odd:bg-[#ff741d15] rounded-sm",
          }}
          headerColumns={{
            product_name: { children: "product_name", order: 1 },
            product_image: { children: "product_image", order: 2 },
            product_price: {
              children: "product_price",
              order: 3,
              width: 150,
            },
            stock_amount: { children: "stock_amount", order: 4, width: 150 },
          }}
          bodyColumns={uploadData}
        />
      </section>
      <Modal />
    </SidebarLayout>
  );
}

export default function ProductInsertPage() {
  return (
    <Suspense>
      <ProductInsert />
    </Suspense>
  );
}
