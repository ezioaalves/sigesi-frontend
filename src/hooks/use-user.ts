import { useQuery } from "@tanstack/react-query";
import { getCurrentUser } from "@/services/usuarios";

export const useUser = () => {
    return useQuery({
        queryKey: ["user", "me"],
        queryFn: getCurrentUser,
        retry: false,
        staleTime: 1000 * 60 * 5, // 5 minutes
    });
};
