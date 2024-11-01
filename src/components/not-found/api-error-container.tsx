import { Wrench } from "lucide-react";
import { memo } from "react";

function ApiError() {
  return (
    <div className="flex-1 bg-slate-50 flex-col w-full flex justify-center items-center">
      <p className="font-medium flex items-center">
        {"กำลังปรับปรุงระบบ"}
        <Wrench className="w-4 h-4 ml-1" />
      </p>
      <p className="font-[300] text-sm text-slate-700/70">
        {"ขออภัยในความไม่สะดวก"}
      </p>
    </div>
  );
}

export const ApiErrorContainer = memo(ApiError);
