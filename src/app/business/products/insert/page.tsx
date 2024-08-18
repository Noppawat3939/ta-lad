"use client";

import { SidebarLayout } from "@/components";
import {
  Button,
  Card,
  CardBody,
  CardHeader,
  Input,
  Tab,
  Tabs,
} from "@nextui-org/react";
import axios from "axios";
import { FileInput, Link, Upload } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import * as xlsx from "xlsx";

type InsertMethod = "google_sheet" | "csv" | "form";

const GOOGLE_SHEET_TEST_URL =
  "https://docs.google.com/spreadsheets/d/10q7cJqt8F3ce-OsAcP5vmXjhLOnYq19yWiwYWmYD30U/pub?output=csv";

export default function ProductInsertPage() {
  const router = useRouter();

  const [insertMethod, setInsertMethod] =
    useState<InsertMethod>("google_sheet");
  const [googleSheetUrl, setGoogleSheetUrl] = useState("");
  const [uploading, setUploading] = useState(false);

  const getData = async () => {
    try {
      const res = await axios.get(googleSheetUrl);
      const parsed = parseCSV(res.data);
      if (parsed.length > 0) {
        console.log(1, parsed);

        setGoogleSheetUrl("");

        router.replace(
          `/business/products/insert?sheet_url=${encodeURI(googleSheetUrl)}`
        );
      }
    } catch (error) {
      console.log(error);
    } finally {
      setUploading(false);
    }
  };

  const parseCSV = (csvText: string) => {
    const rows = csvText.split(/\r?\n/);
    const headers = rows[0].split(",");

    let data = [];
    for (let i = 1; i < rows.length; i++) {
      const rowData = rows[i].split(",");
      const rowObject: Record<string, string> = {};
      for (let j = 0; j < headers.length; j++) {
        rowObject[headers[j]] = rowData[j];
      }
      data.push(rowObject);
    }
    return data;
  };

  const handleImportDataGoogleSheet = () => {
    setUploading(true);

    getData();
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
      <Card>
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
              isLoading={uploading}
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

  const insertTabs = [
    {
      key: "google_sheet",
      icon: Link,
      label: "Link google sheet",
      children: renderLinkGoogleSheetCard(),
    },
    {
      key: "csv",
      icon: Upload,
      label: "Upload csv file",
      children: renderLinkGoogleSheetCard(),
    },
    {
      key: "form",
      icon: FileInput,
      label: "Mannual form",
      children: renderLinkGoogleSheetCard(),
    },
  ];

  return (
    <SidebarLayout
      classNames={{ contentLayout: "px-4 py-3" }}
      activeSubMenuKey="insert"
      injectSubMenu={injectSubMenu}
    >
      <section className="px-3">
        <h1 className="text-2xl text-slate-900 font-semibold">
          {"Insert Product"}
        </h1>
      </section>
      <Tabs
        onSelectionChange={(selected) =>
          setInsertMethod(selected as InsertMethod)
        }
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
      <br />
      <input
        hidden
        type="file"
        onChange={(e) => {
          const file = e.target.files?.[0];
          const reader = new FileReader();

          reader.onload = (e) => {
            const workBook = xlsx.read(e.target?.result, { type: "binary" });
            const sheetName = workBook.SheetNames[0];
            const sheet = workBook.Sheets[sheetName];
            const sheetData = xlsx.utils.sheet_to_json(sheet);

            console.log(sheetName, sheet, sheetData);
          };

          reader.readAsBinaryString(file as unknown as Blob);
        }}
      />
    </SidebarLayout>
  );
}
