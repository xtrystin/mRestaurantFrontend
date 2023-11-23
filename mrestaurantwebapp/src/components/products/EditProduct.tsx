import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Form, Button } from 'react-bootstrap';
import { ApiUrl } from '../../Consts.tsx';
import authService from '../auth/AuthorizeService';
import { useNavigate } from 'react-router-dom';

const EditProduct: React.FC = () => {
    const productId = useParams().id;
    const navigate = useNavigate();
    const [errorMsg, setErrorMsg] = useState("");

    const [product, setProduct] = useState({
        name: '',
        price: 0,
        isDisabled: false,
    });

    useEffect(() => {
        // Fetch product data based on productId
        const fetchProduct = async () => {
            try {
                const response = await fetch(ApiUrl + `/api/produkt/${productId}`, {
                    headers: new Headers({ 'Authorization': 'Bearer ' + await authService.getJwtToken() })
                });
                const data = await response.json();
                setProduct(data);
            } catch (error) {
                console.error('Error fetching product:', error);
                setErrorMsg("Error fetching product: " + error);
            }
        };

        fetchProduct();
    }, [productId]);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setProduct({
            ...product,
            [e.target.name]: e.target.value,
        });
    };

    const handleUpdateProduct = async () => {
        try {
            const response = await fetch(ApiUrl + `/api/produkt/${productId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer ' + await authService.getJwtToken()
                },
                body: JSON.stringify(product),
            });

            if (response.ok) {
                console.log('Product updated successfully');
                navigate("/polproducts");
            } else {
                console.error('Failed to update product');
                setErrorMsg('Failed to update product');
            }
        } catch (error) {
            console.error('Error updating product:', error);
            setErrorMsg("Error updating product: " + error);
        }
    };

    return (
        <div>
            <h2>Edit Product</h2>
            <Form>
                <Form.Group className="mb-3" controlId="formProductName">
                    <Form.Label>Product Name</Form.Label>
                    <Form.Control
                        type="text"
                        placeholder="Enter product name"
                        name="name"
                        value={product.name}
                        onChange={handleInputChange}
                    />
                </Form.Group>

                <Form.Group className="mb-3" controlId="formProductPrice">
                    <Form.Label>Product Price</Form.Label>
                    <Form.Control
                        type="number"
                        placeholder="Enter product price"
                        name="price"
                        value={product.price}
                        onChange={handleInputChange}
                    />
                </Form.Group>

                <Form.Group className="mb-3" controlId="formProductIsDisabled">
                    <Form.Check
                        type="checkbox"
                        label="Is Disabled"
                        name="isDisabled"
                        checked={product.isDisabled}
                        onChange={() => setProduct({ ...product, isDisabled: !product.isDisabled })}
                    />
                </Form.Group>

                {errorMsg && <p className='text-danger'>{errorMsg}</p>}

                <Button variant="primary" onClick={handleUpdateProduct}>
                    Update Product
                </Button>
            </Form>
        </div>
    );
};

export default EditProduct;
