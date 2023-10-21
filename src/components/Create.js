import {Link} from 'react-router-dom';
import { useRef } from 'react';

function Create(){

    let product ={};

    let formV = useRef();

    function readValue(property, value)
     {
         
         product[property] = value;
         console.log(product);
    }


    function createProduct(){

        fetch("http://localhost:8000/products",{
            method:"POST",
            headers:{
                "Content-type":"application/json"
            },
            body:JSON.stringify(product)
        })
        .then((response) => response.json())
        .then((data) => {
            if(data.success===true){
                formV.current.reset();
            }
        })
        .catch((err)=> {
            console.log(err);
        })
    }



    return(

        <div className="container">
           <div className="header">
                <h1 className="title">All Products</h1>
                <Link to={"/Products"}>
                    <button className="btn btn-primary"> View products </button>
                </Link>
            </div>

            <div className='form-container mt-5 ' ref={formV}>

                <input placeholder='Enter ID' className='form-control' onChange={(event)=>{
                    readValue("id", Number(event.target.value) )
                }}></input>
                <input placeholder='Enter Name' className='form-control' onChange={(event)=>{
                    readValue("name", event.target.value )
                }}></input>
                <input placeholder='Enter Price' className='form-control' onChange={(event)=>{
                    readValue("price", Number(event.target.value) )
                }}></input>
                <input placeholder='Enter Quantity' className='form-control' onChange={(event)=>{
                    readValue("quantity", Number(event.target.value) )
                }}></input>

                <button type='button'  className='btn btn-primary' onClick={createProduct}>Create Product</button>

            </div>

        </div>

    )
}

export default Create;