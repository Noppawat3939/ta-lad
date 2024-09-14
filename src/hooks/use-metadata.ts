import { useEffect } from "react";

type UseMetadata = {
  title?: string;
};

export default function useMetadata(params: UseMetadata) {
  useEffect(() => {
    if (params.title) {
      document.title = params.title;
    }
  }, [params.title]);
}
