import { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";

function Products(){

    let [products,setproducts]=useState([]);
    let [modalvisible,setModalVisible] = useState(false);
    let [messagevisible,setMessageVisible] = useState(false);
    let [message,setMessage] = useState({text:"dummy text", typeClass:"success"});
    let product = useRef({});

   
    useEffect(()=>{ 

        fetch( "http://localhost:8000/products")
        .then((response) =>response.json())
        .then((data) => {
            setproducts(data);
        })
        .catch((err) => {
            console.log(err);
        })
    },[])

    function deleteProduct(id){

        fetch("http://localhost:8000/products?id="+id,{
            method:"DELETE"
        })
        .then((response) => response.json())
        .then((data) => {
            
            if(data.success === true){
                let tempProducts = [...products];

                let indextoDelete = tempProducts.findIndex((product, index) => {
                    return Number(product.id) === Number(id);
                })

                tempProducts.splice(indextoDelete, 1);

                setproducts(tempProducts);
            }
            else {
                console.log(data.message);
            }
        })
        .catch((err) => {
            console.log(err);
        })

    }

    function updateProduct(){

        fetch("http://localhost:8000/products?id=${product.current.id}", {
            method:"PUT",
            headers:{
                "Content-Type":"application/json"
            },
            body:JSON.stringify(product.current)
        })
        .then((response) => response.json())
        .then((data) => {
                setModalVisible(false);
                setMessageVisible(true);
            if(data.success === true){
                
                setMessage({text:data.message,typeClass:"success"});
            }
            else{
                setMessage({text:data.message,typeClass:"error"});

            }
          
        })
        .catch((err) => {
            console.log(err);
        })
 
    }

    function setupUpdate(pro){
        setModalVisible(true);
        product.current = pro;

    }
                             

    function readValue(property, value)
    {
        product.current[property] = value;
        console.log(product.current);
    }

    

    return(
       <div className="container">
          {/* pop up */}

        {
            messagevisible === true?(
                <div className={"pop_up" + message.typeClass}>
                    {message.text}``
                </div>

            )
            :
            null
        }


        {/* {model} */}
        {
            modalvisible === true?(
                <div className="custom-modal">
                    <div className="updateform">
                       
                        <input placeholder='Enter ID' className='form-control' defaultValue={product.current.id}  onChange={(event)=>{
                            readValue("id", Number(event.target.value) )
                        }}></input>
                         <input placeholder='Enter Name' className='form-control' defaultValue={product.current.name} onChange={(event)=>{
                            readValue("name", event.target.value )
                        }}></input>
                        <input placeholder='Enter Price' className='form-control' defaultValue={product.current.price} onChange={(event)=>{
                            readValue("price", Number(event.target.value) )
                        }}></input>
                        <input placeholder='Enter Quantity' className='form-control' defaultValue={product.current.quantity} onChange={(event)=>{
                            readValue("quantity", Number(event.target.value) )
                        }}></input>

                        <button type="button" className="btn btn-primary" onClick={updateProduct}>Update product</button> 


                     </div> 
                     
                </div>
            )
            :
            null
        }

            <div className="header">
                <h1 className="title">All Products</h1>
                <Link to={"/create"}>
                    <button className="btn btn-primary"> Create products </button>
                </Link>

            </div>
            

            <table className="table mt-5">
                <thead>
                    <tr>
                        <td>No.</td>
                        <td>Name</td>
                        <td>Price</td>
                        <td>Quantity</td>
                        <td>Actions</td>
                    </tr>
                </thead>
                <tbody>

                   {
                    products.map((product, index) => {

                        return(
                            <tr key={index}>
                                <td>{index + 1}</td>
                                <td>{product.name}</td>
                                <td>{product.price}</td>
                                <td>{product.quantity}</td>
                                <td>
                                    <i class="fa-solid fa-file-pen text-success me-2" onClick={()=>{
                                        setupUpdate(product)
                                    }}></i>
                                    <i className="fa-solid fa-trash text-danger" onClick={() => {
                                        deleteProduct(product.id);
                                    }}></i>
                                </td>
                            </tr>
                        )

                    })
                   }

                </tbody>
            </table>

       </div>
    )
    
}
export default Products;
