import { useQuery } from "@tanstack/react-query";
import { useParams } from "react-router";
import { getHeroAction } from "../actions/get.hero.action";

export const useHeroPage = () => {

    const { idSlug = '' } = useParams();
    return useQuery({
        queryKey: ['heroes', idSlug],
        queryFn: () => getHeroAction(idSlug),
        retry: false,
    });

};


