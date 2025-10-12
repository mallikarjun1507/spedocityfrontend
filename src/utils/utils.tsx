import {useMemo} from "react";
export const getUser = () =>{
    const userData = useMemo(() => {
        const user = localStorage.getItem('user');
        return user ? JSON.parse(user) : {};
    }, [])
    return userData;
}



