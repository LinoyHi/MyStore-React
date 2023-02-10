import { useEffect, useState } from "react"
import { useSelector } from "react-redux"
import { addToCart, getSpecificItem } from "../../DAL/api"
import FormGroupType from "../forms/formGroupType"
import './addToCart.css'

export default function AddProductToCart(props) {
    const userData = useSelector(state => state.user)
    const [item, setItem] = useState(null)
    const [buy, setbuy] = useState({ color: null, size: null, amount: 1, prod: [] })
    const [stock, setstock] = useState(null)
    const [itemAnimation, setItemAnimation] = useState(null)

    useEffect(() => async function set() {
        let newItem = props.item
        if (!props.item) {
            newItem = await getSpecificItem(props.id)
        }
        setItem(newItem)
        if (newItem.prodDet.length === 1) {
            const prod = newItem.prodDet[0]
            setbuy({ prod: [prod.id], color: prod.color, size: prod.size, amount: 1 })
            setstock(prod.quantity)
        }
    }, [])

    async function addtocart() {
        if (buy.prod.length == 1) {
            const cart = await addToCart(buy.prod[0], buy.amount, userData.user)
            if (cart.errors) {
                const left = stock - cart.amountInCart
                alert(left ?
                    `you already added ${cart.amountInCart} of ${item.productName} in this size and color you can add only ${left} please change the amount and try again if you'd like` :
                    `${item.productName} in this size and color is already in your cart at the MAX amount`)
            }
            else {
                if (cart.errors === false) {
                    const cart = document.getElementById('Headcart')
                    cart?.classList.add('cartAnimation')
                    setItemAnimation(
                        <div style={{ zIndex: '1000000', 
                        position: 'fixed', 
                        top:'40%' }}>
                            <img className="addToCartAnimation"
                                src={item.mainImg}
                                alt={`${item.productName} main photo`}></img>
                        </div>
                    )
                    setTimeout(() => { setItemAnimation(null); cart?.classList.remove('cartAnimation');}, 1000)
                }
                else {
                    alert('something went wrong please try again latter')
                }
            }
        }
        else {
            alert('size or color is missing')
        }
    }

    function changebutton(e, name) {
        e.target.parentElement.getElementsByClassName('choosen')[0]?.classList.remove('choosen')
        e.target.classList.add('choosen')
        const current = e.target.value
        let instock = 0
        let prods = []
        for (const i of item.prodDet) {
            if (name === 'color') {
                if (i.color == current) {
                    if (buy.size) {
                        if (buy.size == i.size) {
                            instock += i.quantity
                            prods.push(i.id)
                        }
                    }
                    else {
                        instock += i.quantity
                        prods.push(i.id)
                    }
                }
            }
            else {
                if (i.size == current) {
                    if (buy.color) {
                        if (buy.color == i.color) {
                            instock += i.quantity
                            prods.push(i.id)
                        }
                    }
                    else {
                        instock += i.quantity
                        prods.push(i.id)
                    }
                }
            }
        }
        setstock(instock)
        const newbuy = { ...buy }
        name == 'color' ? newbuy.color = current : newbuy.size = current
        newbuy.prod = prods
        setbuy(newbuy)
    }

    return (item ?
        <div className={`d-flex flex-column ${!props.cancelBG && 'bg-purple'} align-items-center`}>
            {itemAnimation && itemAnimation}
            <h5 className="color-white">{item.productName}</h5>
            <span className="card-body">price: {item.price}$ | in stock: {stock || stock == 0 ? stock : item.inventory}</span>
            <FormGroupType type='button' value={item.sizes.length == 1 ? item.sizes[0] : ''} changeButton={changebutton} label='size' name='size'
                eror='' validate={{}} options={item.sizes}></FormGroupType>
            <br />
            <FormGroupType type='button' value={item.colors.length == 1 ? item.colors[0] : ''} changeButton={changebutton} label='color' name='color'
                eror='' validate={{}} options={item.colors}></FormGroupType>
            <br />
            <div className="d-flex justify-content-between">
                <button name='addToCart' onClick={addtocart}
                    className='addToCart me-2' disabled={stock === 0 ? true : false}>{stock === 0 ? 'out of stock' : 'add to cart'}</button>
                <input className='addToCartInput' name={`amount${item.id}`} type='number' defaultValue='1' min='1'
                    max={stock ? stock : 1} onChange={(e) => {
                        const newbuy = { ...buy }
                        newbuy.amount = e.target.value
                        setbuy(newbuy)
                    }}></input>
            </div>
        </div> :
        <p>please wait..</p>
    )
}