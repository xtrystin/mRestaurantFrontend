import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Form, Button } from 'react-bootstrap';
import { ApiUrl } from '../../Consts.tsx';
import authService from '../auth/AuthorizeService';
import { useNavigate } from 'react-router-dom';

const RemoveProduct: React.FC = () => {
    const productId = useParams().id;
    const navigate = useNavigate();

    const handleRemoveProduct = async () => {
        try {
            const response = await fetch(ApiUrl + `/api/produkt/${productId}`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer ' + await authService.getJwtToken()
                },
                body: JSON.stringify({ "productId": productId }),
            });

            if (response.ok) {
                console.log('Product updated successfully');
                navigate("/products");
            } else {
                console.error('Failed to update product');
            }
        } catch (error) {
            console.error('Error updating product:', error);
        }
    };

    return (
        <div>
            <h2>Are you sure to remove this product?</h2>
            <Form>
                <Form.Group className="mb-3" controlId="formProductId">
                    <Form.Label>Product Name</Form.Label>
                    <Form.Control
                        type="text"
                        name="id"
                        value={productId}
                    />
                </Form.Group>

                <Button variant="primary" onClick={handleRemoveProduct}>
                    Remove Product
                </Button>
            </Form>
        </div>
    );
};

export default RemoveProduct;
