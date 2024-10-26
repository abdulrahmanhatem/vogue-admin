import axios from "axios";
import { unstable_cache } from "next/cache";

const apiURL = `${process.env.NEXT_PUBLIC_APP_API}/categories`

export const getCategories = unstable_cache(
    async () =>{
    try {
        const res = await axios.get(apiURL)
        let data: Category[] = [];
        if (res?.data?.data) {
            data = res.data.data
            const sortedData = data.sort((a, b) => b.updatedAt.localeCompare(a.updatedAt))
            return sortedData
        }
        return data
    } catch (error) {
        return console.log(error);
        
    }
}, ["categories"], {revalidate: 3600, tags:["categories"]})

export default getCategories