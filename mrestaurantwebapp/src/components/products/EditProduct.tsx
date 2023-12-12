import React, { useEffect, useState } from 'react';
import { useParams, useSearchParams } from 'react-router-dom';
import { Form, Button } from 'react-bootstrap';
import { ApiUrl } from '../../Consts.tsx';
import authService from '../auth/AuthorizeService';
import { useNavigate } from 'react-router-dom';

const EditProduct: React.FC = () => {
    const productId = useParams().id;
    const navigate = useNavigate();
    const [errorMsg, setErrorMsg] = useState("");
    const [searchParams, setSearchParams] = useSearchParams();

    const [product, setProduct] = useState({
        name: '',
        price: 0,
        isDisabled: false,
    });

    useEffect(() => {
        // Fetch product data based on productId
        let add = searchParams.get('add');
        if (add)
            return;
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
        let add = searchParams.get('add');

        try {
            const response = await fetch(ApiUrl + (add ? `/api/produkt` : `/api/produkt/${productId}`), {
                method: add ? 'POST' : 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer ' + await authService.getJwtToken()
                },
                body: JSON.stringify(product),
            });

            if (response.ok) {
                console.log('Product updated successfully');
                navigate("/products");
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
            <h2>Product Data</h2>
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
                    Confirm
                </Button>
            </Form>
        </div>
    );
};

export default EditProduct;
