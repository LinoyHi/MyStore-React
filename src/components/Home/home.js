import { useNavigate, useParams } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { disconnect } from "../../features/user/userSlice";
import ItemCard from "../ItemCard/ItemCard";
import { useEffect, useState } from "react";
import { getbyCategory, getProducts } from "../../DAL/api";

export function Home(props) {
    const { user } = useSelector((state) => state.user);
    const dispatch = useDispatch();
    const navigate = useNavigate()
    const [items, setitems] = useState(null)
    const { type } = useParams()
    const search = props.searched?.toLowerCase() || ''

    async function getInfofromapi() {
        const currentitems = []
        if (type) {
            const items = await getbyCategory(type)
            for (const i of items) {
                if (i.productName.toLowerCase().includes(search) || i.description.toLowerCase().includes(search)) {
                    currentitems.push(i)
                }
            }
            setitems(currentitems)
        } else {
            const items = await getProducts()
            for (const i of items) {
                if (i.productName.toLowerCase().includes(search) || i.description.toLowerCase().includes(search)) {
                    currentitems.push(i)
                }
            }
            setitems(currentitems)
        }
    }

    useEffect(() => { getInfofromapi() }, [type, search])


    return (
        <>
            <h1>welcome {user?.firstName || 
                <span className="App-link" onClick={() => navigate('/')}>log in first</span>}
            </h1>
            {user?.firstName ? <button className="bg-danger" onClick={() => dispatch(disconnect())}>log out</button> :
                <button onClick={() => navigate('/signup')}>sign up</button>}
            <div className={`row w-100 row-cols-sm-2 row-cols-lg-${items?.length>4? '4':items?.length} row-cols-1`}>
                {items?.map((item, index) =>
                    <ItemCard key={index} item={item}></ItemCard>)}
            </div>
        </>
    )
}