import { externalService } from "@/apis";
import { useQueries } from "@tanstack/react-query";

export default function useGetProvince(enabled = true) {
  const [provinceRes, districtRes, subDistrictRes] = useQueries({
    queries: [
      {
        queryKey: ["province"],
        queryFn: externalService.getProvince,
        enabled,
      },
      {
        queryKey: ["districts"],
        queryFn: externalService.getDistrict,
        enabled,
      },
      {
        queryKey: ["sub_districts"],
        queryFn: externalService.getSubDistrict,
        enabled,
      },
    ],
  });

  return {
    provinces: provinceRes.data || [],
    districts: districtRes.data || [],
    subDistricts: subDistrictRes.data || [],
  };
}
