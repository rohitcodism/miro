import { useState } from "react";
import { useMutation } from "convex/react";

export const useApiMutation = (mutationFunction: any) => {
    const [pending, setPending] = useState<boolean>(false);

    const apiMutation = useMutation(mutationFunction);

    const mutate = async(payload: any) => {
        setPending(true);

        return apiMutation(payload)
        .finally(() => setPending(false))
        .then((result) => {
            return result;
        })
        .catch((err) => {
            throw err;
        })
    }

    return {
        mutate,
        pending
    };
}