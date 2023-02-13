import { useEffect, useState } from "react"
import { Table } from "react-bootstrap"
import FormGroupType from "../forms/formGroupType"

export function Reviews(props) {
    const [reviews, setReviews] = useState([])
    const [sort, setSort] = useState(null)

    useEffect(() => {
        function completeReviewSection() {
            let reviewsarray = []
            const addTr= (id) =>{
                reviewsarray.push(
                    <tr className="text-center"
                        key={id}>
                        <td>
                            {props.reviews[id].user.name}
                            <p>size: {props.reviews[id].kinds.size} / color: {props.reviews[id].kinds.color}</p>
                            <hr />
                            {props.reviews[id].reviewInput}
                        </td>
                    </tr>)
            }
            for (const id in props.reviews) {
                if (!sort) {
                    addTr(id)
                }
                else {
                    let check = 0
                    for (const s in sort) {
                        if (sort[s]) {
                            if (sort[s] === props.reviews[id].kinds[s]) {
                                check++
                            }
                        }
                        else {
                            check++
                        }
                    }
                    if(check===Object.keys(sort).length){
                        addTr(id)
                    }
                }
            }
            setReviews(reviewsarray)
        }
        props.reviews?.length + props.builtReviews?.length !== reviews?.length && completeReviewSection()
    }, [sort])

    function onOption(e) {
        const newSort = { ...sort }
        newSort[e.target.name] = e.target.value
        setSort(newSort)
    }

    return (
        <div className='row'>
            <span className="p-1 col-12" style={{ cursor: 'pointer', fontSize: 'x-large', marginLeft: '96%' }} onClick={props.handleClose}>X</span>
            <div className='col-12 col-lg-6'>
                <FormGroupType type='option'
                    value={props.sizes.length == 1 ? props.sizes[0] : ''}
                    label='size' name='size' placeholder='no size sorting'
                    eror='' options={props.sizes} optionFunc={onOption}></FormGroupType>
            </div>
            <div className='col-12 col-lg-6'>
                <FormGroupType type='option'
                    value={props.colors.length == 1 ? props.colors[0] : ''}
                    label='color' name='color' placeholder='sort by color'
                    eror='' options={props.colors} optionFunc={onOption}></FormGroupType>
            </div>
            <Table striped bordered hover>
                <tbody>
                    {reviews}
                </tbody>
            </Table>
        </div>
    )
}